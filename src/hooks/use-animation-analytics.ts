
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { AnimationFeedback, AnimationPerformanceMetrics } from "@/types/animations";

/**
 * Hook for tracking animation usage and performance
 */
export const useAnimationAnalytics = () => {
  const { user } = useAuth();

  /**
   * Start tracking animation metrics
   */
  const startAnimationTracking = useCallback(() => {
    const startTime = Date.now();
    const fps: number[] = [];
    
    // Simple FPS monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    const trackFrame = () => {
      frameCount++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        // Record FPS once per second
        const currentFps = Math.round(frameCount * 1000 / (now - lastTime));
        fps.push(currentFps);
        frameCount = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(trackFrame);
    };
    
    requestAnimationFrame(trackFrame);
    
    return {
      startTime,
      fps
    };
  }, []);

  /**
   * Complete animation tracking and record metrics
   */
  const completeAnimationTracking = useCallback((
    animationType: string,
    trackingData: { startTime: number; fps: number[] }
  ) => {
    const endTime = Date.now();
    const duration = endTime - trackingData.startTime;
    
    // Calculate average FPS 
    const avgFps = trackingData.fps.length > 0 
      ? trackingData.fps.reduce((sum, val) => sum + val, 0) / trackingData.fps.length 
      : null;
    
    // We would typically send metrics to backend here
    console.log('Animation completed:', {
      type: animationType,
      duration,
      avgFps,
      fpsReadings: trackingData.fps.length,
      timestamp: new Date().toISOString()
    });
    
  }, []);

  /**
   * Track animation view or interaction
   */
  const trackAnimation = useCallback((
    animationType: string,
    metrics?: Partial<AnimationPerformanceMetrics>,
    feedback?: AnimationFeedback
  ) => {
    if (!user) return;
    
    try {
      // We would typically send this data to backend via an API call
      console.log('Animation tracked:', {
        animationType,
        userId: user.id,
        metrics,
        feedback,
        timestamp: new Date().toISOString(),
        device: {
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Failed to track animation:', error);
    }
  }, [user]);

  return {
    trackAnimation,
    startAnimationTracking,
    completeAnimationTracking
  };
};

/**
 * Mock hook for animation preferences (would connect to user settings in real app)
 */
export const useAnimationPreferences = () => {
  // Check for system-level reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  return {
    isAnimationEnabled: (type: string) => {
      // Check if user has explicitly disabled this animation type
      // For now, we just respect system preference
      return !prefersReducedMotion;
    },
    
    getPreference: (type: string) => {
      // Return user preferences for this animation type
      // This would typically come from a database or local storage
      return {
        intensity_preference: 5,  // 1-10 scale
        speed_preference: 'normal', // slow, normal, fast
        accessibility_mode: false
      };
    }
  };
};
