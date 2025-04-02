
import { PromptTestsService } from "./db/tests-service";
import { PromptVariantsService } from "./db/variants-service";
import { PromptAnalyticsService } from "./db/analytics-service";

/**
 * Service for database operations related to A/B prompt testing
 * Uses direct query approach to avoid TypeScript table definitions issues
 */
export const PromptDBService = {
  // Test operations
  getActiveTest: PromptTestsService.getActiveTest,
  getAllTests: PromptTestsService.getAllTests,
  getTest: PromptTestsService.getTest,
  createTest: PromptTestsService.createTest,
  
  // Variant operations
  createVariants: PromptVariantsService.createVariants,
  getVariant: PromptVariantsService.getVariant,
  
  // Analytics operations
  recordImpression: PromptAnalyticsService.recordImpression,
  recordSuccess: PromptAnalyticsService.recordSuccess,
  recordFailure: PromptAnalyticsService.recordFailure,
  getImpressions: PromptAnalyticsService.getImpressions,
  getResults: PromptAnalyticsService.getResults
};

// Export individual services for more granular imports
export { PromptTestsService, PromptVariantsService, PromptAnalyticsService };
