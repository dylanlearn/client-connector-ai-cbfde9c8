
import { callOpenAI } from "./openai-client.ts";

// Define common color schemes
const COLOR_SCHEMES = {
  modern: {
    primary: "#3B82F6", // blue-500
    secondary: "#10B981", // emerald-500
    accent: "#F59E0B", // amber-500
    background: "#FFFFFF",
    text: "#1F2937" // gray-800
  },
  minimal: {
    primary: "#000000",
    secondary: "#6B7280", // gray-500
    accent: "#3B82F6", // blue-500
    background: "#FFFFFF",
    text: "#111827" // gray-900
  },
  vibrant: {
    primary: "#8B5CF6", // violet-500
    secondary: "#EC4899", // pink-500
    accent: "#F59E0B", // amber-500
    background: "#FFFFFF",
    text: "#1F2937" // gray-800
  },
  earthy: {
    primary: "#65A30D", // lime-600
    secondary: "#92400E", // amber-800
    accent: "#B45309", // amber-700
    background: "#FFFBEB", // amber-50
    text: "#422006" // amber-950
  },
  professional: {
    primary: "#1E40AF", // blue-800
    secondary: "#1F2937", // gray-800
    accent: "#0369A1", // blue-600
    background: "#F9FAFB", // gray-50
    text: "#111827" // gray-900
  },
  dark: {
    primary: "#3B82F6", // blue-500
    secondary: "#10B981", // emerald-500
    accent: "#F59E0B", // amber-500
    background: "#111827", // gray-900
    text: "#F9FAFB" // gray-50
  }
};

// Define typography pairings
const TYPOGRAPHY_PAIRINGS = {
  modern: {
    headings: "Inter, sans-serif",
    body: "Inter, sans-serif"
  },
  classic: {
    headings: "Merriweather, serif",
    body: "Source Sans Pro, sans-serif"
  },
  minimal: {
    headings: "Montserrat, sans-serif",
    body: "Open Sans, sans-serif"
  },
  creative: {
    headings: "Playfair Display, serif",
    body: "Roboto, sans-serif"
  },
  technical: {
    headings: "Roboto, sans-serif",
    body: "Roboto Mono, monospace"
  }
};

/**
 * Apply style modifiers to the wireframe based on style token or visual tone
 */
export async function applyStyleModifiers(blueprint: any, styleToken: string): Promise<any> {
  console.log("Applying style modifiers for:", styleToken);
  
  // If no sections or no styleToken, return blueprint as is
  if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
    console.log("No sections found in blueprint for style application");
    return blueprint;
  }
  
  if (!styleToken) {
    styleToken = "modern"; // Default style if none specified
  }

  try {
    // Apply basic styling based on predefined style tokens
    const normalizedStyleToken = styleToken.toLowerCase();
    
    // Apply color scheme if it matches a predefined one
    const matchedColorScheme = Object.keys(COLOR_SCHEMES).find(key => 
      normalizedStyleToken.includes(key)
    );
    
    if (matchedColorScheme) {
      blueprint.colorScheme = COLOR_SCHEMES[matchedColorScheme];
    }
    
    // Apply typography if it matches a predefined one
    const matchedTypography = Object.keys(TYPOGRAPHY_PAIRINGS).find(key => 
      normalizedStyleToken.includes(key)
    );
    
    if (matchedTypography) {
      blueprint.typography = TYPOGRAPHY_PAIRINGS[matchedTypography];
    }
    
    // For more nuanced styling, use AI
    const prompt = `
Apply the "${styleToken}" style to this wireframe blueprint:

${JSON.stringify(blueprint, null, 2)}

For each section in the wireframe:
1. Apply appropriate styling based on the "${styleToken}" style
2. Update the section's "style" object with:
   - Appropriate background colors
   - Text styling (font, size, weight, alignment)
   - Spacing and layout adjustments
   - Border, shadow, and other visual treatments
3. Ensure styling is consistent across sections while maintaining hierarchy

Add or update the following global styling objects:
1. "colorScheme" object with:
   - primary: Primary color 
   - secondary: Secondary color
   - accent: Accent color
   - background: Default background color
   - text: Default text color
2. "typography" object with:
   - headings: Font family for headings
   - body: Font family for body text
   - fontPairings (optional): Array of complementary font pairings
3. "designTokens" object with common styling values like:
   - spacing
   - borderRadius
   - shadows
   - etc.

Style Keywords: "${styleToken}" should influence:
- Color palette
- Visual weight
- Spacing principles
- Typography choices
- Overall aesthetic

Return the updated blueprint with style applied to all sections.
Return only valid JSON without any explanations or comments.
`;

    const response = await callOpenAI(prompt, {
      systemMessage: 'You are an expert UI designer who specializes in applying consistent, beautiful styling to wireframes.',
      temperature: 0.5,
      model: "gpt-4o-mini",
      responseFormat: { type: "json_object" }
    });
    
    // Parse the AI response
    let styledBlueprint;
    try {
      styledBlueprint = JSON.parse(response);
    } catch (parseError) {
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/) || 
                        response.match(/\{[\s\S]*\}/);
                        
      if (!jsonMatch || !jsonMatch[0]) {
        console.error("Failed to extract styled blueprint from AI response");
        
        // Apply fallback styling
        applyFallbackStyling(blueprint, styleToken);
        return blueprint;
      }

      try {
        styledBlueprint = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());
      } catch (innerParseError) {
        console.error("Error parsing styled blueprint JSON:", innerParseError);
        
        // Apply fallback styling
        applyFallbackStyling(blueprint, styleToken);
        return blueprint;
      }
    }
    
    console.log("Style application successful");
    return styledBlueprint;
    
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    
    // Apply fallback styling
    applyFallbackStyling(blueprint, styleToken);
    return blueprint;
  }
}

/**
 * Apply fallback styling based on predefined settings if AI styling fails
 */
function applyFallbackStyling(blueprint: any, styleToken: string): void {
  // Normalize style token
  const normalizedStyle = styleToken.toLowerCase();
  
  // Default to modern if no match
  let colorScheme = COLOR_SCHEMES.modern;
  let typography = TYPOGRAPHY_PAIRINGS.modern;
  
  // Try to match style token with predefined styles
  for (const style of Object.keys(COLOR_SCHEMES)) {
    if (normalizedStyle.includes(style)) {
      colorScheme = COLOR_SCHEMES[style];
      break;
    }
  }
  
  for (const style of Object.keys(TYPOGRAPHY_PAIRINGS)) {
    if (normalizedStyle.includes(style)) {
      typography = TYPOGRAPHY_PAIRINGS[style];
      break;
    }
  }
  
  // Apply color scheme and typography
  blueprint.colorScheme = colorScheme;
  blueprint.typography = typography;
  
  // Add basic design tokens
  blueprint.designTokens = {
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      xxl: "3rem"
    },
    borderRadius: {
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.5rem",
      xl: "1rem",
      full: "9999px"
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };
  
  // Apply basic styling to all sections
  for (const section of blueprint.sections) {
    section.style = section.style || {};
    section.style.backgroundColor = section.style.backgroundColor || colorScheme.background;
    section.style.color = section.style.color || colorScheme.text;
    section.style.padding = section.style.padding || "2rem";
  }
}
