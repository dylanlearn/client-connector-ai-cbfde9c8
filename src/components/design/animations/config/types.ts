
export interface AnimationConfigType {
  initial?: {
    opacity?: number;
    y?: number;
    scale?: number;
    rotateY?: number;
    perspective?: number;
  };
  animate: {
    opacity?: number;
    y?: number | number[];
    scale?: number | number[];
    rotateY?: number | number[];
    perspective?: number;
    transition?: any;
    rotate?: number | number[];
  };
  whileHover?: {
    scale?: number;
  };
  whileTap?: {
    scale?: number;
  };
  transition?: {
    duration: number;
    ease?: string;
    repeat?: number;
    repeatDelay?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    staggerChildren?: number;
    delayChildren?: number;
    staggerDirection?: number;
  };
}
