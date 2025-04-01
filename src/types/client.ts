
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
