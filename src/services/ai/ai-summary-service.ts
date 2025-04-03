
import {
  AIQuestionnaireSummaryService,
  AIActionItemsService,
  AIRevisedBriefService,
  IntakeSummaryService,
  IntakeSummaryResult
} from './summary';

/**
 * Service for AI-powered summarization of client data
 */
export const AISummaryService = {
  // Questionnaire summarization
  summarizeQuestionnaire: AIQuestionnaireSummaryService.summarizeQuestionnaire,
  
  // Converting feedback to action items
  convertToActionItems: AIActionItemsService.convertToActionItems,
  
  // Creating revised project briefs
  createRevisedBrief: AIRevisedBriefService.createRevisedBrief,
  
  // Intake form summarization
  summarizeIntakeForm: IntakeSummaryService.summarizeIntakeForm
};

// Re-export the type
export type { IntakeSummaryResult };
