
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteMicrointeractionsDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 flex flex-col gap-3">
        {/* Nav */}
        <div className="flex justify-between items-center">
          <div className="w-20 h-5 bg-gray-800 rounded"></div>
          <div className="flex gap-3">
            <motion.div 
              className="w-10 h-3 bg-gray-300 rounded"
              whileHover={{ scale: 1.1, backgroundColor: "#d1d5db" }}
            />
            <motion.div 
              className="w-10 h-3 bg-gray-300 rounded"
              whileHover={{ scale: 1.1, backgroundColor: "#d1d5db" }}
            />
            <motion.div 
              className="w-10 h-3 bg-gray-300 rounded"
              whileHover={{ scale: 1.1, backgroundColor: "#d1d5db" }}
            />
          </div>
        </div>
        
        {/* Interactive elements */}
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          {/* Button with pulse */}
          <motion.div
            className="w-40 h-10 bg-blue-500 rounded-full flex items-center justify-center"
            animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, backgroundColor: "#3b82f6" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-20 h-3 bg-white rounded opacity-80"></div>
          </motion.div>
          
          {/* Card with hover effect */}
          <div className="flex gap-3">
            <motion.div
              className="w-24 h-24 bg-gray-100 rounded-lg p-2 flex flex-col justify-center items-center"
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="w-24 h-24 bg-gray-100 rounded-lg p-2 flex flex-col justify-center items-center"
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-8 h-8 rounded-full bg-green-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteMicrointeractionsDemo;
