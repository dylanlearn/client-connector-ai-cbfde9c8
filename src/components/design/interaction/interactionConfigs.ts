
// This file is now a re-export from the modular configuration system
import { getInteractionConfig } from './configs';
import type { 
  BaseInteractionConfig,
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
  GlassmorphismConfig,
  InteractionConfig
} from './configs/types';

// Export the main configuration getter function
export { getInteractionConfig };

// Export types for use in other components
export type {
  BaseInteractionConfig,
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
  GlassmorphismConfig,
  InteractionConfig
};
