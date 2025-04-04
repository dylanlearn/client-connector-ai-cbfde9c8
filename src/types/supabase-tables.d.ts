
/**
 * Custom type definitions for Supabase tables that might not be included in
 * the auto-generated types.
 */

/**
 * Feedback analysis types
 */
export interface FeedbackAnalysisTable {
  id: string;
  original_feedback: string;
  action_items: any; // This will be the ActionItem[] type in our application
  tone_analysis: any; // This will be the ToneAnalysis type in our application
  summary: string;
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
      };
    };
  }
}
