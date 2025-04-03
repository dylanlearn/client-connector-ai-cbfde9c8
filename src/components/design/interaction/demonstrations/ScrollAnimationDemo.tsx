
import { motion } from "framer-motion";
import { ScrollAnimationConfig } from "../interactionConfigs";

interface ScrollAnimationDemoProps {
  interactionConfig: ScrollAnimationConfig;
  isActive: boolean;
}

const ScrollAnimationDemo = ({ interactionConfig, isActive }: ScrollAnimationDemoProps) => {
  return (
    <div className="relative bg-gray-100 h-64 rounded-md flex flex-col items-center justify-start p-4 overflow-hidden">
      <div className="w-full flex justify-between mb-4">
        <div className="w-24 h-4 bg-gray-300 rounded-full" />
        <div className="w-32 h-4 bg-gray-300 rounded-full" />
      </div>
      
      <div className="w-full space-y-4">
        <motion.div 
          className="w-full h-12 bg-white rounded-md shadow"
          {...interactionConfig}
        />
        
        {isActive && (
          <>
            <motion.div 
              className="w-full h-12 bg-white rounded-md shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            />
            <motion.div 
              className="w-full h-12 bg-white rounded-md shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ScrollAnimationDemo;
