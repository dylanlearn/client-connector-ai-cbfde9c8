
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
  
  // If it's an array, try to find the key in any of the objects
  if (Array.isArray(copySuggestions)) {
    for (const suggestion of copySuggestions) {
      if (suggestion && suggestion[key]) {
        return String(suggestion[key]);
      }
    }
    return defaultValue;
  }
  
  // If it's an object, directly access the key
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
 * Convert a string or Record<string, string> colorScheme to the required format
 * Ensures the colorScheme has all required properties: primary, secondary, accent, background
 */
export const createColorScheme = (
  colorScheme: string | Record<string, string> | undefined
): { primary: string; secondary: string; accent: string; background: string; text?: string } => {
  // Default color scheme
  const defaultColors = {
    primary: '#3B82F6',    // blue-500
    secondary: '#10B981',  // emerald-500
    accent: '#F59E0B',     // amber-500
    background: '#FFFFFF', // white
    text: '#111827'        // gray-900
  };
  
  // If no colorScheme provided, return the default
  if (!colorScheme) {
    return defaultColors;
  }
  
  // If colorScheme is a string, assume it's a style token and apply a predefined scheme
  if (typeof colorScheme === 'string') {
    const colorToken = colorScheme.toLowerCase();
    
    // Apply different predefined color schemes based on the token
    if (colorToken.includes('blue') || colorToken.includes('corporate')) {
      return {
        primary: '#2563EB',    // blue-600
        secondary: '#0EA5E9',  // sky-500
        accent: '#6366F1',     // indigo-500
        background: '#F9FAFB', // gray-50
        text: '#1F2937'        // gray-800
      };
    } else if (colorToken.includes('green') || colorToken.includes('nature')) {
      return {
        primary: '#10B981',    // emerald-500
        secondary: '#059669',  // emerald-600
        accent: '#FBBF24',     // amber-400
        background: '#ECFDF5', // emerald-50
        text: '#064E3B'        // emerald-900
      };
    } else if (colorToken.includes('dark') || colorToken.includes('night')) {
      return {
        primary: '#3B82F6',    // blue-500
        secondary: '#10B981',  // emerald-500
        accent: '#F59E0B',     // amber-500
        background: '#1F2937', // gray-800
        text: '#F9FAFB'        // gray-50
      };
    } else if (colorToken.includes('minimal') || colorToken.includes('simple')) {
      return {
        primary: '#000000',    // black
        secondary: '#6B7280',  // gray-500
        accent: '#3B82F6',     // blue-500
        background: '#FFFFFF', // white
        text: '#111827'        // gray-900
      };
    } else if (colorToken.includes('vibrant') || colorToken.includes('creative')) {
      return {
        primary: '#8B5CF6',    // violet-500
        secondary: '#EC4899',  // pink-500
        accent: '#F59E0B',     // amber-500
        background: '#FFFFFF', // white
        text: '#1F2937'        // gray-800
      };
    }
    
    // Default scheme if no specific token matched
    return defaultColors;
  }
  
  // If colorScheme is an object, ensure it has all required properties
  return {
    primary: colorScheme.primary || defaultColors.primary,
    secondary: colorScheme.secondary || defaultColors.secondary,
    accent: colorScheme.accent || defaultColors.accent,
    background: colorScheme.background || defaultColors.background,
    text: colorScheme.text || defaultColors.text
  };
};
