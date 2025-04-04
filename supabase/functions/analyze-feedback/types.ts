
/**
 * Types shared across edge functions
 */

export interface ClientErrorData {
  errorMessage: string;
  errorStack?: string;
  componentName?: string;
  userId?: string;
  browserInfo?: string;
  url?: string;
}

export interface FeedbackData {
  userId: string;
  feedbackType: 'bug' | 'feature' | 'improvement' | 'other';
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  metadata?: Record<string, any>;
}

export interface AnalysisResult {
  id: string;
  analysis: {
    sentiment: string;
    topics: string[];
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
    suggestedResponse?: string;
  };
}
