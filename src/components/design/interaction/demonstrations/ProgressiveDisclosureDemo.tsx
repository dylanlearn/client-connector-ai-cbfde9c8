
import { motion } from "framer-motion";
import { ProgressiveDisclosureConfig } from "../interactionConfigs";
import { Layers } from "lucide-react";

interface ProgressiveDisclosureDemoProps {
  interactionConfig: ProgressiveDisclosureConfig;
  isActive: boolean;
}

const ProgressiveDisclosureDemo = ({ interactionConfig, isActive }: ProgressiveDisclosureDemoProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 opacity-5">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-gray-400 rounded"></div>
        ))}
      </div>
      
      <div className="w-full max-w-sm px-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full shadow-md">
            <Layers className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="p-4 border-b border-gray-100">
            <motion.h3 
              className="font-medium text-gray-800 text-center"
              variants={itemVariants}
            >
              Onboarding Steps
            </motion.h3>
          </div>
          
          <div className="p-4">
            <motion.div 
              className="flex items-center mb-4 bg-indigo-50 p-3 rounded-md"
              variants={itemVariants}
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3 text-xs font-bold">1</div>
              <div className="flex-1">
                <div className="h-3 w-40 bg-indigo-200 rounded-full"></div>
                <div className="h-2 w-24 bg-indigo-100 rounded-full mt-2"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center mb-4 bg-indigo-50 p-3 rounded-md"
              variants={itemVariants}
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3 text-xs font-bold">2</div>
              <div className="flex-1">
                <div className="h-3 w-48 bg-indigo-200 rounded-full"></div>
                <div className="h-2 w-32 bg-indigo-100 rounded-full mt-2"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center bg-indigo-50 p-3 rounded-md"
              variants={itemVariants}
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3 text-xs font-bold">3</div>
              <div className="flex-1">
                <div className="h-3 w-36 bg-indigo-200 rounded-full"></div>
                <div className="h-2 w-28 bg-indigo-100 rounded-full mt-2"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Help text for initial state */}
      {!isActive && (
        <motion.div
          className="absolute bottom-4 text-xs text-gray-500 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click "Demonstrate" to see progressive disclosure animation
        </motion.div>
      )}
    </div>
  );
};

export default ProgressiveDisclosureDemo;
