
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeDesignRequest {
  promptOrDescription: string;
  context?: Record<string, any>;
  industry?: string;
  category?: string;
}

interface DesignAnalysisResponse {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  visualElements: Record<string, any>;
  colorScheme: {
    palette: string[];
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontPairings: string[];
  };
  layoutPattern: {
    type: string;
    structure: string;
    spacing: string;
  };
  tags: string[];
  relevanceScore: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const requestData: AnalyzeDesignRequest = await req.json();
    const { promptOrDescription, context = {}, industry, category } = requestData;

    console.log("Processing design analysis request:", { promptOrDescription, industry, category });

    // Prepare system prompt
    const systemPrompt = `
      You are a world-class design expert with deep knowledge of web UI/UX design, visual aesthetics, and design systems.
      Your task is to analyze design concepts and provide detailed, structured insights.
      Focus on practical, implementable design patterns, not theoretical concepts.
      Always consider visual hierarchy, color theory, typography principles, and accessibility.
      
      ${industry ? `The target industry is ${industry}.` : ''}
      ${category ? `This analysis belongs to the ${category} design category.` : ''}
    `;

    // Prepare user prompt
    const userPrompt = `
      Analyze the following design concept or description and provide detailed insights:
      "${promptOrDescription}"
      
      Respond with a structured JSON object containing the following:
      - A concise title for this design pattern
      - A detailed description of the design pattern
      - A specific design category and subcategory
      - Visual elements breakdown (hierarchy, whitespace, contrast)
      - A color scheme with specific HEX codes for primary, secondary, accent, and background colors
      - Typography recommendations with specific font pairings
      - Layout pattern information
      - Relevant tags for this design pattern (5-10 tags)
      - A relevance score between 0-1 indicating how useful this pattern is
      
      Only include the JSON response, no additional text.
    `;

    // Call OpenAI API
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      
      return new Response(
        JSON.stringify({ error: 'Failed to process design analysis', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("OpenAI API response:", data);

    // Extract and parse the AI response
    let analysisResult: DesignAnalysisResponse;
    try {
      const responseText = data.choices[0].message.content;
      
      // Attempt to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      analysisResult = JSON.parse(jsonString);
      console.log("Successfully parsed design analysis result");
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse AI response', 
          aiResponse: data.choices[0].message.content 
        }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in analyze-design-patterns function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
