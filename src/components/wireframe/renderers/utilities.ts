
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

// Helper function to safely access copySuggestions properties
export const getSuggestion = (
  copySuggestions: CopySuggestions | CopySuggestions[] | undefined, 
  key: string, 
  defaultValue: string
): string => {
  if (!copySuggestions) {
    return defaultValue;
  }
  
  // Handle array case
  if (Array.isArray(copySuggestions)) {
    // Try to find a suggestion with the key in any array item
    for (const suggestion of copySuggestions) {
      if (suggestion && typeof suggestion === 'object' && key in suggestion) {
        return suggestion[key] || defaultValue;
      }
    }
    return defaultValue;
  }
  
  // Handle object case
  if (typeof copySuggestions === 'object') {
    return (copySuggestions as any)[key] || defaultValue;
  }
  
  return defaultValue;
};
