
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ClientAccessLink {
  id: string;
  designerId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date | null;
  status: 'active' | 'completed' | 'expired';
  projectId: string | null;
  projectTitle: string | null;
  /**
   * Optional personal message to the client (max 150 characters)
   */
  personalMessage: string | null;
}

export interface ClientLinkResult {
  link: string | null;
  linkId: string | null;
}

export interface ClientTask {
  id: string;
  linkId: string;
  taskType: 'intakeForm' | 'designPicker' | 'templates' | string;
  status: TaskStatus;
  clientResponse?: any; // Changed from Record<string, unknown> to any to be more flexible
  designerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface ClientTaskProgress {
  clientName?: string;
  email?: string;
  linkId?: string;
  completed: number;
  total: number;
  percentage: number;
  lastActive?: Date | null;
  intakeForm?: boolean;
  designPicker?: boolean;
  templates?: boolean;
}

export interface ClientProgressItem {
  clientName: string;
  email?: string;
  completed: number;
  total: number;
  percentage?: number;
  lastActive: Date | null;
}

export interface TaskCardProps {
  title: string;
  description: string;
  status: TaskStatus;
  onClick?: () => void;
  icon?: React.ReactNode;
  isCompleted: boolean;
  btnText: string;
  designerNotes?: string;
  onButtonClick: () => void;
  taskType: string;
}

export interface WhatNextSectionProps {
  isComplete?: boolean;
}

export interface LoadingViewProps {
  message?: string;
}

export interface ClientOverview {
  totalClients: number;
  activeClients: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}
