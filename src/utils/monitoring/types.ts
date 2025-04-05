
/**
 * Types for system monitoring and observability
 */

export type SystemStatus = 'critical' | 'warning' | 'normal' | 'degraded';

export interface SystemMonitoringRecord {
  id?: string;
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
  event_type: string;
  created_at?: string;
}

export interface MonitoringConfiguration {
  id?: string;
  component: string;
  warning_threshold: number;
  critical_threshold: number;
  check_interval: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClientError {
  id?: string;
  error_message: string;
  error_stack?: string | null;
  component_name?: string | null;
  user_id?: string | null;
  browser_info?: string | null;
  url?: string | null;
  resolved?: boolean;
  resolution_notes?: string | null;
  timestamp?: string;
}
