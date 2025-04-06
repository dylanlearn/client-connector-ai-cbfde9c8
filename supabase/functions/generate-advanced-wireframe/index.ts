
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main function to handle the intent extraction and wireframe generation
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, projectId, styleToken, includeDesignMemory = false } = await req.json();
    
    if (!userInput) {
      throw new Error('User input is required');
    }
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    console.log(`Processing wireframe request for input: ${userInput.substring(0, 50)}...`);
    
    // Step 1: Extract intent from user input
    const intentData = await extractIntent(userInput, styleToken);
    console.log("Intent extraction completed");
    
    // Step 2: Generate layout blueprint
    const blueprint = await generateLayoutBlueprint(intentData);
    console.log("Layout blueprint generation completed");
    
    // Step 3: Select component variants
    const wireframeWithComponents = await selectComponentVariants(blueprint);
    console.log("Component variant selection completed");

    // Step 4: Apply style modifiers
    const finalWireframe = await applyStyleModifiers(wireframeWithComponents, styleToken || intentData.visualTone);
    console.log("Style modification completed");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        wireframe: finalWireframe,
        intentData,
        blueprint
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-advanced-wireframe function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Step 1: Extract intent from user input
async function extractIntent(userInput: string, styleToken?: string) {
  const prompt = `
Interpret this user request and return a layout blueprint with section types, visual tone, content intent, and component variants.

User input: "${userInput}"

Return a structured JSON object with the following properties:
- structuredIntent: Brief description of what the user wants
- visualTone: Keywords describing the visual style (e.g., modern, sleek, playful)
- contentPurpose: What this wireframe is trying to achieve
- suggestedSections: Array of section types needed
- pageType: What kind of page this is (landing, dashboard, product, etc.)
- audienceLevel: Who this design is for (technical, general, executive, etc.)
- complexity: Suggested complexity level (simple, standard, advanced)
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      return JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    }
    
    // If we can't extract JSON, return a structured format based on the text
    return {
      structuredIntent: userInput,
      visualTone: styleToken || "modern",
      suggestedSections: ["hero", "features", "footer"],
      pageType: "landing",
      complexity: "standard"
    };
  } catch (error) {
    console.error("Error parsing intent extraction:", error);
    throw new Error("Failed to parse intent extraction results");
  }
}

// Step 2: Generate layout blueprint
async function generateLayoutBlueprint(intentData: any) {
  const prompt = `
Based on this user vision, output a JSON layout blueprint with the following for each section:
- type
- layout (grid, flex, overlay, etc.)
- key components
- responsive behavior notes
- optional style modifiers (dark, glassy, minimalist)

User vision details:
- Intent: ${intentData.structuredIntent || 'Not specified'}
- Visual tone: ${intentData.visualTone || 'modern'}
- Page type: ${intentData.pageType || 'landing page'}
- Suggested sections: ${JSON.stringify(intentData.suggestedSections || [])}
- Complexity: ${intentData.complexity || 'standard'}

Return the blueprint as a JSON object with a "sections" array containing each section.
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      return JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    }
    
    throw new Error("Could not extract JSON blueprint from response");
  } catch (error) {
    console.error("Error parsing layout blueprint:", error);
    throw new Error("Failed to parse layout blueprint results");
  }
}

// Step 3: Select component variants for each section
async function selectComponentVariants(blueprint: any) {
  if (!blueprint || !blueprint.sections || !Array.isArray(blueprint.sections)) {
    throw new Error("Invalid blueprint structure");
  }
  
  const prompt = `
For each section in this layout blueprint, select the most appropriate component variant. Include variant type, layout notes, and tone guidance.

Blueprint sections: ${JSON.stringify(blueprint.sections)}

Example component types: Navbar, Hero, Sidebar, Feature Grid, Testimonials, Pricing Cards, Footer.
Example variants: Transparent, Collapsible, Light/Dark, Overlay, Sticky, Split Grid.

For each section, return:
- sectionType (original type)
- componentVariant (selected variant)
- layoutNotes (specific layout guidance)
- components (array of content components needed)
- responsiveBehavior (how it should adapt)

Return a JSON object with an updated "sections" array containing these enhanced sections.
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      const variantData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      
      // Merge the component variants back into the original blueprint
      return {
        ...blueprint,
        sections: variantData.sections || blueprint.sections
      };
    }
    
    return blueprint; // Return original blueprint if parsing fails
  } catch (error) {
    console.error("Error parsing component variants:", error);
    return blueprint; // Return original blueprint if parsing fails
  }
}

// Step 4: Apply style modifiers to the wireframe
async function applyStyleModifiers(wireframe: any, styleToken: string = 'modern') {
  const prompt = `
Apply a unified visual style across this layout: ${styleToken}.
Style options include: brutalist, soft, glassy, corporate, playful, editorial, tech-forward.

Current wireframe: ${JSON.stringify(wireframe)}

Adjust layout spacing, text hierarchy, borders, backgrounds, and shadows to match the style.
Return the wireframe with style properties added to each section.

For each section, add:
- styleProperties (color scheme, spacing, typography, shadows, etc.)
- visualPlaceholders (placeholder guidance for images, icons, etc.)
- designTokens (specific CSS-like values that reflect the style)

Return a JSON object with the original wireframe structure but with these style enhancements.
`;

  const response = await callOpenAI(prompt);
  
  try {
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      const styledWireframe = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      
      // Add the style token to the wireframe
      return {
        ...styledWireframe,
        styleToken: styleToken,
        title: wireframe.title || `${styleToken.charAt(0).toUpperCase() + styleToken.slice(1)} Wireframe`,
        description: wireframe.description || `A ${styleToken} style wireframe with multiple sections`
      };
    }
    
    // If we can't parse the response, add minimal style information
    return {
      ...wireframe,
      styleToken: styleToken,
      title: wireframe.title || `${styleToken.charAt(0).toUpperCase() + styleToken.slice(1)} Wireframe`,
      description: wireframe.description || `A ${styleToken} style wireframe with multiple sections`
    };
  } catch (error) {
    console.error("Error parsing style modifiers:", error);
    // Return original with minimal style information
    return {
      ...wireframe,
      styleToken: styleToken
    };
  }
}

// Helper function to call OpenAI API
async function callOpenAI(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert UI/UX designer and wireframe generator. Create detailed, structured wireframe specifications based on user input.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
