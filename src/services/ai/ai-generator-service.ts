
import {
  AIContentGenerationService,
  AIFeedbackService,
  AIProjectBriefService
} from './content';
import { PromptABTestingService } from './content/prompt-testing/ab-testing-service';

export type { ContentGenerationOptions } from './content/content-generation-service';
export type { PromptTest, PromptVariant } from './content/prompt-testing/ab-testing-service';

/**
 * Service for generating AI-powered content and suggestions
 */
export const AIGeneratorService = {
  // Content generation
  generateContent: AIContentGenerationService.generateContent,
  
  // Feedback summarization
  summarizeFeedback: AIFeedbackService.summarizeFeedback,
  
  // Project brief generation
  generateProjectBrief: AIProjectBriefService.generateProjectBrief,
  
  // A/B Testing for prompts
  getActivePromptTest: PromptABTestingService.getActiveTest,
  selectPromptVariant: PromptABTestingService.selectVariant,
  createPromptTest: PromptABTestingService.createTest,
  getPromptTestResults: PromptABTestingService.getTestResults,
  recordPromptTestSuccess: PromptABTestingService.recordSuccess,
  recordPromptTestFailure: PromptABTestingService.recordFailure
};
