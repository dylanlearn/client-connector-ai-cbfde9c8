
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { callOpenAI } from "./openai-client.ts";
import { WireframeGenerationRequest, WireframeGenerationResponse } from "./types.ts";

// Process the wireframe generation request
async function generateWireframe(
  request: WireframeGenerationRequest
): Promise<WireframeGenerationResponse> {
  const startTime = performance.now();
  
  try {
    console.log("Received generation request:", request.userInput);
    
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
    
    // Generate wireframe blueprint
    console.log("Generating wireframe blueprint...");
    
    // Extract design intent
    const intentPrompt = `
      I need you to analyze the following website description and extract the user's intent, desired sections, and layout preferences.
      
      Description: ${userInput}
      
      Return a JSON object with the following structure:
      {
        "title": "Website title based on description",
        "intentSummary": "Brief summary of the user's intent",
        "targetAudience": "Who this website is for",
        "desiredSections": ["array", "of", "section", "types"],
        "tone": "Professional/Casual/Friendly/etc",
        "requiredFeatures": ["array", "of", "key", "features"],
        "industryCategory": "Category of business/organization"
      }
    `;
    
    // First extract the user's intent
    const intentResponse = await callOpenAI(intentPrompt, {
      model: "gpt-4o-mini",
      systemMessage: "You are a helpful AI specializing in understanding website design requirements.",
      temperature: 0.5, // Lower temperature for more deterministic results
      maxTokens: 1000
    });
    
    let intentData;
    try {
      intentData = JSON.parse(intentResponse);
    } catch (err) {
      console.error("Error parsing intent data:", err);
      intentData = { 
        title: "Unnamed Website", 
        intentSummary: userInput.substring(0, 100),
        desiredSections: ["hero", "features", "about", "contact"]
      };
    }
    
    // Generate the blueprint for the wireframe
    const blueprintPrompt = `
      Create a comprehensive wireframe blueprint for a website based on the following requirements:
      
      Description: ${userInput}
      Intent Summary: ${intentData.intentSummary || "Not specified"}
      Target Audience: ${intentData.targetAudience || "General"}
      Tone: ${intentData.tone || "Professional"}
      Industry: ${industry || intentData.industryCategory || "General"}
      Style: ${styleToken || "Modern and clean"}
      
      ${enhancedCreativity ? `Use high creativity level (${creativityLevel}/10) to generate innovative design ideas.` : "Use a standard, conventional design approach."}
      
      Return a JSON object that represents the complete wireframe structure with the following format:
      {
        "id": "unique-wireframe-id",
        "title": "Website Title",
        "description": "Brief description of the wireframe",
        "sections": [
          {
            "id": "section-id",
            "name": "Section Name",
            "sectionType": "hero/features/pricing/etc",
            "description": "What this section does",
            "layout": { "type": "flex/grid", "direction": "column/row", ... },
            "components": [],
            "copySuggestions": {
              "heading": "Suggested heading text",
              "subheading": "Suggested subheading text"
            }
          }
        ],
        "colorScheme": {
          "primary": "#hex",
          "secondary": "#hex",
          "accent": "#hex",
          "background": "#hex"
        },
        "typography": {
          "headings": "font family for headings",
          "body": "font family for body text"
        },
        "styleToken": "modern/classic/minimalist/etc",
        "mobileConsiderations": "notes on mobile design",
        "accessibilityNotes": "accessibility considerations"
      }
    `;
    
    // Call OpenAI to generate the wireframe blueprint
    const blueprintResponse = await callOpenAI(blueprintPrompt, {
      model: "gpt-4o",
      systemMessage: "You are a professional UI/UX designer with expertise in creating wireframes that follow modern design principles and best practices.",
      temperature: enhancedCreativity ? Math.min(0.4 + (creativityLevel / 10), 1.0) : 0.4,
      maxTokens: 4000,
    });
    
    // Parse the blueprint response
    let blueprint;
    try {
      blueprint = JSON.parse(blueprintResponse);
      console.log("Successfully generated blueprint");
    } catch (err) {
      console.error("Error parsing blueprint:", err, blueprintResponse);
      throw new Error("Failed to generate wireframe blueprint");
    }
    
    // Apply color scheme if provided
    if (colorScheme) {
      blueprint.colorScheme = typeof colorScheme === 'string' 
        ? JSON.parse(colorScheme) 
        : colorScheme;
    }
    
    // Calculate metrics
    const endTime = performance.now();
    const generationTime = (endTime - startTime) / 1000; // in seconds
    
    // Return the final wireframe
    return {
      success: true,
      wireframe: blueprint,
      model: "gpt-4o",
      intentData,
      blueprint,
      usage: {
        total_tokens: 0, // We don't have exact token counts from the API
        prompt_tokens: 0,
        completion_tokens: 0
      }
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
      const result = await generateWireframe(request);
      
      // Return the result
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400
      });
    }
    
    // Handle unknown action
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
