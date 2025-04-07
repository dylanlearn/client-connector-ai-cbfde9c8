
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { extractIntent } from "./intent-extractor.ts";
import { generateLayoutBlueprint } from "./blueprint-generator.ts";
import { selectComponentVariants } from "./component-selector.ts";
import { applyStyleModifiers } from "./style-applicator.ts";

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
    // Get and validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey || openAIApiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured or is invalid. Please check your environment variables.');
    }

    // Validate input parameters
    const { userInput, projectId, styleToken, includeDesignMemory = false } = await req.json();
    
    if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
      throw new Error('Valid user input is required');
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
