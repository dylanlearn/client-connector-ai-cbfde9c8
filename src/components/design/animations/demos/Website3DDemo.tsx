
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const Website3DDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          {/* 3D Card */}
          <motion.div
            className="w-56 h-40 bg-white rounded-xl shadow-xl p-4 flex flex-col gap-3"
            style={{ transformStyle: "preserve-3d" }}
            animate={isPlaying ? { rotateY: [20, -20, 20], rotateX: [5, -5, 5] } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
            </div>
            
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
              <div className="w-3/5 h-3 bg-gray-200 rounded"></div>
            </div>
            
            <div className="w-full flex justify-between">
              <div className="w-16 h-6 rounded bg-blue-500"></div>
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Background elements */}
          <motion.div
            className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-30 -top-5 -right-5"
            animate={isPlaying ? { scale: [1, 1.2, 1], rotate: [0, 15, 0] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-yellow-100 to-green-100 opacity-30 -bottom-5 -left-5"
            animate={isPlaying ? { scale: [1, 1.3, 1], rotate: [0, -15, 0] } : {}}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Website3DDemo;
