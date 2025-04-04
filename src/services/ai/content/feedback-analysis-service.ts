
import { supabase } from "@/integrations/supabase/client";

/**
 * Represents an action item extracted from client feedback
 */
export interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

/**
 * Analysis of feedback tone and sentiment
 */
export interface ToneAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  urgent: boolean;
  critical: boolean;
  vague: boolean;
}

/**
 * Complete feedback analysis result
 */
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
   * 
   * @param feedbackText - The feedback text to analyze
   * @returns Structured analysis of the feedback
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
        console.error('Error from analyze-feedback function:', error);
        throw new Error(error.message || 'Failed to analyze feedback');
      }

      if (!data) {
        throw new Error('No analysis data returned');
      }

      // Store the feedback analysis in the database for future reference
      try {
        const { error: insertError } = await supabase.from('feedback_analysis').insert({
          original_feedback: feedbackText,
          action_items: data.actionItems,
          tone_analysis: data.toneAnalysis,
          summary: data.summary
        });
        
        if (insertError) {
          console.error('Error saving feedback analysis:', insertError);
        }
      } catch (saveError) {
        // Log the error but don't fail the operation
        console.error('Error saving feedback analysis to database:', saveError);
      }

      return data;
    } catch (error: any) {
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
   * 
   * @param limit - Maximum number of analyses to return
   * @returns List of past feedback analyses
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

      if (error) {
        console.error('Error fetching past analyses:', error);
        throw error;
      }

      return (data || []).map(item => ({
        originalFeedback: item.original_feedback,
        result: {
          summary: item.summary,
          actionItems: item.action_items as ActionItem[],
          toneAnalysis: item.tone_analysis as ToneAnalysis
        },
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching past analyses:', error);
      return [];
    }
  }
};
