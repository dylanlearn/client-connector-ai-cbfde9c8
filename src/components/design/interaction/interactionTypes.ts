
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

export interface MorphingShapeConfig extends BaseInteractionConfig {
  animate: Record<string, any>;
  variants?: Record<string, any>;
}

export interface ProgressiveDisclosureConfig extends BaseInteractionConfig {
  animate: Record<string, any>;
  variants?: Record<string, any>;
  staggerChildren?: number;
}

export interface IntentBasedMotionConfig extends BaseInteractionConfig {
  animate: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
}

export interface GlassmorphismConfig extends BaseInteractionConfig {
  animate: Record<string, any>;
  variants?: Record<string, any>;
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
  | MorphingShapeConfig
  | ProgressiveDisclosureConfig
  | IntentBasedMotionConfig
  | GlassmorphismConfig
  | BaseInteractionConfig;

// No need to re-export these types since they are already exported above
