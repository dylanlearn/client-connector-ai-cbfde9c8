
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
