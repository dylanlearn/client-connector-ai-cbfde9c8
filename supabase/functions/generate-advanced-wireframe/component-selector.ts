
// Import callOpenAI from the OpenAI client
import { callOpenAI } from "./openai-client.ts";

/**
 * Select appropriate component variants based on the blueprint
 */
export async function selectComponentVariants(blueprint: any): Promise<any> {
  if (!blueprint || !blueprint.sections) {
    throw new Error('Valid blueprint with sections is required for component variant selection');
  }

  // Construct a prompt for component selection
  const prompt = `
Given this wireframe blueprint:
${JSON.stringify(blueprint, null, 2)}

Enhance it with appropriate component variants by:
1. Selecting an appropriate variant for each section
2. Adding detailed design and layout notes
3. Specifying responsive behaviors
4. Adding appropriate style properties
5. Including visual placeholders descriptions

Return the enhanced wireframe with these additions.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI designer who selects the best component variants for wireframes.',
      temperature: 0.7,
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract component variants from AI response");
    }

    let enhancedWireframe;
    try {
      enhancedWireframe = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing component variants JSON:", parseError, "Raw JSON:", jsonMatch[0]);
      throw new Error("Failed to parse component variants data");
    }
    
    if (!enhancedWireframe || !enhancedWireframe.sections) {
      console.error("Invalid enhanced wireframe data structure:", enhancedWireframe);
      throw new Error("Invalid enhanced wireframe data structure");
    }
    
    console.log("Successfully selected variants for", enhancedWireframe.sections.length, "sections");
    return enhancedWireframe;
  } catch (error) {
    console.error("Error selecting component variants:", error);
    throw new Error(`Failed to select component variants: ${error.message}`);
  }
}
