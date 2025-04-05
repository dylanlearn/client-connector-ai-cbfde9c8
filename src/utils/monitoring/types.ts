
/**
 * Types for system monitoring functionality
 */

export type SystemStatus = 'normal' | 'warning' | 'critical' | 'unknown';

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
  created_at?: string;
  updated_at?: string;
}

export interface SystemHealthCheck {
  component: string;
  status: SystemStatus;
  details?: Record<string, any>;
  last_checked: Date;
}
