
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAIMemory } from "@/contexts/ai/hooks";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory } from "@/services/ai/memory";

/**
 * Hook for tracking user interactions for heatmaps and analytics
 */
export const useInteractionTracking = () => {
  const { user } = useAuth();
  const { storeInteractionMemory, storeMemory } = useAIMemory();
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
      // Use direct table insert instead of RPC
      const { error } = await supabase
        .from('interaction_events')
        .insert({
          user_id: user.id,
          event_type: eventType,
          page_url: window.location.pathname,
          x_position: position.x,
          y_position: position.y,
          element_selector: elementSelector || '',
          session_id: sessionId(),
          metadata: metadata || {}
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
    trackTonePreference
  };
};
