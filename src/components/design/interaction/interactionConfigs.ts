
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

export type InteractionConfig = 
  | HoverEffectConfig 
  | ModalDialogConfig 
  | CustomCursorConfig 
  | ScrollAnimationConfig 
  | DragInteractionConfig 
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
      };
    case "interaction-2": // Modal Dialogs
      return {
        initial: { scale: 0 },
        animate: isActive ? { 
          scale: 1,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        } : { scale: 0 }
      };
    case "interaction-3": // Custom Cursors
      return {
        initial: {},
        animate: {
          x: cursorPosition.x,
          y: cursorPosition.y,
          transition: { type: "spring", damping: 25, stiffness: 300 }
        }
      };
    case "interaction-4": // Scroll Animations
      return {
        initial: { opacity: 0, y: 50 },
        animate: isActive ? { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        } : { opacity: 0, y: 50 }
      };
    case "interaction-5": // Drag Interactions
      return {
        initial: {},
        animate: isActive ? { x: 50 } : { x: 0 },
        drag: true,
        dragConstraints: { left: 0, right: 100, top: 0, bottom: 0 },
        whileDrag: { scale: 1.1 }
      };
    default:
      return {};
  }
};
