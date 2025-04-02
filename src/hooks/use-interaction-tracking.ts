import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAIMemory } from "@/contexts/ai/hooks";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for tracking user interactions for heatmaps and analytics
 */
export const useInteractionTracking = () => {
  const { user } = useAuth();
  const { storeInteractionMemory } = useAIMemory();
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
    eventType: 'click' | 'hover' | 'scroll' | 'view',
    position: { x: number, y: number },
    elementSelector?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    try {
      // Use RPC function to track interaction
      const { error } = await supabase.rpc('track_interaction', {
        p_user_id: user.id,
        p_event_type: eventType,
        p_page_url: window.location.pathname,
        p_x_position: position.x,
        p_y_position: position.y,
        p_element_selector: elementSelector || '',
        p_session_id: sessionId(),
        p_metadata: metadata || {}
      });

      if (error) {
        console.error('Error tracking interaction:', error);
        return;
      }

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
   * Track a click event
   */
  const trackClick = useCallback((e: MouseEvent | React.MouseEvent) => {
    const elem = e.target as HTMLElement;
    const rect = elem.getBoundingClientRect();
    const selector = getElementSelector(elem);
    
    trackInteraction('click', {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    }, selector, {
      elementType: elem.tagName,
      innerText: elem.innerText?.substring(0, 100)
    });
  }, [trackInteraction]);

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
    trackClick
  };
};
