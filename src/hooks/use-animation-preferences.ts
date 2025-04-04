
import { useCallback } from 'react';

/**
 * Hook to manage user's animation preferences
 */
export const useAnimationPreferences = () => {
  // Check for system-level reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  /**
   * Check if an animation type is enabled based on user preferences
   */
  const isAnimationEnabled = useCallback((type: string) => {
    // Would normally check user settings from database/storage
    // For now, we just respect system preference for reduced motion
    return !prefersReducedMotion;
  }, [prefersReducedMotion]);
  
  /**
   * Get specific animation preferences for a type
   */
  const getPreference = useCallback((type: string) => {
    // This would typically fetch from user settings
    // For now we return default values
    return {
      intensity_preference: 5,  // 1-10 scale
      speed_preference: 'normal' as 'slow' | 'normal' | 'fast',
      accessibility_mode: false,
      reduced_motion_preference: prefersReducedMotion
    };
  }, [prefersReducedMotion]);
  
  return {
    isAnimationEnabled,
    getPreference,
    prefersReducedMotion
  };
};
