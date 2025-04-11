
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { callOpenAI, getTokenUsage, resetTokenUsage } from "./openai-client.ts";
import { extractIntent } from "./intent-extractor.ts";
import { generateBlueprint, enhanceBlueprint } from "./blueprint-generator.ts";
import { selectComponentVariants } from "./component-selector.ts";
import { applyStyleModifiers } from "./style-applicator.ts";
import { WireframeGenerationRequest, WireframeGenerationResponse } from "./types.ts";
import { v4 as uuid } from "https://deno.land/std@0.110.0/uuid/mod.ts";

// Process the wireframe generation request
async function generateWireframe(
  request: WireframeGenerationRequest
): Promise<WireframeGenerationResponse> {
  const startTime = performance.now();
  console.log("Starting wireframe generation...");
  
  // Reset token usage tracking for this request
  resetTokenUsage();
  
  try {
    console.log("Received generation request:", request.userInput?.substring(0, 100));
    
    // Extract the user's input
    const { 
      userInput, 
      styleToken, 
      colorScheme, 
      enhancedCreativity = true, 
      creativityLevel = 8, 
      industry,
      baseWireframe,
      isVariation
    } = request;
    
    if (!userInput) {
      throw new Error("User input is required");
    }
    
    // Step 1: Extract design intent
    console.log("Extracting design intent...");
    const intentData = await extractIntent(userInput, styleToken);
    console.log("Intent extraction complete", intentData);
    
    // Step 2: Generate wireframe blueprint
    console.log("Generating wireframe blueprint...");
    let blueprint = await generateBlueprint(userInput, intentData, styleToken);
    
    // Step 3: If we have a base wireframe and we're creating a variation, enhance the blueprint
    if (baseWireframe && isVariation) {
      console.log("Enhancing blueprint for variation based on existing wireframe");
      blueprint = await enhanceBlueprint(
        blueprint, 
        `Create a variation that maintains the same purpose but with ${
          enhancedCreativity ? "higher creativity" : "similar structure"
        }. Focus on ${
          creativityLevel > 7 ? "innovative and unique" : "practical and effective"
        } design patterns.`
      );
    }
    
    // Step 4: Select appropriate component variants
    console.log("Selecting component variants...");
    blueprint = await selectComponentVariants(blueprint);
    
    // Step 5: Apply style modifiers
    console.log("Applying style modifiers...");
    blueprint = await applyStyleModifiers(blueprint, styleToken || intentData.visualTone);
    
    // Apply color scheme if provided
    if (colorScheme) {
      blueprint.colorScheme = typeof colorScheme === 'string' 
        ? JSON.parse(colorScheme) 
        : colorScheme;
    }
    
    // Add a unique ID if one doesn't exist
    blueprint.id = blueprint.id || crypto.randomUUID();
    
    // Calculate metrics
    const endTime = performance.now();
    const generationTime = (endTime - startTime) / 1000; // in seconds
    console.log(`Wireframe generation completed in ${generationTime.toFixed(2)} seconds`);
    
    // Get token usage data
    const tokenUsage = getTokenUsage();
    
    // Return the final wireframe with real token usage data
    return {
      success: true,
      wireframe: blueprint,
      model: "gpt-4o-mini",
      intentData,
      blueprint,
      usage: tokenUsage,
      generationTime
    };
    
  } catch (error) {
    console.error("Error generating wireframe:", error);
    return {
      success: false,
      error: error.message,
      errorType: "GenerationError",
      errorDetails: String(error)
    };
  }
}

// Process suggestion generation requests
async function generateSuggestions(request: any): Promise<any> {
  try {
    const { wireframe, sections, targetSection } = request;
    
    if (!wireframe) {
      throw new Error("Wireframe data is required for generating suggestions");
    }
    
    const prompt = `
Analyze this wireframe and provide design improvement suggestions:

${JSON.stringify(wireframe, null, 2)}

${targetSection ? `Focus on improving the section with ID: ${targetSection}` : 'Provide general improvements for the entire wireframe.'}

Generate 3-5 specific, actionable suggestions that would improve the design in terms of:
1. Visual hierarchy and user flow
2. Content organization and readability
3. Consistency and coherence
4. User engagement
5. Accessibility

For each suggestion, provide:
- A clear title
- A detailed description of what to change
- A preview of how the change would look (as a JSON snippet)
- A justification for why this change improves the design

Return an array of suggestions in JSON format.
`;

    const response = await callOpenAI(prompt, {
      systemMessage: "You are an expert UI/UX designer who specializes in providing actionable wireframe improvement suggestions.",
      temperature: 0.7,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    let suggestions;
    try {
      suggestions = JSON.parse(response);
    } catch (parseError) {
      console.error("Error parsing suggestions JSON:", parseError);
      
      // Try to extract JSON if it's wrapped in markdown code blocks or text
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                         response.match(/(\{[\s\S]*\})/);
                         
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Failed to parse AI suggestions");
      }
    }
    
    // Get token usage data
    const tokenUsage = getTokenUsage();
    
    return {
      success: true,
      suggestions: Array.isArray(suggestions) ? suggestions : [],
      usage: tokenUsage
    };
    
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return {
      success: false,
      error: error.message,
      errorType: "SuggestionError",
      errorDetails: String(error)
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Parse the request body
    const request = await req.json();
    
    if (request.action === "generate-wireframe") {
      // Call the wireframe generation function
      console.log("Processing generate-wireframe action");
      const result = await generateWireframe(request);
      
      // Return the result
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400
      });
    }
    else if (request.action === "generate-suggestions") {
      // Call the suggestions generation function
      console.log("Processing generate-suggestions action");
      const result = await generateSuggestions(request);
      
      // Return the result
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400
      });
    }
    
    // Handle unknown action
    console.error("Unknown action requested:", request.action);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unknown action",
        errorType: "ActionError"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        errorType: "ProcessingError",
        errorDetails: String(error)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
