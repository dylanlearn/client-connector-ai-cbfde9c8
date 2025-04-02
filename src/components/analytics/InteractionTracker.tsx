
import { useEffect } from "react";
import { useInteractionTracking } from "@/hooks/use-interaction-tracking";
import { useAuth } from "@/hooks/use-auth";

/**
 * Hidden component that tracks user interactions for analytics
 * This should be included in any page where you want to track
 * interactions for heatmaps and analysis
 */
const InteractionTracker = () => {
  const { user } = useAuth();
  const { trackClick, trackInteraction } = useInteractionTracking();
  
  // Track click events
  useEffect(() => {
    if (!user) return;
    
    const handleClick = (e: MouseEvent) => {
      trackClick(e);
    };
    
    // Add global click handler
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [user, trackClick]);
  
  // Track page view on component mount
  useEffect(() => {
    if (!user) return;
    
    // Center of viewport
    const viewportCenter = {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2)
    };
    
    // Track page view event
    trackInteraction('view', viewportCenter, 'document');
    
    // Track periodic scroll events (throttled)
    let lastScrollY = window.scrollY;
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        // Only track if scroll position changed significantly
        if (Math.abs(window.scrollY - lastScrollY) > 100) {
          trackInteraction('scroll', {
            x: Math.round(window.innerWidth / 2),
            y: Math.round(window.scrollY + (window.innerHeight / 2))
          }, 'window');
          
          lastScrollY = window.scrollY;
        }
      }, 500) as unknown as number;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [user, trackInteraction]);
  
  return null; // This component doesn't render anything
};

export default InteractionTracker;
