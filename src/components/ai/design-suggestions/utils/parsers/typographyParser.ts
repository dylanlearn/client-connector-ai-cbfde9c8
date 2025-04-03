
import { ParsedTypography } from "../../types";

/**
 * Parse typography suggestions from the text
 */
export const parseTypography = (text: string): ParsedTypography[] => {
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
export const determineTypographyType = (usage: string): 'heading' | 'body' | 'accent' => {
  usage = usage.toLowerCase();
  
  if (usage.includes('head') || usage.includes('title')) {
    return 'heading';
  } else if (usage.includes('accent')) {
    return 'accent';
  } else {
    return 'body';
  }
};
