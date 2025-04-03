
import { motion } from "framer-motion";
import { ScrollAnimationConfig } from "../interactionConfigs";
import { ChevronDown } from "lucide-react";

interface ScrollAnimationDemoProps {
  interactionConfig: ScrollAnimationConfig;
  isActive: boolean;
}

const ScrollAnimationDemo = ({ interactionConfig, isActive }: ScrollAnimationDemoProps) => {
  // Staggered animation for multiple elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex flex-col items-center justify-start p-4 overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-between mb-4">
        <div className="w-24 h-4 bg-gray-300 rounded-full" />
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <div className="w-4 h-4 rounded-full bg-gray-300" />
        </div>
      </div>
      
      {/* Simulated scroll area */}
      <div className="w-full pb-2 relative">
        {/* Scrolling indicator when not active */}
        {!isActive && (
          <motion.div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-gray-400 opacity-70"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        )}
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isActive ? "show" : "hidden"}
          className="w-full space-y-4"
        >
          <motion.div 
            className="w-full h-16 bg-white rounded-lg shadow-sm p-3 flex flex-col justify-center"
            variants={itemVariants}
          >
            <div className="w-1/2 h-3 bg-gray-200 rounded-full mb-2" />
            <div className="w-5/6 h-3 bg-gray-200 rounded-full" />
          </motion.div>
          
          <motion.div 
            className="w-full h-16 bg-white rounded-lg shadow-sm p-3 flex flex-col justify-center"
            variants={itemVariants}
          >
            <div className="w-2/3 h-3 bg-gray-200 rounded-full mb-2" />
            <div className="w-3/4 h-3 bg-gray-200 rounded-full" />
          </motion.div>
          
          <motion.div 
            className="w-full h-16 bg-white rounded-lg shadow-sm p-3 flex flex-col justify-center"
            variants={itemVariants}
          >
            <div className="w-1/3 h-3 bg-gray-200 rounded-full mb-2" />
            <div className="w-3/5 h-3 bg-gray-200 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-indigo-100 opacity-50 z-0"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-purple-100 opacity-40 z-0"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
};

export default ScrollAnimationDemo;
