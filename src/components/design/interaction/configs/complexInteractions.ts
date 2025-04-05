
import {
  ProgressiveDisclosureConfig,
  IntentBasedMotionConfig,
  GlassmorphismConfig,
  BaseInteractionConfig
} from './types';

/**
 * Complex interaction configurations
 */
export const getComplexInteractionConfig = (
  interactionType: string,
  isActive: boolean
): ProgressiveDisclosureConfig | IntentBasedMotionConfig | GlassmorphismConfig | BaseInteractionConfig => {
  
  switch (interactionType) {
    case "interaction-11": // Progressive Disclosure
      return {
        initial: { opacity: 0, height: 0 },
        animate: isActive ? {
          opacity: 1,
          height: "auto",
          transition: {
            staggerChildren: 0.2,
            duration: 0.8,
            ease: "easeOut"
          }
        } : { 
          opacity: 0, 
          height: 0,
          transition: {
            duration: 0.4,
            ease: "easeIn"
          }
        },
        variants: {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5,
              ease: "easeOut"
            }
          }
        }
      };
    
    case "interaction-12": // Intent-Based Motion
      return {
        initial: {},
        animate: isActive ? { 
          scale: [1, 1.02, 1],
          transition: { 
            duration: 0.8,
            repeat: 3,
            repeatType: "reverse" as const
          }
        } : {},
        whileHover: { 
          scale: 1.05,
          transition: { 
            type: "spring",
            stiffness: 300,
            damping: 15
          }
        },
        whileTap: { 
          scale: 0.95,
          transition: { 
            type: "spring",
            stiffness: 500,
            damping: 20
          }
        }
      };
    
    case "interaction-13": // Glassmorphism or Soft Motion Layering
      return {
        initial: { 
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(255, 255, 255, 0)"
        },
        animate: isActive ? {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          transition: { 
            duration: 0.8,
            ease: "easeOut"
          }
        } : { 
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(255, 255, 255, 0)",
          transition: { 
            duration: 0.5,
            ease: "easeIn"
          }
        },
        variants: {
          hidden: { 
            opacity: 0,
            backdropFilter: "blur(0px)",
            backgroundColor: "rgba(255, 255, 255, 0)"
          },
          visible: { 
            opacity: 1,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            transition: { 
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }
      };
    
    default:
      return {};
  }
};
