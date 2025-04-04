
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
 * Database record for feedback analysis
 */
export interface FeedbackAnalysisRecord {
  id?: string;
  user_id?: string;
  original_feedback: string;
  action_items: ActionItem[];
  tone_analysis: ToneAnalysis;
  summary: string;
  created_at?: string;
  updated_at?: string;
}

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries in milliseconds (starting value, will be exponentially increased)
const RETRY_DELAY = 1000;

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
    // Validate input
    if (!feedbackText?.trim()) {
      throw new Error('Feedback text cannot be empty');
    }

    // Retry mechanism for the API call
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < MAX_RETRIES) {
      try {
        // Call the edge function to analyze the feedback
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

        // Get the current user ID if available
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // Store the feedback analysis in the database for future reference
        try {
          // Convert ActionItem[] and ToneAnalysis to JSON for database storage
          const record = {
            user_id: userId,
            original_feedback: feedbackText,
            action_items: JSON.stringify(data.actionItems),
            tone_analysis: JSON.stringify(data.toneAnalysis),
            summary: data.summary
          };
          
          const { error: insertError } = await supabase
            .from('feedback_analysis')
            .insert(record);
          
          if (insertError) {
            console.error('Error saving feedback analysis:', insertError);
            // Continue with the operation even if saving fails
          }
        } catch (saveError) {
          // Log the error but don't fail the operation
          console.error('Error saving feedback analysis to database:', saveError);
        }

        return data;
      } catch (error: any) {
        lastError = error;
        retries++;
        
        // If we've reached max retries, break out
        if (retries >= MAX_RETRIES) break;
        
        // Exponential backoff - wait longer between each retry
        const delay = RETRY_DELAY * Math.pow(2, retries - 1);
        console.log(`Retry ${retries}/${MAX_RETRIES} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error('All retries failed for feedback analysis:', lastError);
    
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
      // Get the current user ID if available
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Build query based on whether we have a user ID
      let query = supabase
        .from('feedback_analysis')
        .select('original_feedback, action_items, tone_analysis, summary, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      // If we have a user ID, filter by it
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching past analyses:', error);
        throw error;
      }

      return (data || []).map(item => ({
        originalFeedback: item.original_feedback,
        result: {
          summary: item.summary,
          actionItems: typeof item.action_items === 'string' 
            ? JSON.parse(item.action_items) 
            : item.action_items,
          toneAnalysis: typeof item.tone_analysis === 'string' 
            ? JSON.parse(item.tone_analysis) 
            : item.tone_analysis
        },
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching past analyses:', error);
      return [];
    }
  }
};
