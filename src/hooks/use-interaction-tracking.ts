
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMouseTracking } from "./tracking/use-mouse-tracking";
import { useScrollTracking } from "./tracking/use-scroll-tracking";
import { useToneTracking } from "./tracking/use-tone-tracking";
import { useTrackInteraction } from "./tracking/use-track-interaction";
import { batchService } from "@/services/analytics/batch-interaction-service";

/**
 * Hook for tracking user interactions for heatmaps and analytics
 */
export const useInteractionTracking = () => {
  const { user } = useAuth();
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  
  // Import tracking functionality from specialized hooks
  const { trackInteraction } = useTrackInteraction();
  const { trackClick, trackMouseMovement } = useMouseTracking();
  const { trackScroll } = useScrollTracking();
  const { trackTonePreference } = useToneTracking();

  /**
   * Send batched events to the server
   */
  const batchInteractions = useCallback(async () => {
    if (isProcessingBatch || !user) return;
    
    try {
      setIsProcessingBatch(true);
      await batchService.sendBatch(user.id);
    } finally {
      setIsProcessingBatch(false);
    }
  }, [user, isProcessingBatch]);

  return {
    trackInteraction,
    trackClick,
    trackMouseMovement,
    trackScroll,
    trackTonePreference,
    batchInteractions
  };
};
