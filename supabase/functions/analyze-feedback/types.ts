
export interface FeedbackAnalysisRequest {
  feedbackText: string;
  projectId: string;
  userId: string;
  context?: Record<string, any>;
}

export interface FeedbackAnalysisResponse {
  success: boolean;
  analysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
    themes: string[];
    actionItems: string[];
    priority: 'low' | 'medium' | 'high';
  };
  error?: string;
}
