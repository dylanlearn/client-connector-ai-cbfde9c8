
import { motion } from "framer-motion";
import { IntentBasedMotionConfig } from "../interactionConfigs";
import { MousePointerClick, Target } from "lucide-react";

interface IntentBasedMotionDemoProps {
  interactionConfig: IntentBasedMotionConfig;
  isActive: boolean;
}

const IntentBasedMotionDemo = ({ interactionConfig, isActive }: IntentBasedMotionDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 opacity-5">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-gray-400 rounded"></div>
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-6 z-10">
        <div className="flex items-center justify-center">
          <Target className="w-6 h-6 text-indigo-600 mr-2" />
          <p className="text-sm font-medium text-gray-700">Intent-Based Motion</p>
        </div>
        
        <div className="flex gap-6">
          {/* Hover element */}
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md flex flex-col items-center justify-center text-white"
            whileHover={interactionConfig.whileHover}
            whileTap={interactionConfig.whileTap}
            animate={isActive ? {
              scale: [1, 1.05, 1],
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            } : {}}
          >
            <MousePointerClick className="h-8 w-8 mb-2" />
            <p className="text-xs font-semibold">Hover me</p>
          </motion.div>
          
          {/* Focus element with emphasis */}
          <motion.div
            className="w-24 h-24 bg-white rounded-lg shadow-md border-2 border-transparent flex flex-col items-center justify-center"
            animate={isActive ? {
              borderColor: ["transparent", "rgba(79, 70, 229, 1)", "transparent"],
              boxShadow: [
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              ],
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            } : {}}
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(79, 70, 229, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
            </div>
            <p className="text-xs font-semibold text-gray-700">Focus me</p>
          </motion.div>
        </div>
        
        {/* Return behavior demo */}
        {isActive && (
          <motion.div
            className="flex gap-4 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="w-4 h-4 bg-gray-400 rounded-full"
              animate={{
                x: [0, 20, 0],
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              }}
            />
            <motion.div
              className="w-4 h-4 bg-gray-400 rounded-full"
              animate={{
                x: [0, 20, 0],
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }
              }}
            />
            <motion.div
              className="w-4 h-4 bg-gray-400 rounded-full"
              animate={{
                x: [0, 20, 0],
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.4 }
              }}
            />
          </motion.div>
        )}
      </div>
      
      {/* Help text for initial state */}
      {!isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click "Demonstrate" and hover over elements to see intent-based motion
        </motion.div>
      )}
    </div>
  );
};

export default IntentBasedMotionDemo;
