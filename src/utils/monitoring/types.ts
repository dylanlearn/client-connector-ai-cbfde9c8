
export interface MonitoringConfiguration {
  enabled: boolean;
  errorThreshold: number;
  warnThreshold: number;
  notificationsEnabled: boolean;
  checkInterval: number;
  [key: string]: string | number | boolean;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  components: Record<string, ComponentStatus>;
  lastUpdated: string;
}

export interface ComponentStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  metrics: Record<string, number | string | boolean>;
  lastUpdated: string;
}

export interface MonitoringAlert {
  id: string;
  component: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  acknowledged: boolean;
  metadata?: Record<string, any>;
}
