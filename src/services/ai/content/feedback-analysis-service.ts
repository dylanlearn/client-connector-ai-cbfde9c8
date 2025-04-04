
import { supabase } from "@/integrations/supabase/client";

export interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

export interface FeedbackAnalysisResult {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
    urgent: boolean;
    critical: boolean;
    vague: boolean;
  };
}

/**
 * Service for analyzing client feedback and extracting actionable insights
 */
export const FeedbackAnalysisService = {
  /**
   * Analyzes feedback text and returns structured analysis results
   */
  analyzeFeedback: async (feedbackText: string): Promise<FeedbackAnalysisResult> => {
    try {
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

      return data;
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      
      // Return fallback data if analysis fails
      return {
        summary: 'Failed to analyze feedback.',
        actionItems: [{ 
          task: 'Review feedback manually', 
          priority: 'high', 
          urgency: 10 
        }],
        toneAnalysis: {
          positive: 0,
          neutral: 1,
          negative: 0,
          urgent: false,
          critical: false,
          vague: false
        }
      };
    }
  }
};
