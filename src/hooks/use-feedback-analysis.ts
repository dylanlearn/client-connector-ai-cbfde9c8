
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FeedbackAnalysisResult, FeedbackAnalysisService } from '@/services/ai/content/feedback-analysis-service';

/**
 * Hook for analyzing client feedback with AI assistance
 * 
 * @returns Functions and state for analyzing customer feedback
 */
export function useFeedbackAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyzes feedback text and extracts insights
   * 
   * @param feedbackText - The feedback text to analyze
   * @returns The analysis result or null if there was an error
   */
  const analyzeFeedback = useCallback(async (feedbackText: string): Promise<FeedbackAnalysisResult | null> => {
    if (!feedbackText.trim()) {
      setError('Feedback text cannot be empty');
      toast.error('Feedback text cannot be empty');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      console.log('Sending feedback for analysis:', feedbackText.substring(0, 50) + '...');
      
      // Use the service to analyze feedback
      const data = await FeedbackAnalysisService.analyzeFeedback(feedbackText);
      
      setResult(data);
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during feedback analysis';
      console.error('Feedback analysis error:', err);
      setError(errorMessage);
      toast.error('Feedback analysis failed', {
        description: errorMessage,
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Resets the analysis state
   */
  const resetAnalysis = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyzeFeedback,
    resetAnalysis,
    isAnalyzing,
    result,
    error,
  };
}
