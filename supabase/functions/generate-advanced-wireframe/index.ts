
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
    // Get and validate OpenAI API key with improved error message
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable in your Supabase project settings.');
    }
    
    if (openAIApiKey.trim() === '') {
      throw new Error('OpenAI API key is empty. Please provide a valid API key in your Supabase project settings.');
    }
    
    if (!openAIApiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format. API keys should start with "sk-". Please check your API key in Supabase project settings.');
    }

    // Validate input parameters with detailed validation errors
    const requestData = await req.json();
    
    if (!requestData) {
      throw new Error('Request body is missing. Please provide the required parameters.');
    }
    
    const { userInput, projectId, styleToken, includeDesignMemory = false } = requestData;
    
    if (!userInput) {
      throw new Error('User input is required. Please provide a description for the wireframe.');
    }
    
    if (typeof userInput !== 'string') {
      throw new Error('User input must be a string. Please provide a text description for the wireframe.');
    }
    
    if (userInput.trim() === '') {
      throw new Error('User input cannot be empty. Please provide a meaningful description for the wireframe.');
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
        error: error.message || 'Unknown error occurred',
        errorType: error.name,
        errorDetails: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
