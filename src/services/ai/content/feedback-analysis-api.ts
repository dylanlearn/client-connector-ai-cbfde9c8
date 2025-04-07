
import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisRecord, 
  FeedbackAnalysisResult, 
  FeedbackStatus,
  FeedbackComment,
  PastAnalysisResult,
  AnalysisFilters
} from "./feedback-types";
import { FeedbackDatabase } from './api/feedback-database';
import { FeedbackComments } from './api/feedback-comments';
import { FeedbackApiClient } from './api/feedback-api-client';

// Define interface for the FeedbackAnalysisAPI
interface IFeedbackAnalysisAPI {
  analyzeFeedback: (feedbackText: string) => Promise<FeedbackAnalysisResult>;
  storeFeedbackAnalysis: (record: FeedbackAnalysisRecord) => Promise<string | null>;
  getPastAnalyses: (limit?: number, filters?: AnalysisFilters) => Promise<PastAnalysisResult[]>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => Promise<boolean>;
  updateFeedbackPriority: (id: string, priority: 'high' | 'medium' | 'low') => Promise<boolean>;
  addComment: (feedbackId: string, comment: string) => Promise<string | null>;
  getComments: (feedbackId: string) => Promise<FeedbackComment[]>;
}

/**
 * API service for feedback analysis operations
 */
export const FeedbackAnalysisAPI: IFeedbackAnalysisAPI = {
  /**
   * Analyze feedback text and return insights
   */
  analyzeFeedback: async (feedbackText: string): Promise<FeedbackAnalysisResult> => {
    try {
      return await FeedbackApiClient.callAnalyzeFeedbackFunction(feedbackText);
    } catch (error: any) {
      throw new Error(`Feedback analysis failed: ${error.message}`);
    }
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
