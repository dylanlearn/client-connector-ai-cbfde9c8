
/**
 * Types for animation configurations
 */

export interface AnimationConfigType {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  variants?: Record<string, any>;
  style?: Record<string, any>;
  exit?: Record<string, any>;
}
