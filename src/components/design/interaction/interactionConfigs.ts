
import { 
  InteractionConfig,
  HoverEffectConfig,
  ModalDialogConfig,
  CustomCursorConfig,
  ScrollAnimationConfig,
  DragInteractionConfig,
  MagneticElementConfig,
  ColorShiftConfig,
  ParallaxTiltConfig,
  MorphingShapeConfig,
  ProgressiveDisclosureConfig,
  IntentBasedMotionConfig,
  GlassmorphismConfig
} from './interactionTypes';

// Get interaction configuration based on interaction type
export const getInteractionConfig = (
  interactionType: string,
  isActive: boolean,
  cursorPosition: { x: number, y: number }
): InteractionConfig => {
  switch (interactionType) {
    case "interaction-1": // Hover Effects
      return {
        initial: {},
        whileHover: { 
          scale: 1.05, 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
        },
        animate: isActive ? { 
          scale: 1.05,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
        } : {}
      } as HoverEffectConfig;
    
    case "interaction-2": // Modal Dialogs
      return {
        initial: { scale: 0 },
        animate: isActive ? { 
          scale: 1,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        } : { scale: 0 }
      } as ModalDialogConfig;
    
    case "interaction-3": // Custom Cursors
      return {
        initial: {},
        animate: {
          x: cursorPosition.x,
          y: cursorPosition.y,
          transition: { type: "spring", damping: 25, stiffness: 300 }
        }
      } as CustomCursorConfig;
    
    case "interaction-4": // Scroll Animations
      return {
        initial: { opacity: 0, y: 50 },
        animate: isActive ? { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        } : { opacity: 0, y: 50 }
      } as ScrollAnimationConfig;
    
    case "interaction-5": // Drag Interactions
      return {
        initial: {},
        animate: isActive ? { x: 50 } : { x: 0 },
        drag: true,
        dragConstraints: { left: 0, right: 100, top: 0, bottom: 0 },
        whileDrag: { scale: 1.1 }
      } as DragInteractionConfig;
    
    case "interaction-7": // Magnetic Elements
      return {
        initial: {},
        animate: isActive ? {
          x: cursorPosition.x > 0 ? (cursorPosition.x / 20) - 10 : 0,
          y: cursorPosition.y > 0 ? (cursorPosition.y / 20) - 10 : 0,
          transition: { type: "spring", damping: 15, stiffness: 150 }
        } : {}
      } as MagneticElementConfig;
    
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
      } as ColorShiftConfig;
    
    case "interaction-9": // Parallax Tilt
      return {
        initial: { rotateX: 0, rotateY: 0 },
        animate: isActive ? {
          rotateX: (cursorPosition.y / 10) - 10,
          rotateY: (cursorPosition.x / 10) - 10,
          transition: { type: "spring", damping: 20, stiffness: 200 }
        } : { rotateX: 0, rotateY: 0 }
      } as ParallaxTiltConfig;
    
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
      } as MorphingShapeConfig;
    
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
      } as ProgressiveDisclosureConfig;
    
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
      } as IntentBasedMotionConfig;
    
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
      } as GlassmorphismConfig;
    
    default:
      return {} as InteractionConfig;
  }
};
