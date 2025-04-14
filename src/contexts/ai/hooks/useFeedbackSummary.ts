
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { FeedbackAnalysisAPI } from '@/services/ai/content/feedback-analysis-api';

/**
 * Hook for summarizing client feedback with AI assistance
 */
export function useFeedbackSummary() {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Summarizes multiple pieces of feedback text
   * 
   * @param feedbackItems - Array of feedback texts to summarize
   * @returns Summarized feedback text
   */
  const summarizeFeedback = useCallback(async (feedbackItems: string[]): Promise<string> => {
    if (feedbackItems.length === 0) {
      const errorMessage = 'No feedback items to summarize';
      setError(errorMessage);
      toast.error(errorMessage);
      return '';
    }

    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    
    try {
      // For now, this combines the items and calls the analyze function
      // This could be enhanced in the future with a dedicated summarization endpoint
      const combinedFeedback = feedbackItems.join('\n\n');
      const result = await FeedbackAnalysisAPI.analyzeFeedback(combinedFeedback);
      
      // Use summary from result, ensuring it exists
      const resultSummary = result.summary || 'No summary available';
      setSummary(resultSummary);
      return resultSummary;
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during feedback summarization';
      console.error('Feedback summarization error:', err);
      
      setError(errorMessage);
      toast.error('Feedback summarization failed', {
        description: errorMessage,
      });
      return 'Failed to summarize feedback.';
    } finally {
      setIsSummarizing(false);
    }
  }, []);

  return {
    summarizeFeedback,
    isSummarizing,
    summary,
    error,
    resetSummary: () => setSummary(null)
  };
}
