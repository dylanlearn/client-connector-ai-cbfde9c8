import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisRecord, 
  FeedbackAnalysisResult, 
  FeedbackStatus,
  FeedbackComment,
  ActionItem,
  ToneAnalysis,
  PastAnalysisResult,
  AnalysisFilters
} from "./feedback-types";

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries in milliseconds (starting value, will be exponentially increased)
const RETRY_DELAY = 1000;

/**
 * API service for feedback analysis operations
 */
export const FeedbackAnalysisAPI = {
  /**
   * Call the analyze-feedback edge function
   */
  callAnalyzeFeedbackFunction: async (feedbackText: string): Promise<FeedbackAnalysisResult> => {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < MAX_RETRIES) {
      try {
        // Call the edge function to analyze the feedback
        const { data, error } = await supabase.functions.invoke<any>(
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

        // Make sure action items have valid priorities
        const validatedActionItems: ActionItem[] = (data.actionItems || []).map((item: any) => {
          // Validate priority is one of the allowed values
          let priority: 'high' | 'medium' | 'low' = 'medium';
          if (item.priority === 'high' || item.priority === 'medium' || item.priority === 'low') {
            priority = item.priority;
          }
          
          return {
            task: item.task,
            priority,
            urgency: Number(item.urgency) || 5
          };
        });

        return {
          summary: data.summary || '',
          actionItems: validatedActionItems,
          toneAnalysis: data.toneAnalysis || {
            positive: 0,
            neutral: 1,
            negative: 0,
            urgent: false,
            critical: false,
            vague: false
          }
        };
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
    throw lastError || new Error('Failed to analyze feedback after multiple attempts');
  },

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
        let actionItems: ActionItem[];
        try {
          actionItems = typeof item.action_items === 'string' 
            ? JSON.parse(item.action_items) 
            : item.action_items;
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

        return {
          id: item.id,
          originalFeedback: item.original_feedback,
          result: {
            summary: item.summary,
            actionItems,
            toneAnalysis
          },
          createdAt: item.created_at,
          priority: item.priority,
          status: item.status as FeedbackStatus, // Cast to FeedbackStatus to ensure type safety
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
  },

  /**
   * Add a comment to feedback
   */
  addComment: async (
    feedbackId: string, 
    comment: string
  ): Promise<string | null> => {
    try {
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to add comments');
      }
      
      const { data, error } = await supabase
        .from('feedback_comments')
        .insert({
          feedback_id: feedbackId,
          user_id: user.id,
          comment
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error adding comment:', error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  /**
   * Get comments for feedback
   */
  getComments: async (feedbackId: string): Promise<FeedbackComment[]> => {
    try {
      // First, we need to fetch the comments directly without joining to profiles
      const { data, error } = await supabase
        .from('feedback_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id
        `)
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
      
      // Then we'll transform the data to the expected format
      // and add user email info if we can find it
      const comments: FeedbackComment[] = [];
      
      for (const item of data || []) {
        // Try to get the user email if available
        let userEmail: string | undefined = undefined;
        
        if (item.user_id) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', item.user_id)
            .single();
            
          if (!userError && userData) {
            userEmail = userData.email;
          }
        }
        
        comments.push({
          id: item.id,
          comment: item.comment,
          createdAt: item.created_at,
          userId: item.user_id,
          userEmail
        });
      }
      
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }
};
