
import { IntentData } from "./intent-extractor.ts";
import { CallOpenAIOptions, callOpenAI } from "./openai-client.ts";

export interface Blueprint {
  sections: Array<{
    type: string;
    layout: string;
    components: string[];
    responsiveBehavior?: string;
    styleModifiers?: string[];
  }>;
  title?: string;
  description?: string;
}

/**
 * Generates layout blueprint based on intent data
 */
export async function generateLayoutBlueprint(intentData: IntentData): Promise<Blueprint> {
  if (!intentData || typeof intentData !== 'object') {
    throw new Error('Valid intent data is required for blueprint generation');
  }

  const prompt = `
Based on this user vision, output a JSON layout blueprint with the following for each section:
- type
- layout (grid, flex, overlay, etc.)
- key components
- responsive behavior notes
- optional style modifiers (dark, glassy, minimalist)

User vision details:
- Intent: ${intentData.structuredIntent || 'Not specified'}
- Visual tone: ${intentData.visualTone || 'modern'}
- Page type: ${intentData.pageType || 'landing page'}
- Suggested sections: ${JSON.stringify(intentData.suggestedSections || [])}
- Complexity: ${intentData.complexity || 'standard'}

Return the blueprint as a JSON object with a "sections" array containing each section.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI/UX designer specializing in creating structured layout blueprints.'
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch && jsonMatch[0]) {
      return JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    }
    
    throw new Error("Could not extract JSON blueprint from response");
  } catch (error) {
    console.error("Error parsing layout blueprint:", error);
    throw new Error("Failed to parse layout blueprint results");
  }
}
