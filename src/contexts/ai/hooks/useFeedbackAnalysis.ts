
import { useState, useCallback } from "react";
import { FeedbackAnalysisService } from "@/services/ai/content/feedback-analysis-service";

/**
 * Enterprise hook for AI-powered feedback analysis
 * - Extracts actionable tasks from feedback
 * - Analyzes tone and sentiment
 * - Detects urgency levels
 * - Provides categorized results
 */
export const useFeedbackAnalysis = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAnalysisDate, setLastAnalysisDate] = useState<Date | null>(null);

  /**
   * Analyze feedback to extract action items with priorities
   * and detect tone/urgency patterns
   */
  const analyzeFeedback = useCallback(async (feedback: string) => {
    setIsProcessing(true);
    try {
      const result = await FeedbackAnalysisService.analyzeFeedback(feedback);
      
      // Track analysis timestamp for caching decisions
      setLastAnalysisDate(new Date());
      
      // Sort action items by priority and urgency
      const sortedItems = [...result.actionItems].sort((a, b) => {
        // First sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                             priorityOrder[b.priority as keyof typeof priorityOrder];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by urgency (higher urgency first)
        return b.urgency - a.urgency;
      });
      
      return {
        ...result,
        actionItems: sortedItems
      };
    } catch (error) {
      console.error("Error analyzing feedback:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    lastAnalysisDate,
    analyzeFeedback
  };
};
