
/**
 * Analytics types for centralized usage across the application
 */

export interface AnalyticsData {
  id: string;
  user_id: string;
  category: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalInteractions: number;
  averageEngagement: number;
  topCategories: string[];
  recentActivity: AnalyticsData[];
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  userId?: string;
  limit?: number;
}

export interface InteractionEvent {
  id: string;
  user_id: string;
  event_type: InteractionEventType;
  page_url: string;
  element_selector: string;
  x_position: number;
  y_position: number;
  timestamp: string;
  session_id: string;
  metadata?: Record<string, any>;
  device_type?: string;
  viewport_width?: number;
  viewport_height?: number;
  scroll_depth?: number;
}

export type InteractionEventType = 'click' | 'hover' | 'scroll' | 'view' | 'movement';

// Add missing types that are being imported in other files
export interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  element?: string;
  timestamp?: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  design_option_id: string;
  title: string;
  category: string;
  rank?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignAnalytics {
  id: string;
  design_option_id: string;
  title: string;
  category: string;
  selection_count: number;
  average_rank: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}
