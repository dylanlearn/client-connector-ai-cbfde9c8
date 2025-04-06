
import { AnimationConfigType, AnimationPreferenceOptions } from "./types";
import { getBasicAnimationConfig } from "./animations-1-5";
import { getAdvancedAnimationConfig } from "./animations-6-10";

/**
 * Cache for animation configurations to improve performance
 */
const configCache = new Map<string, AnimationConfigType>();

/**
 * Clear the animation config cache
 */
export const clearAnimationConfigCache = (): void => {
  configCache.clear();
};

/**
 * Get the category of an animation based on its ID
 */
export const getAnimationCategory = (animationId: string): string => {
  if (animationId.startsWith('animation-')) {
    const animationNumber = parseInt(animationId.split('-')[1]);
    
    if (animationNumber <= 5) return 'basic';
    if (animationNumber <= 10) return 'advanced';
    return 'complex';
  }
  
  return 'unknown';
};

/**
 * Get configuration for an animation based on its type and play state
 */
export const getAnimationConfig = (
  animationType: string,
  isPlaying: boolean,
  options?: AnimationPreferenceOptions
): AnimationConfigType => {
  // Create a cache key based on animation type and playing state
  const cacheKey = `${animationType}-${isPlaying}`;
  
  // Check if the configuration is already cached
  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey)!;
  }
  
  let config: AnimationConfigType;
  
  // Get configuration based on animation category
  if (animationType.startsWith('animation-')) {
    const animationNumber = parseInt(animationType.split('-')[1]);
    
    if (animationNumber <= 5) {
      config = getBasicAnimationConfig(animationType, isPlaying);
    } else if (animationNumber <= 10) {
      config = getAdvancedAnimationConfig(animationType, options);
    } else {
      config = { initial: {}, animate: {} };
    }
  } else {
    config = { initial: {}, animate: {} };
  }
  
  // Cache the configuration
  configCache.set(cacheKey, config);
  
  return config;
};

export type { AnimationConfigType };
