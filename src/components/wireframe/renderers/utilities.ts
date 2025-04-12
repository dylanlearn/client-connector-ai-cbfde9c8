
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

/**
 * Safely processes CopySuggestions that could be an object or array
 * Returns a clean object with string properties
 */
export const processCopySuggestions = (copySuggestions: CopySuggestions | CopySuggestions[] | undefined): Record<string, string> => {
  if (!copySuggestions) {
    return {};
  }
  
  if (Array.isArray(copySuggestions)) {
    // If it's an array, use the first item
    return copySuggestions.length > 0 
      ? Object.fromEntries(
          Object.entries(copySuggestions[0])
            .map(([key, value]) => [key, String(value || '')])
        )
      : {};
  }
  
  // If it's an object, convert all values to strings
  return Object.fromEntries(
    Object.entries(copySuggestions)
      .map(([key, value]) => [key, String(value || '')])
  );
};

/**
 * Safely get a suggestion from copySuggestions that might be an object or array
 */
export const getSuggestion = (
  copySuggestions: CopySuggestions | CopySuggestions[] | undefined,
  key: string,
  defaultValue: string = ''
): string => {
  const processed = processCopySuggestions(copySuggestions);
  return processed[key] || defaultValue;
};

/**
 * Creates a style object that's safe to use with React's CSSProperties
 */
export const createStyleObject = (styles: Record<string, any> = {}): React.CSSProperties => {
  return styles as React.CSSProperties;
};
