
import { callOpenAI } from "./openai-client.ts";
import { Blueprint } from "./blueprint-generator.ts";

/**
 * Apply style modifiers to the wireframe
 */
export async function applyStyleModifiers(wireframe: Blueprint, styleToken: string = 'modern'): Promise<Blueprint> {
  if (!wireframe || !wireframe.sections) {
    throw new Error('Valid wireframe with sections is required for style modification');
  }

  console.log(`Applying "${styleToken}" style to wireframe`);

  // Define style presets for common design styles
  const stylePresets: Record<string, any> = {
    modern: {
      colorScheme: {
        primary: "#3B82F6",
        secondary: "#10B981",
        accent: "#F59E0B",
        background: "#FFFFFF",
        text: "#1F2937"
      },
      typography: {
        headings: "Inter, system-ui, sans-serif",
        body: "Inter, system-ui, sans-serif",
        fontPairings: ["Inter/System UI"]
      },
      spacing: {
        sectionPadding: "4rem 2rem",
        componentSpacing: "1.5rem"
      },
      borderRadius: "0.5rem",
      shadows: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    minimal: {
      colorScheme: {
        primary: "#000000",
        secondary: "#333333",
        accent: "#666666",
        background: "#FFFFFF",
        text: "#111111"
      },
      typography: {
        headings: "DM Sans, sans-serif",
        body: "DM Sans, sans-serif",
        fontPairings: ["DM Sans/DM Sans"]
      },
      spacing: {
        sectionPadding: "5rem 2rem",
        componentSpacing: "2rem"
      },
      borderRadius: "0rem",
      shadows: "none"
    },
    playful: {
      colorScheme: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFD166",
        background: "#FFFFFF",
        text: "#293241"
      },
      typography: {
        headings: "Poppins, sans-serif",
        body: "Nunito, sans-serif",
        fontPairings: ["Poppins/Nunito"]
      },
      spacing: {
        sectionPadding: "3rem 2rem",
        componentSpacing: "1.5rem"
      },
      borderRadius: "1rem",
      shadows: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    corporate: {
      colorScheme: {
        primary: "#1A56DB",
        secondary: "#4B5563",
        accent: "#9CA3AF",
        background: "#F9FAFB",
        text: "#111827"
      },
      typography: {
        headings: "IBM Plex Sans, sans-serif",
        body: "IBM Plex Sans, sans-serif",
        fontPairings: ["IBM Plex Sans/IBM Plex Sans"]
      },
      spacing: {
        sectionPadding: "4rem 3rem",
        componentSpacing: "1.25rem"
      },
      borderRadius: "0.25rem",
      shadows: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    }
  };
  
  // Get the style preset if it exists
  const stylePreset = stylePresets[styleToken.toLowerCase()] || stylePresets.modern;
  
  // Deep clone the wireframe to avoid mutations
  const styledWireframe = JSON.parse(JSON.stringify(wireframe));
  
  // Apply the base style preset
  if (stylePreset) {
    styledWireframe.colorScheme = styledWireframe.colorScheme || stylePreset.colorScheme;
    styledWireframe.typography = styledWireframe.typography || stylePreset.typography;
    styledWireframe.designTokens = styledWireframe.designTokens || {
      spacing: stylePreset.spacing,
      borderRadius: stylePreset.borderRadius,
      shadows: stylePreset.shadows
    };
  }
  
  // For more complex style application, use OpenAI to enhance the styling
  const prompt = `
Apply the "${styleToken}" style to this wireframe:
${JSON.stringify(styledWireframe, null, 2)}

Enhance it with style properties:
1. Update color schemes to align with the "${styleToken}" style
2. Add appropriate typography recommendations
3. Apply styling notes for each section
4. Add shadow and border recommendations
5. Ensure visual style is consistent with "${styleToken}" aesthetics

Maintain the same structure but enhance the style properties.
Return the complete wireframe with style enhancements applied.
`;

  try {
    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI stylist who applies beautiful and consistent visual styles to wireframes.',
      temperature: 0.4,
      model: "gpt-4o-mini"
    });
    
    // Try to parse the JSON response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract JSON from OpenAI response");
      console.log("Continuing with preset styles only");
      // If we can't parse the response, return wireframe with just the preset styles
      styledWireframe.styleToken = styleToken;
      return styledWireframe;
    }

    let aiStyledWireframe: Blueprint;
    try {
      aiStyledWireframe = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing AI styled wireframe JSON:", parseError);
      // If parsing fails, return wireframe with just the preset styles
      styledWireframe.styleToken = styleToken;
      return styledWireframe;
    }
    
    // Ensure the AI hasn't removed any sections or critical data
    if (!aiStyledWireframe.sections || !Array.isArray(aiStyledWireframe.sections) || 
        aiStyledWireframe.sections.length < styledWireframe.sections.length) {
      console.warn("AI style modification lost sections, reverting to preset styling");
      return styledWireframe;
    }
    
    aiStyledWireframe.styleToken = styleToken;
    console.log(`Successfully applied "${styleToken}" style to wireframe`);
    return aiStyledWireframe;
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    // Return the wireframe with just the preset styles if AI styling fails
    styledWireframe.styleToken = styleToken;
    return styledWireframe;
  }
}
