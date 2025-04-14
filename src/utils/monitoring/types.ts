
/**
 * Types for monitoring and observability system
 */

/**
 * Interface for client error records
 */
export interface ClientError {
  id?: string;
  error_message: string;
  component_name?: string;
  error_stack?: string;
  browser_info?: string;
  url?: string;
  user_id?: string;
  session_id?: string;
  timestamp?: string;
  resolved?: boolean;
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for API usage metrics
 */
export interface APIUsageMetric {
  id?: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  user_id?: string;
  timestamp: string;
  request_size?: number;
  response_size?: number;
  client_info?: string;
}

/**
 * Interface for system performance metrics
 */
export interface SystemPerformanceMetric {
  id?: string;
  metric_name: string;
  metric_value: number;
  component: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

/**
 * Interface for monitoring alerting configuration
 */
export interface MonitoringAlertConfig {
  id?: string;
  component: string;
  metric: string;
  warning_threshold: number;
  critical_threshold: number;
  notification_channel: string;
  enabled: boolean;
  cooldown_period: number;
}

/**
 * Interface for monitoring configuration
 */
export interface MonitoringConfiguration {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  samplingRate: number;
  alertChannels: string[];
  retentionPeriod: number;
  components: Record<string, boolean>;
}

/**
 * Interface for system monitoring record
 */
export interface SystemMonitoringRecord {
  id?: string;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  active_connections: number;
  response_times: Record<string, number>;
  error_count: number;
  warning_count: number;
}

/**
 * Interface for system status
 */
export interface SystemStatus {
  status: 'operational' | 'degraded' | 'outage';
  components: Record<string, 'operational' | 'degraded' | 'outage'>;
  lastUpdated: string;
  incidents: Array<{
    id: string;
    title: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Type for AI Analysis object
 */
export interface AIAnalysis {
  patterns: Array<{
    type: string;
    description: string;
    confidence: number;
    examples?: string[];
  }>;
  insights: Array<{
    category: string;
    description: string;
    importance: number;
  }>;
  contradictions: Array<{
    description: string;
    conflictingItems: string[];
    resolution?: string;
  }>;
  anomalies: Array<{
    description: string;
    level: 'low' | 'medium' | 'high';
    context?: string;
  }>;
  summary?: string;
}
