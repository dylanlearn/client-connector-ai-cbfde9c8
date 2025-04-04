
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteFloatingElementsDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 relative">
        {/* Background color */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="w-24 h-6 bg-indigo-600 rounded"></div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100"></div>
              <div className="w-6 h-6 rounded-full bg-indigo-100"></div>
              <div className="w-6 h-6 rounded-full bg-indigo-100"></div>
            </div>
          </div>
          
          {/* Main content with floating elements */}
          <div className="flex-1 flex flex-col justify-center items-center relative">
            {/* Center element */}
            <div className="text-center z-10 mb-4">
              <div className="w-40 h-6 bg-gray-800 rounded mx-auto mb-2"></div>
              <div className="w-64 h-4 bg-gray-600 rounded mx-auto"></div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-0 left-6 w-10 h-10 rounded-full bg-blue-200"
              animate={isPlaying ? { 
                y: [0, -15, 0],
                rotate: [0, 10, 0]
              } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute top-10 right-10 w-8 h-8 rounded-full bg-purple-200"
              animate={isPlaying ? { 
                y: [0, -10, 0],
                rotate: [0, -10, 0]
              } : {}}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            
            <motion.div
              className="absolute bottom-5 left-1/4 w-12 h-12 rounded-full bg-indigo-200"
              animate={isPlaying ? { 
                y: [0, -20, 0],
                rotate: [0, 15, 0]
              } : {}}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            <motion.div
              className="absolute bottom-10 right-1/4 w-6 h-6 rounded-full bg-pink-200"
              animate={isPlaying ? { 
                y: [0, -8, 0],
                rotate: [0, -8, 0]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
            
            {/* Action button */}
            <motion.div
              className="w-40 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
              animate={isPlaying ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-20 h-3 bg-white rounded opacity-80"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFloatingElementsDemo;
