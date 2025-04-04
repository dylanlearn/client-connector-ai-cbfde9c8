
import { useState } from "react";
import { toast } from "sonner";
import { FeedbackAnalysisService } from "@/services/ai/content/feedback-analysis-service";
import { ActionItem, ToneAnalysis } from "@/services/ai/content/feedback-analysis-service";

interface FeedbackAnalysisResult {
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
  summary: string;
}

export const useFeedbackAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Analyze feedback text and return structured results
  const analyzeFeedback = async (feedbackText: string): Promise<FeedbackAnalysisResult | null> => {
    if (!feedbackText.trim()) {
      toast.error("Please provide feedback text to analyze");
      return null;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await FeedbackAnalysisService.analyzeFeedback(feedbackText);
      setAnalysisResult(result);
      toast.success("Feedback analysis complete");
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error("Error analyzing feedback", {
        description: errorMessage
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Extract high priority action items
  const getHighPriorityItems = (): ActionItem[] => {
    if (!analysisResult) return [];
    return analysisResult.actionItems.filter(item => item.priority === 'high');
  };

  // Get overall sentiment (positive, negative, neutral)
  const getOverallSentiment = (): 'positive' | 'negative' | 'neutral' | null => {
    if (!analysisResult) return null;
    
    const { positive, negative, neutral } = analysisResult.toneAnalysis;
    
    if (positive > Math.max(negative, neutral)) return 'positive';
    if (negative > Math.max(positive, neutral)) return 'negative';
    return 'neutral';
  };

  // Reset the analysis state
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    analyzeFeedback,
    isAnalyzing,
    analysisResult,
    error,
    getHighPriorityItems,
    getOverallSentiment,
    resetAnalysis
  };
};
