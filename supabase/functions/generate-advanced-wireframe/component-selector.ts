
import { Blueprint } from "./blueprint-generator.ts";
import { callOpenAI } from "./openai-client.ts";

/**
 * Selects component variants for each section in the blueprint
 */
export async function selectComponentVariants(blueprint: Blueprint): Promise<Blueprint> {
  if (!blueprint) {
    console.error("Blueprint is null or undefined");
    throw new Error("Invalid blueprint: Blueprint data is missing");
  }

  if (!blueprint.sections || !Array.isArray(blueprint.sections)) {
    console.error("Blueprint sections are invalid:", blueprint);
    throw new Error("Invalid blueprint structure: Sections array is missing or not an array");
  }
  
  if (blueprint.sections.length === 0) {
    console.warn("Blueprint has no sections, returning original blueprint");
    return blueprint;
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
    console.log("Calling OpenAI for component variant selection");
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI component designer. Select appropriate component variants for wireframe sections.'
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract component variants from AI response");
    }

    let variantData;
    try {
      variantData = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing component variants JSON:", parseError, "Raw JSON:", jsonMatch[0]);
      throw new Error("Failed to parse component variants data");
    }
    
    if (!variantData || !variantData.sections) {
      console.error("Invalid component variants data structure:", variantData);
      throw new Error("Invalid component variants data structure");
    }
    
    console.log(`Successfully selected variants for ${variantData.sections.length} sections`);
    
    // Merge the component variants back into the original blueprint
    return {
      ...blueprint,
      sections: variantData.sections || blueprint.sections
    };
  } catch (error) {
    console.error("Error selecting component variants:", error);
    // Return original blueprint if variant selection fails
    console.warn("Using original blueprint sections due to error in variant selection");
    return blueprint;
  }
}
