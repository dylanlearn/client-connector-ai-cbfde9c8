
import { ParsedColor, ParsedSuggestion, ParsedTypography } from "../types";

/**
 * Parse color palette information from the suggestion text
 */
const parseColorPalette = (text: string): ParsedColor[] => {
  const colors: ParsedColor[] = [];
  
  // Look for hex codes with optional color names
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g;
  const colorLineRegex = /([\w\s]+):\s*#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/gi;
  
  // First try to parse structured color information
  const colorMatches = [...text.matchAll(colorLineRegex)];
  
  if (colorMatches.length > 0) {
    colorMatches.forEach(match => {
      const name = match[1]?.trim();
      const hex = `#${match[2]}`;
      const fullMatch = match[0];
      
      // Extract description if available
      const parts = fullMatch.split('-');
      const description = parts.length > 1 
        ? parts.slice(1).join('-').trim() 
        : undefined;
      
      colors.push({ name, hex, description });
    });
  } else {
    // Fall back to just finding hex codes
    const hexMatches = text.match(hexRegex);
    if (hexMatches) {
      hexMatches.forEach((hex, index) => {
        colors.push({
          name: `Color ${index + 1}`,
          hex
        });
      });
    }
  }
  
  return colors;
};

/**
 * Parse typography suggestions from the text
 */
const parseTypography = (text: string): ParsedTypography[] => {
  const typography: ParsedTypography[] = [];
  
  // Look for font names followed by a usage
  const fontRegex = /(Headings?|Body|Title|Accent)(?:\sfont)?:?\s+([A-Za-z\s]+)/gi;
  const matches = [...text.matchAll(fontRegex)];
  
  matches.forEach(match => {
    const usage = match[1]?.toLowerCase();
    const name = match[2]?.trim();
    
    if (name) {
      let type: 'heading' | 'body' | 'accent' = 'body';
      
      if (usage.includes('head') || usage.includes('title')) {
        type = 'heading';
      } else if (usage.includes('accent')) {
        type = 'accent';
      }
      
      typography.push({ name, type });
    }
  });
  
  return typography;
};

/**
 * Parse layout suggestions from the text
 */
const parseLayouts = (text: string): string[] => {
  const layouts: string[] = [];
  
  // Look for sections that mention layout
  const layoutSectionRegex = /(?:layout|structure)s?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i;
  const layoutMatch = text.match(layoutSectionRegex);
  
  if (layoutMatch && layoutMatch[1]) {
    // Split by bullet points or numbers
    const layoutItems = layoutMatch[1]
      .split(/(?:\n|^)(?:[-•*]|\d+\.)\s+/)
      .filter(item => item.trim().length > 0);
    
    layoutItems.forEach(item => {
      layouts.push(item.trim());
    });
  }
  
  // If no layouts found, look for bullet points in general
  if (layouts.length === 0) {
    const bulletPointRegex = /(?:^|\n)[-•*]\s+([^\n]+)/g;
    const bulletMatches = [...text.matchAll(bulletPointRegex)];
    
    bulletMatches.forEach(match => {
      if (match[1] && 
          (match[1].toLowerCase().includes('layout') || 
           match[1].toLowerCase().includes('structure') ||
           match[1].toLowerCase().includes('section'))) {
        layouts.push(match[1].trim());
      }
    });
  }
  
  return layouts;
};

/**
 * Parse component suggestions from the text
 */
const parseComponents = (text: string): string[] => {
  const components: string[] = [];
  
  // Look for sections that mention components
  const componentSectionRegex = /components?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i;
  const componentMatch = text.match(componentSectionRegex);
  
  if (componentMatch && componentMatch[1]) {
    // Split by bullet points or numbers
    const componentItems = componentMatch[1]
      .split(/(?:\n|^)(?:[-•*]|\d+\.)\s+/)
      .filter(item => item.trim().length > 0);
    
    componentItems.forEach(item => {
      components.push(item.trim());
    });
  }
  
  return components;
};

/**
 * Parse the entire suggestion text into structured data
 */
export const parseSuggestionText = (text: string): ParsedSuggestion => {
  if (!text) {
    throw new Error("Suggestion text is required");
  }
  
  return {
    colors: parseColorPalette(text),
    typography: parseTypography(text),
    layouts: parseLayouts(text),
    components: parseComponents(text),
    originalText: text
  };
};
