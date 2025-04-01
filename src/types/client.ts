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
}

export interface TaskCardProps {
  title: string;
  description: string;
  status: TaskStatus;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface WhatNextSectionProps {
  isComplete: boolean;
}

export interface LoadingViewProps {
  message?: string;
}
