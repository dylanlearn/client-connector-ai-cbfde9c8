
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteScrollRevealDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 flex flex-col gap-2">
        {/* Content with scroll reveal effect */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="h-10 w-full flex justify-center items-center">
            <div className="w-1/2 h-4 bg-gray-800 rounded"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
              transition={{ duration: 1.2, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
              transition={{ duration: 1.2, delay: 0.2, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            >
              <div className="w-8 h-8 rounded-full bg-green-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
              transition={{ duration: 1.2, delay: 0.4, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
          </div>
          
          <motion.div
            className="h-20 bg-gray-100 rounded p-3 flex gap-4"
            animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
            transition={{ duration: 1.2, delay: 0.6, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
          >
            <div className="w-1/3 bg-gray-200 rounded"></div>
            <div className="w-2/3 flex flex-col justify-center gap-2">
              <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
              <div className="w-full h-3 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteScrollRevealDemo;
