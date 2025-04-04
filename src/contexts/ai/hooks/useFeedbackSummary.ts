
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FeedbackAnalysisResult, FeedbackAnalysisService } from '@/services/ai/content/feedback-analysis-service';

export function useFeedbackSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeFeedback = useCallback(async (feedbackText: string): Promise<FeedbackAnalysisResult | null> => {
    if (!feedbackText.trim()) {
      setError('Feedback text cannot be empty');
      toast.error('Feedback text cannot be empty');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the service to analyze feedback
      const result = await FeedbackAnalysisService.analyzeFeedback(feedbackText);
      setAnalysis(result);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during feedback analysis';
      console.error('Feedback analysis error:', err);
      setError(errorMessage);
      toast.error('Feedback analysis failed', {
        description: errorMessage,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analyzeFeedback,
    resetAnalysis,
    isLoading,
    analysis,
    error,
  };
}
