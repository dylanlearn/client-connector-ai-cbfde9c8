
/**
 * Interaction-related types shared across the application
 */

// Interaction event types
export type InteractionEventType = 'click' | 'hover' | 'view' | 'scroll' | 'movement';

// Device detection information
export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser?: string;
  os?: string;
  isTouchDevice: boolean;
}

// Interaction tracking event
export interface InteractionEvent {
  id: string;
  user_id: string;
  event_type: InteractionEventType;
  page_url: string;
  x_position: number;
  y_position: number;
  element_selector?: string;
  session_id: string;
  metadata?: Record<string, any>;
  viewport_width?: number;
  viewport_height?: number;
  device_type?: string;
  scroll_depth?: number | null;
  timestamp: string;
}

// Interaction tracking options
export interface TrackingOptions {
  throttle?: boolean;
  throttleDelay?: number;
  includeMetadata?: boolean;
  trackPosition?: boolean;
}
