
import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteStaggeredRevealDemo = ({ isPlaying }: AnimationDemoProps) => {
  const containerControls = useAnimationControls();
  
  useEffect(() => {
    if (isPlaying) {
      const animation = async () => {
        await containerControls.start("visible");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await containerControls.start("hidden");
        await new Promise(resolve => setTimeout(resolve, 500));
        animation();
      };
      animation();
    } else {
      containerControls.stop();
    }
    
    return () => {
      containerControls.stop();
    };
  }, [isPlaying, containerControls]);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 }
    }
  };
  
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-8 bg-gray-800 flex items-center px-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <div className="w-32 mx-auto h-4 bg-gray-700 rounded-full"></div>
      </div>
      
      <div className="bg-white h-56 p-4 overflow-hidden">
        {/* Header */}
        <motion.div 
          className="w-full flex justify-center mb-4"
          variants={container}
          initial="hidden"
          animate={containerControls}
        >
          <motion.div variants={item} className="w-40 h-6 bg-indigo-600 rounded"></motion.div>
        </motion.div>
        
        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-4"
          variants={container}
          initial="hidden"
          animate={containerControls}
        >
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              variants={item}
              className="bg-gray-100 rounded p-2 flex flex-col items-center"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Content */}
        <motion.div
          className="space-y-2"
          variants={container}
          initial="hidden"
          animate={containerControls}
        >
          <motion.div variants={item} className="w-full h-3 bg-gray-200 rounded"></motion.div>
          <motion.div variants={item} className="w-5/6 h-3 bg-gray-200 rounded"></motion.div>
          <motion.div variants={item} className="w-4/6 h-3 bg-gray-200 rounded"></motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebsiteStaggeredRevealDemo;
