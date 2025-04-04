
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteFadeSlideDemo = ({ isPlaying }: AnimationDemoProps) => {
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
        {/* Nav */}
        <div className="w-full h-6 flex justify-between items-center">
          <div className="w-20 h-4 bg-blue-500 rounded"></div>
          <div className="flex gap-2">
            <div className="w-10 h-3 bg-gray-300 rounded"></div>
            <div className="w-10 h-3 bg-gray-300 rounded"></div>
            <div className="w-10 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
        
        {/* Hero */}
        <div className="flex-1 flex gap-4 mt-2">
          <div className="w-1/2 flex flex-col justify-center gap-2">
            <motion.div
              className="w-3/4 h-4 bg-gray-800 rounded"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
            <motion.div
              className="w-full h-3 bg-gray-300 rounded"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, delay: 0.1, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
            <motion.div
              className="w-full h-3 bg-gray-300 rounded"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, delay: 0.2, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
            <motion.div
              className="w-20 h-6 bg-blue-500 rounded mt-2"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, delay: 0.3, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
          </div>
          <motion.div
            className="w-1/2 h-32 bg-gray-200 rounded"
            animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
            transition={{ duration: 1.5, delay: 0.4, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
          />
        </div>
      </div>
    </div>
  );
};

export default WebsiteFadeSlideDemo;
