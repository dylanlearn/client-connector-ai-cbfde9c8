
import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAIMemory } from "@/contexts/ai/hooks";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory } from "@/services/ai/memory";
import { toast } from "sonner";
import { InteractionEvent } from "@/types/analytics";

/**
 * Hook for tracking user interactions for heatmaps and analytics
 */
export const useInteractionTracking = () => {
  const { user } = useAuth();
  const { storeInteractionMemory, storeMemory } = useAIMemory();
  const batchedEvents = useRef<any[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const lastMousePosition = useRef<{ x: number, y: number } | null>(null);
  const lastScrollPosition = useRef<number>(0);
  
  // Generate a consistent session ID for the current browser session
  const sessionId = useCallback(() => {
    // Get or create a session ID stored in sessionStorage
    let id = sessionStorage.getItem('analytics_session_id');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('analytics_session_id', id);
    }
    return id;
  }, []);

  /**
   * Track a user interaction event (click, hover, etc.)
   */
  const trackInteraction = useCallback(async (
    eventType: 'click' | 'hover' | 'scroll' | 'view' | 'movement',
    position: { x: number, y: number },
    elementSelector?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    try {
      const event = {
        user_id: user.id,
        event_type: eventType,
        page_url: window.location.pathname,
        x_position: position.x,
        y_position: position.y,
        element_selector: elementSelector || '',
        session_id: sessionId(),
        metadata: metadata || {},
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        device_type: metadata?.deviceInfo?.deviceType || 'unknown',
        scroll_depth: metadata?.scrollDepth || null
      };
      
      // Add to batch instead of sending immediately
      batchedEvents.current.push(event);
      
      // Also store in AI memory for analysis
      await storeInteractionMemory(
        eventType,
        elementSelector || 'unknown',
        position
      );
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  }, [user, storeInteractionMemory, sessionId]);

  /**
   * Send batched events to the server
   */
  const batchInteractions = useCallback(async () => {
    if (isProcessingBatch || !user || batchedEvents.current.length === 0) return;
    
    try {
      setIsProcessingBatch(true);
      
      const eventsToSend = [...batchedEvents.current];
      batchedEvents.current = [];
      
      const { error } = await supabase.rpc(
        'batch_insert_interaction_events', 
        { p_events: eventsToSend }
      );
      
      if (error) {
        console.error('Error batch inserting events:', error);
        // Put events back in the queue
        batchedEvents.current = [...eventsToSend, ...batchedEvents.current];
      } else {
        console.log(`Successfully sent ${eventsToSend.length} interaction events`);
      }
    } catch (err) {
      console.error('Failed to batch send interactions:', err);
    } finally {
      setIsProcessingBatch(false);
    }
  }, [user, isProcessingBatch]);

  /**
   * Track a click event
   */
  const trackClick = useCallback((e: MouseEvent | React.MouseEvent, deviceInfo?: any) => {
    const elem = e.target as HTMLElement;
    const rect = elem.getBoundingClientRect();
    const selector = getElementSelector(elem);
    
    trackInteraction('click', {
      x: Math.round(e.clientX),
      y: Math.round(e.clientY)
    }, selector, {
      elementType: elem.tagName,
      innerText: elem.innerText?.substring(0, 100),
      relativeX: Math.round(e.clientX - rect.left),
      relativeY: Math.round(e.clientY - rect.top),
      deviceInfo
    });
  }, [trackInteraction]);

  /**
   * Track mouse movement (throttled)
   */
  const trackMouseMovement = useCallback((e: MouseEvent, deviceInfo?: any) => {
    // Only track if mouse has moved significantly (at least 50 pixels)
    if (lastMousePosition.current) {
      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 50) return;
    }
    
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    
    trackInteraction('movement', {
      x: Math.round(e.clientX),
      y: Math.round(e.clientY)
    }, document.elementFromPoint(e.clientX, e.clientY)?.tagName || 'unknown', {
      deviceInfo
    });
  }, [trackInteraction]);

  /**
   * Track scroll events (throttled)
   */
  const trackScroll = useCallback((deviceInfo?: any) => {
    // Only track if scroll position changed significantly
    const currentScroll = window.scrollY;
    const scrollDifference = Math.abs(currentScroll - lastScrollPosition.current);
    
    if (scrollDifference < 100) return;
    
    lastScrollPosition.current = currentScroll;
    
    const scrollDepth = Math.round((currentScroll / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    trackInteraction('scroll', {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(currentScroll + (window.innerHeight / 2))
    }, 'window', {
      scrollDepth,
      deviceInfo
    });
  }, [trackInteraction]);

  /**
   * Track tone preferences based on user interactions with text content
   */
  const trackTonePreference = useCallback((
    content: string,
    rating: number,
    context?: string
  ) => {
    if (!user) return;
    
    // Store tone preference in memory
    storeMemory(
      content,
      MemoryCategory.TonePreference,
      undefined,
      {
        rating,
        context,
        timestamp: new Date().toISOString()
      }
    );
    
    console.log('Tone preference tracked:', { content, rating, context });
  }, [user, storeMemory]);

  /**
   * Get a simple CSS selector for an element
   */
  const getElementSelector = (element: HTMLElement): string => {
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

  return {
    trackInteraction,
    trackClick,
    trackMouseMovement,
    trackScroll,
    trackTonePreference,
    batchInteractions
  };
};
