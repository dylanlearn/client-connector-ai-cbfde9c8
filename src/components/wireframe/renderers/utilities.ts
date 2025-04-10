
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

/**
 * Helper function to safely access copySuggestions properties
 * This handles both object and array formats of copySuggestions
 */
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
    return copySuggestions[key] || defaultValue;
  }
  
  return defaultValue;
};

/**
 * Helper to convert potentially string textAlign to valid CSS property
 * This fixes the common issue with style.textAlign not being a valid CSS TextAlign
 */
export const getValidTextAlign = (textAlign?: string): React.CSSProperties['textAlign'] => {
  // Only return the textAlign if it's one of the valid CSS values
  if (textAlign && ['left', 'center', 'right', 'justify', 'initial', 'inherit'].includes(textAlign)) {
    return textAlign as React.CSSProperties['textAlign'];
  }
  return undefined;
};

/**
 * Helper to create properly typed style objects to avoid CSSProperties errors
 */
export const createStyleObject = (styleObj?: Record<string, any>): React.CSSProperties => {
  if (!styleObj) return {};
  
  const validStyle: React.CSSProperties = {};
  
  // Copy all properties except textAlign which needs special handling
  Object.entries(styleObj).forEach(([key, value]) => {
    if (key !== 'textAlign') {
      (validStyle as any)[key] = value;
    }
  });
  
  // Handle textAlign specifically to ensure type safety
  if (styleObj.textAlign) {
    validStyle.textAlign = getValidTextAlign(styleObj.textAlign);
  }
  
  return validStyle;
};
