
import { callOpenAI } from "./openai-client.ts";

/**
 * Select appropriate component variants for the wireframe based on its purpose and style
 */
export async function selectComponentVariants(blueprint: any): Promise<any> {
  console.log("Selecting component variants...");
  
  // If no sections, return blueprint as is
  if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
    console.log("No sections found in blueprint for component selection");
    return blueprint;
  }
  
  const prompt = `
Analyze this wireframe blueprint and select the most appropriate component variants for each section:

${JSON.stringify(blueprint, null, 2)}

For each section in the wireframe:
1. Identify the section type (e.g., hero, features, testimonials)
2. Select the most appropriate component variant based on:
   - The purpose of the website/page
   - Target audience
   - Visual style/tone
   - Content needs
3. Update the section's "componentVariant" property with the selected variant
4. Add any necessary component-specific configuration to the section's "data" object

Return the updated blueprint with component variants selected for all sections.
Return only valid JSON without any explanations or comments.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI component specialist who selects the most appropriate component variants for wireframes.',
      temperature: 0.4, // Lower temperature for more focused/deterministic selections
      model: "gpt-4o-mini"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract component variants from AI response");
      return blueprint; // Return original blueprint if we couldn't parse the response
    }

    try {
      const updatedBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      console.log("Component variant selection successful");
      return updatedBlueprint;
    } catch (parseError) {
      console.error("Error parsing component variants JSON:", parseError);
      return blueprint; // Return original blueprint if we couldn't parse the response
    }
    
  } catch (error) {
    console.error("Error selecting component variants:", error);
    return blueprint; // Return original blueprint on error
  }
}
