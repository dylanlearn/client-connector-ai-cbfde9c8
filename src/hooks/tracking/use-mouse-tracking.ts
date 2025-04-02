
import { useCallback, useRef } from "react";
import { useTrackInteraction } from "./use-track-interaction";

/**
 * Hook for tracking mouse movements and clicks
 */
export const useMouseTracking = () => {
  const { trackInteraction } = useTrackInteraction();
  const lastMousePosition = useRef<{ x: number, y: number } | null>(null);
  
  /**
   * Track a click event
   */
  const trackClick = useCallback((e: MouseEvent | React.MouseEvent, deviceInfo?: any) => {
    const elem = e.target as HTMLElement;
    const rect = elem.getBoundingClientRect();
    
    // Import dynamically to avoid circular dependencies
    const { getElementSelector } = require("@/utils/interaction-utils");
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

  return {
    trackClick,
    trackMouseMovement
  };
};
