
import { callOpenAI } from "./openai-client.ts";
import { DesignIntent } from "./intent-extractor.ts";

/**
 * Generate a wireframe blueprint from the user input and extracted intent
 */
export async function generateBlueprint(
  userInput: string, 
  intentData: DesignIntent, 
  styleToken?: string
) {
  console.log("Generating wireframe blueprint...");
  
  const prompt = `
Generate a detailed wireframe blueprint based on the following design intent:

${JSON.stringify(intentData, null, 2)}

Original user request: "${userInput}"

The wireframe blueprint should include:
1. A structured layout with clear sections (hero, features, testimonials, etc.)
2. Appropriate content structure for each section
3. Responsive design considerations
4. Proper hierarchy of information
5. Navigation and user flow elements

Return a complete wireframe JSON structure with the following:
- id: UUID for the wireframe
- title: Clear title based on intent
- description: Brief description
- sections: Array of sections, each with:
  * id: Unique identifier
  * name: Descriptive name
  * sectionType: Type of section (hero, features, etc.)
  * order: Display order
  * data: Content and configuration for the section
  * style: Visual styling properties

Each section should have appropriate subsections, content placeholders, and styling.
${styleToken ? `Apply the "${styleToken}" visual style throughout the wireframe.` : ''}

Return only valid JSON without any explanations or comments.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI/UX designer specializing in wireframe creation. You create detailed, structured wireframes based on design requirements.',
      temperature: 0.7,
      model: "gpt-4o-mini"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      throw new Error("Failed to extract blueprint data from AI response");
    }

    try {
      const blueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      console.log("Blueprint generation successful");
      return blueprint;
    } catch (parseError) {
      console.error("Error parsing blueprint JSON:", parseError);
      throw new Error("Failed to parse blueprint data");
    }
    
  } catch (error) {
    console.error("Error generating blueprint:", error);
    throw error;
  }
}

/**
 * Enhance an existing blueprint with additional details or variations
 */
export async function enhanceBlueprint(
  blueprint: any, 
  enhancementInstructions: string
) {
  console.log("Enhancing wireframe blueprint...");
  
  const prompt = `
Enhance and improve this existing wireframe blueprint according to these instructions:

${enhancementInstructions}

Current blueprint:
${JSON.stringify(blueprint, null, 2)}

Make these specific improvements:
1. Enhance the visual design elements
2. Improve content structure and flow
3. Add more detailed component specifications
4. Ensure responsive design considerations are included
5. Add any missing sections that would improve the user experience

Return the enhanced blueprint as valid JSON without any explanations or comments.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI/UX designer specializing in wireframe enhancement. You improve existing wireframes while maintaining their core structure and intent.',
      temperature: 0.7,
      model: "gpt-4o-mini"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      throw new Error("Failed to extract enhanced blueprint data from AI response");
    }

    try {
      const enhancedBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      console.log("Blueprint enhancement successful");
      return enhancedBlueprint;
    } catch (parseError) {
      console.error("Error parsing enhanced blueprint JSON:", parseError);
      throw new Error("Failed to parse enhanced blueprint data");
    }
    
  } catch (error) {
    console.error("Error enhancing blueprint:", error);
    throw error;
  }
}
