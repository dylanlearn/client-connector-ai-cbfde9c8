
import {
  AIContentGenerationService,
  AIFeedbackService,
  AIProjectBriefService
} from './content';

export type { ContentGenerationOptions } from './content/content-generation-service';

/**
 * Service for generating AI-powered content and suggestions
 */
export const AIGeneratorService = {
  // Content generation
  generateContent: AIContentGenerationService.generateContent,
  
  // Feedback summarization
  summarizeFeedback: AIFeedbackService.summarizeFeedback,
  
  // Project brief generation
  generateProjectBrief: AIProjectBriefService.generateProjectBrief
};
