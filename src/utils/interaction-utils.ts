
import { InteractionEventType } from "@/types/analytics";
import { DeviceInfo } from "@/hooks/tracking/use-device-detection";

/**
 * Get a simple CSS selector for an element
 */
export const getElementSelector = (element: HTMLElement): string => {
  if (!element) return '';
  
  let selector = element.tagName.toLowerCase();
  
  if (element.id) {
    selector += `#${element.id}`;
  } else if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/);
    if (classes.length > 0) {
      selector += `.${classes[0]}`;
    }
  }
  
  return selector;
};

/**
 * Create a consistent session ID for tracking
 */
export const getSessionId = (): string => {
  // Get or create a session ID stored in sessionStorage
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
};

/**
 * Creates a tracking event object
 */
export const createTrackingEvent = (
  userId: string,
  eventType: InteractionEventType,
  position: { x: number, y: number },
  sessionId: string,
  elementSelector?: string,
  metadata?: Record<string, any>
) => {
  // Extract deviceInfo from metadata if it exists
  const deviceInfo: DeviceInfo | undefined = metadata?.deviceInfo;

  return {
    user_id: userId,
    event_type: eventType,
    page_url: window.location.pathname,
    x_position: position.x,
    y_position: position.y,
    element_selector: elementSelector || '',
    session_id: sessionId,
    metadata: metadata || {},
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_type: deviceInfo?.deviceType || 'unknown',
    scroll_depth: metadata?.scrollDepth || null
  };
};
