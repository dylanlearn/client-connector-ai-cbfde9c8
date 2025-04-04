
import { ActionItem, ToneAnalysis, FeedbackStatus } from "./feedback-types";

/**
 * Utility functions for the feedback analysis service
 */
export const FeedbackUtils = {
  /**
   * Determine priority from tone analysis if not provided
   */
  calculatePriorityFromToneAnalysis: (toneAnalysis: ToneAnalysis, providedPriority?: 'high' | 'medium' | 'low'): 'high' | 'medium' | 'low' => {
    if (providedPriority) {
      return providedPriority;
    }
    
    if (toneAnalysis.urgent) {
      return 'high';
    } else if (toneAnalysis.negative > 0.7) {
      return 'high';
    } else if (toneAnalysis.negative > 0.4) {
      return 'medium';
    } else {
      return 'low';
    }
  },

  /**
   * Generate a fallback analysis result in case of failure
   */
  generateFallbackAnalysisResult: () => {
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
   * Validate input for feedback analysis
   */
  validateFeedbackInput: (feedbackText: string): boolean => {
    return !!feedbackText?.trim();
  },

  /**
   * Format feedback status for display
   */
  formatFeedbackStatus: (status: FeedbackStatus): string => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'implemented': return 'Implemented';
      case 'declined': return 'Declined';
      default: return status;
    }
  },

  /**
   * Format priority for display
   */
  formatPriority: (priority: string): string => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority;
    }
  },

  /**
   * Get priority color
   */
  getPriorityColor: (priority: string): string => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  }
};
