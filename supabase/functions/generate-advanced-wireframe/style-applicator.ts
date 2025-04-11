
import { callOpenAI } from "./openai-client.ts";

/**
 * Apply style modifiers to the wireframe based on style token or visual tone
 */
export async function applyStyleModifiers(blueprint: any, styleToken: string): Promise<any> {
  console.log("Applying style modifiers...");
  
  // If no sections, return blueprint as is
  if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
    console.log("No sections found in blueprint for style application");
    return blueprint;
  }
  
  const prompt = `
Apply the "${styleToken}" style to this wireframe blueprint:

${JSON.stringify(blueprint, null, 2)}

For each section in the wireframe:
1. Apply appropriate styling based on the "${styleToken}" style
2. Update the section's "style" object with:
   - Appropriate background colors
   - Text styling (font, size, weight, alignment)
   - Spacing and layout adjustments
   - Border, shadow, and other visual treatments
3. Ensure styling is consistent across sections while maintaining hierarchy
4. Add a global "colorScheme" object to the blueprint with:
   - primary: Primary color 
   - secondary: Secondary color
   - accent: Accent color
   - background: Default background color
   - text: Default text color

Style Keywords: "${styleToken}" should influence:
- Color palette
- Visual weight
- Spacing principles
- Typography choices
- Overall aesthetic

Return the updated blueprint with style applied to all sections.
Return only valid JSON without any explanations or comments.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI designer who specializes in applying consistent, beautiful styling to wireframes.',
      temperature: 0.5,
      model: "gpt-4o-mini"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract styled blueprint from AI response");
      return blueprint; // Return original blueprint if we couldn't parse the response
    }

    try {
      const styledBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      console.log("Style application successful");
      return styledBlueprint;
    } catch (parseError) {
      console.error("Error parsing styled blueprint JSON:", parseError);
      return blueprint; // Return original blueprint if we couldn't parse the response
    }
    
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    return blueprint; // Return original blueprint on error
  }
}
