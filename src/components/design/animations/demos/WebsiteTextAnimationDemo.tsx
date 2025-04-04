
import { motion } from "framer-motion";

interface AnimationDemoProps {
  isPlaying: boolean;
}

const WebsiteTextAnimationDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3 flex flex-col items-center justify-center gap-8">
        {/* Animated Text Header */}
        <div className="flex flex-col items-center">
          <div className="flex space-x-1">
            {["C", "R", "E", "A", "T", "I", "V", "E"].map((letter, index) => (
              <motion.div
                key={index}
                className="w-6 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded flex items-center justify-center text-white font-bold"
                animate={isPlaying ? {
                  y: [0, -10, 0],
                  color: ["#ffffff", "#f0f9ff", "#ffffff"],
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  repeat: isPlaying ? Infinity : 0,
                  repeatDelay: 1.5,
                  ease: "easeInOut"
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="w-36 h-3 mt-2 bg-gray-200 rounded"
            animate={isPlaying ? {
              width: ["144px", "120px", "144px"],
              backgroundColor: ["#e5e7eb", "#d1d5db", "#e5e7eb"]
            } : {}}
            transition={{
              duration: 2,
              delay: 1.2,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Animated text content */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-full h-3 bg-gray-200 rounded"
              animate={isPlaying ? {
                backgroundColor: ["#e5e7eb", "#d1d5db", "#e5e7eb"],
                width: i === 1 ? "100%" : i === 2 ? ["80%", "90%", "80%"] : ["60%", "70%", "60%"]
              } : {}}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: isPlaying ? Infinity : 0,
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* CTA button with text animation */}
        <motion.div
          className="w-32 h-9 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden"
          animate={isPlaying ? {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          } : {}}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{
            backgroundSize: "200% 200%"
          }}
        >
          <motion.div
            className="w-20 h-3 bg-white/80 rounded"
            animate={isPlaying ? {
              width: ["80px", "60px", "80px"],
            } : {}}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default WebsiteTextAnimationDemo;
