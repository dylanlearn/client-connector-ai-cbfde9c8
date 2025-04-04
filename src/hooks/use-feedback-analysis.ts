
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  FeedbackAnalysisResult, 
  FeedbackStatus, 
  FeedbackAnalysisService 
} from '@/services/ai/content/feedback-analysis-service';
import { supabase } from "@/integrations/supabase/client";

/**
 * Options for analyzing feedback
 */
export interface FeedbackAnalysisOptions {
  projectId?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Hook for analyzing client feedback with AI assistance
 * 
 * @returns Functions and state for analyzing customer feedback
 */
export function useFeedbackAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FeedbackAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (err) {
        console.error('Error checking auth status:', err);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Analyzes feedback text and extracts insights
   * 
   * @param feedbackText - The feedback text to analyze
   * @param options - Optional parameters for the analysis
   * @returns The analysis result or null if there was an error
   */
  const analyzeFeedback = useCallback(async (
    feedbackText: string, 
    options?: FeedbackAnalysisOptions
  ): Promise<FeedbackAnalysisResult | null> => {
    if (!feedbackText.trim()) {
      setError('Feedback text cannot be empty');
      toast.error('Feedback text cannot be empty');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      console.log('Sending feedback for analysis:', feedbackText.substring(0, 50) + '...');
      
      // Use the service to analyze feedback with options
      const data = await FeedbackAnalysisService.analyzeFeedback(feedbackText, options);
      
      setResult(data);
      toast.success('Feedback analyzed successfully');
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred during feedback analysis';
      console.error('Feedback analysis error:', err);
      setError(errorMessage);
      
      toast.error('Feedback analysis failed', {
        description: errorMessage,
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Updates the status of a feedback analysis
   * 
   * @param id - The ID of the feedback analysis
   * @param status - The new status
   * @returns True if update was successful
   */
  const updateStatus = useCallback(async (id: string, status: FeedbackStatus): Promise<boolean> => {
    try {
      const success = await FeedbackAnalysisService.updateFeedbackStatus(id, status);
      
      if (success) {
        toast.success(`Status updated to ${status}`);
      } else {
        toast.error('Failed to update status');
      }
      
      return success;
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
      return false;
    }
  }, []);

  /**
   * Updates the priority of a feedback analysis
   * 
   * @param id - The ID of the feedback analysis
   * @param priority - The new priority
   * @returns True if update was successful
   */
  const updatePriority = useCallback(async (id: string, priority: 'high' | 'medium' | 'low'): Promise<boolean> => {
    try {
      const success = await FeedbackAnalysisService.updateFeedbackPriority(id, priority);
      
      if (success) {
        toast.success(`Priority updated to ${priority}`);
      } else {
        toast.error('Failed to update priority');
      }
      
      return success;
    } catch (err) {
      console.error('Error updating priority:', err);
      toast.error('Failed to update priority');
      return false;
    }
  }, []);

  /**
   * Adds a comment to a feedback analysis
   * 
   * @param feedbackId - The ID of the feedback analysis
   * @param comment - The comment text
   * @returns The ID of the created comment if successful
   */
  const addComment = useCallback(async (feedbackId: string, comment: string): Promise<string | null> => {
    try {
      const commentId = await FeedbackAnalysisService.addComment(feedbackId, comment);
      
      if (commentId) {
        toast.success('Comment added');
      } else {
        toast.error('Failed to add comment');
      }
      
      return commentId;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
      return null;
    }
  }, []);

  /**
   * Resets the analysis state
   */
  const resetAnalysis = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyzeFeedback,
    resetAnalysis,
    updateStatus,
    updatePriority,
    addComment,
    isAnalyzing,
    result,
    error,
    isAuthenticated
  };
}
