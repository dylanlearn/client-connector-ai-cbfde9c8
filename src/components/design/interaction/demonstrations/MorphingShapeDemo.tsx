
import { motion } from "framer-motion";
import { MorphingShapeConfig } from "../interactionConfigs";
import { Shapes } from "lucide-react";

interface MorphingShapeDemoProps {
  interactionConfig: MorphingShapeConfig;
  isActive: boolean;
}

const MorphingShapeDemo = ({ interactionConfig, isActive }: MorphingShapeDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 opacity-5">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-gray-400 rounded"></div>
        ))}
      </div>
      
      <div className="z-10 flex flex-col items-center gap-8">
        {/* Primary morphing shape */}
        <motion.div 
          className="w-28 h-28 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg flex items-center justify-center"
          initial={interactionConfig.initial}
          animate={isActive ? interactionConfig.animate : interactionConfig.initial}
          style={{ borderRadius: "30%" }}
        >
          <Shapes className="text-white h-12 w-12" />
        </motion.div>
        
        {/* Secondary morphing elements */}
        {isActive && (
          <div className="flex gap-8">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500"
              initial={{ borderRadius: "10%" }}
              animate={{
                borderRadius: ["10%", "50%", "30%", "10%"],
                transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
              }}
            />
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500"
              initial={{ borderRadius: "50%" }}
              animate={{
                borderRadius: ["50%", "10%", "70% 30% 30% 70% / 60% 40% 60% 40%", "50%"],
                transition: { duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.5 }
              }}
            />
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ borderRadius: "30%" }}
              animate={{
                borderRadius: ["30%", "70% 30% 30% 70% / 60% 40% 60% 40%", "50%", "30%"],
                transition: { duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }
              }}
            />
          </div>
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
          Click "Demonstrate" to see shape morphing transitions
        </motion.div>
      )}
    </div>
  );
};

export default MorphingShapeDemo;
