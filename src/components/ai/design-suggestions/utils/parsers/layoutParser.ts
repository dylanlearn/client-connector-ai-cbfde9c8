
/**
 * Parse layout suggestions from the text with enhanced pattern matching
 */
export const parseLayouts = (text: string): string[] => {
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
