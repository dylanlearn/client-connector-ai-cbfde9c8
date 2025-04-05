
import { 
  MagneticElementConfig, 
  ColorShiftConfig, 
  ParallaxTiltConfig, 
  MorphingShapeConfig,
  ProgressiveDisclosureConfig,
  IntentBasedMotionConfig,
  GlassmorphismConfig,
  BaseInteractionConfig
} from './types';

/**
 * Advanced interaction configurations
 */
export const getAdvancedInteractionConfig = (
  interactionType: string,
  isActive: boolean,
  cursorPosition: { x: number, y: number }
): MagneticElementConfig | ColorShiftConfig | ParallaxTiltConfig | MorphingShapeConfig | 
   ProgressiveDisclosureConfig | IntentBasedMotionConfig | GlassmorphismConfig | BaseInteractionConfig => {
  
  switch (interactionType) {
    case "interaction-7": // Magnetic Elements
      return {
        initial: {},
        animate: isActive ? {
          x: cursorPosition.x > 0 ? (cursorPosition.x / 20) - 10 : 0,
          y: cursorPosition.y > 0 ? (cursorPosition.y / 20) - 10 : 0,
          transition: { type: "spring", damping: 15, stiffness: 150 }
        } : {}
      };
    
    case "interaction-8": // Color Shift
      return {
        initial: { backgroundColor: "#4f46e5" },
        animate: isActive ? { 
          backgroundColor: "#8b5cf6",
          transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
        } : { backgroundColor: "#4f46e5" },
        whileHover: { 
          backgroundColor: "#7c3aed", 
          scale: 1.05 
        }
      };
    
    case "interaction-9": // Parallax Tilt
      return {
        initial: { rotateX: 0, rotateY: 0 },
        animate: isActive ? {
          rotateX: (cursorPosition.y / 10) - 10,
          rotateY: (cursorPosition.x / 10) - 10,
          transition: { type: "spring", damping: 20, stiffness: 200 }
        } : { rotateX: 0, rotateY: 0 }
      };
    
    case "interaction-10": // Morphing Shape Transitions
      return {
        initial: { borderRadius: "30%" },
        animate: isActive ? {
          borderRadius: ["30%", "50%", "10%", "70%", "30%"],
          transition: {
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse" as const
          }
        } : { borderRadius: "30%" },
        variants: {
          circle: { borderRadius: "50%" },
          square: { borderRadius: "10%" },
          blob: { borderRadius: "70% 30% 30% 70% / 60% 40% 60% 40%" }
        }
      };
    
    default:
      return {};
  }
};
