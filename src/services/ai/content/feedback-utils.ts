
import { FeedbackAnalysisResult, ActionItem, ToneAnalysis } from './feedback-types';

/**
 * Utility functions for feedback analysis
 */
export const FeedbackUtils = {
  /**
   * Validates feedback input text
   */
  validateFeedbackInput: (text: string): boolean => {
    return !!text && text.trim().length > 0;
  },

  /**
   * Calculates priority based on tone analysis
   */
  calculatePriorityFromToneAnalysis: (toneAnalysis: ToneAnalysis): 'high' | 'medium' | 'low' => {
    if (toneAnalysis.urgent || toneAnalysis.critical || toneAnalysis.negative > 0.5) {
      return 'high';
    } else if (toneAnalysis.negative > 0.2 || toneAnalysis.vague) {
      return 'medium';
    } else {
      return 'low';
    }
  },

  /**
   * Generates a fallback analysis result when AI analysis fails
   */
  generateFallbackAnalysisResult: (): FeedbackAnalysisResult => {
    return {
      summary: "We were unable to analyze this feedback automatically.",
      actionItems: [
        {
          task: "Review the feedback manually",
          priority: 'medium',
          urgency: 5
        }
      ],
      toneAnalysis: {
        positive: 0,
        neutral: 1,
        negative: 0,
        urgent: false,
        critical: false,
        vague: true
      }
    };
  }
};
