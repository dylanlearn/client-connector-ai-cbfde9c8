
import { callOpenAI } from "./openai-client.ts";

// Style tokens and their corresponding CSS properties
const styleTokens = {
  "modern": {
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    colorPrimary: "#3B82F6",
    colorSecondary: "#10B981",
    colorAccent: "#F59E0B",
  },
  "minimal": {
    fontFamily: "system-ui, sans-serif",
    borderRadius: "0.25rem",
    boxShadow: "none",
    colorPrimary: "#000000",
    colorSecondary: "#666666",
    colorAccent: "#3B82F6",
  },
  "corporate": {
    fontFamily: "Arial, sans-serif",
    borderRadius: "0.35rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    colorPrimary: "#1E40AF",
    colorSecondary: "#374151",
    colorAccent: "#D97706",
  },
  "playful": {
    fontFamily: "Poppins, sans-serif",
    borderRadius: "1rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    colorPrimary: "#8B5CF6",
    colorSecondary: "#EC4899",
    colorAccent: "#F59E0B",
  },
  "elegant": {
    fontFamily: "Georgia, serif",
    borderRadius: "0.25rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    colorPrimary: "#1F2937",
    colorSecondary: "#4B5563",
    colorAccent: "#D1D5DB",
  },
  "brutalist": {
    fontFamily: "monospace",
    borderRadius: "0",
    boxShadow: "4px 4px 0px rgba(0, 0, 0, 1)",
    colorPrimary: "#000000",
    colorSecondary: "#000000",
    colorAccent: "#FF0000",
  },
  "retro": {
    fontFamily: "Courier, monospace",
    borderRadius: "0",
    boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.8)",
    colorPrimary: "#FF4500",
    colorSecondary: "#FFD700",
    colorAccent: "#008080",
  }
};

/**
 * Apply style modifiers to a wireframe blueprint based on style tokens
 */
export async function applyStyleModifiers(blueprint: any, style?: string): Promise<any> {
  if (!style || !blueprint) {
    return blueprint;
  }

  console.log(`Applying style modifiers for style: ${style}`);

  try {
    // Normalize style name
    const normalizedStyle = style.toLowerCase().trim();
    
    // Get style token matching the requested style
    const styleToken = Object.keys(styleTokens).find(key => 
      key.toLowerCase() === normalizedStyle || 
      normalizedStyle.includes(key.toLowerCase())
    );
    
    // If no matching style token, use AI to apply style
    if (!styleToken) {
      return await applyAIStyleModifiers(blueprint, style);
    }
    
    // Apply style token properties to wireframe
    const styleProperties = styleTokens[styleToken as keyof typeof styleTokens];
    
    // Update color scheme
    if (!blueprint.colorScheme) {
      blueprint.colorScheme = {};
    }
    
    blueprint.colorScheme.primary = styleProperties.colorPrimary || blueprint.colorScheme.primary;
    blueprint.colorScheme.secondary = styleProperties.colorSecondary || blueprint.colorScheme.secondary;
    blueprint.colorScheme.accent = styleProperties.colorAccent || blueprint.colorScheme.accent;
    
    // Update typography
    if (!blueprint.typography) {
      blueprint.typography = {
        headings: styleProperties.fontFamily || "system-ui, sans-serif",
        body: styleProperties.fontFamily || "system-ui, sans-serif"
      };
    }
    
    // Update designTokens
    if (!blueprint.designTokens) {
      blueprint.designTokens = {};
    }
    
    blueprint.designTokens = {
      ...blueprint.designTokens,
      borderRadius: styleProperties.borderRadius || "0.5rem",
      boxShadow: styleProperties.boxShadow || "none",
      fontFamily: styleProperties.fontFamily || "system-ui, sans-serif"
    };
    
    // Apply style to sections
    if (blueprint.sections && Array.isArray(blueprint.sections)) {
      blueprint.sections = blueprint.sections.map((section: any) => {
        if (!section.style) {
          section.style = {};
        }
        
        // Apply appropriate style properties based on section type
        if (section.sectionType === 'hero') {
          section.style = {
            ...section.style,
            borderRadius: styleProperties.borderRadius,
            fontFamily: styleProperties.fontFamily
          };
        } else if (section.sectionType === 'cta') {
          section.style = {
            ...section.style,
            boxShadow: styleProperties.boxShadow,
            borderRadius: styleProperties.borderRadius
          };
        } else {
          // General style properties for other sections
          section.style = {
            ...section.style,
            fontFamily: styleProperties.fontFamily
          };
        }
        
        return section;
      });
    }
    
    // Store the style token used
    blueprint.styleToken = styleToken;
    
    console.log("Style application successful");
    return blueprint;
    
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    return blueprint; // Return original blueprint if styling fails
  }
}

/**
 * Use AI to apply custom style modifiers when no matching style token is found
 */
async function applyAIStyleModifiers(blueprint: any, style: string): Promise<any> {
  console.log(`Using AI to apply custom style: ${style}`);
  
  try {
    const prompt = `
Apply the following style to this wireframe blueprint:

Style: "${style}"

Current blueprint structure (partial):
${JSON.stringify(blueprint, null, 2).substring(0, 500)}...

Please modify the blueprint to match this style by:
1. Determining appropriate color scheme (primary, secondary, accent, background, text colors)
2. Selecting suitable typography (font families for headings and body text)
3. Defining design tokens (border radius, shadows, spacing, etc.)
4. Applying style-specific modifications to section components as needed
5. Preserving the content and structure of the wireframe

Return the complete modified blueprint with style changes applied as valid JSON.
`;

    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI designer specialized in applying visual styles to wireframes. You transform wireframe blueprints to match specific design languages while preserving their structure and content.',
      temperature: 0.5,
      model: "gpt-4o-mini"
    });
    
    // Extract the JSON object from the response
    const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (!jsonMatch || !jsonMatch[0]) {
      console.error("Failed to extract styled blueprint from AI response");
      return blueprint; // Return original blueprint if extraction fails
    }

    try {
      const styledBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      console.log("AI style application successful");
      
      // Ensure the styleToken is set
      styledBlueprint.styleToken = style;
      
      return styledBlueprint;
    } catch (parseError) {
      console.error("Error parsing styled blueprint JSON:", parseError);
      return blueprint; // Return original blueprint if parsing fails
    }
    
  } catch (error) {
    console.error("Error in AI style application:", error);
    return blueprint; // Return original blueprint if AI styling fails
  }
}
