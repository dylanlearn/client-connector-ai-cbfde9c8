
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
        <p className="text-sm font-medium">Select an interaction to preview</p>
      </motion.div>
      
      {/* Decorative background elements */}
      <motion.div 
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gray-200 opacity-30"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gray-200 opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -5, 0],
          y: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
};

export default DefaultDemo;
