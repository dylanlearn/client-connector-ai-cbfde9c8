
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
  check_interval_seconds?: number; // Added for backward compatibility
  enabled: boolean;
  notification_enabled?: boolean; // Added missing field
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

// API Usage Record type
export interface ApiUsageRecord {
  id?: string;
  endpoint: string;
  method: string;
  user_id?: string;
  status_code: number;
  response_time_ms: number;
  request_timestamp: string;
  ip_address?: string;
  request_payload?: Record<string, any>;
  error_message?: string;
}
