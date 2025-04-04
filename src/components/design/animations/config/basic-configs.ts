
import { AnimationConfigType, AnimationPreferenceOptions } from './types';

type ConfigFunction = (isPlaying: boolean, options?: AnimationPreferenceOptions) => AnimationConfigType;

// Basic animation configurations
export const basicConfigs: Record<string, ConfigFunction> = {
  'animation-1': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Fade and slide animation
    return {
      initial: { 
        opacity: 0, 
        y: reducedMotion ? 0 : 50 * intensityFactor
      },
      animate: isPlaying ? { 
        opacity: 1, 
        y: 0,
        transition: {
          opacity: { duration: reducedMotion ? 0.1 : 0.6 * speedFactor },
          y: { duration: reducedMotion ? 0.1 : 0.8 * speedFactor }
        }
      } : { 
        opacity: 0, 
        y: reducedMotion ? 0 : 50 * intensityFactor
      },
      elementStyle: 'w-64 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center',
      content: 'Fade & Slide'
    };
  },
  
  'animation-2': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Scroll reveal animation simulation
    return {
      initial: { 
        opacity: 0, 
        scale: 0.9,
        y: reducedMotion ? 0 : 70 * intensityFactor
      },
      animate: isPlaying ? { 
        opacity: 1, 
        scale: 1,
        y: 0,
        transition: {
          duration: reducedMotion ? 0.1 : 1.2 * speedFactor,
          ease: 'easeOut'
        }
      } : { 
        opacity: 0, 
        scale: 0.9,
        y: reducedMotion ? 0 : 70 * intensityFactor
      },
      elementStyle: 'w-64 h-32 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg flex items-center justify-center',
      content: 'Scroll Reveal'
    };
  },
  
  'animation-3': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Parallax effect
    return {
      initial: { 
        y: 0
      },
      animate: isPlaying ? {
        y: reducedMotion ? 0 : [0, -20 * intensityFactor, 0],
        transition: {
          duration: reducedMotion ? 0.1 : 3 * speedFactor,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop'
        }
      } : {
        y: 0
      },
      elementStyle: 'w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center',
      content: 'Parallax',
      secondaryElements: [
        {
          className: 'absolute w-20 h-20 bg-opacity-80 bg-indigo-500 rounded-full -z-10',
          style: { left: '30%', top: '60%' },
          initial: { y: 0 },
          animate: isPlaying ? {
            y: reducedMotion ? 0 : [0, -10 * intensityFactor, 0],
            transition: {
              duration: reducedMotion ? 0.1 : 2.5 * speedFactor,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
              delay: 0.5
            }
          } : { y: 0 },
          transition: {}
        },
        {
          className: 'absolute w-16 h-16 bg-opacity-80 bg-pink-500 rounded-full -z-10',
          style: { right: '25%', bottom: '60%' },
          initial: { y: 0 },
          animate: isPlaying ? {
            y: reducedMotion ? 0 : [0, -15 * intensityFactor, 0],
            transition: {
              duration: reducedMotion ? 0.1 : 3.5 * speedFactor,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
              delay: 1
            }
          } : { y: 0 },
          transition: {}
        }
      ]
    };
  },
  
  'animation-5': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Microinteraction animation
    return {
      initial: { scale: 1 },
      animate: { scale: 1 },
      whileHover: reducedMotion ? {} : { 
        scale: 1.05 * intensityFactor,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 * speedFactor }
      },
      whileTap: reducedMotion ? {} : { 
        scale: 0.95,
        transition: { duration: 0.1 * speedFactor }
      },
      elementStyle: 'w-48 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center cursor-pointer',
      content: 'Hover & Tap Me!'
    };
  },
  
  'animation-6': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Text animation simulation
    return {
      initial: { 
        opacity: 0
      },
      animate: isPlaying ? {
        opacity: 1,
        transition: {
          duration: reducedMotion ? 0.1 : 0.5 * speedFactor,
          staggerChildren: reducedMotion ? 0.03 : 0.1 * speedFactor
        }
      } : {
        opacity: 0
      },
      elementStyle: 'w-64 h-32 flex items-center justify-center',
      secondaryElements: Array.from({ length: 5 }).map((_, i) => ({
        className: `text-2xl font-bold ${
          i === 0 ? 'text-red-500' : 
          i === 1 ? 'text-orange-500' : 
          i === 2 ? 'text-yellow-500' : 
          i === 3 ? 'text-green-500' : 
          'text-blue-500'
        }`,
        style: { 
          transform: `translateX(${(i - 2) * 25}px)` 
        },
        initial: { 
          opacity: 0, 
          y: reducedMotion ? 0 : 20 * intensityFactor 
        },
        animate: isPlaying ? { 
          opacity: 1, 
          y: 0 
        } : { 
          opacity: 0, 
          y: reducedMotion ? 0 : 20 * intensityFactor 
        },
        transition: { 
          delay: i * (reducedMotion ? 0.05 : 0.15 * speedFactor) 
        }
      }))
    };
  },
  
  'animation-8': (isPlaying, options = {}) => {
    const { speedFactor = 1, intensityFactor = 1, reducedMotion = false } = options;
    
    // Floating elements
    return {
      initial: { 
        y: 0
      },
      animate: isPlaying ? {
        y: reducedMotion ? 0 : [0, -10 * intensityFactor, 0],
        transition: {
          duration: reducedMotion ? 0.1 : 4 * speedFactor,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop'
        }
      } : {
        y: 0
      },
      elementStyle: 'w-full h-full flex items-center justify-center',
      secondaryElements: [
        {
          className: 'w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg',
          style: { margin: '0 auto' },
          initial: { y: 0, rotate: 0 },
          animate: isPlaying ? {
            y: reducedMotion ? 0 : [0, -15 * intensityFactor, 0],
            rotate: reducedMotion ? 0 : [0, 5 * intensityFactor, 0, -5 * intensityFactor, 0],
            transition: {
              y: {
                duration: reducedMotion ? 0.1 : 3 * speedFactor,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop'
              },
              rotate: {
                duration: reducedMotion ? 0.1 : 5 * speedFactor,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop'
              }
            }
          } : { y: 0, rotate: 0 },
          transition: {}
        },
        {
          className: 'absolute w-10 h-10 bg-pink-400 rounded-full shadow-md',
          style: { top: '35%', left: '30%' },
          initial: { y: 0 },
          animate: isPlaying ? {
            y: reducedMotion ? 0 : [0, -25 * intensityFactor, 0],
            transition: {
              duration: reducedMotion ? 0.1 : 4 * speedFactor,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
              delay: 0.5
            }
          } : { y: 0 },
          transition: {}
        },
        {
          className: 'absolute w-8 h-8 bg-yellow-400 rounded-full shadow-md',
          style: { bottom: '35%', right: '35%' },
          initial: { y: 0 },
          animate: isPlaying ? {
            y: reducedMotion ? 0 : [0, -20 * intensityFactor, 0],
            transition: {
              duration: reducedMotion ? 0.1 : 3.5 * speedFactor,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
              delay: 1
            }
          } : { y: 0 },
          transition: {}
        }
      ]
    };
  }
};
