
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { extractIntent } from "./intent-extractor.ts";
import { generateLayoutBlueprint } from "./blueprint-generator.ts";
import { selectComponentVariants } from "./component-selector.ts";
import { applyStyleModifiers } from "./style-applicator.ts";
import { corsHeaders, WireframeGenerationRequest, WireframeGenerationResponse, REQUIRED_SECTION_TYPES } from "./types.ts";
import { v4 as uuid } from "https://deno.land/std@0.110.0/uuid/mod.ts";

// Main function to handle the intent extraction and wireframe generation
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Advanced wireframe generation function invoked");

  try {
    // Get and validate OpenAI API key with improved error handling
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("OpenAI API key is missing");
      throw new Error('OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable in your Supabase project settings.');
    }
    
    if (openAIApiKey.trim() === '') {
      console.error("OpenAI API key is empty");
      throw new Error('OpenAI API key is empty. Please provide a valid API key in your Supabase project settings.');
    }

    // Parse and validate request body
    const requestData = await req.json().catch(err => {
      console.error("Error parsing JSON request:", err);
      throw new Error("Invalid JSON in request body");
    });
    
    if (!requestData) {
      console.error("Request body is missing");
      throw new Error('Request body is missing. Please provide the required parameters.');
    }
    
    const { 
      userInput, 
      projectId, 
      styleToken, 
      colorScheme,
      enhancedCreativity = true,
      creativityLevel = 7,
      industry,
      includeDesignMemory = false,
      baseWireframe,
      isVariation = false,
      variationIndex
    } = requestData as WireframeGenerationRequest;
    
    console.log(`Request received: projectId=${projectId}, styleToken=${styleToken}, enhancedCreativity=${enhancedCreativity}, creativityLevel=${creativityLevel}`);
    
    if (!userInput) {
      console.error("User input is missing");
      throw new Error('User input is required. Please provide a description for the wireframe.');
    }
    
    console.log(`Processing wireframe request for input: ${userInput.substring(0, 100)}...`);
    
    // Step 1: Extract intent from user input
    console.log("Starting intent extraction...");
    const intentData = await extractIntent(userInput, styleToken);
    console.log("Intent extraction completed successfully");
    
    // Step 2: Generate layout blueprint
    console.log("Starting blueprint generation...");
    const blueprint = await generateLayoutBlueprint(intentData);
    console.log("Layout blueprint generation completed successfully");
    
    // Step 3: Select component variants
    console.log("Starting component variant selection...");
    const wireframeWithComponents = await selectComponentVariants(blueprint);
    console.log("Component variant selection completed successfully");

    // Step 4: Apply style modifiers
    console.log("Starting style modification...");
    const finalWireframe = await applyStyleModifiers(
      wireframeWithComponents, 
      styleToken || intentData.visualTone
    );
    console.log("Style modification completed successfully");
    
    // Validate the wireframe sections
    if (!finalWireframe.sections || finalWireframe.sections.length === 0) {
      console.error("Wireframe generation failed: No sections were generated");
      throw new Error("Wireframe generation failed: No sections were generated");
    }
    
    // Ensure wireframe has unique ID
    finalWireframe.id = finalWireframe.id || uuid();
    
    // Ensure wireframe has consistent styling
    if (colorScheme) {
      finalWireframe.colorScheme = typeof colorScheme === 'string' 
        ? finalWireframe.colorScheme  // Keep AI-generated colors if colorScheme is just a string preference
        : { ...finalWireframe.colorScheme, ...colorScheme };  // Use provided colorScheme if it's an object
    }
    
    // Add any model and tokenization info
    const modelInfo = {
      model: "gpt-4o",
      usage: {
        prompt_tokens: 0,  // These would be replaced with actual values in a production system
        completion_tokens: 0,
        total_tokens: 0
      }
    };
    
    // Create the response
    const response: WireframeGenerationResponse = {
      success: true,
      wireframe: finalWireframe,
      intentData,
      blueprint,
      model: modelInfo.model,
      usage: modelInfo.usage
    };
    
    console.log("Advanced wireframe generation successful");
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-advanced-wireframe function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        errorType: error instanceof Error ? error.name : 'UnknownError',
        errorDetails: error instanceof Error ? error.stack : 'No stack trace available'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
