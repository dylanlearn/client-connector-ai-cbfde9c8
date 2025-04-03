
import { ParsedSuggestion, ParsedColor, ParsedTypography } from "../types";

// Common color names mapped to hex values
const colorNameMap: Record<string, string> = {
  // Blacks & Grays
  "black": "#000000",
  "charcoal": "#36454F",
  "charcoal black": "#36454F",
  "charcoal gray": "#36454F",
  "dark gray": "#333333",
  "gray": "#808080",
  "light gray": "#D3D3D3",
  "slate": "#708090",
  "slate gray": "#708090",
  
  // Blues
  "navy": "#000080",
  "navy blue": "#000080",
  "dark blue": "#00008B",
  "blue": "#0000FF",
  "light blue": "#ADD8E6",
  "sky blue": "#87CEEB",
  "teal": "#008080",
  "turquoise": "#40E0D0",
  "cyan": "#00FFFF",
  
  // Greens
  "dark green": "#006400",
  "green": "#008000",
  "light green": "#90EE90",
  "olive": "#808000",
  "olive green": "#808000",
  "lime": "#00FF00",
  "mint": "#98FB98",
  "mint green": "#98FB98",
  "sage": "#BCB88A",
  "sage green": "#BCB88A",
  
  // Reds
  "dark red": "#8B0000",
  "red": "#FF0000",
  "light red": "#FF6347",
  "burgundy": "#800020",
  "maroon": "#800000",
  "crimson": "#DC143C",
  
  // Oranges
  "orange": "#FFA500",
  "coral": "#FF7F50",
  "peach": "#FFDAB9",
  "amber": "#FFBF00",
  
  // Yellows
  "gold": "#FFD700",
  "yellow": "#FFFF00",
  "mustard": "#FFDB58",
  
  // Purples
  "purple": "#800080",
  "lavender": "#E6E6FA",
  "violet": "#EE82EE",
  "indigo": "#4B0082",
  "magenta": "#FF00FF",
  "fuchsia": "#FF00FF",
  
  // Pinks
  "pink": "#FFC0CB",
  "hot pink": "#FF69B4",
  "rose": "#FF007F",
  
  // Browns
  "brown": "#A52A2A",
  "tan": "#D2B48C",
  "beige": "#F5F5DC",
  
  // Whites & Neutrals
  "white": "#FFFFFF",
  "off-white": "#F8F8FF",
  "cream": "#FFFDD0",
  "ivory": "#FFFFF0"
};

// Extract hex color codes from text
const extractHexCodes = (text: string): string[] => {
  const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
  return (text.match(hexRegex) || []).map(hex => hex.toLowerCase());
};

// Extract color names and map to hex values
const extractColorNames = (text: string): ParsedColor[] => {
  const colors: ParsedColor[] = [];
  
  // Check for hex codes first
  const hexCodes = extractHexCodes(text);
  hexCodes.forEach(hex => {
    // Try to find a description around this hex code
    const hexIndex = text.indexOf(hex);
    const contextBefore = text.substring(Math.max(0, hexIndex - 50), hexIndex).trim();
    const contextAfter = text.substring(hexIndex + hex.length, Math.min(text.length, hexIndex + hex.length + 50)).trim();
    
    // Look for color name in context
    const nameMatch = contextBefore.match(/([A-Za-z\s]+)(?::|-)?\s*$/i) || 
                      contextAfter.match(/^(?::|-)?\s*([A-Za-z\s]+)/i);
    
    const name = nameMatch ? nameMatch[1].trim() : `Color ${colors.length + 1}`;
    
    colors.push({
      name,
      hex,
      description: contextBefore + " " + contextAfter
    });
  });
  
  // Now look for named colors
  Object.keys(colorNameMap).forEach(colorName => {
    const colorNameRegex = new RegExp(`\\b${colorName}\\b`, 'gi');
    if (colorNameRegex.test(text)) {
      // Only add if we don't already have this color
      const hex = colorNameMap[colorName];
      if (!colors.some(c => c.hex === hex)) {
        colors.push({
          name: colorName,
          hex,
          description: `Suggested ${colorName} color for the design`
        });
      }
    }
  });
  
  return colors;
};

