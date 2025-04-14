
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

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  components: Record<string, ComponentStatus>;
  lastUpdated: string;
  incidents?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
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

// Add ClientError type that was missing
export interface ClientError {
  id?: string;
  message: string;
  stackTrace?: string;
  componentName?: string;
  userId?: string;
  timestamp?: string;
  browser?: string;
  os?: string;
  resolved?: boolean;
  resolution_notes?: string;
  metadata?: Record<string, any>;
}

// Add SystemMonitoringRecord type that was missing
export interface SystemMonitoringRecord {
  id?: string;
  timestamp: string;
  component: string;
  metric: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  metadata?: Record<string, any>;
}
