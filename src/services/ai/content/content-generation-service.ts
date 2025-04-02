
import { ContentGenerator, ContentGenerationOptions } from "./generators/content-generator";

/**
 * Service for generating AI-powered content with database caching and performance optimizations
 */
export const AIContentGenerationService = {
  /**
   * Generates content based on type and specifications with caching support
   */
  generateContent: async (options: ContentGenerationOptions): Promise<string> => {
    const generator = new ContentGenerator();
    return generator.generate(options);
  }
};

// Re-export the ContentGenerationOptions interface
export type { ContentGenerationOptions } from "./generators/content-generator";
