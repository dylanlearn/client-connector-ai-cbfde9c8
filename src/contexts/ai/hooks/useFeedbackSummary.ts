
import { useState } from "react";
import { AISummaryService } from "@/services/ai";
import { toast } from "sonner";

export const useFeedbackSummary = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Summarize feedback into actionable items
  const summarizeFeedback = async (feedback: string) => {
    setIsProcessing(true);
    
    try {
      toast.message("Processing feedback...", {
        id: "processing-feedback",
        loading: true
      });
      
      const actionItems = await AISummaryService.convertToActionItems(feedback);
      
      toast.dismiss("processing-feedback");
      toast.success("Feedback processed successfully");
      
      return actionItems.map(item => item.task);
    } catch (error) {
      console.error("Error summarizing feedback:", error);
      
      toast.dismiss("processing-feedback");
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
