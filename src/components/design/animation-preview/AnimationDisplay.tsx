
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimationConfigType } from "../animations/AnimationConfig";

interface AnimationDisplayProps {
  isPlaying: boolean;
  animationKey: number;
  animationConfig: AnimationConfigType;
}

export const AnimationDisplay = memo(({ 
  isPlaying, 
  animationKey, 
  animationConfig 
}: AnimationDisplayProps) => {
  return (
    <div className="relative h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md flex items-center justify-center mb-4">
      <AnimatePresence mode="wait">
        {isPlaying && (
          <motion.div
            key={animationKey}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 w-3/4"
            {...animationConfig}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"/>
            <div className="w-full h-3 bg-gray-200 rounded-full"/>
            <div className="w-4/5 h-3 bg-gray-200 rounded-full"/>
            <div className="w-2/3 h-3 bg-gray-200 rounded-full"/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AnimationDisplay.displayName = "AnimationDisplay";
