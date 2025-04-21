
// Monitoring types

export interface ComponentStatus {
  status: 'healthy' | 'warning' | 'critical' | 'error' | 'degraded' | 'unhealthy' | 'unknown';
  metrics: Record<string, number | string>;
  lastUpdated: string;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
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
