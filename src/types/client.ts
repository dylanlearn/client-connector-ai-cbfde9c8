
export interface ClientAccessLink {
  id: string;
  token: string;
  clientName: string;
  clientEmail: string;
  status: 'active' | 'completed' | 'expired';
  expiresAt: string;
  createdAt: string;
  lastAccessedAt?: string;
  clientPhone?: string;
  personalMessage?: string;
  projectId?: string;
  designerId: string;
  projectTitle?: string;
}

export interface ClientProgressItem {
  clientName: string;
  email: string;
  completed: number;
  total: number;
  percentage?: number;
  lastActive?: string;
}

export interface ClientTaskProgress {
  clientName: string;
  email: string;
  completed: number;
  total: number;
  percentage: number;
  lastActive?: string;
  intakeForm: boolean;
  designPicker: boolean;
  templates: boolean;
  linkId?: string; // Added linkId property needed by ClientProgressList
}

export interface ClientOverview {
  totalClients: number;
  activeClients: number;
  completionRate: number;
}

// Add missing interfaces
export interface LoadingViewProps {
  message?: string;
}

export interface WhatNextSectionProps {
  isComplete?: boolean;
}

export interface TaskCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  btnText: string;
  designerNotes?: string;
  onButtonClick: () => void;
  taskType: string;
  status: TaskStatus;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ClientTask {
  id: string;
  linkId: string;
  taskType: 'intakeForm' | 'designPicker' | 'templates';
  status: TaskStatus;
  completedAt: Date | null;
  designerNotes?: string;
  clientResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientLinkResult {
  link: string;
  linkId: string;
}
