
import { PromptTestSelector } from './modules/test-selector';
import { PromptTestCreator } from './modules/test-creator';
import { PromptTestResults } from './modules/test-results';
import { PromptAnalyticsTracker } from './modules/analytics-tracker';

// Re-export types from the types module
export { PromptTestStatus, PromptVariant, PromptTest, PromptTestResult } from './modules/types';

/**
 * Service for managing A/B testing of AI prompts with statistical significance tracking
 */
export const PromptABTestingService = {
  // Selector functions
  getActiveTest: PromptTestSelector.getActiveTest,
  selectVariant: PromptTestSelector.selectVariant,
  
  // Creator functions
  createTest: PromptTestCreator.createTest,
  
  // Results functions
  getTestResults: PromptTestResults.getTestResults,
  
  // Analytics tracking functions
  recordImpression: PromptAnalyticsTracker.recordImpression,
  recordSuccess: PromptAnalyticsTracker.recordSuccess,
  recordFailure: PromptAnalyticsTracker.recordFailure
};
