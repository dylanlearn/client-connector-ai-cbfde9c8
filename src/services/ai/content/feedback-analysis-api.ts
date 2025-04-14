
import { supabase } from '@/integrations/supabase/client';
import { getFeedbackStats, submitFeedback } from './api/feedback-database';

// Interface for feedback analysis results
export interface FeedbackAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  key_themes: string[];
  improvement_areas?: string[];
  strengths?: string[];
}

export class FeedbackAnalysisAPI {
  /**
   * Analyze feedback from a specific content piece
   */
  static async analyzeFeedback(contentId: string): Promise<FeedbackAnalysis | null> {
    try {
      const stats = await getFeedbackStats(contentId);
      
      if (!stats || stats.total_ratings === 0) {
        return null;
      }
      
      // Call RPC function for AI analysis if available
      const { data, error } = await supabase.rpc('analyze_content_feedback', { 
        p_content_id: contentId 
      });
      
      if (error) {
        console.error('Error analyzing feedback:', error);
        // Provide fallback analysis based on simple statistics
        return this.generateFallbackAnalysis(stats);
      }
      
      return data as FeedbackAnalysis;
    } catch (error) {
      console.error('Error in feedback analysis:', error);
      return null;
    }
  }
  
  /**
   * Generate a basic analysis from stats when AI analysis fails
   */
  private static generateFallbackAnalysis(stats: any): FeedbackAnalysis {
    const averageRating = stats.average_rating || 0;
    let sentiment: 'positive' | 'neutral' | 'negative';
    
    if (averageRating >= 4) {
      sentiment = 'positive';
    } else if (averageRating >= 2.5) {
      sentiment = 'neutral';
    } else {
      sentiment = 'negative';
    }
    
    return {
      sentiment,
      score: averageRating,
      key_themes: ['User Experience', 'Content Quality'],
      improvement_areas: averageRating < 4 ? ['Consider reviewing content quality'] : undefined,
      strengths: averageRating >= 4 ? ['Well-received by users'] : undefined
    };
  }
}
