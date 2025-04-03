
/**
 * Parse component suggestions from the text with improved pattern recognition
 */
export const parseComponents = (text: string): string[] => {
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
