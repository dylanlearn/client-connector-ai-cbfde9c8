
import { AnimationCategory } from "@/types/animations";

export interface AnimationConfigType {
  initial?: {
    opacity?: number;
    y?: number;
    scale?: number;
    rotateY?: number;
    perspective?: number;
  };
  animate: {
    opacity?: number;
    y?: number | number[];
    scale?: number | number[];
    rotateY?: number | number[];
    perspective?: number;
    transition?: any;
    rotate?: number | number[];
  };
  whileHover?: {
    scale?: number;
  };
  whileTap?: {
    scale?: number;
  };
  transition?: {
    duration: number;
    ease?: string;
    repeat?: number;
    repeatDelay?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    staggerChildren?: number;
    delayChildren?: number;
    staggerDirection?: number;
  };
}

// Memoize animation configurations to avoid recreating objects on each render
const cachedConfigs = new Map<string, Map<boolean, AnimationConfigType>>();

export const getAnimationConfig = (animationType: string, isPlaying: boolean): AnimationConfigType => {
  // Check if we have a cached config for this animation type
  if (!cachedConfigs.has(animationType)) {
    cachedConfigs.set(animationType, new Map<boolean, AnimationConfigType>());
  }
  
  const typeCache = cachedConfigs.get(animationType)!;
  
  // Check if we have a cached config for this isPlaying state
  if (typeCache.has(isPlaying)) {
    return typeCache.get(isPlaying)!;
  }
  
  // Create the configuration
  let config: AnimationConfigType;
  
  switch (animationType) {
    case "animation-1": // Fade & Slide In
      config = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: 1.8, 
          ease: "easeOut",
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 3,
          repeatType: "reverse"
        }
      };
      break;
    case "animation-2": // Scroll Reveal
      config = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { 
          duration: 1.5, 
          repeat: isPlaying ? Infinity : 0,
          repeatDelay: 3,
          repeatType: "reverse"
        }
      };
      break;
    case "animation-3": // Parallax Effects
      config = {
        initial: { y: 100 },
        animate: { y: 0 },
        transition: { 
          duration: 1.5, 
          ease: "easeInOut",
          repeat: isPlaying ? Infinity : 0,
          repeatType: "reverse"
        }
      };
      break;
    case "animation-4": // 3D Transforms
      config = {
        initial: { rotateY: 30, perspective: 1000 },
        animate: { rotateY: -30, perspective: 1000 },
        transition: { 
          duration: 2,
          ease: "easeInOut",
          repeat: isPlaying ? Infinity : 0,
          repeatType: "reverse"
        }
      };
      break;
    case "animation-5": // Microinteractions
      config = {
        initial: {}, 
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        animate: isPlaying ? {
          scale: [1, 1.02, 1],
          transition: { 
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }
        } : { scale: 1 }
      };
      break;
    case "animation-6": // Text Animation - Enhanced
      config = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.8,
            staggerChildren: 0.12,
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 2.5,
            repeatType: "reverse"
          }
        }
      };
      break;
    case "animation-7": // Staggered Reveal - Enhanced
      config = {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
            staggerDirection: 1,
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 3,
            repeatType: "reverse"
          }
        }
      };
      break;
    case "animation-8": // Floating Elements - Enhanced
      config = {
        initial: {}, 
        animate: isPlaying ? { 
          y: [0, -12, 0, -8, 0],
          rotate: [0, 2, 0, -2, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}
      };
      break;
    case "animation-9": // Elastic Motion - Enhanced
      config = {
        initial: {}, 
        animate: isPlaying ? {
          scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
          rotate: [0, 1, -1, 2, -2, 0],
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 5,
            repeat: Infinity,
            repeatDelay: 0.8,
            duration: 2.5
          }
        } : {}
      };
      break;
    default:
      config = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 }
      };
  }
  
  // Cache the config
  typeCache.set(isPlaying, config);
  return config;
};

// Map animation ID to AnimationCategory for analytics
// Using a static Map for better performance
const categoryMappingCache = new Map<string, AnimationCategory>([
  ["animation-1", "morphing_shape"],
  ["animation-2", "scroll_animation"],
  ["animation-3", "parallax_tilt"],
  ["animation-4", "glassmorphism"],
  ["animation-5", "hover_effect"],
  ["animation-6", "color_shift"],
  ["animation-7", "progressive_disclosure"],
  ["animation-8", "magnetic_element"],
  ["animation-9", "modal_dialog"],
]);

export const getAnimationCategory = (id: string): AnimationCategory => {
  return categoryMappingCache.get(id) || "hover_effect" as AnimationCategory;
};

// Function to clear animation config cache when needed
export const clearAnimationConfigCache = (): void => {
  cachedConfigs.clear();
};
