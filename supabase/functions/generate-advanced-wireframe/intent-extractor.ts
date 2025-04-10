
import { callOpenAI } from "./openai-client.ts";

// Define the intent interface
export interface DesignIntent {
  purpose: string;
  target: string;
  visualTone: string;
  content: string[];
  layout?: string;
  specialRequirements?: string[];
  colorPreferences?: string[];
  typographyPreferences?: string[];
  accessibilityRequirements?: string[];
  [key: string]: any;
}

/**
 * Extract intent data from user input
 */
export async function extractIntent(userInput: string, styleToken?: string): Promise<DesignIntent> {
  if (!userInput || typeof userInput !== 'string') {
    throw new Error('Valid user input is required for intent extraction');
  }

  console.log("Extracting intent from user input:", userInput.substring(0, 100) + (userInput.length > 100 ? "..." : ""));

  // Construct a prompt for the intent extraction
  const prompt = `
Extract the core intent and design parameters from this wireframe description:

"${userInput}"

Analyze this input and extract:
1. purpose (what kind of website/application is needed)
2. target (target audience or users)
3. visualTone (design style preference, use "${styleToken || 'modern'}" if not explicitly specified)
4. content (key content sections/elements that need to be included)
5. layout (overall layout structure if mentioned)
6. specialRequirements (any unique or specific requirements mentioned)
7. colorPreferences (any color preferences or brand colors mentioned)
8. typographyPreferences (any font or typography preferences)
9. accessibilityRequirements (any accessibility considerations)

Return a JSON object with these extracted intent elements. If information for a field is not provided, make a reasonable assumption based on the purpose and target audience. For 'content', always return an array of strings.
`;

  try {
    console.log("Calling OpenAI for intent extraction");
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert product designer who extracts user intent for digital products. Return ONLY valid JSON.',
      temperature: 0.3, // Lower temperature for more deterministic results
      model: "gpt-4o-mini"
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract intent from AI response");
    }

    let intentData: DesignIntent;
    try {
      intentData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing intent JSON:", parseError, "Raw JSON:", jsonMatch[0]);
      throw new Error("Failed to parse intent data");
    }
    
    // Ensure we have the minimal required intent data
    if (!intentData || !intentData.purpose) {
      console.error("Invalid intent data structure:", intentData);
      throw new Error("Invalid intent data structure: missing critical fields");
    }
    
    // Set default values for missing fields
    intentData.visualTone = intentData.visualTone || styleToken || 'modern';
    intentData.content = intentData.content || [];
    intentData.specialRequirements = intentData.specialRequirements || [];
    
    console.log("Successfully extracted intent:", {
      purpose: intentData.purpose,
      target: intentData.target,
      visualTone: intentData.visualTone,
      contentCount: intentData.content?.length || 0
    });
    
    return intentData;
  } catch (error) {
    console.error("Error extracting intent:", error);
    throw new Error(`Failed to extract intent: ${error.message}`);
  }
}
