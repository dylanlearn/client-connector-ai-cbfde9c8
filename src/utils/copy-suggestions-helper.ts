
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

/**
 * Safely get a value from copySuggestions, handling both object and array formats
 */
export const getSuggestion = (
  copySuggestions: CopySuggestions | CopySuggestions[] | Record<string, string> | undefined, 
  key: string, 
  defaultValue: string = ''
): string => {
  if (!copySuggestions) return defaultValue;
  
  // Handle array of suggestions
  if (Array.isArray(copySuggestions)) {
    for (const suggestion of copySuggestions) {
      if (suggestion && suggestion[key]) {
        return String(suggestion[key]);
      }
    }
    return defaultValue;
  }
  
  // Handle object format
  return String(copySuggestions[key] || defaultValue);
};

/**
 * Create a style object that handles text-align correctly for React CSS Properties
 */
export const createStyleObject = (styles: Record<string, any> = {}): React.CSSProperties => {
  const result: Record<string, any> = { ...styles };
  
  // Handle textAlign specifically - cast it to a valid CSS text-align value
  if (styles?.textAlign) {
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

/**
 * Helper to safely convert string or number dimensions to numeric values for calculations
 */
export const parseDimension = (value: string | number | undefined, defaultValue: number = 0): number => {
  if (value === undefined) return defaultValue;
  
  if (typeof value === 'number') return value;
  
  // Try to parse the string as a number
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Create a color scheme object from a wireframe
 */
export const createColorScheme = (wireframe: any): Record<string, string> => {
  const colorScheme = wireframe?.colorScheme || {
    primary: '#3182ce',
    secondary: '#805ad5',
    accent: '#ed8936',
    background: '#ffffff',
    text: '#1a202c'
  };
  
  return colorScheme;
};
