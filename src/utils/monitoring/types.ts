
// Define types for tables not included in the generated types
export type SystemStatus = "normal" | "warning" | "critical";

export interface SystemMonitoringRecord {
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
  event_type?: string;
  created_at?: string;
  id?: string;
}

export interface MonitoringConfiguration {
  id: string;
  component: string;
  warning_threshold: number;
  critical_threshold: number;
  check_interval: number;
  enabled: boolean;
  notification_enabled: boolean;
}

export interface RateLimitCounter {
  id: string;
  key: string;
  endpoint: string;
  tokens: number;
  last_refill: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiUsageMetric {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  request_timestamp: string;
  user_id?: string;
  ip_address?: string;
  error_message?: string;
  request_payload?: any;
}

// Define the type for client errors table
export interface ClientError {
  id?: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
  user_id?: string;
  browser_info?: string;
  url?: string;
  timestamp?: string;
  resolved?: boolean;
  resolution_notes?: string;
}
