
import { FallbackContentMap } from "../types/generation-types";

/**
 * Default fallback content for different content types
 */
export const DEFAULT_FALLBACKS: FallbackContentMap = {
  header: (context?: string) => {
    return context ? `${context} Solution` : "Professional Solutions for Your Business";
  },
  tagline: (context?: string) => {
    return context ? `Transforming ${context} for success` : "Transforming ideas into realities";
  },
  description: (context?: string) => {
    return context ? `Our specialized ${context} services help businesses achieve their goals with innovative solutions.` : 
      "Our specialized services help businesses achieve their goals with innovative solutions.";
  },
  cta: (context?: string) => {
    return context ? `Get started with ${context}` : "Get Started Today";
  }
};

/**
 * Get appropriate fallback content for a content type
 * 
 * @param contentType The type of content to generate fallback for
 * @param context Optional context to customize the fallback
 * @returns Appropriate fallback content
 */
export function getFallbackContent(contentType: string, context?: string): string {
  const fallback = DEFAULT_FALLBACKS[contentType as keyof typeof DEFAULT_FALLBACKS];
  
  if (!fallback) {
    return "Content not available. Please try again later.";
  }
  
  if (typeof fallback === "function") {
    return fallback(context);
  }
  
  return typeof fallback === "string" ? fallback : String(fallback);
}
