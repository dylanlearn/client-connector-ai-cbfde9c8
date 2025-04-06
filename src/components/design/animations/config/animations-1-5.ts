
import { AnimationConfigType } from "./types";

/**
 * Configuration for basic animations (1-5)
 */
export const getBasicAnimationConfig = (
  animationType: string,
  isPlaying: boolean
): AnimationConfigType => {
  switch (animationType) {
    case "animation-1": // Fade In Animation
      return {
        initial: { opacity: 0, y: 20 },
        animate: isPlaying 
          ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.6,
                ease: "easeOut"
              } 
            }
          : { opacity: 0, y: 20 },
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      };
      
    case "animation-2": // Scale Animation
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: isPlaying 
          ? { 
              opacity: 1, 
              scale: 1,
              transition: {
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut"
              } 
            } 
          : { opacity: 0, scale: 0.9 },
        transition: {
          duration: 0.5,
          ease: "easeOut",
          delay: 0.2
        }
      };
      
    case "animation-3": // Floating Animation
      return {
        initial: { y: 0 },
        animate: isPlaying 
          ? {
              y: [-20, 20],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            } 
          : { y: 0 },
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      };
      
    case "animation-4": // Rotation Animation
      return {
        initial: { rotateY: 0 },
        animate: isPlaying 
          ? { 
              rotateY: 360,
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              } 
            } 
          : { rotateY: 0 },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }
      };
      
    case "animation-5": // Button Animation
      return {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        initial: { scale: 1 },
        animate: isPlaying 
          ? { 
              scale: [1, 1.05, 1],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              } 
            } 
          : { scale: 1 }
      };
      
    default:
      return {
        initial: {},
        animate: {},
        transition: {}
      };
  }
};
