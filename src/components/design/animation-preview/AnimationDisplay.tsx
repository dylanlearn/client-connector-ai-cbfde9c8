
import { memo } from "react";
import { motion } from "framer-motion";
import { AnimationConfigType } from "../animations/config/types";

interface AnimationDisplayProps {
  isPlaying: boolean;
  animationKey: number;
  animationConfig: AnimationConfigType;
}

interface SecondaryElement {
  className: string;
  style?: React.CSSProperties;
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  transition: {
    duration?: number;
    delay?: number;
    type?: string;
    stiffness?: number;
    damping?: number;
    repeat?: number | "Infinity";
    repeatType?: "loop" | "reverse" | "mirror";
    ease?: string;
  };
}

export const AnimationDisplay = memo(({ 
  isPlaying, 
  animationKey, 
  animationConfig 
}: AnimationDisplayProps) => {
  if (!animationConfig) {
    return (
      <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
        <p className="text-gray-400">No animation configuration available</p>
      </div>
    );
  }

  // Apply animation configs conditionally based on play state
  const animateProps = isPlaying ? animationConfig.animate : animationConfig.initial;
  
  return (
    <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md flex items-center justify-center relative overflow-hidden" key={animationKey}>
      {/* Background elements for depth */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-4 opacity-5">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="border border-gray-400 rounded"></div>
        ))}
      </div>
      
      {/* Main animated element */}
      <motion.div
        className={`${animationConfig.elementStyle || 'w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg'}`}
        initial={animationConfig.initial}
        animate={animateProps}
        transition={animationConfig.transition}
        whileHover={animationConfig.whileHover}
        whileTap={animationConfig.whileTap}
        drag={animationConfig.drag}
        dragConstraints={animationConfig.dragConstraints}
      >
        {animationConfig.content && (
          <div className="w-full h-full flex items-center justify-center text-white font-medium">
            {animationConfig.content}
          </div>
        )}
      </motion.div>
      
      {/* Secondary elements for complex animations */}
      {animationConfig.secondaryElements?.map((element: SecondaryElement, index: number) => (
        <motion.div
          key={`secondary-${index}`}
          className={element.className}
          style={element.style}
          initial={element.initial}
          animate={isPlaying ? element.animate : element.initial}
          transition={element.transition}
        />
      ))}
    </div>
  );
});

AnimationDisplay.displayName = "AnimationDisplay";
