
/**
 * Types related to system monitoring
 */

export type SystemStatus = 'normal' | 'warning' | 'critical' | 'unknown';

export interface SystemMonitoringRecord {
  component: string;
  status: SystemStatus;
  value?: number;
  threshold?: number;
  message?: string;
  metadata?: Record<string, any>;
  event_type: 'status_update' | 'health_check' | 'alert';
}

export interface MonitoringConfiguration {
  id: string;
  component: string;
  warning_threshold: number;
  critical_threshold: number;
  check_interval: number; // in seconds
  enabled: boolean;
  notification_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseStatistics {
  timestamp: string;
  table_stats: Array<{
    table: string;
    dead_row_ratio: number;
    total_rows: number;
    dead_rows: number;
    last_vacuum: string | null;
  }>;
  high_vacuum_tables?: string[];
}

export interface MonitoringRecord {
  id: string;
  component: string;
  status: SystemStatus;
  value?: number;
  timestamp: string;
  message?: string;
}

