
import { Blueprint } from "./blueprint-generator.ts";
import { callOpenAI } from "./openai-client.ts";

/**
 * Selects component variants for each section in the blueprint
 */
export async function selectComponentVariants(blueprint: Blueprint): Promise<Blueprint> {
  if (!blueprint || !blueprint.sections || !Array.isArray(blueprint.sections)) {
    throw new Error("Invalid blueprint structure");
  }
  
  const prompt = `
For each section in this layout blueprint, select the most appropriate component variant. Include variant type, layout notes, and tone guidance.

Blueprint sections: ${JSON.stringify(blueprint.sections)}

Example component types: Navbar, Hero, Sidebar, Feature Grid, Testimonials, Pricing Cards, Footer.
Example variants: Transparent, Collapsible, Light/Dark, Overlay, Sticky, Split Grid.

For each section, return:
- sectionType (original type)
- componentVariant (selected variant)
- layoutNotes (specific layout guidance)
- components (array of content components needed)
- responsiveBehavior (how it should adapt)

Return a JSON object with an updated "sections" array containing these enhanced sections.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI component designer. Select appropriate component variants for wireframe sections.'
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      const variantData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      
      // Merge the component variants back into the original blueprint
      return {
        ...blueprint,
        sections: variantData.sections || blueprint.sections
      };
    }
    
    return blueprint; // Return original blueprint if parsing fails
  } catch (error) {
    console.error("Error parsing component variants:", error);
    return blueprint; // Return original blueprint if parsing fails
  }
}
