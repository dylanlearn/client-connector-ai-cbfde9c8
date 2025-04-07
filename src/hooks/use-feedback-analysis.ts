
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  FeedbackAnalysisService, 
  FeedbackAnalysisResult 
} from '@/services/ai/content/feedback-analysis-service';

export function useFeedbackAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const analyzeFeedback = async (feedbackText: string): Promise<FeedbackAnalysisResult | null> => {
    if (!feedbackText || feedbackText.trim().length < 5) {
      setError('Please provide valid feedback text (at least 5 characters)');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Call the API to analyze the feedback
      const analysisResult = await FeedbackAnalysisService.analyzeFeedback(feedbackText);
      
      setResult(analysisResult);
      
      // If user is authenticated, store the analysis
      if (user) {
        try {
          await FeedbackAnalysisService.storeFeedbackAnalysis({
            userId: user.id,
            originalFeedback: feedbackText,
            summary: analysisResult.summary,
            actionItems: analysisResult.actionItems,
            toneAnalysis: analysisResult.toneAnalysis,
            priority: analysisResult.toneAnalysis.urgent ? 'high' : 'medium',
            status: 'open'
          });
        } catch (storageError) {
          console.error('Error storing feedback analysis:', storageError);
          // Don't set error here as the analysis was successful
        }
      }
      
      return analysisResult;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to analyze feedback';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return {
    analyzeFeedback,
    isAnalyzing,
    result,
    error,
    isAuthenticated: user !== null
  };
}
