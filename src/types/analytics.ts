
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
  event_type: 'click' | 'hover' | 'scroll' | 'view' | 'movement';
  page_url: string;
  element_selector: string;
  x_position: number;
  y_position: number;
  timestamp: string;
  session_id: string;
  metadata?: Record<string, any>;
  // Device information
  device_type?: string;
  viewport_width?: number;
  viewport_height?: number;
  scroll_depth?: number;
  // Future fields that would be populated when geographic tracking is implemented
  latitude?: number;
  longitude?: number;
  location_name?: string;
}

export type HeatmapDataPoint = {
  x: number;
  y: number;
  value: number;
  element?: string;
  elements?: string[];
  timestamp?: string;
  // Future properties for geographic visualization
  latitude?: number;
  longitude?: number;
  locationName?: string;
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

// Future type for geographic analytics
export type GeographicData = {
  location: string;
  latitude: number;
  longitude: number;
  userCount: number;
  interactionCount: number;
  conversionRate?: number;
}

// Session analytics data
export type SessionData = {
  id: string;
  user_id: string;
  session_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  page_views: number;
  interactions: number;
  device_type: string;
  browser: string;
  os: string;
  entry_page: string;
  exit_page?: string;
}

// Interaction timeline events
export type TimelineEvent = {
  timestamp: string;
  event_type: string;
  element: string;
  count: number;
  sessions: string[];
}

// Define a proper type for the interaction event types
export type InteractionEventType = 'click' | 'hover' | 'scroll' | 'view' | 'movement';

// Define DateRange to match the type expected by the DatePicker component
export interface DateRangeWithRequiredDates {
  from: Date;
  to: Date;
}
