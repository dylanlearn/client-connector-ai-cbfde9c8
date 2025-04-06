
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the types for our request body
interface DesignPromptRequest {
  prompt: string;
  industry?: string;
  style?: string;
  enhancedCreativity?: boolean;
  creativeProfile?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment variable
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    // Parse request body
    const { 
      prompt, 
      industry, 
      style, 
      enhancedCreativity = true,
      creativeProfile = 'designSuggestions' 
    }: DesignPromptRequest = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating design suggestions for prompt: ${prompt}, industry: ${industry || 'not specified'}, style: ${style || 'not specified'}, creative profile: ${creativeProfile}`);

    // Construct system message with specific instructions for visual information
    let systemMessage = `You are an expert design consultant who provides specific, actionable design suggestions with visual elements. 
    
For all suggestions:
1. Always include specific color hex codes (e.g., #FF5500) for all color recommendations
2. Specify exact font names for typography (e.g., "Montserrat", "Open Sans")
3. Provide clear layout descriptions with specific measurements when relevant
4. Suggest specific components that would work well in the design
5. Keep your recommendations concrete and actionable

For color palettes, provide at least 4-5 colors with:
- Color name (e.g., "Primary Blue")
- Hex code (e.g., #4F46E5)
- Usage recommendation (e.g., "Use for primary buttons and headers")

For typography, always specify:
- Heading font with an example use case
- Body text font with example use case
- Any accent fonts if appropriate

For layouts, describe them in detail with explicit components and measurements.`;
    
    // Handle industry, including custom industry values
    if (industry && industry !== 'any') {
      systemMessage += ` You specialize in designs for the ${industry} industry, with expertise in what color schemes, typography, and layouts work best for this sector.`;
    }
    
    // Handle style, including custom style values
    if (style && style !== 'any') {
      systemMessage += ` You favor a ${style} design style and will ensure all recommendations align with ${style} design principles and aesthetics.`;
    }
    
    // Add enhanced creative guidance for more articulate, decisive recommendations
    if (enhancedCreativity) {
      systemMessage += `

Be highly specific and decisive in your recommendations. Don't use phrases like "you might consider" or "perhaps"; instead, state recommendations with confidence: "Use this color palette" or "Implement this layout structure."

Provide a clear design vision with rationale for each recommendation. Explain WHY certain colors, fonts, or layouts work well for this specific project.

Use precise, vivid language to articulate design concepts. Don't just say "modern typography"; instead, say "A geometric sans-serif like Gilroy that conveys contemporary precision with its consistent stroke weights and ample x-height."

Think beyond generic design patterns. Recommend distinctive approaches that will make this design stand out while still serving business objectives.`;
    }

    // Apply temperature adjustment based on creative profile
    let temperature = 0.7; // default
    if (creativeProfile === 'wireframing') {
      temperature = 0.8; // more creative
      systemMessage += "\nFocus on innovative layout structures and distinctive visual hierarchies.";
    } else if (creativeProfile === 'designSuggestions') {
      temperature = 0.75; // balanced creativity with precision
      systemMessage += "\nFocus on precise, articulate design language with specific visual references.";
    } else if (creativeProfile === 'contentCreation') {
      temperature = 0.7; // more controlled
      systemMessage += "\nFocus on compelling design narrative with clear value propositions.";
    }

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
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content;

    console.log('Successfully generated design suggestions');

    // Return the generated suggestions
    return new Response(
      JSON.stringify({ 
        suggestions,
        model: data.model,
        usage: data.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in design-suggestions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
