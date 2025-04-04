
/**
 * Animation configuration type definition
 */
export interface AnimationConfigType {
  initial: any;
  animate: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  drag?: boolean;
  dragConstraints?: any;
  elementStyle?: string;
  content?: React.ReactNode;
  secondaryElements?: {
    className: string;
    style?: React.CSSProperties;
    initial: any;
    animate: any;
    transition: any;
  }[];
}

/**
 * Animation category definition
 */
export type AnimationCategory = string;

/**
 * Animation preference options used for configuration
 */
export interface AnimationPreferenceOptions {
  speedFactor?: number;
  intensityFactor?: number;
  reducedMotion?: boolean;
}
