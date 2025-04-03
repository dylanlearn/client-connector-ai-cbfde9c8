
import { motion } from "framer-motion";
import { MagneticElementConfig } from "../interactionConfigs";
import { Magnet } from "lucide-react";

interface MagneticElementDemoProps {
  interactionConfig: MagneticElementConfig;
  isActive: boolean;
}

const MagneticElementDemo = ({ interactionConfig, isActive }: MagneticElementDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <motion.div 
        className="absolute w-20 h-20 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg flex flex-col items-center justify-center text-white cursor-pointer"
        style={{ 
          boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.5)",
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
        {...interactionConfig}
      >
        <Magnet className="h-8 w-8 mb-1" />
        <p className="text-xs font-semibold">Magnetic</p>
      </motion.div>
      
      {/* Help text for initial state */}
      {!isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click "Demonstrate" and move cursor to see magnetic effect
        </motion.div>
      )}
      
      {/* Decorative grid background */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 opacity-5">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-gray-400 rounded"></div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -bottom-10 right-10 w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-pink-100 opacity-40"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default MagneticElementDemo;
