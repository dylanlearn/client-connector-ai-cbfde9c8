
import { callOpenAI } from "./openai-client.ts";
import { DesignIntent } from "./intent-extractor.ts";
import { v4 as uuid } from "https://deno.land/std@0.110.0/uuid/mod.ts";

// Define the Blueprint interface
export interface Blueprint {
  title: string;
  description: string;
  sections: BlueprintSection[];
  styleToken?: string;
  colorScheme?: ColorScheme;
  typography?: Typography;
  designTokens?: Record<string, any>;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  [key: string]: any;
}

export interface BlueprintSection {
  id: string;
  name: string;
  sectionType: string;
  description: string;
  layout?: LayoutConfig | string;
  components?: any[];
  copySuggestions?: Record<string, string>;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  style?: Record<string, any>;
  variant?: string;
}

export interface LayoutConfig {
  type: string;
  direction?: string;
  alignment?: string;
  justifyContent?: string;
  columns?: number;
  gap?: number;
  wrap?: boolean;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Typography {
  headings: string;
  body: string;
  fontPairings?: string[];
}

/**
 * Generate a layout blueprint based on extracted intent data
 */
export async function generateLayoutBlueprint(intent: DesignIntent): Promise<Blueprint> {
  if (!intent || typeof intent !== 'object') {
    throw new Error('Valid intent data is required for blueprint generation');
  }

  const { purpose, target, visualTone, content } = intent;

  if (!purpose || !target) {
    throw new Error('Intent data is missing required fields');
  }

  console.log(`Generating blueprint for ${purpose} website targeting ${target}`);

  // Construct a prompt for the layout blueprint generation
  const prompt = `
Generate a detailed wireframe layout blueprint for a ${purpose} website targeting ${target}.
Visual tone: ${visualTone || 'modern and professional'}

Content to include:
${Array.isArray(content) ? content.map(c => `- ${c}`).join('\n') : '- No specific content sections provided'}

Special requirements:
${Array.isArray(intent.specialRequirements) ? intent.specialRequirements.map(r => `- ${r}`).join('\n') : '- None specified'}

The blueprint should include:
1. A title for the wireframe
2. An overall description
3. A detailed sections array with at least the following sections:
   - Navigation/header section
   - Hero section
   - Features or main content section
   - Call to action section
   - Footer section
   - Any other sections that make sense for this specific website type

For each section, provide:
   - id (leave as "{{sectionId}}" and I'll generate it)
   - name (descriptive name)
   - sectionType (e.g., hero, features, testimonials, contact, etc.)
   - description (what this section contains/does)
   - layout (visual structure description as an object with type, direction, etc.)
   - copySuggestions (sample text content for the section)
   - style (any specific styling notes)
   - variant (a specific variant if multiple options exist for this section type)

Also include:
- colorScheme: Appropriate color scheme object with primary, secondary, accent, background, and text colors (use hex codes)
- typography: Font recommendations object with headings and body fonts
- mobileConsiderations: Notes about how the design should adapt for mobile
- accessibilityNotes: Important accessibility considerations

Return ONLY a valid complete JSON object with these fields.
`;

  try {
    console.log("Calling OpenAI for blueprint generation");
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI architect who creates structured wireframe blueprints. Return ONLY valid JSON.',
      temperature: 0.7,
      model: "gpt-4o"
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response:", response);
      throw new Error("Failed to extract blueprint from AI response");
    }

    let blueprint: Blueprint;
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
    const enhancedBlueprint: Blueprint = {
      title: blueprint.title || `${purpose.charAt(0).toUpperCase() + purpose.slice(1)} Website Wireframe`,
      description: blueprint.description || `A wireframe blueprint for a ${purpose} website targeting ${target}`,
      styleToken: visualTone || 'modern',
      sections: blueprint.sections || [],
      colorScheme: blueprint.colorScheme || {
        primary: "#3B82F6", // Default blue
        secondary: "#10B981", // Default green
        accent: "#F59E0B", // Default amber
        background: "#FFFFFF", // Default white
        text: "#1F2937", // Default dark gray
      },
      typography: blueprint.typography || {
        headings: "Inter",
        body: "Roboto",
      },
      mobileConsiderations: blueprint.mobileConsiderations || "Ensure all sections stack properly on mobile and text remains readable.",
      accessibilityNotes: blueprint.accessibilityNotes || "Ensure proper contrast ratios and keyboard navigation throughout the site."
    };

    // Generate UUIDs for all sections that don't have them
    enhancedBlueprint.sections = enhancedBlueprint.sections.map(section => ({
      ...section,
      id: section.id && section.id !== "{{sectionId}}" ? section.id : uuid(),
    }));

    // Add position and dimensions if missing
    let currentY = 0;
    const defaultWidth = 1200;
    
    enhancedBlueprint.sections = enhancedBlueprint.sections.map((section) => {
      if (!section.position) {
        section.position = { x: 0, y: currentY };
      }
      
      if (!section.dimensions) {
        // Set reasonable default heights based on section type
        let height = 400;
        switch (section.sectionType.toLowerCase()) {
          case 'hero': height = 600; break;
          case 'navigation': case 'header': height = 80; break;
          case 'footer': height = 200; break;
          case 'features': case 'testimonials': height = 500; break;
          case 'cta': height = 300; break;
          default: height = 400;
        }
        
        section.dimensions = { width: defaultWidth, height };
      }
      
      // Update Y position for next section
      currentY = section.position.y + section.dimensions.height + 20;
      
      return section;
    });
    
    console.log(`Blueprint generated successfully with ${enhancedBlueprint.sections.length} sections`);
    return enhancedBlueprint;
  } catch (error) {
    console.error("Error generating layout blueprint:", error);
    throw new Error(`Failed to generate layout blueprint: ${error.message}`);
  }
}
