
export interface SupabaseHealthCheck {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  auth: {
    status: string;
    message: string;
  };
  database: {
    status: string;
    message: string;
    tables?: string[];
    performance?: any;
  };
  storage: {
    status: string;
    message: string;
  };
  functions: {
    status: string;
    message: string;
    availableFunctions?: string[];
  };
}

export interface SupabaseTable {
  name: string;
  row_count: number;
  size: string;
  last_vacuum: string | null;
  last_analyze: string | null;
}

export interface SupabaseAuditResult {
  project_id: string;
  project_name: string;
  region: string;
  health: SupabaseHealthCheck;
  database_size: string;
  storage_size: string;
  tables: SupabaseTable[];
  functions_count: number;
  storage_buckets: string[];
  timestamp: string;
}

// Add missing AuditLog type
export interface AuditLog {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address?: string;
  metadata?: Record<string, any>;
}

// Add missing SystemHealthCheck type
export interface SystemHealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'error';
  response_time_ms?: number;
  created_at: string;
  id?: string;
}

// Add missing SystemHealthStatus type
export interface SystemHealthStatus {
  component: string;
  latest_status: 'healthy' | 'degraded' | 'unhealthy' | 'error';
  last_checked: string;
  issues_last_24h: number;
  avg_response_time_1h?: number;
}

// Add missing SystemAlert type
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
