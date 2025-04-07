
import { CallOpenAIOptions, callOpenAI } from "./openai-client.ts";

export interface IntentData {
  structuredIntent: string;
  visualTone: string;
  contentPurpose?: string;
  suggestedSections: string[];
  pageType: string;
  audienceLevel?: string;
  complexity: string;
}

/**
 * Extracts intent from user input
 */
export async function extractIntent(userInput: string, styleToken?: string): Promise<IntentData> {
  if (!userInput || typeof userInput !== 'string') {
    throw new Error('Valid user input is required for intent extraction');
  }

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

  try {
    const response = await callOpenAI(prompt, { 
      systemMessage: 'You are an expert UI/UX designer and wireframe generator. Create detailed, structured wireframe specifications based on user input.'
    });
    
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
