import { callOpenAI } from "./openai-client.ts";
import { Blueprint, BlueprintSection } from "./blueprint-generator.ts";
import { v4 as uuid } from "https://deno.land/std@0.110.0/uuid/mod.ts";

/**
 * Component definition for the wireframe
 */
export interface WireframeComponent {
  id: string;
  type: string;
  content?: string | Record<string, any>;
  style?: Record<string, any>;
  children?: WireframeComponent[];
  props?: Record<string, any>;
  variant?: string;
  [key: string]: any;
}

/**
 * Select appropriate component variants based on the blueprint
 */
export async function selectComponentVariants(blueprint: Blueprint): Promise<Blueprint> {
  if (!blueprint || !blueprint.sections) {
    throw new Error('Valid blueprint with sections is required for component variant selection');
  }

  console.log(`Selecting component variants for blueprint with ${blueprint.sections.length} sections`);

  // Deep clone the blueprint to avoid mutating the original
  const enhancedBlueprint: Blueprint = JSON.parse(JSON.stringify(blueprint));

  // Process each section to add appropriate components
  const completedSections: BlueprintSection[] = [];

  for (const section of enhancedBlueprint.sections) {
    try {
      const enhancedSection = await enhanceSectionWithComponents(section, blueprint.styleToken || "modern");
      completedSections.push(enhancedSection);
    } catch (error) {
      console.error(`Error enhancing section ${section.name}:`, error);
      // If enhancement fails, keep the original section
      completedSections.push(section);
    }
  }

  enhancedBlueprint.sections = completedSections;
  
  return enhancedBlueprint;
}

/**
 * Enhance a single section with appropriate components
 */
async function enhanceSectionWithComponents(section: BlueprintSection, styleToken: string): Promise<BlueprintSection> {
  // Create a prompt for this specific section
  const prompt = `
Generate appropriate components for this wireframe section:
${JSON.stringify(section, null, 2)}

Design style: ${styleToken}

Return an enhanced version of the section with:
1. An array of component objects in the "components" property
2. Enhanced layout information
3. Responsive design considerations
4. Detailed style properties matching the ${styleToken} design style

For each component, include:
- id (use "{{componentId}}" and I'll generate it)
- type (e.g., heading, text, button, image, container, etc.)
- content (what text/data should be shown)
- style (appropriate styling properties)
- children (if the component has child elements)
- props (any special properties needed)
- variant (if the component has multiple possible variants)

Return the entire enhanced section object as a valid JSON object.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI component designer who selects the best component variants for wireframe sections.',
      temperature: 0.5,
    });
    
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response for section component selection");
      // If we can't parse the response, return the original section
      return section;
    }

    let enhancedSection: BlueprintSection;
    try {
      enhancedSection = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing enhanced section JSON:", parseError);
      return section;
    }
    
    if (!enhancedSection) {
      console.error("Invalid enhanced section data");
      return section;
    }
    
    // Ensure all components have IDs
    if (enhancedSection.components && Array.isArray(enhancedSection.components)) {
      enhancedSection.components = generateComponentIds(enhancedSection.components);
    }
    
    return enhancedSection;
  } catch (error) {
    console.error(`Error enhancing section ${section.name}:`, error);
    // If anything goes wrong, return the original section
    return section;
  }
}

/**
 * Recursively assign IDs to all components in a component tree
 */
function generateComponentIds(components: WireframeComponent[]): WireframeComponent[] {
  if (!components || !Array.isArray(components)) return [];
  
  return components.map(component => {
    // Generate an ID if missing or template
    const componentWithId = {
      ...component,
      id: (!component.id || component.id === "{{componentId}}") ? uuid() : component.id
    };
    
    // Process children recursively if they exist
    if (componentWithId.children && Array.isArray(componentWithId.children)) {
      componentWithId.children = generateComponentIds(componentWithId.children);
    }
    
    return componentWithId;
  });
}
