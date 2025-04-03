
// Define types for interaction configurations
export interface BaseInteractionConfig {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
}

export interface HoverEffectConfig extends BaseInteractionConfig {
  whileHover?: Record<string, any>;
}

export interface ModalDialogConfig extends BaseInteractionConfig {
  initial: { scale: number };
  animate: { scale: number; transition?: Record<string, any> };
}

export interface CustomCursorConfig extends BaseInteractionConfig {
  animate: { x: number; y: number; transition?: Record<string, any> };
}

export interface ScrollAnimationConfig extends BaseInteractionConfig {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number; transition?: Record<string, any> };
}

export interface DragInteractionConfig extends BaseInteractionConfig {
  drag: boolean;
  dragConstraints: { left: number; right: number; top: number; bottom: number };
  whileDrag?: Record<string, any>;
}

export interface MagneticElementConfig extends BaseInteractionConfig {
  animate: { x: number; y: number; transition?: Record<string, any> };
}

export interface ColorShiftConfig extends BaseInteractionConfig {
  animate: Record<string, any>;
  whileHover: { backgroundColor?: string; scale?: number };
}

export interface ParallaxTiltConfig extends BaseInteractionConfig {
  animate: { rotateX: number; rotateY: number; transition?: Record<string, any> };
}

export type InteractionConfig = 
  | HoverEffectConfig 
  | ModalDialogConfig 
  | CustomCursorConfig 
  | ScrollAnimationConfig 
  | DragInteractionConfig
  | MagneticElementConfig
  | ColorShiftConfig
  | ParallaxTiltConfig
  | BaseInteractionConfig;

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
    default:
      return {} as BaseInteractionConfig;
  }
};
