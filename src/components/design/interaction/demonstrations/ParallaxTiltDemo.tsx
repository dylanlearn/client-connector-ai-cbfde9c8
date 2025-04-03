
import { motion } from "framer-motion";
import { ParallaxTiltConfig } from "../interactionConfigs";
import { Move3d } from "lucide-react";

interface ParallaxTiltDemoProps {
  interactionConfig: ParallaxTiltConfig;
  isActive: boolean;
}

const ParallaxTiltDemo = ({ interactionConfig, isActive }: ParallaxTiltDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <motion.div 
        className="relative w-52 h-32 rounded-lg bg-white shadow-xl p-4 flex flex-col justify-between"
        style={{ 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
        {...interactionConfig}
      >
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Move3d className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="w-16 h-2 bg-gray-200 rounded-full mb-1.5" />
            <div className="w-12 h-2 bg-gray-200 rounded-full" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full" />
          <div className="w-3/4 h-2 bg-gray-200 rounded-full" />
        </div>
        
        <div className="w-20 h-6 bg-indigo-100 rounded-md" />
        
        {/* Inner elements with different 3D positions */}
        <motion.div 
          className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-yellow-100"
          style={{ 
            transformStyle: "preserve-3d", 
            transform: "translateZ(20px)" 
          }}
        />
        
        <motion.div 
          className="absolute left-8 top-12 w-3 h-3 rounded-full bg-green-100"
          style={{ 
            transformStyle: "preserve-3d", 
            transform: "translateZ(30px)" 
          }}
        />
      </motion.div>
      
      {/* Help text */}
      <motion.div
        className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isActive ? "Move your cursor to see the 3D tilt effect" : "Click 'Demonstrate' to activate tilt"}
      </motion.div>
    </div>
  );
};

export default ParallaxTiltDemo;
