
import { FeedbackAnalysisAPI, FeedbackAnalysis } from '@/services/ai/content/feedback-analysis-api';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Interface for design feedback interpretation
 */
export interface DesignFeedbackInterpretation {
  intent: 'modify' | 'add' | 'remove' | 'style' | 'layout' | 'unknown';
  targetSection?: string;
  targetElement?: string;
  suggestedChanges: Array<{
    property: string;
    value: any;
    confidence: number;
  }>;
  priority: 'high' | 'medium' | 'low';
  sentimentScore: number;
}

/**
 * Interface for feedback processing options
 */
export interface FeedbackProcessingOptions {
  wireframeId?: string;
  contextualSections?: WireframeSection[];
  userId?: string;
  detailedAnalysis?: boolean;
}

/**
 * Service for interpreting design feedback and converting it to actionable changes
 */
export class FeedbackInterpreterService {
  /**
   * Process design feedback and extract structured interpretations
   */
  static async interpretFeedback(
    feedbackText: string, 
    options: FeedbackProcessingOptions = {}
  ): Promise<DesignFeedbackInterpretation> {
    try {
      console.log('Interpreting feedback:', feedbackText);
      
      // First use the feedback analysis service to get sentiment and action items
      const analysisResult = await FeedbackAnalysisAPI.analyzeFeedback(feedbackText);
      
      // Default interpretation structure
      const interpretation: DesignFeedbackInterpretation = {
        intent: 'unknown',
        suggestedChanges: [],
        priority: 'medium',
        sentimentScore: 0
      };
      
      // Calculate sentiment score from analysis result
      interpretation.sentimentScore = 
        (analysisResult.toneAnalysis.positive * 1) + 
        (analysisResult.toneAnalysis.neutral * 0) + 
        (analysisResult.toneAnalysis.negative * -1);
      
      // Set priority based on analysis result
      if (analysisResult.toneAnalysis.urgent) {
        interpretation.priority = 'high';
      } else {
        // Check for high priority action items
        const highPriorityItems = analysisResult.actionItems.filter(
          item => item.priority === 'high'
        ).length;
        interpretation.priority = highPriorityItems > 0 ? 'high' : 'medium';
      }
      
      // Determine intent from feedback text
      if (feedbackText.toLowerCase().includes('add') || feedbackText.toLowerCase().includes('insert')) {
        interpretation.intent = 'add';
      } else if (feedbackText.toLowerCase().includes('remove') || feedbackText.toLowerCase().includes('delete')) {
        interpretation.intent = 'remove';
      } else if (feedbackText.toLowerCase().includes('style') || feedbackText.toLowerCase().includes('color') || 
                 feedbackText.toLowerCase().includes('font') || feedbackText.toLowerCase().includes('look')) {
        interpretation.intent = 'style';
      } else if (feedbackText.toLowerCase().includes('move') || feedbackText.toLowerCase().includes('position') || 
                 feedbackText.toLowerCase().includes('layout') || feedbackText.toLowerCase().includes('arrange')) {
        interpretation.intent = 'layout';
      }
      
      return interpretation;
    } catch (error) {
      console.error('Error interpreting feedback:', error);
      throw error;
    }
  }
}
