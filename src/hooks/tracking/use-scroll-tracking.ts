
import { useCallback, useRef } from "react";
import { useTrackInteraction } from "./use-track-interaction";

/**
 * Hook for tracking scroll events
 */
export const useScrollTracking = () => {
  const { trackInteraction } = useTrackInteraction();
  const lastScrollPosition = useRef<number>(0);
  
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

  return {
    trackScroll
  };
};
