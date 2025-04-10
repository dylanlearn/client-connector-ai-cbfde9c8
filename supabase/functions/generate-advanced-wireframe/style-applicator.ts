
import { Blueprint } from "./blueprint-generator.ts";
import { callOpenAI } from "./openai-client.ts";

/**
 * Interface for style tokens
 */
export interface StyleToken {
  name: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  typography: {
    headings: string;
    body: string;
    scale: number[];
    fontPairings?: [string, string][];
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  animations: {
    easing: string;
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
  };
}

/**
 * Map of predefined style tokens
 */
const STYLE_TOKENS: Record<string, Partial<StyleToken>> = {
  modern: {
    name: "Modern",
    colorPalette: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827",
      muted: "#6B7280",
      surface: "#F9FAFB"
    },
    typography: {
      headings: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      scale: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60],
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12,
      pill: 9999
    }
  },
  minimal: {
    name: "Minimal",
    colorPalette: {
      primary: "#000000",
      secondary: "#404040",
      accent: "#2563EB",
      background: "#FFFFFF",
      text: "#171717",
      muted: "#737373",
      surface: "#FAFAFA"
    },
    typography: {
      headings: "Helvetica, Arial, sans-serif",
      body: "Helvetica, Arial, sans-serif",
      scale: [12, 14, 16, 18, 20, 24, 32, 40, 48, 64],
    },
    borderRadius: {
      small: 2,
      medium: 4,
      large: 8,
      pill: 9999
    }
  },
  elegant: {
    name: "Elegant",
    colorPalette: {
      primary: "#4F46E5",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#1F2937",
      muted: "#6B7280",
      surface: "#F9FAFB"
    },
    typography: {
      headings: "Playfair Display, Georgia, serif",
      body: "Source Sans Pro, system-ui, sans-serif",
      scale: [12, 14, 16, 18, 20, 24, 32, 40, 48, 60],
    },
    borderRadius: {
      small: 3,
      medium: 6,
      large: 12,
      pill: 9999
    }
  },
  corporate: {
    name: "Corporate",
    colorPalette: {
      primary: "#0C4A6E",
      secondary: "#0369A1",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#0F172A",
      muted: "#64748B",
      surface: "#F1F5F9"
    },
    typography: {
      headings: "Roboto, system-ui, sans-serif",
      body: "Roboto, system-ui, sans-serif",
      scale: [12, 14, 16, 20, 24, 32, 40, 48, 56, 64],
    }
  },
  bold: {
    name: "Bold",
    colorPalette: {
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#F97316",
      background: "#18181B",
      text: "#FFFFFF",
      muted: "#A1A1AA",
      surface: "#27272A"
    },
    typography: {
      headings: "Montserrat, system-ui, sans-serif",
      body: "Open Sans, system-ui, sans-serif",
      scale: [12, 14, 16, 18, 20, 24, 32, 42, 54, 68],
    },
    borderRadius: {
      small: 8,
      medium: 16,
      large: 24,
      pill: 9999
    }
  }
};

/**
 * Apply style modifiers to the wireframe blueprint
 */
