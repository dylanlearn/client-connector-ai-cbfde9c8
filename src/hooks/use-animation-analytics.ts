
import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceDetection } from "@/hooks/tracking/use-device-detection";
import { 
  AnimationCategory, 
  AnimationFeedback, 
  AnimationPerformanceMetrics 
} from "@/types/animations";
import { animationAnalyticsService, trackAnimationView } from "@/services/analytics/animation-analytics-service";

export function useAnimationAnalytics() {
  const deviceInfo = useDeviceDetection();
  // Add a ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Clean up analytics service on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      animationAnalyticsService.cleanup();
    };
  }, []);
  
  // Track an animation view/interaction
  const trackAnimation = useCallback(async (
    animationType: AnimationCategory,
    metrics?: AnimationPerformanceMetrics,
    feedback?: AnimationFeedback
  ) => {
    try {
      // Only track if component is still mounted
      if (isMounted.current) {
        // Use the service function instead of direct API call
        trackAnimationView(
          animationType,
          metrics,
          {
            deviceType: deviceInfo.deviceType || 'unknown',
            browser: deviceInfo.browserName || 'unknown',
            os: deviceInfo.osName || 'unknown',
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          },
          feedback as 'positive' | 'negative'
        );
      }
    } catch (err) {
      console.error('Error tracking animation:', err);
    }
  }, [deviceInfo]);
  
  // Record animation start time for performance tracking
  const startAnimationTracking = useCallback(() => {
    return {
      startTime: performance.now(),
      fps: [] as number[]
    };
  }, []);
  
  // Complete animation tracking and record analytics
  const completeAnimationTracking = useCallback(async (
    animationType: AnimationCategory,
    trackingData: { startTime: number; fps: number[] },
    feedback?: AnimationFeedback
  ) => {
    if (!isMounted.current) return;
    
    const endTime = performance.now();
    const duration = endTime - trackingData.startTime;
    
    // Calculate average FPS if available
    let avgFps;
    if (trackingData.fps.length > 0) {
      avgFps = trackingData.fps.reduce((sum, fps) => sum + fps, 0) / trackingData.fps.length;
    }
    
    const metrics: AnimationPerformanceMetrics = {
      startTime: trackingData.startTime,
      endTime,
      duration,
      fps: avgFps
    };
    
    await trackAnimation(animationType, metrics, feedback);
    
    return metrics;
  }, [trackAnimation]);
  
  // Get a function to measure FPS
  const measureFps = useCallback(() => {
    let lastCalledTime: number | null = null;
    let fps: number[] = [];
    
    return () => {
      if (!lastCalledTime) {
        lastCalledTime = performance.now();
        return 0;
      }
      
      const delta = (performance.now() - lastCalledTime) / 1000;
      lastCalledTime = performance.now();
      const currentFps = 1 / delta;
      
      // Only record reasonable FPS values (between 1 and 120)
      if (currentFps > 0 && currentFps < 120) {
        fps.push(currentFps);
      }
      
      return fps;
    };
  }, []);

  return {
    trackAnimation,
    startAnimationTracking,
    completeAnimationTracking,
    measureFps
  };
}
