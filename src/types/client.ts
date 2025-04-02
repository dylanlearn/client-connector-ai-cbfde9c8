
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
  taskType: string;
  status: TaskStatus;
  clientResponse?: any;
  designerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface ClientTaskProgress {
  completed: number;
  total: number;
  percentage: number;
  intakeForm?: boolean;
  designPicker?: boolean;
  templates?: boolean;
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
