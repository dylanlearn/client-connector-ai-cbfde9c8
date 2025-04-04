
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteElasticMotionDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="w-20 h-5 bg-gray-800 rounded"></div>
          <div className="flex gap-2">
            <motion.div 
              className="w-5 h-5 rounded-full bg-gray-200"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.div 
              className="w-5 h-5 rounded-full bg-gray-200"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.div 
              className="w-5 h-5 rounded-full bg-gray-200"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
        </div>
        
        {/* Main content with elastic motion */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          {/* Elastic card */}
          <motion.div
            className="w-56 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-4 flex flex-col justify-center"
            animate={isPlaying ? {
              scale: [1, 1.05, 0.95, 1.02, 1],
              rotate: [0, 2, -2, 1, 0],
              y: [0, -5, 5, -2, 0],
            } : {}}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <div className="w-32 h-4 bg-white/30 rounded mb-2"></div>
            <div className="w-full h-3 bg-white/20 rounded mb-1"></div>
            <div className="w-3/4 h-3 bg-white/20 rounded"></div>
          </motion.div>
          
          {/* Elastic buttons */}
          <div className="flex gap-4">
            <motion.div
              className="w-24 h-8 bg-indigo-500 rounded-full flex items-center justify-center"
              animate={isPlaying ? {
                scale: [1, 1.1, 0.9, 1.05, 1],
                rotate: [0, 1, -1, 0.5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.2
              }}
            >
              <div className="w-12 h-2.5 bg-white/80 rounded"></div>
            </motion.div>
            
            <motion.div
              className="w-24 h-8 bg-gray-200 rounded-full flex items-center justify-center"
              animate={isPlaying ? {
                scale: [1, 1.08, 0.92, 1.04, 1],
                rotate: [0, -1, 1, -0.5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.5
              }}
            >
              <div className="w-12 h-2.5 bg-gray-400 rounded"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteElasticMotionDemo;
