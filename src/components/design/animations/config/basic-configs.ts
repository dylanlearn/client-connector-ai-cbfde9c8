
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
  // Fade & Slide In Animation
  'animation-1': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: isPlaying ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.1 },
        elementStyle: "w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg"
      };
    }
    
    return {
      initial: { opacity: 0, y: 20 * intensityFactor },
      animate: isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 * intensityFactor },
      transition: { duration: 0.5 * speedFactor },
      elementStyle: "w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg"
    };
  },
  
  // Scroll Reveal Animation
  'animation-2': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: isPlaying ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.1 },
        elementStyle: "w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg"
      };
    }
    
    return {
      initial: { opacity: 0, y: 50 * intensityFactor },
      animate: isPlaying 
        ? { opacity: 1, y: 0, transition: { duration: 0.8 * speedFactor, ease: "easeOut" }} 
        : { opacity: 0, y: 50 * intensityFactor },
      elementStyle: "w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg"
    };
  },
  
  // Parallax Effects
  'animation-3': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { scale: 1 },
        animate: isPlaying ? { scale: 1.02 } : { scale: 1 },
        transition: { duration: 0.3 },
        elementStyle: "w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg"
      };
    }
    
    const scaleAmount = 0.05 * intensityFactor;
    const yAmount = 10 * intensityFactor;
    const rotateAmount = 2 * intensityFactor;
    
    return {
      initial: { scale: 1 },
      animate: isPlaying 
        ? { 
            scale: [1, 1 + scaleAmount, 1 - scaleAmount, 1], 
            y: [0, -yAmount, yAmount, 0], 
            rotate: [0, rotateAmount, -rotateAmount, 0] 
          } 
        : { scale: 1 },
      transition: { duration: 4 * speedFactor, repeat: Infinity, repeatType: "reverse" },
      elementStyle: "w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg"
    };
  },
  
  // 3D Transforms
  'animation-4': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { rotateY: 0 },
        animate: isPlaying ? { rotateY: 5 } : { rotateY: 0 },
        transition: { duration: 0.3 },
        elementStyle: "w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg"
      };
    }
    
    const rotateAmount = 180 * intensityFactor;
    const rotateXAmount = 10 * intensityFactor;
    const zAmount = 50 * intensityFactor;
    
    return {
      initial: { rotateY: 0, rotateX: 0, z: 0 },
      animate: isPlaying 
        ? { rotateY: [0, rotateAmount, 0], rotateX: [0, rotateXAmount, 0], z: [0, zAmount, 0] } 
        : { rotateY: 0, rotateX: 0, z: 0 },
      transition: { duration: 4 * speedFactor, repeat: Infinity, repeatDelay: 0.5 * speedFactor },
      elementStyle: "w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg"
    };
  },
  
  // Microinteractions
  'animation-5': (isPlaying, options = {}) => {
    const { intensityFactor = 1, reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { scale: 1 },
        animate: { scale: 1 },
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        elementStyle: "w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg cursor-pointer",
        content: "Hover me"
      };
    }
    
    const scaleAmount = 0.1 * intensityFactor; 
    
    return {
      initial: { scale: 1 },
      animate: { scale: 1 },
      whileHover: { scale: 1 + scaleAmount, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
      whileTap: { scale: 1 - (scaleAmount / 2) },
      elementStyle: "w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg cursor-pointer",
      content: "Hover me"
    };
  }
};
