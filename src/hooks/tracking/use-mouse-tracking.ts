
import { useCallback, useRef } from "react";
import { useTrackInteraction } from "./use-track-interaction";
import { getElementSelector } from "@/utils/interaction-utils";
import { DeviceInfo } from "./use-device-detection";

/**
 * Hook for tracking mouse and click interactions
 */
export const useMouseTracking = () => {
  const { trackInteraction } = useTrackInteraction();
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  /**
   * Track mouse clicks with element information
   */
  const trackClick = useCallback((e: MouseEvent, deviceInfo?: DeviceInfo) => {
    const target = e.target as HTMLElement;
    const elementSelector = getElementSelector(target);
    
    trackInteraction('click', {
      x: e.clientX,
      y: e.clientY
    }, elementSelector, {
      deviceInfo
    });
  }, [trackInteraction]);
  
  /**
   * Track mouse movement (throttled)
   */
  const trackMouseMovement = useCallback((e: MouseEvent, deviceInfo?: DeviceInfo) => {
    // Skip if mouse hasn't moved significantly to reduce data
    const dx = Math.abs(e.clientX - lastMousePosition.current.x);
    const dy = Math.abs(e.clientY - lastMousePosition.current.y);
    
    if (dx < 50 && dy < 50) return;
    
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    
    const target = e.target as HTMLElement;
    const elementSelector = getElementSelector(target);
    
    trackInteraction('movement', {
      x: e.clientX,
      y: e.clientY
    }, elementSelector, {
      deviceInfo
    });
  }, [trackInteraction]);

  return {
    trackClick,
    trackMouseMovement
  };
};
