
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAIMemory } from "@/contexts/ai/hooks";
import { InteractionEventType } from "@/types/analytics";
import { getSessionId, createTrackingEvent } from "@/utils/interaction-utils";
import { batchService } from "@/services/analytics/batch-interaction-service";

/**
 * Core hook for tracking user interactions
 */
export const useTrackInteraction = () => {
  const { user } = useAuth();
  const { storeInteractionMemory } = useAIMemory();
  
  /**
   * Track a user interaction event (click, hover, etc.)
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
      await storeInteractionMemory(
        eventType,
        elementSelector || 'unknown',
        position
      );
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  }, [user, storeInteractionMemory]);

  return {
    trackInteraction
  };
};