export async function applyStyleModifiers(
  blueprint: Blueprint, 
  styleToken: string = "modern"
): Promise<Blueprint> {
  console.log(`Applying style modifiers with style token: ${styleToken}`);
  
  if (!blueprint || !blueprint.sections) {
    throw new Error("Valid blueprint with sections is required for style application");
  }
  
  // Get the style token definition or use modern as default
  const styleDefinition = STYLE_TOKENS[styleToken] || STYLE_TOKENS.modern;
  
  // Apply color scheme if not already present
  if (!blueprint.colorScheme) {
    blueprint.colorScheme = {
      primary: styleDefinition.colorPalette?.primary || "#3B82F6",
      secondary: styleDefinition.colorPalette?.secondary || "#10B981",
      accent: styleDefinition.colorPalette?.accent || "#F59E0B",
      background: styleDefinition.colorPalette?.background || "#FFFFFF",
      text: styleDefinition.colorPalette?.text || "#111827"
    };
  }
  
  // Apply typography if not already present
  if (!blueprint.typography) {
    blueprint.typography = {
      headings: styleDefinition.typography?.headings || "Inter, system-ui, sans-serif",
      body: styleDefinition.typography?.body || "Inter, system-ui, sans-serif",
      fontPairings: [
        ["Inter", "Inter"],
        ["Roboto", "Roboto"],
        ["Playfair Display", "Source Sans Pro"]
      ]
    };
  }
  
  // Store the style token for reference
  blueprint.styleToken = styleToken;
  
  // Add design tokens for extended styling
  blueprint.designTokens = {
    ...styleDefinition,
    spacing: styleDefinition.spacing || {
      unit: 4,
      scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    },
    shadows: styleDefinition.shadows || {
      small: "0 1px 2px rgba(0, 0, 0, 0.05)",
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    animations: styleDefinition.animations || {
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      }
    },
  };

  // Apply detailed style modifiers to each section
  const enhancedSections = await Promise.all(blueprint.sections.map(async (section) => {
    // Apply section-specific styling based on section type
    const sectionWithStyle = { ...section };
    
    switch (section.sectionType) {
      case "hero":
        sectionWithStyle.style = {
          ...section.style,
          padding: "6rem 2rem",
          backgroundColor: blueprint.colorScheme?.background,
          color: blueprint.colorScheme?.text
        };
        break;
      case "features":
        sectionWithStyle.style = {
          ...section.style,
          padding: "4rem 2rem",
          backgroundColor: blueprint.colorScheme?.background,
          color: blueprint.colorScheme?.text
        };
        break;
      case "pricing":
        sectionWithStyle.style = {
          ...section.style,
          padding: "4rem 2rem",
          backgroundColor: styleDefinition.colorPalette?.surface || "#F9FAFB",
          color: blueprint.colorScheme?.text
        };
        break;
      case "testimonials":
        sectionWithStyle.style = {
          ...section.style,
          padding: "4rem 2rem",
          backgroundColor: blueprint.colorScheme?.background,
          color: blueprint.colorScheme?.text
        };
        break;
      case "cta":
        sectionWithStyle.style = {
          ...section.style,
          padding: "4rem 2rem",
          backgroundColor: blueprint.colorScheme?.primary,
          color: "#FFFFFF"
        };
        break;
      case "footer":
        sectionWithStyle.style = {
          ...section.style,
          padding: "2rem 1rem",
          backgroundColor: styleDefinition.colorPalette?.surface || "#F9FAFB",
          color: styleDefinition.colorPalette?.muted || "#6B7280"
        };
        break;
      default:
        sectionWithStyle.style = {
          ...section.style,
          padding: "3rem 2rem",
          backgroundColor: blueprint.colorScheme?.background,
          color: blueprint.colorScheme?.text
        };
    }
    
    return sectionWithStyle;
  }));
  
  // Update sections with styled versions
  blueprint.sections = enhancedSections;
  
  // Add mobile considerations
  blueprint.mobileConsiderations = `
    This wireframe uses a ${styleToken} style that adapts well to mobile devices.
    Key considerations:
    - Text sizes should scale down by 10-15% on mobile
    - Multi-column layouts should stack vertically
    - Navigation menus should collapse into a hamburger menu
    - Buttons should expand to full width on small screens
    - Spacing should be reduced by 25% on mobile
  `;
  
  // Add accessibility notes
  blueprint.accessibilityNotes = `
    Accessibility considerations for this wireframe:
    - Color contrast meets WCAG 2.1 AA standards
    - All interactive elements have clear focus states
    - Headings follow proper hierarchy
    - Form elements have appropriate labels
    - Images should include alt text
  `;
  
  console.log(`Style modifiers applied successfully to blueprint with ${blueprint.sections.length} sections`);
  return blueprint;
}
