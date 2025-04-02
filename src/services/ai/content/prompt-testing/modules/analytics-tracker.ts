
import { PromptAnalyticsService } from "../db-service";

/**
 * Functions for tracking analytics data for A/B tests
 */
export const PromptAnalyticsTracker = {
  /**
   * Record an impression for a variant
   */
  recordImpression: async (testId: string, variantId: string, userId: string): Promise<void> => {
    try {
      await PromptAnalyticsService.recordImpression(testId, variantId, userId);
    } catch (error) {
      console.error("Error recording impression:", error);
    }
  },

  /**
   * Record a success for a variant
   */
  recordSuccess: async (
    testId: string, 
    variantId: string, 
    userId: string, 
    latencyMs: number,
    tokenUsage?: number
  ): Promise<void> => {
    try {
      await PromptAnalyticsService.recordSuccess(testId, variantId, userId, latencyMs, tokenUsage);
    } catch (error) {
      console.error("Error recording success:", error);
    }
  },

  /**
   * Record a failure for a variant
   */
  recordFailure: async (
    testId: string, 
    variantId: string, 
    userId: string, 
    errorType?: string
  ): Promise<void> => {
    try {
      await PromptAnalyticsService.recordFailure(testId, variantId, userId, errorType);
    } catch (error) {
      console.error("Error recording failure:", error);
    }
  }
};
