import { callOpenAI } from "./openai-client.ts";

/**
 * Generate a wireframe blueprint from user input and design intent
 */
export async function generateBlueprint(userInput: string, intentData: any, styleToken?: string): Promise<any> {
  const systemPrompt = `You are a professional UX/UI designer with expertise in creating wireframes.
Based on the provided user description and design intent, generate a complete wireframe blueprint.
Your response should ONLY be a valid JSON object with the following structure:
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
  "designTokens": {},
  "styleToken": "${styleToken || 'standard'}",
  "designReasoning": "Explanation of key design decisions"
}`;

  const userPrompt = `Design intent: ${JSON.stringify(intentData)}
User input: ${userInput}
${styleToken ? `Style: ${styleToken}` : ''}

Generate a complete wireframe blueprint that fulfills this request. The wireframe should have 3-7 well-structured sections.`;

  try {
    const response = await callOpenAI(userPrompt, { 
      systemMessage: systemPrompt,
      temperature: 0.7,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    // Parse the response into a JSON object
    let blueprint;
    try {
      blueprint = JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse blueprint JSON:", error);
      // Try to extract JSON if it's wrapped in markdown code blocks or text
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                         response.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        blueprint = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Could not extract valid JSON from the response");
      }
    }
    
    // Ensure the blueprint has a unique ID
    if (!blueprint.id) {
      blueprint.id = crypto.randomUUID();
    }
    
    return blueprint;
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
      designTokens: {},
      styleToken: styleToken || "standard",
      designReasoning: "Fallback design created due to generation error"
    };
  }
}

/**
 * Enhance an existing blueprint with additional details or variations
 */
export async function enhanceBlueprint(blueprint: any, enhancementDirections: string): Promise<any> {
  const systemPrompt = `You are a professional UX/UI designer. 
Enhance the provided wireframe blueprint according to the enhancement directions.
Maintain the original structure but improve or modify it according to the directions.
Return ONLY a valid JSON object with the enhanced blueprint.`;

  const userPrompt = `Original blueprint: ${JSON.stringify(blueprint)}
  
Enhancement directions: ${enhancementDirections}

Return the enhanced blueprint as a complete, valid JSON object.`;

  try {
    const response = await callOpenAI(userPrompt, {
      systemMessage: systemPrompt,
      temperature: 0.7,
      model: "gpt-4o-mini", 
      responseFormat: { type: "json_object" }
    });
    
    // Parse the response into a JSON object
    let enhancedBlueprint;
    try {
      enhancedBlueprint = JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse enhanced blueprint JSON:", error);
      // Try to extract JSON if it's wrapped in markdown code blocks or text
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                         response.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        enhancedBlueprint = JSON.parse(jsonMatch[1].trim());
      } else {
        // Fall back to the original blueprint
        return blueprint;
      }
    }
    
    // Ensure we keep the same ID
    enhancedBlueprint.id = blueprint.id;
    
    return enhancedBlueprint;
  } catch (error) {
    console.error("Error enhancing blueprint:", error);
    // Return the original blueprint as fallback
    return blueprint;
  }
}
