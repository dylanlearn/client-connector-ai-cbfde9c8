
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

/**
 * Safely get a value from copySuggestions, handling both object and array formats
 */
export const getSuggestion = (
  copySuggestions: CopySuggestions | CopySuggestions[] | undefined, 
  key: string, 
  defaultValue: string = ''
): string => {
  if (!copySuggestions) return defaultValue;
  
  // If it's an array, try to find the key in any of the objects
  if (Array.isArray(copySuggestions)) {
    for (const suggestion of copySuggestions) {
      if (suggestion[key]) {
        return suggestion[key];
      }
    }
    return defaultValue;
  }
  
  // If it's an object, directly access the key
  return copySuggestions[key] || defaultValue;
};

/**
 * Create a style object that handles text-align correctly for React CSS Properties
 */
export const createStyleObject = (styles: Record<string, any> = {}): React.CSSProperties => {
  const result: Record<string, any> = { ...styles };
  
  // Handle textAlign specifically - cast it to a valid CSS text-align value
  if (styles.textAlign) {
    switch (styles.textAlign) {
      case 'left':
      case 'center':
      case 'right':
      case 'justify':
        result.textAlign = styles.textAlign as 'left' | 'center' | 'right' | 'justify';
        break;
      default:
        // Use a safe default if the value isn't recognized
        result.textAlign = 'left';
    }
  }
  
  return result as React.CSSProperties;
};
