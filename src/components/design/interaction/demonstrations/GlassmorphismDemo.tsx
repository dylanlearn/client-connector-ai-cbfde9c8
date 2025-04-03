
import { motion } from "framer-motion";
import { GlassmorphismConfig } from "../interactionConfigs";
import { Layers, Sparkles } from "lucide-react";

interface GlassmorphismDemoProps {
  interactionConfig: GlassmorphismConfig;
  isActive: boolean;
}

const GlassmorphismDemo = ({ interactionConfig, isActive }: GlassmorphismDemoProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-100 to-purple-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      {/* Background colorful shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-4 left-8 w-20 h-20 rounded-full bg-blue-400 opacity-30"
          animate={isActive ? { 
            y: [0, -10, 0], 
            x: [0, 5, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-4 right-8 w-24 h-24 rounded-full bg-purple-400 opacity-30"
          animate={isActive ? { 
            y: [0, 10, 0], 
            x: [0, -5, 0],
            scale: [1, 1.15, 1]
          } : {}}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-pink-400 opacity-30"
          animate={isActive ? { 
            y: [0, 15, 0], 
            x: [0, 10, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 0.7 }}
        />
      </div>
      
      {/* Glassmorphism card */}
      <motion.div
        className="relative w-56 rounded-xl overflow-hidden"
        style={{ backdropFilter: isActive ? "blur(10px)" : "blur(0px)" }}
        variants={cardVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.div
          className="absolute inset-0 bg-white rounded-xl"
          initial={{ opacity: 0.1 }}
          animate={isActive ? { opacity: 0.2 } : { opacity: 0.1 }}
          transition={{ duration: 0.8 }}
        />
        
        <div className="relative p-4 z-10">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/30 mr-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="h-3 w-24 bg-white/60 rounded-full"></div>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="h-2 w-full bg-white/40 rounded-full"></div>
            <div className="h-2 w-5/6 bg-white/40 rounded-full"></div>
            <div className="h-2 w-4/6 bg-white/40 rounded-full"></div>
          </div>
          
          <div className="pt-2 mt-2 border-t border-white/20 flex justify-between">
            <div className="h-6 w-16 bg-indigo-500/80 rounded-md"></div>
            <div className="flex space-x-1">
              <div className="w-6 h-6 rounded-full bg-white/30"></div>
              <div className="w-6 h-6 rounded-full bg-white/30"></div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Modal overlay effect */}
      {isActive && (
        <motion.div
          className="absolute top-6 right-6 w-24 h-24 overflow-hidden rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative p-3 flex flex-col items-center justify-center h-full">
            <Layers className="h-6 w-6 text-white/90 mb-1" />
            <div className="h-2 w-12 bg-white/60 rounded-full"></div>
            <div className="h-2 w-16 bg-white/40 rounded-full mt-1"></div>
          </div>
        </motion.div>
      )}
      
      {/* Help text for initial state */}
      {!isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4 bg-white/60 backdrop-blur-sm py-1 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click "Demonstrate" to see glassmorphism and layering effects
        </motion.div>
      )}
    </div>
  );
};

export default GlassmorphismDemo;
