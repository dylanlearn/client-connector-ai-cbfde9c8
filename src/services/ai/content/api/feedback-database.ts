
import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisRecord, 
  FeedbackStatus,
  PastAnalysisResult,
  AnalysisFilters
} from "../feedback-types";
import { RpcClient } from "@/utils/supabase/rpc-client";

/**
 * Database operations for feedback analysis
 */
export const FeedbackDatabase = {
  /**
   * Store feedback analysis in the database
   */
  storeFeedbackAnalysis: async (record: FeedbackAnalysisRecord): Promise<string | null> => {
    try {
      const data = {
        userId: record.userId,
        projectId: record.projectId,
        originalFeedback: record.originalFeedback,
        summary: record.summary,
        actionItems: record.actionItems,
        toneAnalysis: record.toneAnalysis,
        priority: record.priority,
        status: record.status || 'open',
        category: record.category
      };
      
      return await RpcClient.feedbackAnalysis.store(data);
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
      const analysisFilters = {
        status: filters?.status,
        priority: filters?.priority,
        userId: filters?.userId,
        projectId: filters?.projectId,
        category: filters?.category,
        limit
      };
      
      const results = await RpcClient.feedbackAnalysis.list(analysisFilters);
      return results as PastAnalysisResult[];
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
    return RpcClient.feedbackAnalysis.updateStatus(id, status);
  },

  /**
   * Update feedback priority
   */
  updateFeedbackPriority: async (
    id: string, 
    priority: 'high' | 'medium' | 'low'
  ): Promise<boolean> => {
    return RpcClient.feedbackAnalysis.updatePriority(id, priority);
  }
};
