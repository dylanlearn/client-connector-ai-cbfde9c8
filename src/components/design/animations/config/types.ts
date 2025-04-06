
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
  // Additional properties for extended functionality
  elementStyle?: string;
  content?: React.ReactNode;
  secondaryElements?: SecondaryElementType[];
  drag?: boolean;
  dragConstraints?: Record<string, number>;
}

export interface SecondaryElementType {
  className: string;
  style?: React.CSSProperties;
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition: Record<string, any>;
}

export interface AnimationPreferenceOptions {
  speedFactor?: number;
  intensityFactor?: number;
  reducedMotion?: boolean;
}
