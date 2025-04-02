
export type DesignAnalytics = {
  id: string;
  category: string;
  design_option_id: string;
  title: string;
  average_rank: number;
  selection_count: number;
  updated_at: string;
}

export type UserPreference = {
  id: string;
  user_id: string;
  category: string;
  design_option_id: string;
  title: string;
  rank: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type InteractionEvent = {
  id: string;
  user_id: string;
  event_type: 'click' | 'hover' | 'scroll' | 'view';
  page_url: string;
  element_selector: string;
  x_position: number;
  y_position: number;
  timestamp: string;
  session_id: string;
  metadata?: Record<string, any>;
}

export type HeatmapDataPoint = {
  x: number;
  y: number;
  value: number;
  element?: string;
}

export type ConversionEvent = {
  id: string;
  user_id: string;
  event_type: string;
  funnel_stage: string;
  page_url: string;
  timestamp: string;
  session_id: string;
  metadata?: Record<string, any>;
}

export type ABTestVariant = {
  id: string;
  test_id: string;
  name: string;
  description?: string;
  conversion_rate: number;
  visitors: number;
  conversions: number;
  is_control: boolean;
  is_winner?: boolean;
}

export type ABTest = {
  id: string;
  name: string;
  description?: string;
  status: 'running' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  confidence_level?: number;
  variants: ABTestVariant[];
}
