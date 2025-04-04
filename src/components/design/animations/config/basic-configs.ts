
import { AnimationConfigType } from "./types";

interface AnimationPreferenceOptions {
  speedFactor?: number;
  intensityFactor?: number;
  reducedMotion?: boolean;
}

/**
 * Basic animation configurations
 */
export const basicConfigs: Record<string, (isPlaying: boolean, options?: AnimationPreferenceOptions) => AnimationConfigType> = {
  // Simple Fade
  'animation-1': (isPlaying, options = {}) => {
    const { reducedMotion = false, speedFactor = 1, intensityFactor = 1 } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0.1 }
      };
    }
    
    return {
      initial: { opacity: 0, y: 20 * intensityFactor },
      animate: isPlaying 
        ? { opacity: 1, y: 0 } 
        : { opacity: 0, y: 20 * intensityFactor },
      transition: { 
        duration: 0.5 * speedFactor,
        ease: "easeOut"
      }
    };
  },
  
  // Scale
  'animation-2': (isPlaying, options = {}) => {
    const { reducedMotion = false, speedFactor = 1, intensityFactor = 1 } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.1 }
      };
    }
    
    return {
      initial: { opacity: 0, scale: 0.9 },
      animate: isPlaying 
        ? { opacity: 1, scale: 1 } 
        : { opacity: 0, scale: 0.9 },
      transition: { 
        duration: 0.5 * speedFactor,
        ease: "easeOut"
      }
    };
  },
  
  // Rotate and Scale
  'animation-3': (isPlaying, options = {}) => {
    const { reducedMotion = false, speedFactor = 1, intensityFactor = 1 } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1, rotate: 0, scale: 1 },
        animate: { opacity: 1, rotate: 0, scale: 1 },
        transition: { duration: 0.1 }
      };
    }
    
    return {
      initial: { opacity: 0, rotate: -10 * intensityFactor, scale: 0.9 },
      animate: isPlaying 
        ? { opacity: 1, rotate: 0, scale: 1 } 
        : { opacity: 0, rotate: -10 * intensityFactor, scale: 0.9 },
      transition: { 
        duration: 0.6 * speedFactor,
        ease: "easeOut"
      }
    };
  },
  
  // Slide from side
  'animation-4': (isPlaying, options = {}) => {
    const { reducedMotion = false, speedFactor = 1, intensityFactor = 1 } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.1 }
      };
    }
    
    return {
      initial: { opacity: 0, x: 50 * intensityFactor },
      animate: isPlaying 
        ? { opacity: 1, x: 0 } 
        : { opacity: 0, x: 50 * intensityFactor },
      transition: { 
        duration: 0.5 * speedFactor,
        ease: "easeOut"
      }
    };
  },
  
  // Bounce
  'animation-5': (isPlaying, options = {}) => {
    const { reducedMotion = false, speedFactor = 1, intensityFactor = 1 } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.1 }
      };
    }
    
    return {
      initial: { opacity: 0, y: 50 },
      animate: isPlaying 
        ? { opacity: 1, y: 0 } 
        : { opacity: 0, y: 50 },
      transition: { 
        type: "spring",
        stiffness: 300 * intensityFactor,
        damping: 15,
        duration: 0.8 * speedFactor
      }
    };
  }
};
