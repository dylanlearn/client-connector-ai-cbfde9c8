
import { ParsedColor, ParsedSuggestion, ParsedTypography } from "../types";

/**
 * Utility function to normalize and clean input text
 */
const normalizeText = (text: string): string => {
  if (!text) return "";
  return text.trim().replace(/\s+/g, ' ');
};

/**
 * Parse color palette information from the suggestion text
 */
const parseColorPalette = (text: string): ParsedColor[] => {
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

/**
 * Parse typography suggestions from the text
 */
const parseTypography = (text: string): ParsedTypography[] => {
  const typography: ParsedTypography[] = [];
  
  // Enhanced pattern matching for typography
  const fontPatterns = [
    // Pattern 1: "Heading font: Montserrat"
    /(Headings?|Body|Title|Accent)(?:\sfont)?:?\s+([A-Za-z\s\-]+)/gi,
    
    // Pattern 2: "For headings, use Montserrat"
    /for\s+(headings?|body|titles?|accents?)[,:]?\s+(?:use\s+)?([A-Za-z\s\-]+)/gi,
    
    // Pattern 3: "Montserrat for headings"
    /([A-Za-z\s\-]+)\s+for\s+(headings?|body|titles?|accents?)/gi
  ];
  
  fontPatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    
    matches.forEach(match => {
      // Determine which capture group has the usage and which has the font name
      let usage: string;
      let name: string;
      
      if (pattern.toString().includes('for\\s+')) {
        // Pattern 2
        usage = match[1]?.toLowerCase() || '';
        name = match[2]?.trim() || '';
      } else if (pattern.toString().includes('\\s+for\\s+')) {
        // Pattern 3
        usage = match[2]?.toLowerCase() || '';
        name = match[1]?.trim() || '';
      } else {
        // Pattern 1
        usage = match[1]?.toLowerCase() || '';
        name = match[2]?.trim() || '';
      }
      
      if (name && usage) {
        // Avoid duplicates by checking if font already exists
        const existingFont = typography.find(
          t => t.name.toLowerCase() === name.toLowerCase() && 
               t.type.toLowerCase() === determineTypographyType(usage).toLowerCase()
        );
        
        if (!existingFont) {
          typography.push({ 
            name, 
            type: determineTypographyType(usage) 
          });
        }
      }
    });
  });
  
  return typography;
};

/**
 * Helper function to determine typography type
 */
const determineTypographyType = (usage: string): 'heading' | 'body' | 'accent' => {
  usage = usage.toLowerCase();
  
  if (usage.includes('head') || usage.includes('title')) {
    return 'heading';
  } else if (usage.includes('accent')) {
    return 'accent';
  } else {
    return 'body';
  }
};

/**
 * Parse layout suggestions from the text with enhanced pattern matching
 */
const parseLayouts = (text: string): string[] => {
  const layouts: string[] = [];
  
  // Look for layout section with various delimiters
  const layoutSectionRegexes = [
    /(?:layout|structure)s?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i,
    /(?:layout|structure)\s+recommendations?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i,
    /for\s+(?:the\s+)?layout:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i
  ];
  
  // Try each pattern to find layout sections
  for (const regex of layoutSectionRegexes) {
    const layoutMatch = text.match(regex);
    
    if (layoutMatch && layoutMatch[1]) {
      // Split by bullet points, numbers, or new lines
      const layoutItems = layoutMatch[1]
        .split(/(?:\n|^)(?:[-•*]|\d+\.)\s+/)
        .filter(item => item.trim().length > 0);
      
      if (layoutItems.length > 0) {
        layoutItems.forEach(item => {
          layouts.push(item.trim());
        });
        break; // Found layouts, no need to try other patterns
      }
    }
  }
  
  // If no layouts found through sections, look for bullet points in general
  if (layouts.length === 0) {
    const bulletPointRegex = /(?:^|\n)[-•*]\s+([^\n]+)/g;
    const bulletMatches = [...text.matchAll(bulletPointRegex)];
    
    bulletMatches.forEach(match => {
      if (match[1] && 
          (match[1].toLowerCase().includes('layout') || 
           match[1].toLowerCase().includes('structure') ||
           match[1].toLowerCase().includes('section') ||
           match[1].toLowerCase().includes('page') ||
           match[1].toLowerCase().includes('design'))) {
        layouts.push(match[1].trim());
      }
    });
  }
  
  return layouts;
};

/**
 * Parse component suggestions from the text with improved pattern recognition
 */
const parseComponents = (text: string): string[] => {
  const components: string[] = [];
  
  // Look for sections that mention components with various patterns
  const componentSectionRegexes = [
    /components?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i,
    /suggested\s+components?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i,
    /ui\s+elements?:?\s*(?:\n|\.)([\s\S]*?)(?:\n\n|\n#|$)/i
  ];
  
  // Try each pattern to find component sections
  for (const regex of componentSectionRegexes) {
    const componentMatch = text.match(regex);
    
    if (componentMatch && componentMatch[1]) {
      // Split by bullet points or numbers
      const componentItems = componentMatch[1]
        .split(/(?:\n|^)(?:[-•*]|\d+\.)\s+/)
        .filter(item => item.trim().length > 0);
      
      if (componentItems.length > 0) {
        componentItems.forEach(item => {
          components.push(item.trim());
        });
        break; // Found components, no need to try other patterns
      }
    }
  }
  
  // If no components found through sections, look for specific component mentions
  if (components.length === 0) {
    const componentKeywords = [
      'button', 'card', 'navigation', 'menu', 'form', 'input', 'modal', 
      'popup', 'sidebar', 'footer', 'header', 'dropdown', 'carousel'
    ];
    
    componentKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(`(?:^|\\s)(${keyword}[\\w\\s]*?)(?:\\.|,|;|\\n)`, 'gi');
      const matches = [...text.matchAll(keywordRegex)];
      
      matches.forEach(match => {
        if (match[1]) {
          components.push(match[1].trim());
        }
      });
    });
  }
  
  return components;
};

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
