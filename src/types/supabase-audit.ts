
export interface SupabaseHealthCheck {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  auth: {
    status: string;
    message: string;
  };
  database: {
    status: string;
    message: string;
  };
  storage: {
    status: string;
    message: string;
  };
  functions: {
    status: string;
    message: string;
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
