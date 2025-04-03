import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { DeviceInfo } from './tracking/use-device-detection';

// Define the interaction event structure
interface InteractionEvent {
  user_id: string;
  event_type: string;
  page_url: string;
  x_position: number;
  y_position: number;
  element_selector?: string;
  session_id: string;
  metadata?: Record<string, any>;
  viewport_width?: number;
  viewport_height?: number;
  device_type?: string;
  scroll_depth?: number;
}

// Use a throttle function to limit event frequency
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean = false;
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

export function useInteractionTracking() {
  const { user } = useAuth();
  const [events, setEvents] = useState<InteractionEvent[]>([]);
  const sessionId = useRef<string>(Math.random().toString(36).substring(2, 15));
  
  // Track an interaction
  const trackInteraction = useCallback((
    eventType: string, 
    position: { x: number, y: number }, 
    elementSelector?: string,
    additionalData?: Record<string, any>
  ) => {
    if (!user) return;
    
    const newEvent: InteractionEvent = {
      user_id: user.id,
      event_type: eventType,
      page_url: window.location.href,
      x_position: position.x,
      y_position: position.y,
      element_selector: elementSelector,
      session_id: sessionId.current,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      metadata: additionalData
    };
    
    setEvents(prev => [...prev, newEvent]);
  }, [user]);
  
  // Track click events
  const trackClick = useCallback((e: MouseEvent, deviceInfo: DeviceInfo) => {
    if (!user) return;
    
    // Get the target element
    const target = e.target as HTMLElement;
    
    // Try to get a meaningful selector for the element
    let selector = '';
    
    if (target.id) {
      selector = `#${target.id}`;
    } else if (target.className && typeof target.className === 'string') {
      // Create a class selector with the first class only to keep it cleaner
      const classNames = target.className.split(' ').filter(c => c.length > 0);
      if (classNames.length > 0) {
        selector = `.${classNames[0]}`;
      }
    } else {
      // Fallback to tag name
      selector = target.tagName.toLowerCase();
    }
    
    // Get the element's text content as additional context
    let textContent = target.textContent?.trim() || '';
    if (textContent.length > 50) {
      textContent = textContent.substring(0, 50) + '...';
    }
    
    trackInteraction('click', {
      x: e.pageX,
      y: e.pageY
    }, selector, {
      textContent,
      deviceInfo
    });
  }, [user, trackInteraction]);
  
  // Track mouse movement (throttled)
  const trackMouseMovement = throttle((e: MouseEvent, deviceInfo: DeviceInfo) => {
    if (!user) return;
    
    trackInteraction('move', {
      x: e.pageX,
      y: e.pageY
    }, undefined, { deviceInfo });
  }, 1000); // Only track once per second
  
  // Track scroll events (throttled)
  const trackScroll = throttle((deviceInfo: DeviceInfo) => {
    if (!user) return;
    
    // Calculate scroll position as percentage
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    // Track at the center of the viewport
    trackInteraction('scroll', {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2 + scrollTop)
    }, 'document', {
      scrollDepth: Math.round(scrollPercentage),
      deviceInfo
    });
  }, 1000); // Only track once per second
  
  // Batch send events to the server
  const batchInteractions = useCallback(async () => {
    if (events.length === 0 || !user) return;
    
    try {
      const { error } = await supabase.functions.invoke('interaction-db-functions', {
        body: { 
          action: 'batch_insert',
          events: events
        }
      });
      
      if (error) {
        console.error('Error sending tracking data:', error);
        return;
      }
      
      // Clear the sent events
      setEvents([]);
    } catch (error) {
      console.error('Error sending tracking data:', error);
    }
  }, [events, user]);
  
  return {
    trackInteraction,
    trackClick,
    trackMouseMovement,
    trackScroll,
    batchInteractions,
    events
  };
}
