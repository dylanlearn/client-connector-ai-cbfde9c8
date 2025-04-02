
import { useState } from "react";
import { FeedbackAnalysisService, FeedbackAnalysisResult } from "@/services/ai/content/feedback-analysis-service";
import { toast } from "sonner";

export const useFeedbackAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Analyze feedback text to extract action items and tone
   */
  const analyzeFeedback = async (feedbackText: string): Promise<FeedbackAnalysisResult | null> => {
    if (!feedbackText.trim()) {
      toast.error("Please provide feedback text to analyze");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Show toast for long-running process
      const toastId = toast.loading("Analyzing feedback...");
      
      const result = await FeedbackAnalysisService.analyzeFeedback(feedbackText);
      
      setAnalysisResult(result);
      
      // Update toast based on analysis result
      if (result.toneAnalysis.urgent) {
        toast.update(toastId, { 
          id: toastId,
          title: "Urgent feedback detected", 
          description: "This feedback contains time-sensitive items",
          duration: 5000,
          isLoading: false,
          action: {
            label: "View",
            onClick: () => console.log("View urgent feedback")
          },
        });
      } else {
        toast.dismiss(toastId);
        toast.success("Feedback analyzed successfully");
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error analyzing feedback");
      setError(error);
      toast.error("Failed to analyze feedback", {
        description: error.message
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Clear the current analysis results
   */
  const clearAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    analyzeFeedback,
    clearAnalysis,
    isAnalyzing,
    analysisResult,
    error
  };
};
