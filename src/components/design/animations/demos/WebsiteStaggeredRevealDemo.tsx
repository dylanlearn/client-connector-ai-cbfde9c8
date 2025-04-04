
import { useEffect, useRef, memo } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

// Memoized component to prevent unnecessary re-renders
const WebsiteStaggeredRevealDemo = memo(({ isPlaying }: AnimationDemoProps) => {
  const containerControls = useAnimationControls();
  // Use ref to track animation state
  const animationRef = useRef<{ timers: NodeJS.Timeout[], active: boolean }>({
    timers: [],
    active: false
  });
  
  // Define animation variants once, outside the render function
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
  
  useEffect(() => {
    // Efficient animation loop with proper cleanup
    if (isPlaying) {
      animationRef.current.active = true;
      
      const runAnimation = async () => {
        if (!animationRef.current.active) return;
        
        await containerControls.start("visible");
        const timer1 = setTimeout(async () => {
          if (!animationRef.current.active) return;
          
          await containerControls.start("hidden");
          const timer2 = setTimeout(() => {
            if (animationRef.current.active) {
              runAnimation();
            }
          }, 500);
          
          animationRef.current.timers.push(timer2);
        }, 2000);
        
        animationRef.current.timers.push(timer1);
      };
      
      runAnimation();
    } else {
      // Stop animation
      animationRef.current.active = false;
      containerControls.stop();
    }
    
    // Proper cleanup to prevent memory leaks
    return () => {
      animationRef.current.active = false;
      containerControls.stop();
      
      // Clear all timers
      animationRef.current.timers.forEach(timer => clearTimeout(timer));
      animationRef.current.timers = [];
    };
  }, [isPlaying, containerControls]);
  
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
});

WebsiteStaggeredRevealDemo.displayName = "WebsiteStaggeredRevealDemo";

export default WebsiteStaggeredRevealDemo;
