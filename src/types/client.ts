
import { ReactNode } from 'react';

// Task status types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

// Client task interface
export interface ClientTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  type: string;
  completionPercentage: number;
  clientId: string;
  
  // Additional properties for client hub functionality
  linkId?: string;
  taskType?: 'intakeForm' | 'designPicker' | 'templates';
  completedAt?: Date | null;
  designerNotes?: string | null;
  clientResponse?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

// Client access link interface
export interface ClientAccessLink {
  id: string;
  linkId?: string;
  name?: string;
  email?: string;
  token: string;
  created_at: string;
  expires_at?: string;
  project_id?: string;
  status: 'active' | 'expired' | 'used' | 'completed';
  
  // Additional properties for client functionality
  designerId?: string;
  projectId?: string;
  projectTitle?: string | null;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string | null;
  createdAt?: string;
  expiresAt?: string;
  lastAccessedAt?: string | null;
  last_accessed_at?: string | null;
  personalMessage?: string | null;
}

// Client task progress interface
export interface ClientTaskProgress {
  completed: number;
  total: number;
  percentage: number;
  intakeForm: boolean;
  designPicker: boolean;
  templates: boolean;
  clientName?: string;
  email?: string;
  linkId?: string;
  lastActive?: string;
}

// Component props interfaces
export interface TaskCardProps {
  task?: ClientTask;
  onClick?: (task: ClientTask) => void;
  
  // Additional properties for TaskCard component
  title?: string;
  description?: string;
  icon?: ReactNode;
  isCompleted?: boolean;
  btnText?: string;
  designerNotes?: string | null;
  onButtonClick?: () => void;
  taskType?: string;
  status?: TaskStatus;
}

export interface WhatNextSectionProps {
  tasks?: ClientTask[];
  isComplete?: boolean;
}

export interface LoadingViewProps {
  message?: string;
}

export interface ClientLinkResult {
  success: boolean;
  linkId?: string;
  error?: string;
}
