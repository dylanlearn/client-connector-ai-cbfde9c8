
import { callOpenAI } from "./openai-client.ts";
import { extractIntent, DesignIntent } from "./intent-extractor.ts";
import { v4 as uuid } from "https://deno.land/std@0.110.0/uuid/mod.ts";

/**
 * BlueprintSection represents a section in the wireframe blueprint
 */
export interface BlueprintSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  components?: any[];
  layout?: any;
  copysuggestions?: any;
  [key: string]: any;
}

/**
 * Blueprint represents the complete wireframe structure
 */
export interface Blueprint {
  id: string;
  title: string;
  description: string;
  sections: BlueprintSection[];
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
  styleToken?: string;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  [key: string]: any;
}

/**
 * Generate a complete wireframe blueprint based on user input and design intent
 */
export async function generateBlueprint(
  userInput: string, 
  intent: DesignIntent, 
  styleToken?: string
): Promise<Blueprint> {
  console.log(`Generating blueprint from user input with style: ${styleToken || "default"}`);
  
  // Prepare a detailed prompt for the blueprint generation
  const prompt = `
As an expert UI/UX designer, create a detailed website wireframe blueprint based on this description:

"${userInput}"

Design Intent Analysis:
- Purpose: ${intent.purpose}
- Target audience: ${intent.target}
- Visual tone: ${intent.visualTone || styleToken || "modern"}
- Content needs: ${intent.content?.join(", ") || "Standard website sections"}
${intent.layout ? `- Layout preference: ${intent.layout}` : ""}
${intent.specialRequirements?.length ? `- Special requirements: ${intent.specialRequirements.join(", ")}` : ""}
${intent.colorPreferences?.length ? `- Color preferences: ${intent.colorPreferences.join(", ")}` : ""}
${intent.typographyPreferences?.length ? `- Typography preferences: ${intent.typographyPreferences.join(", ")}` : ""}
${intent.accessibilityRequirements?.length ? `- Accessibility requirements: ${intent.accessibilityRequirements.join(", ")}` : ""}

Generate a comprehensive and professional wireframe blueprint as a JSON object with the following structure:
{
  "id": "generate-unique-id",
  "title": "Website title based on description",
  "description": "Brief summary of what this website is",
  "sections": [
    {
      "id": "generate-unique-id",
      "name": "Section Name (e.g. Hero, Features, etc)",
      "sectionType": "hero/features/pricing/etc",
      "description": "What this section does",
      "layout": {
        "type": "flex/grid",
        "direction": "column/row",
        "gap": "spacing value",
        "padding": "padding value"
      },
      "backgroundColor": "#color-if-needed",
      "components": []
    }
  ],
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "typography": {
    "headings": "font family for headings",
    "body": "font family for body text"
  },
  "styleToken": "${styleToken || intent.visualTone || "modern"}",
  "mobileConsiderations": "notes on mobile design",
  "accessibilityNotes": "accessibility considerations"
}

Include all necessary sections based on the user's needs and best practices for the website's purpose.
Each section should have a logical layout and proper organization.
Ensure the design is coherent and follows modern web design principles.
The color scheme should match the intended visual tone and purpose.

Return ONLY the valid JSON object as your response.
`;

  try {
    // Call OpenAI to generate the blueprint
    console.log("Calling OpenAI to generate blueprint...");
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI/UX designer with deep knowledge of wireframing, web design patterns, and user experience principles.',
      temperature: 0.7, // Allow some creativity
      model: "gpt-4o"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response.substring(0, 500) + "...");
      throw new Error("Failed to extract blueprint from AI response");
    }

    let blueprint: Blueprint;
    try {
      const cleanedJson = jsonMatch[0].replace(/```json|```/g, '').trim();
      blueprint = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("Error parsing blueprint JSON:", parseError);
      throw new Error("Failed to parse blueprint data");
    }
    
    // Validate the essential structure
    if (!blueprint || !blueprint.sections || !Array.isArray(blueprint.sections)) {
      throw new Error("Blueprint is missing required sections array");
    }
    
    // Ensure all sections have valid IDs
    blueprint.sections = blueprint.sections.map(section => ({
      ...section,
      id: section.id || uuid()
    }));
    
    // Ensure the blueprint has an ID
    blueprint.id = blueprint.id || uuid();
    
    console.log(`Blueprint generated successfully with ${blueprint.sections.length} sections`);
    return blueprint;
  } catch (error) {
    console.error("Error generating blueprint:", error);
    throw new Error(`Failed to generate blueprint: ${error.message}`);
  }
}

/**
 * Add additional sections to an existing blueprint
 */
export async function enhanceBlueprint(
  blueprint: Blueprint, 
  additionalRequirements: string
): Promise<Blueprint> {
  if (!blueprint || !blueprint.sections) {
    throw new Error('Valid blueprint with sections is required for enhancement');
  }
  
  console.log("Enhancing existing blueprint with additional requirements");
  
  const prompt = `
Enhance this existing wireframe blueprint with these additional requirements:

EXISTING BLUEPRINT:
${JSON.stringify(blueprint, null, 2)}

ADDITIONAL REQUIREMENTS:
${additionalRequirements}

Modify the blueprint to incorporate these requirements while maintaining consistency with the existing design.
You can:
1. Add new sections
2. Modify existing sections
3. Adjust the color scheme or typography as needed
4. Add any other elements needed to fulfill the requirements

Return the complete enhanced blueprint as a JSON object.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI/UX designer specialized in enhancing wireframes with additional requirements.',
      temperature: 0.5,
      model: "gpt-4o-mini"
    });
    
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      throw new Error("Failed to extract enhanced blueprint from AI response");
    }

    let enhancedBlueprint: Blueprint;
    try {
      enhancedBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      throw new Error("Failed to parse enhanced blueprint data");
    }
    
    // Validate the enhanced blueprint
    if (!enhancedBlueprint || !enhancedBlueprint.sections || !Array.isArray(enhancedBlueprint.sections)) {
      throw new Error("Enhanced blueprint is missing required sections array");
    }
    
    console.log(`Blueprint enhanced successfully with ${enhancedBlueprint.sections.length} sections`);
    return enhancedBlueprint;
  } catch (error) {
    console.error("Error enhancing blueprint:", error);
    throw new Error(`Failed to enhance blueprint: ${error.message}`);
  }
}
