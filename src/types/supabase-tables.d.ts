
/**
 * Custom type definitions for Supabase tables that might not be included in
 * the auto-generated types.
 */

import { ActionItem, ToneAnalysis, FeedbackStatus } from "@/services/ai/content/feedback-analysis-service";

/**
 * Feedback analysis types
 */
export interface FeedbackAnalysisTable {
  id: string;
  user_id?: string;
  project_id?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: FeedbackStatus;
  original_feedback: string;
  action_items: ActionItem[] | string; 
  tone_analysis: ToneAnalysis | string;
  summary: string;
  created_at: string;
  updated_at: string;
}

/**
 * Feedback comments types
 */
export interface FeedbackCommentsTable {
  id: string;
  feedback_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Add this interface to augment the Supabase types
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        feedback_analysis: {
          Row: FeedbackAnalysisTable;
          Insert: Omit<FeedbackAnalysisTable, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<FeedbackAnalysisTable, 'id' | 'created_at' | 'updated_at'>>;
        };
        feedback_comments: {
          Row: FeedbackCommentsTable;
          Insert: Omit<FeedbackCommentsTable, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<FeedbackCommentsTable, 'id' | 'created_at' | 'updated_at'>>;
        };
      };
    };
  }
}
