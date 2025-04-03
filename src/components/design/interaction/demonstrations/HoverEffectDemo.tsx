
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { HoverEffectConfig } from "../interactionConfigs";

interface HoverEffectDemoProps {
  interactionConfig: HoverEffectConfig;
}

const HoverEffectDemo = ({ interactionConfig }: HoverEffectDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <motion.div 
        className="bg-white p-6 rounded-lg w-3/4 shadow-sm relative z-10 overflow-hidden group"
        {...interactionConfig}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        {/* Gradient shine effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="w-full flex flex-col gap-4 relative z-10">
          <motion.div 
            className="flex items-center justify-between mb-2"
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
            >
              <ArrowUpRight className="h-4 w-4 text-indigo-500" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full" 
            initial={{ width: "70%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          
          <div className="flex justify-between items-center">
            <motion.div 
              className="w-5/6 h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"
              initial={{ width: "60%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
            />
            
            <motion.div
              className="h-4 w-4 rounded-full bg-purple-100"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <motion.div 
            className="w-4/6 h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"
            initial={{ width: "40%" }}
            animate={{ width: "65%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Enhanced background decorative elements */}
      <motion.div 
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-200/30 to-blue-200/30 blur-xl"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/20 to-pink-200/20 blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
};

export default HoverEffectDemo;
