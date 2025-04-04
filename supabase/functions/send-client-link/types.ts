
export interface ClientLinkParams {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectId: string;
  designerId: string;
  personalMessage?: string;
  expiresInDays?: number;
}

export interface ClientLinkResponse {
  success: boolean;
  linkId?: string;
  linkUrl?: string;
  error?: string;
}

export interface DeliveryResult {
  success: boolean;
  deliveryId?: string;
  error?: string;
}

export interface ClientTaskParams {
  linkId: string;
  taskType: string;
  designerNotes?: string;
}

export interface ClientTaskResponse {
  success: boolean;
  taskId?: string;
  error?: string;
}
