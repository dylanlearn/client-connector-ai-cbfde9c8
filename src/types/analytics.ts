
export interface AnalyticsDashboard {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  layout: any[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  is_default: boolean;
  is_template: boolean;
}

export interface AnalyticsWidget {
  id: string;
  dashboard_id: string;
  widget_type: string;
  title: string;
  configuration: Record<string, any>;
  position_data: {
    x: number;
    y: number;
    z?: number;
  };
  size_data: {
    width: number;
    height: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductivityMetric {
  id: string;
  user_id?: string;
  team_id?: string;
  project_id?: string;
  metric_type: string;
  metric_value: number;
  time_period: string;
  recorded_at: string;
  notes?: string;
}

export interface ResourceUtilization {
  id: string;
  resource_type: string;
  resource_id: string;
  utilization_percentage: number;
  recorded_at: string;
  project_id?: string;
  team_id?: string;
  workspace_id: string;
  details?: Record<string, any>;
}

export interface MetricsSummary {
  total: number;
  average: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}
