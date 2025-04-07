
import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisRecord, 
  FeedbackAnalysisResult, 
  FeedbackStatus,
  FeedbackComment,
  PastAnalysisResult,
  AnalysisFilters
} from "./feedback-types";

/**
 * API service for feedback analysis operations
 */
export const FeedbackAnalysisAPI = {
  /**
   * Call the analyze-feedback edge function
   */
  callAnalyzeFeedbackFunction: async (feedbackText: string): Promise<FeedbackAnalysisResult> => {
    const { data, error } = await supabase.functions.invoke("analytics-api", {
      body: {
        action: "analyze_feedback",
        feedbackText
      }
    });

    if (error) {
      throw error;
    }

    return data as FeedbackAnalysisResult;
  },

  /**
   * Store feedback analysis in the database
   */
  storeFeedbackAnalysis: async (record: FeedbackAnalysisRecord): Promise<string | null> => {
    return FeedbackDatabase.storeFeedbackAnalysis(record);
  },

  /**
   * Get past feedback analyses
   */
  getPastAnalyses: async (
    limit: number = 10,
    filters?: AnalysisFilters
  ): Promise<PastAnalysisResult[]> => {
    return FeedbackDatabase.getPastAnalyses(limit, filters);
  },

  /**
   * Update feedback status
   */
  updateFeedbackStatus: async (
    id: string, 
    status: FeedbackStatus
  ): Promise<boolean> => {
    return FeedbackDatabase.updateFeedbackStatus(id, status);
  },

  /**
   * Update feedback priority
   */
  updateFeedbackPriority: async (
    id: string, 
    priority: 'high' | 'medium' | 'low'
  ): Promise<boolean> => {
    return FeedbackDatabase.updateFeedbackPriority(id, priority);
  },

  /**
   * Add a comment to feedback
   */
  addComment: async (
    feedbackId: string, 
    comment: string
  ): Promise<string | null> => {
    return FeedbackComments.addComment(feedbackId, comment);
  },

  /**
   * Get comments for feedback
   */
  getComments: async (feedbackId: string): Promise<FeedbackComment[]> => {
    return FeedbackComments.getComments(feedbackId);
  }
};
