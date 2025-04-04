
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteParallaxDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 flex flex-col gap-2 overflow-hidden">
        {/* Parallax layers */}
        <div className="relative flex-1 overflow-hidden rounded bg-gradient-to-b from-blue-100 to-blue-200">
          {/* Background layer */}
          <motion.div 
            className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-indigo-900 to-transparent"
            animate={isPlaying ? { y: [-5, 0, -5] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Mountains */}
          <motion.div 
            className="absolute bottom-0 w-full h-16"
            animate={isPlaying ? { y: [-8, 0, -8] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[60px] border-l-transparent border-r-transparent border-b-indigo-800"></div>
            <div className="absolute bottom-0 left-20 w-0 h-0 border-l-[80px] border-r-[80px] border-b-[90px] border-l-transparent border-r-transparent border-b-indigo-700"></div>
            <div className="absolute bottom-0 right-10 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[70px] border-l-transparent border-r-transparent border-b-indigo-900"></div>
          </motion.div>
          
          {/* Middle layer */}
          <motion.div 
            className="absolute bottom-0 w-full h-10 rounded-t-3xl bg-indigo-600"
            animate={isPlaying ? { y: [-15, 0, -15] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Foreground layer */}
          <motion.div 
            className="absolute bottom-0 w-full h-6 rounded-t-3xl bg-indigo-500"
            animate={isPlaying ? { y: [-25, 0, -25] } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating elements */}
          <motion.div 
            className="absolute left-1/4 top-1/3 w-4 h-4 rounded-full bg-white/60"
            animate={isPlaying ? { y: [-10, 0, -10], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute right-1/3 top-1/4 w-3 h-3 rounded-full bg-white/60"
            animate={isPlaying ? { y: [-15, 0, -15], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-center"
              animate={isPlaying ? { y: [-5, 0, -5], scale: [0.95, 1, 0.95] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-32 h-4 mb-2 mx-auto bg-white rounded"></div>
              <div className="w-20 h-6 mx-auto bg-indigo-100 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteParallaxDemo;
