
import { FeedbackAnalysisAPI } from "./feedback-analysis-api";
import { FeedbackUtils } from "./feedback-utils";
import { 
  FeedbackAnalysisResult, 
  FeedbackStatus, 
  ActionItem, 
  ToneAnalysis, 
  FeedbackComment,
  FeedbackAnalysisRecord
} from "./feedback-types";
import { supabase } from "@/integrations/supabase/client";

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
    if (!FeedbackUtils.validateFeedbackInput(feedbackText)) {
      throw new Error('Feedback text cannot be empty');
    }

    try {
      // Call the analyze-feedback edge function
      const data = await FeedbackAnalysisAPI.callAnalyzeFeedbackFunction(feedbackText);

      // Get the current user ID if available
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Store the feedback analysis in the database for future reference
      try {
        // Determine priority if not provided 
        const calculatedPriority = options?.priority || 
          FeedbackUtils.calculatePriorityFromToneAnalysis(data.toneAnalysis);

        // Create a record for database storage
        const record: FeedbackAnalysisRecord = {
          user_id: userId,
          project_id: options?.projectId,
          category: options?.category,
          priority: calculatedPriority,
          status: 'open' as FeedbackStatus,
          original_feedback: feedbackText,
          action_items: data.actionItems,
          tone_analysis: data.toneAnalysis,
          summary: data.summary
        };
        
        await FeedbackAnalysisAPI.storeFeedbackAnalysis(record);
      } catch (saveError) {
        // Log the error but don't fail the operation
        console.error('Error saving feedback analysis to database:', saveError);
      }

      return data;
    } catch (error) {
      console.error('Error in analyzeFeedback:', error);
      
      // Return fallback data if analysis fails
      return FeedbackUtils.generateFallbackAnalysisResult();
    }
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
  ) => {
    return FeedbackAnalysisAPI.getPastAnalyses(limit, filters);
  },

  /**
   * Updates the status of a feedback analysis
   * 
   * @param id - The ID of the feedback analysis to update
   * @param status - New status value
   * @returns True if update was successful
   */
  updateFeedbackStatus: async (id: string, status: FeedbackStatus): Promise<boolean> => {
    return FeedbackAnalysisAPI.updateFeedbackStatus(id, status);
  },

  /**
   * Updates the priority of a feedback analysis
   * 
   * @param id - The ID of the feedback analysis to update
   * @param priority - New priority value
   * @returns True if update was successful
   */
  updateFeedbackPriority: async (id: string, priority: 'high' | 'medium' | 'low'): Promise<boolean> => {
    return FeedbackAnalysisAPI.updateFeedbackPriority(id, priority);
  },

  /**
   * Adds a comment to a feedback analysis
   * 
   * @param feedbackId - The ID of the feedback analysis 
   * @param comment - The comment text
   * @returns The ID of the created comment if successful
   */
  addComment: async (feedbackId: string, comment: string): Promise<string | null> => {
    return FeedbackAnalysisAPI.addComment(feedbackId, comment);
  },

  /**
   * Gets comments for a feedback analysis
   * 
   * @param feedbackId - The ID of the feedback analysis
   * @returns List of comments with user information
   */
  getComments: async (feedbackId: string): Promise<FeedbackComment[]> => {
    return FeedbackAnalysisAPI.getComments(feedbackId);
  }
};

// Re-export types for easier importing
export type { 
  ActionItem, 
  ToneAnalysis, 
  FeedbackAnalysisResult, 
  FeedbackStatus, 
  FeedbackComment,
  FeedbackAnalysisRecord
} from './feedback-types';
