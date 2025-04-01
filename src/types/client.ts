
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
  status: string;
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
  // Add the missing properties
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
