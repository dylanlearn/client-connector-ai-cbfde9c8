
import { FeedbackAnalysisAPI } from './feedback-analysis-api';
import { FeedbackApiClient } from './api/feedback-api-client';
import { FeedbackAnalysisResult, FeedbackAnalysisRecord } from './feedback-types';

// Re-export types and API
export * from './feedback-types';
export { FeedbackAnalysisAPI as FeedbackAnalysisService };

// Add the analyzeFeedback function to the service
FeedbackAnalysisAPI.analyzeFeedback = async (feedbackText: string): Promise<FeedbackAnalysisResult> => {
  try {
    return await FeedbackApiClient.callAnalyzeFeedbackFunction(feedbackText);
  } catch (error) {
    throw new Error(`Feedback analysis failed: ${error.message}`);
  }
};
