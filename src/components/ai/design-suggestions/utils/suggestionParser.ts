
import { ParsedSuggestion } from "../types";
import { parseColorPalette } from "./parsers/colorParser";
import { parseTypography } from "./parsers/typographyParser";
import { parseLayouts } from "./parsers/layoutParser";
import { parseComponents } from "./parsers/componentParser";

/**
 * Parse the entire suggestion text into structured data with error handling
 */
export const parseSuggestionText = (text: string): ParsedSuggestion => {
  if (!text) {
    throw new Error("Suggestion text is required");
  }
  
  try {
    return {
      colors: parseColorPalette(text),
      typography: parseTypography(text),
      layouts: parseLayouts(text),
      components: parseComponents(text),
      originalText: text
    };
  } catch (error) {
    console.error("Error parsing suggestion text:", error);
    // Return a partial result with whatever could be parsed
    return {
      colors: [],
      typography: [],
      layouts: [],
      components: [],
      originalText: text
    };
  }
};
