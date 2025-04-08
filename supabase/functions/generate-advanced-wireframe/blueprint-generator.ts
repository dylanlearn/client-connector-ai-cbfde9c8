
// Import callOpenAI from the OpenAI client
import { callOpenAI } from "./openai-client.ts";

// Define the Intent interface
interface Intent {
  purpose: string;
  target: string;
  visualTone?: string;
  content: string[];
  layout?: string;
  [key: string]: any;
}

// Define the Blueprint interface
export interface Blueprint {
  title?: string;
  description?: string;
  sections?: any[];
  styleToken?: string;
  [key: string]: any;
}

/**
 * Generate a layout blueprint based on extracted intent data
 */
export async function generateLayoutBlueprint(intent: Intent): Promise<Blueprint> {
  if (!intent || typeof intent !== 'object') {
    throw new Error('Valid intent data is required for blueprint generation');
  }

  const { purpose, target, visualTone, content } = intent;

  if (!purpose || !target || !content) {
    throw new Error('Intent data is missing required fields');
  }

  // Construct a prompt for the layout blueprint generation
  const prompt = `
Generate a detailed wireframe layout blueprint for a ${purpose} website targeting ${target}.
Visual tone: ${visualTone || 'modern and professional'}

Content to include:
${Array.isArray(content) ? content.map(c => `- ${c}`).join('\n') : ''}

The blueprint should include:
1. A title for the wireframe
2. An overall description
3. A detailed sections array with the following for each section:
   - id (unique identifier)
   - name (descriptive name)
   - sectionType (e.g., hero, features, testimonials, contact)
   - description (what this section contains/does)
   - layout (visual structure description)

Return ONLY a valid JSON object with these fields.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI architect who creates structured wireframe blueprints.',
      temperature: 0.7,
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract blueprint from AI response");
    }

    let blueprint;
    try {
      blueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing blueprint JSON:", parseError, "Raw JSON:", jsonMatch[0]);
      throw new Error("Failed to parse blueprint data");
    }
    
    if (!blueprint || !blueprint.sections) {
      console.error("Invalid blueprint data structure:", blueprint);
      throw new Error("Invalid blueprint data structure");
    }
    
    // Add any missing required fields
    const enhancedBlueprint = {
      title: blueprint.title || `${purpose.charAt(0).toUpperCase() + purpose.slice(1)} Website Wireframe`,
      description: blueprint.description || `A wireframe blueprint for a ${purpose} website targeting ${target}`,
      styleToken: visualTone || 'modern',
      sections: blueprint.sections || []
    };
    
    return enhancedBlueprint;
  } catch (error) {
    console.error("Error generating layout blueprint:", error);
    throw new Error(`Failed to generate layout blueprint: ${error.message}`);
  }
}
