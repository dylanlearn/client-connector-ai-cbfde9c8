
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ClientAccessLink {
  id: string;
  designerId: string;
  clientEmail: string;
  clientName: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date | null;
  status: string;
}

export interface ClientTask {
  id: string;
  linkId: string;
  taskType: 'intakeForm' | 'designPicker' | 'templates';
  status: TaskStatus;
  completedAt: Date | null;
  designerNotes: string | null;
  clientResponse: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientTaskProgress {
  [key: string]: boolean;
}

export interface TaskCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  btnText: string;
  designerNotes?: string | null;
  onButtonClick: () => void;
  taskType: string;
}

export interface WhatNextSectionProps {
  // For future customization options
}

export interface LoadingViewProps {
  message?: string;
}
