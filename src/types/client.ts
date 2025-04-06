
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
}

// Client access link interface
export interface ClientAccessLink {
  id: string;
  linkId: string;
  name: string;
  email: string;
  token: string;
  created_at: string;
  expires_at?: string;
  project_id?: string;
  status: 'active' | 'expired' | 'used';
}

// Component props interfaces
export interface TaskCardProps {
  task: ClientTask;
  onClick?: (task: ClientTask) => void;
}

export interface WhatNextSectionProps {
  tasks: ClientTask[];
}

export interface LoadingViewProps {
  message?: string;
}

export interface ClientLinkResult {
  success: boolean;
  linkId?: string;
  error?: string;
}
