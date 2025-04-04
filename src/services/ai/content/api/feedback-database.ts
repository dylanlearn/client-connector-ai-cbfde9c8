
import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisRecord, 
  FeedbackStatus,
  FeedbackComment,
  ActionItem,
  ToneAnalysis,
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
  storeFeedbackAnalysis: async (
    record: FeedbackAnalysisRecord
  ): Promise<string | null> => {
    try {
      // Ensure action_items and tone_analysis are stored as JSON strings
      const recordToStore = {
        ...record,
        action_items: typeof record.action_items === 'string' 
          ? record.action_items 
          : JSON.stringify(record.action_items),
        tone_analysis: typeof record.tone_analysis === 'string' 
          ? record.tone_analysis 
          : JSON.stringify(record.tone_analysis)
      };
      
      const { data, error } = await supabase
        .from('feedback_analysis')
        .insert(recordToStore)
        .select('id')
        .single();
      
      if (error) {
        console.error('Error saving feedback analysis:', error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error('Error storing feedback analysis:', error);
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
      // Get the current user ID if available
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      let query = supabase
        .from('feedback_analysis')
        .select()
        .order('created_at', { ascending: false })
        .limit(limit);
        
      // If we have a user ID, filter by it
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      // Apply additional filters if provided
      if (filters?.projectId) {
        query = query.eq('project_id', filters.projectId);
      }
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching past analyses:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform the database records into the expected return format
      return data.map(item => {
        // Parse action_items and tone_analysis if they're stored as strings
        let actionItems: ActionItem[] = [];
        try {
          const parsedItems = typeof item.action_items === 'string' 
            ? JSON.parse(item.action_items) 
            : item.action_items;
            
          // Ensure each action item has a valid priority
          actionItems = Array.isArray(parsedItems) ? parsedItems.map(actionItem => {
            let priority: 'high' | 'medium' | 'low' = 'medium';
            if (actionItem.priority === 'high' || actionItem.priority === 'medium' || actionItem.priority === 'low') {
              priority = actionItem.priority as 'high' | 'medium' | 'low';
            }
            
            return {
              task: actionItem.task,
              priority,
              urgency: Number(actionItem.urgency) || 5
            };
          }) : [];
        } catch (e) {
          console.error('Error parsing action_items:', e);
          actionItems = [];
        }

        let toneAnalysis: ToneAnalysis;
        try {
          toneAnalysis = typeof item.tone_analysis === 'string' 
            ? JSON.parse(item.tone_analysis) 
            : item.tone_analysis;
        } catch (e) {
          console.error('Error parsing tone_analysis:', e);
          toneAnalysis = {
            positive: 0,
            neutral: 1,
            negative: 0,
            urgent: false,
            critical: false,
            vague: false
          };
        }

        // Validate status and priority
        const status = (item.status === 'open' || item.status === 'in_progress' || 
                        item.status === 'implemented' || item.status === 'declined')
          ? item.status as FeedbackStatus
          : 'open' as FeedbackStatus;
        
        const priority = (item.priority === 'high' || item.priority === 'medium' || item.priority === 'low')
          ? item.priority
          : 'medium';

        return {
          id: item.id,
          originalFeedback: item.original_feedback,
          result: {
            summary: item.summary,
            actionItems,
            toneAnalysis
          },
          createdAt: item.created_at,
          priority,
          status,
          category: item.category,
          projectId: item.project_id
        };
      });
    } catch (error) {
      console.error('Error fetching past analyses:', error);
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
        console.error('Error updating feedback status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating feedback status:', error);
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
        console.error('Error updating feedback priority:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating feedback priority:', error);
      return false;
    }
  }
};
