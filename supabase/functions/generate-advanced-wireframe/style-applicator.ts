
// Import callOpenAI from the OpenAI client
import { callOpenAI } from "./openai-client.ts";

/**
 * Apply style modifiers to the wireframe
 */
export async function applyStyleModifiers(wireframe: any, styleToken: string = 'modern'): Promise<any> {
  if (!wireframe || !wireframe.sections) {
    throw new Error('Valid wireframe with sections is required for style modification');
  }

  // Construct a prompt for style application
  const prompt = `
Apply the "${styleToken}" style to this wireframe:
${JSON.stringify(wireframe, null, 2)}

Enhance it with style properties:
1. Update color schemes based on the "${styleToken}" style
2. Add appropriate typography recommendations
3. Enhance styling notes for components
4. Add shadow and border recommendations
5. Ensure visual style is consistent with "${styleToken}" aesthetics

Do not change the structure or components themselves, only enhance style properties.
Return the complete wireframe with style enhancements applied.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI stylist who applies beautiful and consistent visual styles to wireframes.',
      temperature: 0.6,
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract styled wireframe from AI response");
    }

    let styledWireframe;
    try {
      styledWireframe = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing styled wireframe JSON:", parseError, "Raw JSON:", jsonMatch[0]);
      throw new Error("Failed to parse styled wireframe data");
    }
    
    if (!styledWireframe || !styledWireframe.sections) {
      console.error("Invalid styled wireframe data structure:", styledWireframe);
      throw new Error("Invalid styled wireframe data structure");
    }
    
    // Ensure styleToken is carried forward
    styledWireframe.styleToken = styleToken || wireframe.styleToken;
    
    return styledWireframe;
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    throw new Error(`Failed to apply style modifiers: ${error.message}`);
  }
}
