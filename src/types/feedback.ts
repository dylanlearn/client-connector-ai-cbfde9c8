
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ViewRole = 'developer' | 'designer' | 'client' | 'manager';

export interface FeedbackItem {
  id: string;
  wireframeId: string;
  createdBy: string;
  assignedTo?: string;
  title: string;
  content: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  category?: string;
  position?: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackComment {
  id: string;
  feedbackId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserViewPreferences {
  id: string;
  userId: string;
  viewRole: ViewRole;
  showAnnotations: boolean;
  showDeveloperNotes: boolean;
  showClientFeedback: boolean;
}
