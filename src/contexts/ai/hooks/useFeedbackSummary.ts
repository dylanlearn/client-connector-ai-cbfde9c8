
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FeedbackAnalysisResult } from '@/services/ai/content/feedback-analysis-service';

export function useFeedbackSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeFeedback = useCallback(async (feedbackText: string) => {
    if (!feedbackText.trim()) {
      setError('Feedback text cannot be empty');
      toast.error('Feedback text cannot be empty');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Import the hook to use the service
      const { useFeedbackAnalysis } = await import('@/hooks/use-feedback-analysis');
      const { analyzeFeedback } = useFeedbackAnalysis();
      
      const result = await analyzeFeedback(feedbackText);
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
