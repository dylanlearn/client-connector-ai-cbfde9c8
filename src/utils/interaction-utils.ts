
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
  try {
    // Get or create a session ID stored in sessionStorage
    let id = sessionStorage.getItem('analytics_session_id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('analytics_session_id', id);
    }
    return id;
  } catch (error) {
    // Fallback in case sessionStorage is unavailable
    console.warn('Error accessing sessionStorage:', error);
    return crypto.randomUUID();
  }
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
  if (!userId || !eventType) {
    throw new Error('Missing required tracking parameters');
  }
  
  // Validate position data
  if (typeof position.x !== 'number' || typeof position.y !== 'number') {
    position = {
      x: typeof position.x === 'number' ? position.x : 0,
      y: typeof position.y === 'number' ? position.y : 0
    };
  }
  
  // Extract deviceInfo from metadata if it exists
  const deviceInfo: DeviceInfo | undefined = metadata?.deviceInfo;

  // Generate an ID for this event to help with retries
  const eventId = crypto.randomUUID();

  return {
    id: eventId,
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
    scroll_depth: metadata?.scrollDepth || null,
    timestamp: new Date().toISOString()
  };
};

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};
