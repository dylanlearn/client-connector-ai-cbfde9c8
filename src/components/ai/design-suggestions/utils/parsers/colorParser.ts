
import { ParsedColor } from "../../types";

/**
 * Parse color palette information from the suggestion text
 */
export const parseColorPalette = (text: string): ParsedColor[] => {
  const colors: ParsedColor[] = [];
  
  // Look for hex codes with optional color names
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g;
  const colorLineRegex = /([\w\s\-]+):\s*#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})(?:\s*[-–]\s*([^#\n]+))?/gi;
  
  // First try to parse structured color information
  const colorMatches = [...text.matchAll(colorLineRegex)];
  
  if (colorMatches.length > 0) {
    colorMatches.forEach(match => {
      const name = match[1]?.trim() || "";
      const hex = `#${match[2]}`;
      const description = match[3]?.trim();
      
      // Validate hex code format
      if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex)) {
        colors.push({ name, hex, description });
      }
    });
  } else {
    // Fall back to just finding hex codes
    const hexMatches = text.match(hexRegex);
    if (hexMatches) {
      hexMatches.forEach((hex, index) => {
        // Validate hex code format
        if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex)) {
          colors.push({
            name: `Color ${index + 1}`,
            hex
          });
        }
      });
    }
  }
  
  return colors;
};
