
import { useEffect } from "react";
import { useInteractionTracking } from "@/hooks/use-interaction-tracking";
import { useAuth } from "@/hooks/use-auth";
import { useDeviceDetection } from "@/hooks/tracking/use-device-detection";

/**
 * Hidden component that tracks user interactions for analytics
 * This should be included in any page where you want to track
 * interactions for heatmaps and analysis
 */
const InteractionTracker = () => {
  const { user } = useAuth();
  const { 
    trackClick, 
    trackInteraction,
    batchInteractions,
    trackMouseMovement, 
    trackScroll
  } = useInteractionTracking();
  
  // Use our new device detection hook
  const deviceInfo = useDeviceDetection();
  
  // Track click events
  useEffect(() => {
    if (!user) return;
    
    const handleClick = (e: MouseEvent) => {
      trackClick(e, deviceInfo);
    };
    
    // Add global click handler
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [user, trackClick, deviceInfo]);
  
  // Track mouse movement (throttled)
  useEffect(() => {
    if (!user) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      trackMouseMovement(e, deviceInfo);
    };
    
    // Use a throttled event listener to reduce performance impact
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [user, trackMouseMovement, deviceInfo]);
  
  // Track scroll events (throttled)
  useEffect(() => {
    if (!user) return;
    
    const handleScroll = () => {
      trackScroll(deviceInfo);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, trackScroll, deviceInfo]);
  
  // Track page view on component mount
  useEffect(() => {
    if (!user) return;
    
    // Center of viewport
    const viewportCenter = {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2)
    };
    
    // Track page view event with device info
    trackInteraction('view', viewportCenter, 'document', {
      deviceInfo: deviceInfo
    });
    
  }, [user, trackInteraction, deviceInfo]);
  
  // Batch send interactions periodically
  useEffect(() => {
    if (!user) return;
    
    // Send collected data to server every 10 seconds
    const intervalId = setInterval(() => {
      batchInteractions();
    }, 10000);
    
    // Also send on page unload
    const handleUnload = () => {
      batchInteractions();
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleUnload);
      // Final batch send when component unmounts
      batchInteractions();
    };
  }, [user, batchInteractions]);
  
  return null; // This component doesn't render anything
};

export default InteractionTracker;
