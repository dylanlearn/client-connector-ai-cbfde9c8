
// System status types
export interface SystemStatus {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance' | 'unknown';
  components: Record<string, 'operational' | 'degraded' | 'outage' | 'maintenance'>;
  lastUpdated: string;
  incidents: SystemIncident[];
}

export interface SystemIncident {
  id: string;
  title: string;
  description?: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  updatedAt: string;
  componentId?: string;
}

export interface SystemMonitoringRecord {
  timestamp: string;
  response_time: number;
  cpu_usage: number;
  memory_usage: number;
  status_code?: number;
  error_count?: number;
}

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
  metadata?: Record<string, any>;
  resolved?: boolean;
  resolution_notes?: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface MonitoringConfiguration {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  samplingRate: number;
  persistLogs: boolean;
  errorReporting: boolean;
  [key: string]: string | number | boolean;
}
