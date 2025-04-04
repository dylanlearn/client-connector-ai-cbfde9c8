
import { useCallback } from 'react';
import { toast } from 'sonner';
import { FeedbackAnalysisService } from '@/services/ai/content/feedback-analysis-service';

/**
 * Hook for summarizing client feedback with AI assistance
 */
export function useFeedbackSummary() {
  /**
   * Summarizes multiple pieces of feedback text
   * 
   * @param feedbackItems - Array of feedback texts to summarize
   * @returns Summarized feedback text
   */
  const summarizeFeedback = useCallback(async (feedbackItems: string[]): Promise<string> => {
    if (feedbackItems.length === 0) {
      toast.error('No feedback items to summarize');
      return '';
    }

    try {
      // For now, this just combines the items - in the future we can call a more 
      // sophisticated summarization service
      const combinedFeedback = feedbackItems.join('\n\n');
      const result = await FeedbackAnalysisService.analyzeFeedback(combinedFeedback);
      return result.summary;
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during feedback summarization';
      console.error('Feedback summarization error:', err);
      toast.error('Feedback summarization failed', {
        description: errorMessage,
      });
      return 'Failed to summarize feedback.';
    }
  }, []);

  return {
    summarizeFeedback,
  };
}
