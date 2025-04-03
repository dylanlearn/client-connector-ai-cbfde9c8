
import { useState } from "react";
import { toast } from "sonner";
import { FeedbackAnalysisService } from "@/services/ai/content/feedback-analysis-service";

/**
 * @deprecated Use useFeedbackAnalysis instead which provides more comprehensive feedback analysis
 */
export const useFeedbackSummary = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Summarize feedback into actionable items
  const summarizeFeedback = async (feedback: string) => {
    setIsProcessing(true);
    
    try {
      const toastId = "processing-feedback";
      toast(toastId, {
        description: "Processing feedback..."
      });
      
      const analysisResult = await FeedbackAnalysisService.analyzeFeedback(feedback);
      
      toast.dismiss(toastId);
      toast.success("Feedback processed successfully");
      
      return analysisResult.actionItems.map(item => item.task);
    } catch (error) {
      console.error("Error summarizing feedback:", error);
      
      toast.error("Error processing feedback", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      
      return ["Error processing feedback"];
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    summarizeFeedback
  };
};
