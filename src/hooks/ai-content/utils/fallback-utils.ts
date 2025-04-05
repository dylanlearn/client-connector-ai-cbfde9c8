
import { FallbackContentMap } from '../types/generation-types';

/**
 * Default fallback content for different content types
 */
export const DEFAULT_FALLBACKS: FallbackContentMap = {
  header: {
    default: "Example header"
  },
  tagline: {
    default: "Brief, compelling tagline example"
  },
  cta: {
    default: "Sign up for free"
  },
  description: {
    default: "Sample description for this field"
  }
};

/**
 * Get fallback content for a given content type and context
 * @param type Content type
 * @param context Optional context information
 * @returns Appropriate fallback content
 */
export function getFallbackContent(type: string, context?: string): string {
  const fallbackObj = DEFAULT_FALLBACKS[type] || { default: `Example ${type}` };
  
  // Customize fallback based on context if available
  if (context && fallbackObj.default) {
    return fallbackObj.default.replace(/this field/g, context);
  }
  
  return fallbackObj.default;
}
