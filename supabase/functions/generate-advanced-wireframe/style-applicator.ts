
import { Blueprint } from "./blueprint-generator.ts";
import { callOpenAI } from "./openai-client.ts";

/**
 * Apply style modifiers to a blueprint based on the style token
 */
export async function applyStyleModifiers(
  blueprint: Blueprint, 
  styleToken: string = "modern"
): Promise<Blueprint> {
  console.log(`Applying style modifiers for style: ${styleToken}`);
  
  // Deep clone the blueprint to avoid mutating the original
  const enhancedBlueprint = JSON.parse(JSON.stringify(blueprint));
  
  try {
    // Generate style-specific color scheme and typography if not already provided
    if (!enhancedBlueprint.colorScheme || Object.keys(enhancedBlueprint.colorScheme).length === 0) {
      const colorScheme = await generateColorScheme(styleToken);
      enhancedBlueprint.colorScheme = colorScheme;
    }
    
    if (!enhancedBlueprint.typography || Object.keys(enhancedBlueprint.typography).length === 0) {
      const typography = await generateTypography(styleToken);
      enhancedBlueprint.typography = typography;
    }
    
    // Store the style token for reference
    enhancedBlueprint.styleToken = styleToken;
    
    // Apply style-specific modifiers to each section
    if (enhancedBlueprint.sections && Array.isArray(enhancedBlueprint.sections)) {
      for (let i = 0; i < enhancedBlueprint.sections.length; i++) {
        enhancedBlueprint.sections[i] = await applySectionStyleModifiers(
          enhancedBlueprint.sections[i],
          styleToken,
          enhancedBlueprint.colorScheme
        );
      }
    }
    
    return enhancedBlueprint;
  } catch (error) {
    console.error("Error applying style modifiers:", error);
    // Return the original blueprint if there's an error
    return enhancedBlueprint;
  }
}

/**
 * Generate a color scheme based on the style token
 */
async function generateColorScheme(styleToken: string): Promise<{
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}> {
  const styleDescriptions: Record<string, string> = {
    "modern": "Clean, minimalist with subtle shadows and plenty of whitespace",
    "corporate": "Professional, trustworthy, with navy blues and subtle grays",
    "playful": "Vibrant, energetic with bold colors and rounded elements",
    "luxury": "Elegant, sophisticated with gold accents and dark backgrounds",
    "tech": "Bold, forward-thinking with neon accents and dark backgrounds",
    "natural": "Organic, earthy tones with soft textures and natural palettes",
    "retro": "Nostalgic, with vintage color schemes and classic typography",
    "minimal": "Ultra-clean with monochrome palette and essential elements only",
  };
  
  const styleDescription = styleDescriptions[styleToken] || styleDescriptions["modern"];
  
  const prompt = `
Generate a harmonious color scheme for a website with the following style: ${styleToken}
Style description: ${styleDescription}

Return only a JSON object with the following structure:
{
  "primary": "#hex",
  "secondary": "#hex",
  "accent": "#hex",
  "background": "#hex",
  "text": "#hex"
}

Make sure the colors have sufficient contrast for accessibility and work well together.
`;

  try {
    const response = await callOpenAI(prompt, {
      temperature: 0.5,
      model: "gpt-4o-mini"
    });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch || !jsonMatch[0]) {
      throw new Error("Failed to extract JSON from OpenAI response for color scheme");
    }
    
    const colorScheme = JSON.parse(jsonMatch[0]);
    
    // Ensure all required properties exist
    return {
      primary: colorScheme.primary || "#3b82f6",
      secondary: colorScheme.secondary || "#10b981",
      accent: colorScheme.accent || "#f59e0b",
      background: colorScheme.background || "#ffffff",
      text: colorScheme.text || "#111827"
    };
  } catch (error) {
    console.error("Error generating color scheme:", error);
    // Return default color scheme on error
    return {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#111827"
    };
  }
}

/**
 * Generate typography based on the style token
 */
async function generateTypography(styleToken: string): Promise<{
  headings: string;
  body: string;
  fontPairings?: string[];
}> {
  const prompt = `
Recommend appropriate typography for a website with the following style: ${styleToken}

Return only a JSON object with the following structure:
{
  "headings": "font family name for headings",
  "body": "font family name for body text",
  "fontPairings": ["List of good font combinations that work well with this style"]
}

Only suggest widely available web-safe fonts or popular Google Fonts.
`;

  try {
    const response = await callOpenAI(prompt, {
      temperature: 0.5,
      model: "gpt-4o-mini"
    });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch || !jsonMatch[0]) {
      throw new Error("Failed to extract JSON from OpenAI response for typography");
    }
    
    const typography = JSON.parse(jsonMatch[0]);
    
    // Ensure all required properties exist
    return {
      headings: typography.headings || "sans-serif",
      body: typography.body || "sans-serif",
      fontPairings: typography.fontPairings || []
    };
  } catch (error) {
    console.error("Error generating typography:", error);
    // Return default typography on error
    return {
      headings: "sans-serif",
      body: "sans-serif",
      fontPairings: []
    };
  }
}

/**
 * Apply style-specific modifiers to a section
 */
async function applySectionStyleModifiers(
  section: any,
  styleToken: string,
  colorScheme: any
): Promise<any> {
  // Initialize style if it doesn't exist
  if (!section.style) section.style = {};
  
  // Apply style-specific modifiers based on section type
  switch (section.sectionType?.toLowerCase()) {
    case 'hero':
      section.style.backgroundColor = colorScheme.background;
      if (styleToken === 'minimal') {
        section.style.padding = '2rem';
      } else {
        section.style.padding = '4rem 2rem';
      }
      break;
      
    case 'cta':
      if (styleToken === 'minimal') {
        section.style.backgroundColor = colorScheme.background;
      } else {
        section.style.backgroundColor = colorScheme.primary;
        section.style.color = '#ffffff';
      }
      section.style.padding = '3rem 2rem';
      break;
      
    case 'features':
      section.style.backgroundColor = colorScheme.background;
      section.style.padding = '4rem 2rem';
      break;
      
    case 'testimonials':
      if (styleToken === 'minimal') {
        section.style.backgroundColor = colorScheme.background;
      } else {
        section.style.backgroundColor = '#f9fafb';
      }
      section.style.padding = '4rem 2rem';
      break;
      
    case 'pricing':
      section.style.backgroundColor = colorScheme.background;
      section.style.padding = '4rem 2rem';
      break;
      
    case 'footer':
      if (styleToken === 'minimal') {
        section.style.backgroundColor = colorScheme.background;
        section.style.borderTop = `1px solid #f3f4f6`;
      } else if (styleToken === 'tech') {
        section.style.backgroundColor = '#111827';
        section.style.color = '#f9fafb';
      } else {
        section.style.backgroundColor = '#1f2937';
        section.style.color = '#f9fafb';
      }
      section.style.padding = '2rem';
      break;
      
    default:
      // Default styling for other section types
      section.style.backgroundColor = colorScheme.background;
      section.style.padding = '2rem';
  }
  
  return section;
}
