
/**
 * Types related to user interactions and tracking
 */

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browserName: string;
  osName: string;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
}

export interface TrackingOptions {
  captureClicks?: boolean;
  captureHovers?: boolean;
  captureScroll?: boolean;
  captureViews?: boolean;
  sessionId?: string;
  anonymizeData?: boolean;
}

export type InteractionEventType = 'click' | 'hover' | 'scroll' | 'view' | 'movement';

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
