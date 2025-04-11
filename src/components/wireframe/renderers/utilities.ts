
import { getSuggestion as getSuggestionHelper, createStyleObject as createStyleObjectHelper, createColorScheme as createColorSchemeHelper } from '@/utils/copy-suggestions-helper';
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

/**
 * Re-export helper functions from copy-suggestions-helper for convenience
 * and to maintain backward compatibility with existing components
 */
export const getSuggestion = getSuggestionHelper;
export const createStyleObject = createStyleObjectHelper;
export const createColorScheme = createColorSchemeHelper;

/**
 * Helper function to safely access nested properties
 */
export function getNestedProperty(obj: any, path: string, defaultValue: any = undefined): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Generate CSS classes conditionally based on a condition
 */
export function classIf(condition: boolean, className: string): string {
  return condition ? className : '';
}
