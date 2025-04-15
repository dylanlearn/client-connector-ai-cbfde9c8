
import { callOpenAI } from "./openai-client.ts";
import { DebugLogger } from "@/utils/monitoring/debug-logger.ts";

/**
 * Generate a wireframe blueprint from user input and design intent
 */
export async function generateBlueprint(userInput: string, intentData: any, styleToken?: string): Promise<any> {
  DebugLogger.info('Starting blueprint generation', {
    context: 'blueprint-generator',
    metadata: { userInput: userInput.substring(0, 50), styleToken }
  });

  // Optimized system prompt for more direct generation
  const systemPrompt = `As an expert UX/UI designer, generate an optimized wireframe blueprint.
Output a valid JSON object with this exact structure:
{
  "id": "unique-id",
  "title": "Title",
  "description": "Description",
  "sections": [{ "id": "section-id", "name": "Name", "sectionType": "type", "components": [], "layoutType": "type" }],
  "colorScheme": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex" },
  "typography": { "headings": "font", "body": "font" },
  "styleToken": "token",
  "designReasoning": "reasoning"
}`;

  const userPrompt = `Design Intent: ${JSON.stringify(intentData)}
User Request: ${userInput}
${styleToken ? `Style: ${styleToken}` : ''}

Create a wireframe blueprint with 3-7 well-structured sections.
Focus on ${intentData?.primary || 'conversion'}-oriented design.`;

  try {
    DebugLogger.startTimer('blueprint-generation');
    
    const response = await callOpenAI(userPrompt, { 
      systemMessage: systemPrompt,
      temperature: 0.7,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    DebugLogger.endTimer('blueprint-generation');
    
    const blueprint = JSON.parse(response);
    
    // Ensure blueprint has required fields
    if (!blueprint.id) {
      blueprint.id = crypto.randomUUID();
    }
    
    DebugLogger.info('Blueprint generated successfully', {
      context: 'blueprint-generator',
      metadata: { 
        blueprintId: blueprint.id,
        sectionCount: blueprint.sections?.length 
      }
    });
    
    return blueprint;
  } catch (error) {
    DebugLogger.error('Blueprint generation failed', {
      context: 'blueprint-generator',
      metadata: { error }
    });
    
    // Return minimal valid blueprint as fallback
    return {
      id: crypto.randomUUID(),
      title: userInput.substring(0, 30),
      description: userInput,
      sections: [{
        id: crypto.randomUUID(),
        name: "Main Section",
        sectionType: "content",
        components: [],
        layoutType: "standard",
        description: "Generated as fallback"
      }],
      colorScheme: {
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#111827"
      },
      typography: {
        headings: "sans-serif",
        body: "sans-serif"
      },
      styleToken: styleToken || "standard",
      designReasoning: "Fallback design due to error"
    };
  }
}

/**
 * Enhance an existing blueprint with variations while maintaining creativity
 */
export async function enhanceBlueprint(blueprint: any, enhancementDirections: string): Promise<any> {
  DebugLogger.info('Starting blueprint enhancement', {
    context: 'blueprint-generator',
    metadata: { 
      originalBlueprintId: blueprint.id,
      directions: enhancementDirections.substring(0, 50)
    }
  });

  const systemPrompt = `As an expert UX/UI designer, enhance this wireframe blueprint according to the specified directions.
Maintain original structure but improve it creatively.
Return ONLY a valid JSON object matching the original structure.`;

  const userPrompt = `Original Blueprint: ${JSON.stringify(blueprint)}
Enhancement Request: ${enhancementDirections}

Return enhanced blueprint as complete JSON while maintaining structure.`;

  try {
    DebugLogger.startTimer('blueprint-enhancement');
    
    const response = await callOpenAI(userPrompt, {
      systemMessage: systemPrompt,
      temperature: 0.7,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    DebugLogger.endTimer('blueprint-enhancement');
    
    const enhancedBlueprint = JSON.parse(response);
    enhancedBlueprint.id = blueprint.id;
    
    DebugLogger.info('Blueprint enhanced successfully', {
      context: 'blueprint-generator',
      metadata: { 
        blueprintId: enhancedBlueprint.id,
        sectionCount: enhancedBlueprint.sections?.length 
      }
    });
    
    return enhancedBlueprint;
  } catch (error) {
    DebugLogger.error('Blueprint enhancement failed', {
      context: 'blueprint-generator',
      metadata: { error }
    });
    return blueprint; // Return original as fallback
  }
}
