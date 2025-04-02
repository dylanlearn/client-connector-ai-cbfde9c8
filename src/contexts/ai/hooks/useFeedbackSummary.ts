
import { useState } from "react";
import { AISummaryService } from "@/services/ai";

export const useFeedbackSummary = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Summarize feedback into actionable items
  const summarizeFeedback = async (feedback: string) => {
    setIsProcessing(true);
    try {
      const actionItems = await AISummaryService.convertToActionItems(feedback);
      return actionItems.map(item => item.task);
    } catch (error) {
      console.error("Error summarizing feedback:", error);
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
