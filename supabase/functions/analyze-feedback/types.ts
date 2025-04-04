
/**
 * Types for feedback analysis
 */

export interface FeedbackAnalysisRequest {
  feedbackText: string;
}

export interface FeedbackAnalysisResult {
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
  summary: string;
}

export interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

export interface ToneAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  urgent: boolean;
  vague: boolean;
  critical: boolean;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
