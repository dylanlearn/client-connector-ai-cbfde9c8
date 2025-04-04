
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WireframeRequest {
  prompt: string;
  projectId: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  pages?: string[];
  industry?: string;
  additionalInstructions?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment variable
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    // Parse request body
    const requestData: WireframeRequest = await req.json();
    const { prompt, projectId, style, complexity, pages, industry, additionalInstructions } = requestData;
    
    if (!prompt || !projectId) {
      return new Response(
        JSON.stringify({ error: 'Prompt and projectId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = performance.now();
    
    // Construct a detailed system prompt for wireframe generation
    const systemPrompt = `You are an expert UI/UX designer specialized in creating modern, professional wireframes.
    
- Create a detailed wireframe description for a ${industry || ''} website or application
- Focus on layout structure, component placement, and information hierarchy
- Consider best practices for conversion rate optimization and user engagement
- Complexity level: ${complexity || 'medium'}
- Design style: ${style || 'modern and clean'}
${additionalInstructions ? `- Additional requirements: ${additionalInstructions}` : ''}

FORMAT YOUR RESPONSE AS VALID JSON with the following structure:
{
  "title": "Brief title for the wireframe",
  "description": "Detailed description of the overall wireframe design",
  "sections": [
    {
      "name": "Section name (e.g., Hero, Features, etc.)",
      "description": "Detailed description of this section",
      "components": [
        {
          "type": "component type (e.g., heading, paragraph, button, image, etc.)",
          "content": "Text content or description of the component",
          "style": "Styling notes for this component",
          "position": "Positioning information (e.g., top-left, centered, etc.)"
        }
      ]
    }
  ],
  "layout": "Overall layout description",
  "colorScheme": "Suggested color scheme (without specific colors)",
  "typography": "Typography recommendations"
}`;

    // Call OpenAI API to generate wireframe description
    console.log(`Generating wireframe for prompt: ${prompt.substring(0, 100)}...`);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let wireframeData;
    
    try {
      // Parse the response to ensure it's valid JSON
      const content = data.choices[0].message.content;
      wireframeData = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse wireframe JSON:', error);
      wireframeData = { 
        error: 'Failed to generate valid wireframe data',
        rawContent: data.choices[0].message.content
      };
    }

    const endTime = performance.now();
    const generationTime = (endTime - startTime) / 1000; // Convert to seconds

    // Record metrics (even if there was a parsing error)
    try {
      const { data: metricsData, error: metricsError } = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/record_wireframe_generation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            p_project_id: projectId,
            p_prompt: prompt,
            p_generation_params: {
              style,
              complexity,
              pages,
              industry,
              additionalInstructions,
              model: 'gpt-4o-mini'
            },
            p_result_data: wireframeData,
            p_success: !wireframeData.error,
            p_generation_time: generationTime
          }),
        }
      ).then(r => r.json());

      if (metricsError) {
        console.error('Error recording metrics:', metricsError);
      }
    } catch (error) {
      console.error('Failed to record metrics:', error);
    }

    console.log('Successfully generated wireframe data');

    return new Response(
      JSON.stringify({ 
        wireframe: wireframeData,
        generationTime,
        model: data.model,
        usage: data.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-wireframe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
