
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDeviceDetection } from "@/hooks/tracking/use-device-detection";
import { 
  AnimationCategory, 
  AnimationFeedback, 
  AnimationPerformanceMetrics 
} from "@/types/animations";

export function useAnimationAnalytics() {
  const deviceInfo = useDeviceDetection();
  
  // Track an animation view/interaction
  const trackAnimation = useCallback(async (
    animationType: AnimationCategory,
    metrics?: AnimationPerformanceMetrics,
    feedback?: AnimationFeedback
  ) => {
    try {
      const { error } = await supabase.rpc(
        'record_animation_interaction',
        {
          p_animation_type: animationType,
          p_duration: metrics?.duration,
          p_device_info: {
            deviceType: deviceInfo.deviceType,
            browser: deviceInfo.browserName,
            os: deviceInfo.osName,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          },
          p_performance_metrics: metrics || {},
          p_feedback: feedback
        }
      );
      
      if (error) {
        console.error('Error tracking animation:', error);
      }
    } catch (err) {
      console.error('Error in trackAnimation:', err);
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
      
      // Only record reasonable FPS values 
      if (currentFps < 120) {
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
