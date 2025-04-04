
import { basicConfigs } from './basic-configs';
import { complexConfigs } from './complex-configs';
import { AnimationConfigType } from './types';

// Animation category mapping
const animationCategories: Record<string, string> = {
  'animation-1': 'fade_slide',
  'animation-2': 'scroll_reveal',
  'animation-3': 'parallax',
  'animation-4': '3d_transform',
  'animation-5': 'microinteraction',
  'animation-6': 'text_animation',
  'animation-7': 'staggered_reveal',
  'animation-8': 'floating_elements',
  'animation-9': 'elastic_motion'
};

// Cache for animation configurations
let configCache: Record<string, AnimationConfigType> = {};

/**
 * Get animation configuration for specific animation type
 */
export const getAnimationConfig = (
  animationType: string,
  isPlaying: boolean,
  preferences?: {
    intensity?: number;
    speed?: 'slow' | 'normal' | 'fast';
    reduced_motion?: boolean;
  }
): AnimationConfigType => {
  // Generate a cache key that includes preferences
  const prefString = preferences ? 
    `-i${preferences.intensity}-s${preferences.speed}-r${preferences.reduced_motion}` : '';
  const cacheKey = `${animationType}-${isPlaying ? 'playing' : 'paused'}${prefString}`;
  
  // Return from cache if exists
  if (configCache[cacheKey]) {
    return configCache[cacheKey];
  }
  
  // Apply preference adjustments (speed factor)
  const speedFactor = preferences?.speed === 'slow' ? 1.5 :
                      preferences?.speed === 'fast' ? 0.7 : 1;
  
  // Apply preference adjustments (intensity factor 1-10 scale)
  const intensityFactor = preferences?.intensity ? (preferences.intensity / 5) : 1;
  
  // Apply reduced motion preferences
  const reducedMotion = preferences?.reduced_motion || false;

  // Options object for configs
  const options = {
    speedFactor,
    intensityFactor,
    reducedMotion
  };
  
  // Get configuration based on animation type
  let config: AnimationConfigType;
  
  // Handle basic animation types
  if (basicConfigs[animationType]) {
    config = basicConfigs[animationType](isPlaying, options);
  } 
  // Handle complex animation types
  else if (complexConfigs[animationType]) {
    config = complexConfigs[animationType](isPlaying, options);
  } 
  // Default fallback configuration
  else {
    config = {
      initial: { opacity: 0 },
      animate: isPlaying ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: reducedMotion ? 0.1 : 0.5 * speedFactor }
    };
  }
  
  // Cache the configuration
  configCache[cacheKey] = config;
  return config;
};

/**
 * Get animation category for analytics
 */
export const getAnimationCategory = (animationType: string): string => {
  return animationCategories[animationType] || 'unknown';
};

/**
 * Clear animation configuration cache
 */
export const clearAnimationConfigCache = (): void => {
  configCache = {};
};

export type { AnimationConfigType };
