
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const DefaultDemo = () => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <motion.div 
        className="flex flex-col items-center text-gray-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-12 w-12 text-gray-300 mb-3" />
        </motion.div>
        <p className="text-sm font-medium mb-2">Select an interaction to preview</p>
        
        <motion.div
          className="flex items-center text-xs text-gray-300 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span>Swipe for inspiration</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="h-3 w-3 ml-1" />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Decorative background elements with enhanced animations */}
      <motion.div 
        className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 opacity-30"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-8 left-8 w-16 h-16 rounded-full bg-gradient-to-tr from-pink-100 to-purple-100 opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -5, 0],
          y: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      <motion.div 
        className="absolute top-20 right-20 w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 opacity-30"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -8, 0],
          y: [0, -3, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
};

export default DefaultDemo;
