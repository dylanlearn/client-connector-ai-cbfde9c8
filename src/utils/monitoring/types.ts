
// System status types
export type SystemStatus = 'normal' | 'warning' | 'critical' | 'error' | 'unknown';

// System monitoring record
export interface SystemMonitoringRecord {
  id?: string;
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
  event_type: 'status_update' | 'alert' | 'notification';
  created_at?: string;
}

// Monitoring configuration
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

// Client error types
export interface ClientError {
  id?: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
  user_id?: string;
  browser_info?: string;
  url?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
  resolved?: boolean;
  resolution_notes?: string;
}
