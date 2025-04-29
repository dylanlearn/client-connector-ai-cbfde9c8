
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

// Add missing types that were referenced in the error messages
export interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  timestamp?: string;
  element?: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  title: string;
  category: string;
  rank?: number;
  notes?: string;
  updated_at: string;
  created_at: string;
}

export interface DesignAnalytics {
  id: string;
  title: string;
  category: string;
  average_rank: number;
  selection_count: number;
  rank: number;
  percentage?: number;
}

export type InteractionEventType = 'click' | 'hover' | 'scroll' | 'view' | 'movement';

export interface AnalyticsData {
  id: string;
  user_id: string;
  data_type: string;
  value: any;
  timestamp: string;
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  userId?: string;
  limit?: number;
}

// Chart.js type definitions to match our Dataset interface
export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  type?: string;
}
