
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
  critical: boolean;
  vague: boolean;
}

export interface FeedbackAnalysisResult {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
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

      // Store the feedback analysis in the database for future reference
      try {
        await supabase.from('feedback_analysis').insert({
          original_feedback: feedbackText,
          action_items: data.actionItems,
          tone_analysis: data.toneAnalysis,
          summary: data.summary
        });
      } catch (saveError) {
        // Log the error but don't fail the operation
        console.error('Error saving feedback analysis to database:', saveError);
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
  },

  /**
   * Retrieves past feedback analyses
   */
  getPastAnalyses: async (limit: number = 10): Promise<{
    originalFeedback: string;
    result: FeedbackAnalysisResult;
    createdAt: string;
  }[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback_analysis')
        .select('original_feedback, action_items, tone_analysis, summary, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(item => ({
        originalFeedback: item.original_feedback,
        result: {
          summary: item.summary,
          actionItems: item.action_items,
          toneAnalysis: item.tone_analysis
        },
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching past analyses:', error);
      return [];
    }
  }
};
