
import { 
  PromptDBService,
  PromptTestsService, 
  PromptAnalyticsService 
} from "../db-service";
import { PromptTest, PromptVariant } from "./types";

/**
 * Functions for retrieving and selecting prompt test variants
 */
export const PromptTestSelector = {
  /**
   * Get an active test for a specific content type
   */
  getActiveTest: async (contentType: string): Promise<PromptTest | null> => {
    try {
      const data = await PromptTestsService.getActiveTest(contentType);
      
      if (!data) return null;
      
      // Transform database model to our interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        contentType: data.content_type,
        status: data.status as any,
        variants: data.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          promptText: v.prompt_text,
          systemPrompt: v.system_prompt,
          isControl: v.is_control,
          weight: v.weight
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        minSampleSize: data.min_sample_size,
        confidenceThreshold: data.confidence_threshold
      };
    } catch (error) {
      console.error("Error in getActiveTest:", error);
      return null;
    }
  },

  /**
   * Select a variant from an active test based on weighted distribution
   */
  selectVariant: async (contentType: string, userId?: string): Promise<PromptVariant | null> => {
    try {
      const test = await PromptTestSelector.getActiveTest(contentType);
      if (!test || !test.variants.length) return null;
      
      // Select a variant based on weights
      const variants = test.variants;
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
      
      // Generate a random number between 0 and the total weight
      const random = Math.random() * totalWeight;
      
      // Find the variant that corresponds to the random value
      let cumulativeWeight = 0;
      for (const variant of variants) {
        cumulativeWeight += variant.weight;
        if (random <= cumulativeWeight) {
          // Record an impression for this variant
          if (userId) {
            await PromptAnalyticsService.recordImpression(test.id, variant.id, userId);
          }
          return variant;
        }
      }
      
      // Fallback to the first variant if something went wrong
      return variants[0];
    } catch (error) {
      console.error("Error in selectVariant:", error);
      return null;
    }
  }
};
