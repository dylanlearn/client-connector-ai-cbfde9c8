import { callOpenAI } from "./openai-client.ts";

/**
 * Generate a wireframe blueprint from user input and design intent
 */
export async function generateBlueprint(userInput: string, intentData: any, styleToken?: string): Promise<any> {
  // Optimize the system prompt for more direct, efficient generation
  const systemPrompt = `You are a professional UX/UI designer specializing in wireframes.
Generate a complete, optimized wireframe blueprint based on the description and intent.
Your response must be a valid JSON object with this structure:
{
  "id": "unique-id",
  "title": "Title derived from user input",
  "description": "Description based on user input",
  "sections": [
    {
      "id": "section-id",
      "name": "Section Name",
      "sectionType": "hero | features | testimonials | pricing | contact | footer | etc",
      "components": [...],
      "layoutType": "grid | flex | standard",
      "description": "Description of this section's purpose"
    }
  ],
  "colorScheme": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor",
    "background": "#hexcolor",
    "text": "#hexcolor"
  },
  "typography": {
    "headings": "font-family",
    "body": "font-family"
  },
  "styleToken": "${styleToken || 'standard'}",
  "designReasoning": "Explanation of key design decisions"
}`;

  // Optimize the user prompt for clearer, more direct instructions
  const userPrompt = `Design intent: ${JSON.stringify(intentData)}
User input: ${userInput}
${styleToken ? `Style: ${styleToken}` : ''}

Create a wireframe blueprint with 3-7 well-structured sections that fulfills this request.
Focus on clarity, usability, and ${intentData?.primary || 'conversion'}-oriented design.`;

  try {
    console.log(`Generating blueprint for: "${userInput.substring(0, 50)}..."`);
    
    // Use the proper model and optimization settings
    const response = await callOpenAI(userPrompt, { 
      systemMessage: systemPrompt,
      temperature: 0.7,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    // Optimize JSON parsing with better error handling
    try {
      const blueprint = JSON.parse(response);
      
      // Ensure the blueprint has a unique ID
      if (!blueprint.id) {
        blueprint.id = crypto.randomUUID();
      }
      
      console.log(`Blueprint generated successfully with ${blueprint.sections?.length || 0} sections`);
      return blueprint;
    } catch (parseError) {
      console.error("Failed to parse blueprint JSON:", parseError);
      
      // Extract JSON if wrapped in markdown or text
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                         response.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        const extractedBlueprint = JSON.parse(jsonMatch[1].trim());
        console.log(`Extracted blueprint from response with ${extractedBlueprint.sections?.length || 0} sections`);
        return extractedBlueprint;
      } else {
        throw new Error("Could not extract valid JSON from the response");
      }
    }
  } catch (error) {
    console.error("Error generating blueprint:", error);
    
    // Return a minimal valid blueprint as fallback
    return {
      id: crypto.randomUUID(),
      title: "Wireframe from " + userInput.substring(0, 30),
      description: userInput,
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Main Section",
          sectionType: "content",
          components: [],
          layoutType: "standard",
          description: "Generated as fallback due to error"
        }
      ],
      colorScheme: {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#111827"
      },
      typography: {
        headings: "sans-serif",
        body: "sans-serif"
      },
      styleToken: styleToken || "standard",
      designReasoning: "Fallback design created due to generation error"
    };
  }
}

/**
 * Enhance an existing blueprint with additional details or variations
 */
export async function enhanceBlueprint(blueprint: any, enhancementDirections: string): Promise<any> {
  // Optimize system prompt for more efficient blueprint enhancement
  const systemPrompt = `You are a professional UX/UI designer. 
Enhance the provided wireframe blueprint according to the enhancement directions.
Maintain the original structure but improve it according to the directions.
Return ONLY a valid JSON object with the enhanced blueprint.`;

  // Optimized user prompt for clearer instructions
  const userPrompt = `Original blueprint: ${JSON.stringify(blueprint)}
  
Enhancement directions: ${enhancementDirections}

Return the enhanced blueprint as a complete, valid JSON object.
Focus on maintaining the same structure while applying the requested enhancements.`;

  try {
    console.log(`Enhancing blueprint ${blueprint.id} with directions: "${enhancementDirections.substring(0, 50)}..."`);
    
    const response = await callOpenAI(userPrompt, {
      systemMessage: systemPrompt,
      temperature: 0.7,
      model: "gpt-4o-mini", 
      responseFormat: { type: "json_object" }
    });
    
    // Parse with optimized error handling
    try {
      const enhancedBlueprint = JSON.parse(response);
      
      // Ensure we keep the same ID
      enhancedBlueprint.id = blueprint.id;
      
      console.log(`Blueprint enhanced successfully with ${enhancedBlueprint.sections?.length || 0} sections`);
      return enhancedBlueprint;
    } catch (parseError) {
      console.error("Failed to parse enhanced blueprint JSON:", parseError);
      
      // Extract JSON if wrapped in markdown or text
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                         response.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        const extractedBlueprint = JSON.parse(jsonMatch[1].trim());
        extractedBlueprint.id = blueprint.id;
        console.log(`Extracted enhanced blueprint with ${extractedBlueprint.sections?.length || 0} sections`);
        return extractedBlueprint;
      } else {
        // Fall back to the original blueprint
        console.warn("Could not parse enhancement response, returning original blueprint");
        return blueprint;
      }
    }
  } catch (error) {
    console.error("Error enhancing blueprint:", error);
    // Return the original blueprint as fallback
    return blueprint;
  }
}
