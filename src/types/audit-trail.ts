
export interface AuditLog {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  ip_address?: string | null;
  created_at: string;
  metadata?: Record<string, any> | null;
}

export interface SystemAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  component: string;
  is_resolved: boolean;
  resolved_at?: string | null;
  resolved_by?: string | null;
  resolution_notes?: string | null;
  created_at: string;
}

export interface AuditLogFilter {
  start_date?: Date;
  end_date?: Date;
  user_id?: string;
  resource_type?: string;
  action?: string;
  limit?: number;
  offset?: number;
}
