
// Monitoring types

export interface ComponentStatus {
  status: 'healthy' | 'warning' | 'critical' | 'error' | 'degraded' | 'unhealthy' | 'unknown';
  metrics: Record<string, number | string>;
  lastUpdated: string;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'error' | 'degraded' | 'unhealthy' | 'unknown';
  components: Record<string, ComponentStatus>;
  lastUpdated: string;
  incidents?: SystemIncident[];
}

export interface SystemIncident {
  id: string;
  component: string;
  status: 'active' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SystemMonitoringRecord {
  timestamp: string;
  component: string;
  metric: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
}

export interface AlertConfiguration {
  component: string;
  metric: string;
  warningThreshold: number;
  criticalThreshold: number;
  enabled: boolean;
}

// Interface for client error recording
export interface ClientError {
  id?: string;
  message: string;
  stackTrace?: string;
  error_message?: string;
  error_stack?: string;
  componentName?: string;
  component_name?: string;
  userId?: string;
  user_id?: string;
  browser?: string;
  browser_info?: string;
  url?: string;
  timestamp?: string;
  resolved?: boolean;
  resolution_notes?: string;
  metadata?: Record<string, any>;
}

export interface MonitoringConfiguration {
  enabled: boolean;
  errorThreshold: number;
  warnThreshold: number;
  notificationsEnabled: boolean;
  checkInterval: number;
  alertChannels?: string[];
  enabledComponents?: { [key: string]: boolean };
  [key: string]: string | number | boolean | string[] | { [key: string]: boolean } | undefined;
}
