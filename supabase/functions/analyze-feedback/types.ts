
import { corsHeaders } from "../../_shared/cors-headers";

export { corsHeaders };

export interface FeedbackAnalysisRequest {
  feedbackText: string;
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

export interface FeedbackAnalysisResult {
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
  summary: string;
}
