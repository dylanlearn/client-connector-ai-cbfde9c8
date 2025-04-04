
/**
 * Type definitions for the feedback analysis service
 */

/**
 * Represents an action item extracted from client feedback
 */
export interface ActionItem {
  task: string;
  priority: 'high' | 'medium' | 'low';
  urgency: number;
}

/**
 * Analysis of feedback tone and sentiment
 */
export interface ToneAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  urgent: boolean;
  critical: boolean;
  vague: boolean;
}

/**
 * Complete feedback analysis result
 */
export interface FeedbackAnalysisResult {
  summary: string;
  actionItems: ActionItem[];
  toneAnalysis: ToneAnalysis;
}

/**
 * Status of the feedback implementation
 */
export type FeedbackStatus = 'open' | 'in_progress' | 'implemented' | 'declined';

/**
 * Type for feedback comment
 */
export interface FeedbackComment {
  id: string;
  comment: string;
  createdAt: string;
  userId: string;
  userEmail?: string;
}

/**
 * Database record for feedback analysis
 */
export interface FeedbackAnalysisRecord {
  id?: string;
  user_id?: string;
  project_id?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: FeedbackStatus;
  original_feedback: string;
  action_items: ActionItem[] | string;
  tone_analysis: ToneAnalysis | string;
  summary: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Result type for getPastAnalyses
 */
export interface PastAnalysisResult {
  id: string;
  originalFeedback: string;
  result: FeedbackAnalysisResult;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
  status: FeedbackStatus;
  category?: string;
  projectId?: string;
}

/**
 * Filters for retrieving past analyses
 */
export interface AnalysisFilters {
  projectId?: string;
  category?: string;
  status?: FeedbackStatus;
}
