
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMemory } from "@/contexts/ai/MemoryContext";
import { InteractionEventType } from "@/types/interactions";
import { TrackingService } from "@/services/tracking-service";
import { DeviceInfo } from "@/types/interactions";
import { batchService } from "@/services/analytics/batch-interaction-service";

/**
 * Hook for tracking user interactions
 */
export const useInteractionTracking = () => {
  const { user } = useAuth();
  const { storeInteractionMemory } = useMemory();
  
  /**
   * Track a user interaction event
   */
  const trackInteraction = useCallback((
    eventType: InteractionEventType,
    position: { x: number, y: number },
    elementSelector?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;
    
    try {
      // Track via tracking service
      TrackingService.trackInteraction(
        user.id,
        eventType,
        position,
        elementSelector,
        metadata
      );
      
      // Also store in AI memory for analysis
      storeInteractionMemory(
        eventType,
        elementSelector || 'unknown',
        position
      ).catch(error => {
        // Don't let memory errors prevent tracking
        console.error('Failed to store interaction in AI memory:', error);
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  }, [user, storeInteractionMemory]);

  /**
   * Track a click event
   */
  const trackClick = useCallback((
    event: MouseEvent,
    deviceInfo?: DeviceInfo
  ) => {
    if (!user) return;
    
    TrackingService.trackClick(user.id, event, { deviceInfo });
  }, [user]);

  /**
   * Track mouse movement (throttled)
   */
  const trackMouseMovement = useCallback((
    event: MouseEvent,
    deviceInfo?: DeviceInfo
  ) => {
    if (!user) return;
    
    // Implementation would include throttling logic
    // For now, just track the position
    trackInteraction('movement', {
      x: event.clientX,
      y: event.clientY
    }, undefined, { deviceInfo });
  }, [user, trackInteraction]);

  /**
   * Track scroll events
   */
  const trackScroll = useCallback((
    deviceInfo?: DeviceInfo
  ) => {
    if (!user) return;
    
    const scrollDepth = window.scrollY / 
      (document.documentElement.scrollHeight - window.innerHeight) * 100;
      
    trackInteraction('scroll', {
      x: 0,
      y: window.scrollY
    }, 'window', {
      deviceInfo,
      scrollDepth: Math.round(scrollDepth)
    });
  }, [user, trackInteraction]);

  /**
   * Batch send interactions
   */
  const batchInteractions = useCallback(() => {
    batchService.flushEvents();
  }, []);

  return {
    trackInteraction,
    trackClick,
    trackMouseMovement,
    trackScroll,
    batchInteractions
  };
};
