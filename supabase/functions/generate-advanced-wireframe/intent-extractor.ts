
import { callOpenAI } from "./openai-client.ts";

/**
 * Extract intent data from user input
 */
export async function extractIntent(userInput: string, styleToken?: string): Promise<any> {
  if (!userInput || typeof userInput !== 'string') {
    throw new Error('Valid user input is required for intent extraction');
  }

  // Construct a prompt for the intent extraction
  const prompt = `
Extract the core intent from this wireframe description:

"${userInput}"

Analyze this input and extract:
- purpose (what kind of website/application is needed)
- target (target audience or users)
- visualTone (design style preference, use "${styleToken || 'modern'}" if not specified)
- content (key content sections/elements that need to be included)
- specialRequirements (any unique or specific requirements mentioned)

Return a JSON object with these extracted intent elements.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert product designer who extracts user intent for digital products.',
      temperature: 0.3, // Lower temperature for more deterministic results
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract intent from AI response");
    }

    let intentData;
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
    
    return intentData;
  } catch (error) {
    console.error("Error extracting intent:", error);
    throw new Error(`Failed to extract intent: ${error.message}`);
  }
}
