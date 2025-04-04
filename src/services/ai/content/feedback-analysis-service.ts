
export interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

export interface FeedbackAnalysisResult {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
    urgent: boolean;
    critical: boolean;
    vague: boolean;
  };
}
