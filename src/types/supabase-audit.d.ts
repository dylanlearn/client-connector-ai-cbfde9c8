
/**
 * Types for Supabase audit functionality
 */

export type HealthStatus = 'ok' | 'error' | 'warning';
export type OverallHealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface AuthServiceHealth {
  status: HealthStatus;
  message: string;
}

export interface DatabaseServiceHealth {
  status: HealthStatus;
  message: string;
  tables: string[];
  performance?: any;
}

export interface StorageServiceHealth {
  status: HealthStatus;
  message: string;
  buckets?: string[];
}

export interface FunctionsServiceHealth {
  status: HealthStatus | 'degraded';
  message: string;
  availableFunctions: string[];
}

export interface SupabaseHealthCheck {
  auth: AuthServiceHealth;
  database: DatabaseServiceHealth;
  storage: StorageServiceHealth;
  functions: FunctionsServiceHealth;
  overall: OverallHealthStatus;
}
