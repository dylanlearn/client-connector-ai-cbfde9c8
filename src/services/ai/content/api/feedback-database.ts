
import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisRecord, 
  FeedbackStatus,
  PastAnalysisResult,
  AnalysisFilters
} from "../feedback-types";

/**
 * Database operations for feedback analysis
 */
export const FeedbackDatabase = {
  /**
   * Store feedback analysis in the database
   */
  storeFeedbackAnalysis: async (record: FeedbackAnalysisRecord): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('feedback_analysis')
        .insert({
          user_id: record.userId,
          project_id: record.projectId,
          original_feedback: record.originalFeedback,
          summary: record.summary,
          action_items: record.actionItems,
          tone_analysis: record.toneAnalysis,
          priority: record.priority,
          status: record.status || 'open',
          category: record.category
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error storing feedback analysis:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Exception storing feedback analysis:", error);
      return null;
    }
  },

  /**
   * Get past feedback analyses
   */
  getPastAnalyses: async (
    limit: number = 10,
    filters?: AnalysisFilters
  ): Promise<PastAnalysisResult[]> => {
    try {
      let query = supabase
        .from('feedback_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        
        if (filters.priority) {
          query = query.eq('priority', filters.priority);
        }
        
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        
        if (filters.projectId) {
          query = query.eq('project_id', filters.projectId);
        }
        
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching feedback analyses:", error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        originalFeedback: item.original_feedback,
        result: {
          summary: item.summary,
          actionItems: item.action_items,
          toneAnalysis: item.tone_analysis
        },
        createdAt: item.created_at,
        status: item.status,
        priority: item.priority,
        category: item.category
      }));
    } catch (error) {
      console.error("Exception fetching feedback analyses:", error);
      return [];
    }
  },

  /**
   * Update feedback status
   */
  updateFeedbackStatus: async (
    id: string, 
    status: FeedbackStatus
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feedback_analysis')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error("Error updating feedback status:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception updating feedback status:", error);
      return false;
    }
  },

  /**
   * Update feedback priority
   */
  updateFeedbackPriority: async (
    id: string, 
    priority: 'high' | 'medium' | 'low'
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feedback_analysis')
        .update({ priority, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error("Error updating feedback priority:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception updating feedback priority:", error);
      return false;
    }
  }
};
