
import { motion } from "framer-motion";
import { HoverEffectConfig } from "../interactionConfigs";

interface HoverEffectDemoProps {
  interactionConfig: HoverEffectConfig;
}

const HoverEffectDemo = ({ interactionConfig }: HoverEffectDemoProps) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
      <motion.div 
        className="bg-white p-6 rounded-lg w-3/4 shadow-sm"
        {...interactionConfig}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <div className="w-full flex flex-col gap-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-full h-4 bg-gray-200 rounded-full" 
            initial={{ width: "70%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.div 
            className="w-5/6 h-4 bg-gray-200 rounded-full"
            initial={{ width: "60%" }}
            animate={{ width: "85%" }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            className="w-4/6 h-4 bg-gray-200 rounded-full"
            initial={{ width: "40%" }}
            animate={{ width: "65%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-200 opacity-50"
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-indigo-200 opacity-50"
        animate={{ y: [0, 10, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
};

export default HoverEffectDemo;
