
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
  isPlaying: boolean
): AnimationConfigType => {
  // Return from cache if exists
  const cacheKey = `${animationType}-${isPlaying ? 'playing' : 'paused'}`;
  if (configCache[cacheKey]) {
    return configCache[cacheKey];
  }
  
  // Get configuration based on animation type
  let config: AnimationConfigType;
  
  // Handle basic animation types
  if (basicConfigs[animationType]) {
    config = basicConfigs[animationType](isPlaying);
  } 
  // Handle complex animation types
  else if (complexConfigs[animationType]) {
    config = complexConfigs[animationType](isPlaying);
  } 
  // Default fallback configuration
  else {
    config = {
      initial: { opacity: 0 },
      animate: isPlaying ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: 0.5 }
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
