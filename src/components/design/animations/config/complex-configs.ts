
import { AnimationConfigType, AnimationPreferenceOptions } from './types';

type ConfigFunction = (isPlaying: boolean, options?: AnimationPreferenceOptions) => AnimationConfigType;

// Complex animation configurations
export const complexConfigs: Record<string, ConfigFunction> = {
  'animation-4': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // 3D Transform animation
    return {
      initial: { 
        rotateY: 0,
        perspective: 800,
        transformStyle: 'preserve-3d'
      },
      animate: isPlaying ? {
        rotateY: reducedMotion ? 0 : 360 * intensityFactor,
        transition: {
          duration: reducedMotion ? 0.1 : 3 * speedFactor,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop'
        }
      } : {
        rotateY: 0
      },
      elementStyle: 'w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-xl flex items-center justify-center'
    };
  },
  
  'animation-7': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Staggered reveal animation
    const staggerDelay = reducedMotion ? 0.05 : 0.2 * speedFactor;
    const moveDistance = reducedMotion ? 10 : 50 * intensityFactor;
    
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      elementStyle: 'relative w-full h-full flex items-center justify-center',
      secondaryElements: [
        {
          className: 'absolute w-12 h-12 bg-blue-500 rounded-lg',
          style: { top: '30%', left: '30%' },
          initial: { opacity: 0, x: -moveDistance },
          animate: isPlaying ? { opacity: 1, x: 0 } : { opacity: 0, x: -moveDistance },
          transition: { delay: 0, duration: reducedMotion ? 0.1 : 0.7 * speedFactor }
        },
        {
          className: 'absolute w-12 h-12 bg-indigo-500 rounded-lg',
          style: { top: '30%', right: '30%' },
          initial: { opacity: 0, x: moveDistance },
          animate: isPlaying ? { opacity: 1, x: 0 } : { opacity: 0, x: moveDistance },
          transition: { delay: staggerDelay, duration: reducedMotion ? 0.1 : 0.7 * speedFactor }
        },
        {
          className: 'absolute w-12 h-12 bg-purple-500 rounded-lg',
          style: { bottom: '30%', left: '30%' },
          initial: { opacity: 0, y: moveDistance },
          animate: isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: moveDistance },
          transition: { delay: staggerDelay * 2, duration: reducedMotion ? 0.1 : 0.7 * speedFactor }
        },
        {
          className: 'absolute w-12 h-12 bg-pink-500 rounded-lg',
          style: { bottom: '30%', right: '30%' },
          initial: { opacity: 0, y: -moveDistance },
          animate: isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: -moveDistance },
          transition: { delay: staggerDelay * 3, duration: reducedMotion ? 0.1 : 0.7 * speedFactor }
        }
      ]
    };
  },
  
  'animation-9': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Elastic motion animation
    const elasticConfig = {
      type: 'spring',
      damping: reducedMotion ? 20 : 8 * (1/intensityFactor),
      stiffness: reducedMotion ? 300 : 100 * intensityFactor,
      mass: reducedMotion ? 0.5 : 1
    };
    
    return {
      initial: { scale: 0.5, y: 100 },
      animate: isPlaying ? { 
        scale: 1, 
        y: 0,
        transition: elasticConfig
      } : { 
        scale: 0.5, 
        y: 100 
      },
      whileHover: reducedMotion ? {} : { scale: 1.1 },
      whileTap: reducedMotion ? {} : { scale: 0.9 },
      elementStyle: 'w-32 h-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg shadow-lg cursor-pointer'
    };
  }
};
