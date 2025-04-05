
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
}

export interface ClientOverview {
  totalClients: number;
  activeClients: number;
  completionRate: number;
}
