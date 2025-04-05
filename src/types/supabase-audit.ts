
export interface SupabaseHealthCheck {
  auth: {
    status: 'ok' | 'error';
    message: string;
  };
  database: {
    status: 'ok' | 'error';
    message: string;
    tables: string[];
    performance?: any;
  };
  storage: {
    status: 'ok' | 'error';
    message: string;
    buckets?: string[];
  };
  functions: {
    status: 'ok' | 'error' | 'degraded';
    message: string;
    availableFunctions: string[];
  };
  overall: 'healthy' | 'degraded' | 'unhealthy';
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: any;
  ip_address?: string;
  created_at: string;
  user_email?: string;
}

export interface SystemHealthStatus {
  component: string;
  latest_status: 'healthy' | 'degraded' | 'unhealthy' | 'error';
  last_checked: string;
  issues_last_24h: number;
  avg_response_time_1h: number;
}

export interface SystemAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  component: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface SystemHealthCheck {
  id: string;
  component: string;
  status: string;
  response_time_ms?: number;
  details?: any;
  created_at: string;
}
