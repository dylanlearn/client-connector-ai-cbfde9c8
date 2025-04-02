import { PromptDBService } from "../db-service";
import type { PromptVariant } from "./types";

/**
 * Functions for selecting tests and variants for A/B testing
 */
export const PromptTestSelector = {
  /**
   * Get active test for a content type
   */
  getActiveTest: async (contentType: string) => {
    try {
      return await PromptDBService.getActiveTest(contentType);
    } catch (error) {
      console.error("Error getting active test:", error);
      return null;
    }
  },
  
  /**
   * Get all tests
   */
  getAllTests: async () => {
    try {
      return await PromptDBService.getAllTests();
    } catch (error) {
      console.error("Error getting all tests:", error);
      return [];
    }
  },

  /**
   * Select a variant for a user based on weighted randomization
   */
  selectVariant: async (contentType: string, userId?: string): Promise<PromptVariant | null> => {
    try {
      // Get the active test for this content type
      const test = await PromptDBService.getActiveTest(contentType);
      if (!test) return null;
      
      // If no user ID is provided, just return the control variant
      if (!userId) {
        const controlVariant = test.variants.find(v => v.isControl);
        return controlVariant || null;
      }
      
      // Record an impression for each user to keep stats accurate
      // (We'll actually decide on the variant first though)
      
      // Use weighted random selection
      const variants = test.variants;
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
      let randomValue = Math.random() * totalWeight;
      
      // Select a variant based on the weights
      for (const variant of variants) {
        randomValue -= variant.weight;
        if (randomValue <= 0) {
          // Record the impression
          if (userId) {
            await PromptDBService.recordImpression(test.id, variant.id, userId);
          }
          
          return variant;
        }
      }
      
      // Fallback to the first variant (shouldn't happen unless weights are 0)
      const fallbackVariant = variants[0];
      
      // Record the impression
      if (userId && fallbackVariant) {
        await PromptDBService.recordImpression(test.id, fallbackVariant.id, userId);
      }
      
      return fallbackVariant || null;
    } catch (error) {
      console.error("Error selecting variant:", error);
      return null;
    }
  }
};
