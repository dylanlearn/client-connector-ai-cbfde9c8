
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
  critical: boolean;
  vague: boolean;
}

export interface FeedbackAnalysisResult {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
}

export type FeedbackStatus = 'open' | 'in_progress' | 'implemented' | 'declined';

export interface FeedbackAnalysisRecord {
  userId?: string;
  projectId?: string;
  originalFeedback: string;
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
  priority?: 'high' | 'medium' | 'low';
  status?: FeedbackStatus;
  category?: string;
}

export interface FeedbackComment {
  id: string;
  comment: string;
  createdAt: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
}

export interface PastAnalysisResult {
  id: string;
  originalFeedback: string;
  result: FeedbackAnalysisResult;
  createdAt: string;
  status?: FeedbackStatus;
  priority?: string;
  category?: string;
}

export interface AnalysisFilters {
  status?: FeedbackStatus;
  priority?: 'high' | 'medium' | 'low';
  userId?: string;
  projectId?: string;
  category?: string;
}