// Extract typography suggestions
const extractTypography = (text: string): ParsedTypography[] => {
  const typography: ParsedTypography[] = [];
  
  // Common font names to look for
  const fontNames = [
    "Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", 
    "Times New Roman", "Georgia", "Garamond", "Courier New", "Courier",
    "Palatino", "Bookman", "Avant Garde", "Arial Black", "Impact",
    "Century Gothic", "Calibri", "Cambria", "Candara", "Consolas",
    "Constantia", "Corbel", "Franklin Gothic", "Segoe UI", "Lucida Sans",
    "Lucida Grande", "MS Sans Serif", "MS Serif", "Symbol", "Wingdings",
    "Open Sans", "Roboto", "Lato", "Montserrat", "Source Sans Pro",
    "Raleway", "PT Sans", "Noto Sans", "Ubuntu", "Droid Sans",
    "Merriweather", "Playfair Display", "Lora", "Bitter", "Arvo",
    "Nunito", "Quicksand", "Cabin", "Josefin Sans", "Poppins"
  ];
  
  // Look for headings/titles fonts
  fontNames.forEach(font => {
    const titleRegex = new RegExp(`\\b(${font})\\b.{0,50}?\\b(heading|title|header)s?\\b`, 'i');
    const titleRegexReverse = new RegExp(`\\b(heading|title|header)s?.{0,50}?\\b(${font})\\b`, 'i');
    
    if (titleRegex.test(text) || titleRegexReverse.test(text)) {
      typography.push({
        name: font,
        type: 'heading',
        description: `${font} for headings`
      });
    }
    
    const bodyRegex = new RegExp(`\\b(${font})\\b.{0,50}?\\b(body|paragraph|text|content)s?\\b`, 'i');
    const bodyRegexReverse = new RegExp(`\\b(body|paragraph|text|content)s?.{0,50}?\\b(${font})\\b`, 'i');
    
    if (bodyRegex.test(text) || bodyRegexReverse.test(text)) {
      typography.push({
        name: font,
        type: 'body',
        description: `${font} for body text`
      });
    }
    
    const accentRegex = new RegExp(`\\b(${font})\\b.{0,50}?\\b(accent|special|highlight|emphasis)s?\\b`, 'i');
    const accentRegexReverse = new RegExp(`\\b(accent|special|highlight|emphasis)s?.{0,50}?\\b(${font})\\b`, 'i');
    
    if (accentRegex.test(text) || accentRegexReverse.test(text)) {
      typography.push({
        name: font,
        type: 'accent',
        description: `${font} for accents`
      });
    }
  });
  
  // If no specific fonts were found, look for generic recommendations
  if (typography.length === 0) {
    const genericFontRegex = /\b(serif|sans-serif|sans serif|monospace|display)\b/gi;
    let match;
    while ((match = genericFontRegex.exec(text)) !== null) {
      typography.push({
        name: match[1],
        type: 'body',
        description: `Generic ${match[1]} font recommendation`
      });
    }
  }
  
  return typography;
};

// Extract layout suggestions
const extractLayouts = (text: string): string[] => {
  const layoutSuggestions: string[] = [];
  
  // Extract bullet points or numbered lists
  const bulletRegex = /[•\-*]\s+([^•\-*\n]+)/g;
  let match;
  while ((match = bulletRegex.exec(text)) !== null) {
    if (match[1].length > 10 && match[1].length < 200) {
      layoutSuggestions.push(match[1].trim());
    }
  }
  
  // Extract numbered points
  const numberedRegex = /\d+\.\s+([^\n]+)/g;
  while ((match = numberedRegex.exec(text)) !== null) {
    if (match[1].length > 10 && match[1].length < 200) {
      layoutSuggestions.push(match[1].trim());
    }
  }
  
  // Look for specific layout keywords
  const layoutKeywords = [
    "layout", "grid", "section", "hero", "footer", "header", 
    "navigation", "sidebar", "card", "banner", "container"
  ];
  
  layoutKeywords.forEach(keyword => {
    const keywordRegex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    while ((match = keywordRegex.exec(text)) !== null) {
      if (match[0].length > 10 && match[0].length < 200) {
        layoutSuggestions.push(match[0].trim());
      }
    }
  });
  
  return layoutSuggestions;
};

// Extract component suggestions
const extractComponents = (text: string): string[] => {
  const componentSuggestions: string[] = [];
  const componentKeywords = [
    "component", "button", "form", "input", "menu", "modal", "dialog",
    "dropdown", "tab", "card", "carousel", "slider", "gallery",
    "accordion", "tooltip", "notification", "alert", "badge", "chip",
    "progress", "spinner", "loader", "icon", "avatar", "breadcrumb"
  ];
  
  componentKeywords.forEach(keyword => {
    const keywordRegex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    let match;
    while ((match = keywordRegex.exec(text)) !== null) {
      if (match[0].length > 10 && match[0].length < 200) {
        componentSuggestions.push(match[0].trim());
      }
    }
  });
  
  return componentSuggestions;
};

// Main parser function
export const parseSuggestions = (suggestions: string): ParsedSuggestion => {
  return {
    colors: extractColorNames(suggestions),
    typography: extractTypography(suggestions),
    layouts: extractLayouts(suggestions),
    components: extractComponents(suggestions),
    originalText: suggestions
  };
};
