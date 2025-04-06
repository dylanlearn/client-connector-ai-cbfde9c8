
/**
 * Types for system monitoring functionality
 */

export type SystemStatus = 'normal' | 'warning' | 'critical' | 'error' | 'unknown';

export interface SystemMonitoringRecord {
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
  event_type: 'status_update' | 'alert' | 'info';
}

export interface MonitoringConfiguration {
  id: string;
  component: string;
  warning_threshold?: number;
  critical_threshold?: number;
  enabled: boolean;
  check_interval_seconds?: number;
  notification_channels?: string[];
  check_interval?: number;
  notification_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SystemHealthCheck {
  component: string;
  status: SystemStatus;
  details?: Record<string, any>;
  last_checked: Date;
}

export interface ApiUsageRecord {
  id: string;
  endpoint: string;
  response_time_ms: number;
  status_code: number;
  user_id?: string;
  request_timestamp: string;
  method: string;
  ip_address?: string;
  error_message?: string;
  request_payload?: Record<string, any>;
}

export interface ClientError {
  id?: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
  url?: string;
  user_id?: string;
  browser_info?: string;
  timestamp?: string;
  resolved?: boolean;
  resolution_notes?: string;
  metadata?: Record<string, any>;
}

export interface ApiUsageMetrics {
  total_requests: number;
  average_response_time: number;
  error_rate: number;
  success_rate: number;
  requests_by_endpoint: Record<string, number>;
  errors_by_type: Record<string, number>;
}
