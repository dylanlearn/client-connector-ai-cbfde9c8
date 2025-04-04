
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
 * Status of the feedback implementation
 */
export type FeedbackStatus = 'open' | 'in_progress' | 'implemented' | 'declined';

/**
 * Type for feedback comment
 */
export interface FeedbackComment {
  id: string;
  comment: string;
  createdAt: string;
  userId: string;
  userEmail?: string;
}

/**
 * Database record for feedback analysis
 */
export interface FeedbackAnalysisRecord {
  id?: string;
  user_id?: string;
  project_id?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: FeedbackStatus;
  original_feedback: string;
  action_items: ActionItem[] | string;
  tone_analysis: ToneAnalysis | string;
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
   * @param options - Optional parameters (project_id, category)
   * @returns Structured analysis of the feedback
   */
  analyzeFeedback: async (
    feedbackText: string, 
    options?: { 
      projectId?: string; 
      category?: string; 
      priority?: 'high' | 'medium' | 'low';
    }
  ): Promise<FeedbackAnalysisResult> => {
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
          // Determine priority if not provided 
          const calculatedPriority = options?.priority || 
            (data.toneAnalysis.urgent ? 'high' : 
              (data.toneAnalysis.negative > 0.7 ? 'high' : 
                (data.toneAnalysis.negative > 0.4 ? 'medium' : 'low')));

          // Create a record for database storage
          const record = {
            user_id: userId,
            project_id: options?.projectId,
            category: options?.category,
            priority: calculatedPriority,
            status: 'open' as FeedbackStatus,
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
   * @param filters - Optional filters for the query (project_id, category, status)
   * @returns List of past feedback analyses
   */
  getPastAnalyses: async (
    limit: number = 10,
    filters?: {
      projectId?: string;
      category?: string;
      status?: FeedbackStatus;
    }
  ): Promise<{
    id: string;
    originalFeedback: string;
    result: FeedbackAnalysisResult;
    createdAt: string;
    priority?: string;
    status?: FeedbackStatus;
    category?: string;
    projectId?: string;
  }[]> => {
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
          status: item.status,
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
   * Updates the status of a feedback analysis
   * 
   * @param id - The ID of the feedback analysis to update
   * @param status - New status value
   * @returns True if update was successful
   */
  updateFeedbackStatus: async (id: string, status: FeedbackStatus): Promise<boolean> => {
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
   * Updates the priority of a feedback analysis
   * 
   * @param id - The ID of the feedback analysis to update
   * @param priority - New priority value
   * @returns True if update was successful
   */
  updateFeedbackPriority: async (id: string, priority: 'high' | 'medium' | 'low'): Promise<boolean> => {
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
   * Adds a comment to a feedback analysis
   * 
   * @param feedbackId - The ID of the feedback analysis 
   * @param comment - The comment text
   * @returns The ID of the created comment if successful
   */
  addComment: async (feedbackId: string, comment: string): Promise<string | null> => {
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
   * Gets comments for a feedback analysis
   * 
   * @param feedbackId - The ID of the feedback analysis
   * @returns List of comments with user information
   */
  getComments: async (feedbackId: string): Promise<FeedbackComment[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id,
          profiles:user_id (email)
        `)
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        id: item.id,
        comment: item.comment,
        createdAt: item.created_at,
        userId: item.user_id,
        userEmail: item.profiles?.email
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }
};
