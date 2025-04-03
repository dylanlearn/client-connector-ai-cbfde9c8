
import { FallbackContentMap } from '../types/generation-types';

/**
 * Default fallback content for different content types
 */
export const DEFAULT_FALLBACKS: FallbackContentMap = {
  header: "Example header",
  tagline: "Brief, compelling tagline example",
  cta: "Sign up for free",
  description: "Sample description for this field"
};

/**
 * Get fallback content for a given content type and context
 * @param type Content type
 * @param context Optional context information
 * @returns Appropriate fallback content
 */
export function getFallbackContent(type: string, context?: string): string {
  const fallback = DEFAULT_FALLBACKS[type] || `Example ${type}`;
  
  // Customize fallback based on context if available
  if (context) {
    return fallback.replace('this field', context);
  }
  
  return fallback;
}
