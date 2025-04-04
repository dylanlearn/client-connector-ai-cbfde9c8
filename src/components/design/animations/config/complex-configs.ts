
import { AnimationConfigType } from "./types";

interface AnimationPreferenceOptions {
  speedFactor?: number;
  intensityFactor?: number;
  reducedMotion?: boolean;
}

/**
 * Complex animation configurations
 */
export const complexConfigs: Record<string, (isPlaying: boolean, options?: AnimationPreferenceOptions) => AnimationConfigType> = {
  // Text Animation
  'animation-6': (isPlaying, options = {}) => {
    const { reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        elementStyle: "flex flex-col items-center gap-3 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow-md w-56",
        secondaryElements: [
          {
            className: "flex space-x-1",
            initial: { y: 0 },
            animate: { y: 0 },
            transition: { duration: 0.1 }
          }
        ]
      };
    }
    
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      elementStyle: "flex flex-col items-center gap-3 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow-md w-56",
      secondaryElements: [
        {
          className: "flex space-x-1",
          initial: { y: 0 },
          animate: isPlaying ? {} : { y: 0 },
          transition: { staggerChildren: 0.1 }
        },
        ...["A", "N", "I", "M", "A", "T", "E"].map((letter, index) => ({
          className: "w-6 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded flex items-center justify-center text-white font-bold",
          initial: { y: 0, opacity: 1 },
          animate: isPlaying ? {
            y: [0, -15, 0],
            opacity: [1, 0.8, 1],
            transition: { 
              duration: 1.5,
              delay: index * 0.1, 
              repeat: Infinity,
              repeatDelay: 2
            }
          } : { y: 0, opacity: 1 },
          transition: { duration: 0.5 }
        })),
        {
          className: "w-36 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-1",
          initial: { width: "9rem" },
          animate: isPlaying ? {
            width: ["9rem", "7rem", "9rem"],
            transition: { duration: 2, repeat: Infinity, repeatDelay: 1 }
          } : { width: "9rem" },
          transition: { duration: 0.5 }
        },
        {
          className: "w-full h-3 bg-pink-200 rounded-full mt-3",
          initial: { width: "100%" },
          animate: isPlaying ? {
            width: ["100%", "80%", "100%"],
            transition: { duration: 3, repeat: Infinity, repeatDelay: 0.5 }
          } : { width: "100%" },
          transition: { duration: 0.5 }
        },
        {
          className: "w-4/5 h-3 bg-purple-200 rounded-full mt-2",
          initial: { width: "80%" },
          animate: isPlaying ? {
            width: ["80%", "60%", "80%"],
            transition: { duration: 2.5, repeat: Infinity, repeatDelay: 0.7 }
          } : { width: "80%" },
          transition: { duration: 0.5 }
        }
      ]
    };
  },
  
  // Staggered Reveal
  'animation-7': (isPlaying, options = {}) => {
    const { reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        elementStyle: "flex flex-col items-center gap-4 p-4 w-56 h-auto",
        secondaryElements: []
      };
    }
    
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      elementStyle: "flex flex-col items-center gap-4 p-4 w-56 h-auto",
      secondaryElements: [
        {
          className: "w-full flex justify-center mb-2",
          initial: { opacity: 0, y: 20 },
          animate: isPlaying ? { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
          } : { opacity: 0, y: 20 },
          transition: { duration: 0.5 }
        },
        {
          className: "w-36 h-6 bg-indigo-600 rounded",
          initial: { opacity: 0, y: 20 },
          animate: isPlaying ? { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, delay: 0.2 }
          } : { opacity: 0, y: 20 },
          transition: { duration: 0.5 }
        },
        {
          className: "grid grid-cols-3 gap-2 w-full",
          initial: { opacity: 0 },
          animate: isPlaying ? { opacity: 1 } : { opacity: 0 },
          transition: { duration: 0.5 }
        },
        ...Array.from({ length: 3 }).map((_, i) => ({
          className: "bg-gray-100 rounded p-2 flex flex-col items-center",
          initial: { opacity: 0, y: 20 },
          animate: isPlaying ? { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5, 
              delay: 0.4 + (i * 0.15) 
            }
          } : { opacity: 0, y: 20 },
          transition: { duration: 0.5 }
        })),
        ...Array.from({ length: 3 }).map((_, i) => ({
          className: "w-full h-2 bg-gray-200 rounded mt-4",
          initial: { opacity: 0, x: -20 },
          animate: isPlaying ? { 
            opacity: 1, 
            x: 0,
            transition: { 
              duration: 0.5, 
              delay: 1 + (i * 0.15) 
            }
          } : { opacity: 0, x: -20 },
          transition: { duration: 0.5 }
        }))
      ]
    };
  },
  
  // Floating Elements
  'animation-8': (isPlaying, options = {}) => {
    const { reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        elementStyle: "relative w-56 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm flex items-center justify-center",
        secondaryElements: []
      };
    }
    
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      elementStyle: "relative w-56 h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm flex items-center justify-center",
      secondaryElements: [
        {
          className: "absolute top-12 left-6 w-10 h-10 rounded-full bg-blue-200",
          initial: { y: 0 },
          animate: isPlaying ? { 
            y: [0, -15, 0],
            rotate: [0, 10, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          } : { y: 0 },
          transition: { duration: 0.5 }
        },
        {
          className: "absolute top-8 right-8 w-8 h-8 rounded-full bg-purple-200",
          initial: { y: 0 },
          animate: isPlaying ? { 
            y: [0, -10, 0],
            rotate: [0, -10, 0],
            transition: { 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: 0.5 
            }
          } : { y: 0 },
          transition: { duration: 0.5 }
        },
        {
          className: "absolute bottom-12 left-1/4 w-12 h-12 rounded-full bg-indigo-200",
          initial: { y: 0 },
          animate: isPlaying ? { 
            y: [0, -20, 0],
            rotate: [0, 15, 0],
            transition: { 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: 1 
            }
          } : { y: 0 },
          transition: { duration: 0.5 }
        },
        {
          className: "absolute bottom-10 right-1/4 w-6 h-6 rounded-full bg-pink-200",
          initial: { y: 0 },
          animate: isPlaying ? { 
            y: [0, -8, 0],
            rotate: [0, -8, 0],
            transition: { 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: 1.5 
            }
          } : { y: 0 },
          transition: { duration: 0.5 }
        },
        {
          className: "w-40 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center z-10",
          initial: { y: 0 },
          animate: isPlaying ? { 
            y: [0, -8, 0],
            transition: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          } : { y: 0 },
          transition: { duration: 0.5 }
        },
        {
          className: "w-20 h-3 bg-white rounded opacity-80",
          initial: { opacity: 0.8 },
          animate: { opacity: 0.8 },
          transition: { duration: 0.5 }
        }
      ]
    };
  },
  
  // Elastic Motion
  'animation-9': (isPlaying, options = {}) => {
    const { reducedMotion = false } = options;
    
    if (reducedMotion) {
      return {
        initial: { scale: 1 },
        animate: { scale: 1 },
        elementStyle: "w-56 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-4 flex flex-col justify-center",
        secondaryElements: []
      };
    }
    
    return {
      initial: { scale: 1 },
      animate: isPlaying ? {
        scale: [1, 1.05, 0.95, 1.02, 1],
        rotate: [0, 2, -2, 1, 0],
        y: [0, -5, 5, -2, 0],
      } : { scale: 1 },
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      },
      elementStyle: "w-56 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-4 flex flex-col justify-center",
      secondaryElements: [
        {
          className: "w-32 h-4 bg-white/30 rounded mb-2",
          initial: { width: "8rem" },
          animate: { width: "8rem" },
          transition: { duration: 0.5 }
        },
        {
          className: "w-full h-3 bg-white/20 rounded mb-1",
          initial: { width: "100%" },
          animate: { width: "100%" },
          transition: { duration: 0.5 }
        },
        {
          className: "w-3/4 h-3 bg-white/20 rounded",
          initial: { width: "75%" },
          animate: { width: "75%" },
          transition: { duration: 0.5 }
        },
        {
          className: "flex gap-4 mt-8",
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        },
        {
          className: "w-24 h-8 bg-indigo-500 rounded-full flex items-center justify-center",
          initial: { scale: 1 },
          animate: isPlaying ? {
            scale: [1, 1.1, 0.9, 1.05, 1],
            rotate: [0, 1, -1, 0.5, 0]
          } : { scale: 1 },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2
          }
        },
        {
          className: "w-24 h-8 bg-gray-200 rounded-full flex items-center justify-center",
          initial: { scale: 1 },
          animate: isPlaying ? {
            scale: [1, 1.08, 0.92, 1.04, 1],
            rotate: [0, -1, 1, -0.5, 0]
          } : { scale: 1 },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.5
          }
        }
      ]
    };
  }
};
