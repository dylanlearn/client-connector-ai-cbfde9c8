
import { motion } from "framer-motion";
import { ColorShiftConfig } from "../interactionConfigs";
import { Paintbrush } from "lucide-react";

interface ColorShiftDemoProps {
  interactionConfig: ColorShiftConfig;
  isActive: boolean;
}

const ColorShiftDemo = ({ interactionConfig, isActive }: ColorShiftDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="flex gap-4">
        <motion.button 
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-medium"
          style={{ 
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          {...interactionConfig}
        >
          <Paintbrush className="h-5 w-5" />
          <span>Click me</span>
        </motion.button>
        
        {isActive && (
          <motion.button 
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-medium bg-emerald-500"
            whileHover={{ 
              backgroundColor: "#059669", 
              scale: 1.05 
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span>And me</span>
          </motion.button>
        )}
      </div>
      
      {/* Help text */}
      <motion.div
        className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isActive ? "Hover over buttons to see additional effects" : "Click 'Demonstrate' to see color shifting"}
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 opacity-30"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ColorShiftDemo;
