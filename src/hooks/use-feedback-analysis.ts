
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FeedbackAnalysisResult } from '@/services/ai/content/feedback-analysis-service';

export function useFeedbackAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeFeedback = async (feedbackText: string): Promise<FeedbackAnalysisResult | null> => {
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
      
      const { data, error } = await supabase.functions.invoke<FeedbackAnalysisResult>(
        'analyze-feedback',
        {
          body: { feedbackText }
        }
      );

      if (error) {
        throw new Error(error.message || 'Failed to analyze feedback');
      }

      if (!data) {
        throw new Error('No analysis data returned');
      }

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
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyzeFeedback,
    resetAnalysis,
    isAnalyzing,
    result,
    error,
  };
}
