
import { motion } from "framer-motion";
import { DragInteractionConfig } from "../interactionConfigs";
import { GripHorizontal } from "lucide-react";

interface DragInteractionDemoProps {
  interactionConfig: DragInteractionConfig;
  isActive: boolean;
}

const DragInteractionDemo = ({ interactionConfig, isActive }: DragInteractionDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      {/* Track line */}
      <div className="absolute w-4/5 h-1 bg-gray-300 rounded-full" />
      
      {/* Decorative dots on track */}
      <div className="absolute w-4/5 flex justify-between">
        <motion.div 
          className="w-3 h-3 rounded-full bg-gray-400"
          animate={{ scale: isActive ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="w-3 h-3 rounded-full bg-gray-400"
          animate={{ scale: isActive ? 1.2 : 1, backgroundColor: isActive ? "#a855f7" : "#9ca3af" }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="w-3 h-3 rounded-full bg-gray-400"
          animate={{ scale: isActive ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Draggable element */}
      <motion.div 
        className="absolute w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg flex flex-col items-center justify-center text-white cursor-grab active:cursor-grabbing z-10"
        whileTap={{ scale: 1.1, cursor: "grabbing" }}
        {...interactionConfig}
        style={{ 
          boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)",
        }}
      >
        <GripHorizontal className="h-5 w-5 mb-1" />
        <p className="text-xs font-semibold">Drag me</p>
        
        {/* Drag reactive glow effect */}
        <motion.div 
          className="absolute -inset-1.5 bg-white rounded-2xl z-[-1]"
          animate={{ 
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Help text for initial state */}
      {!isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click "Demonstrate" to activate drag interaction
        </motion.div>
      )}
      
      {/* Decorative background elements */}
      <motion.div 
        className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 opacity-50"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -top-5 -left-5 w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 opacity-40"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
};

export default DragInteractionDemo;
