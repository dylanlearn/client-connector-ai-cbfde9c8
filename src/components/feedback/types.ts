
import { FeedbackAnalysisResult } from '@/services/ai/content/feedback-analysis-service';

export interface FeedbackAnalyzerProps {
  onAnalysisComplete?: (result: FeedbackAnalysisResult) => void;
  initialFeedback?: string;
  placeholder?: string;
  className?: string;
}
