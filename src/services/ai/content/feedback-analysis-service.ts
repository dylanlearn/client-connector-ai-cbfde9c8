
import { supabase } from "@/integrations/supabase/client";

export interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

export interface ToneAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  urgent: boolean;
  vague: boolean;
  critical: boolean;
}

export interface FeedbackAnalysisResult {
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
  summary: string;
}

export class FeedbackAnalysisService {
  /**
   * Analyzes feedback text to extract action items and tone patterns
   */
  static async analyzeFeedback(feedbackText: string): Promise<FeedbackAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke("analyze-feedback", {
        body: { feedbackText },
      });

      if (error) {
        console.error("Feedback analysis error:", error);
        throw new Error(`Failed to analyze feedback: ${error.message}`);
      }

      return data as FeedbackAnalysisResult;
    } catch (error) {
      console.error("Error in feedback analysis service:", error);
      throw error;
    }
  }
}
