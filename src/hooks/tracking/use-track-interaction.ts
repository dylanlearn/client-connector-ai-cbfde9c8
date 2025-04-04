
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMemory } from "@/contexts/ai/MemoryContext";
import { InteractionEventType } from "@/types/analytics";
import { getSessionId, createTrackingEvent, getElementSelector } from "@/utils/interaction-utils";
import { batchService } from "@/services/analytics/batch-interaction-service";

/**
 * Hook for tracking user interactions
 */
export const useTrackInteraction = () => {
  const { user } = useAuth();
  const { storeInteractionMemory } = useMemory();
  
  /**
   * Track a user interaction event (click, hover, scroll, view, movement)
   */
  const trackInteraction = useCallback(async (
    eventType: InteractionEventType,
    position: { x: number, y: number },
    elementSelector?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    try {
      const sessionId = getSessionId();
      const event = createTrackingEvent(
        user.id,
        eventType,
        position,
        sessionId,
        elementSelector,
        metadata
      );
      
      // Add to batch instead of sending immediately
      batchService.addEvent(event);
      
      // Also store in AI memory for analysis
      try {
        await storeInteractionMemory(
          eventType,
          elementSelector || 'unknown',
          position
        );
      } catch (memoryError) {
        // Don't let memory errors prevent tracking
        console.error('Failed to store interaction in AI memory:', memoryError);
      }
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  }, [user, storeInteractionMemory]);

  /**
   * Track an element interaction by passing the DOM element directly
   */
  const trackElementInteraction = useCallback((
    eventType: InteractionEventType,
    element: HTMLElement,
    position: { x: number, y: number },
    metadata?: Record<string, any>
  ) => {
    if (!element) return;
    
    const selector = getElementSelector(element);
    
    // Get element text content as additional context
    let textContent = element.textContent?.trim() || '';
    if (textContent.length > 50) {
      textContent = textContent.substring(0, 50) + '...';
    }
    
    // Add element metadata
    const enhancedMetadata = {
      ...metadata,
      textContent,
      tagName: element.tagName.toLowerCase(),
      className: element.className
    };
    
    trackInteraction(eventType, position, selector, enhancedMetadata);
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackElementInteraction
  };
};
