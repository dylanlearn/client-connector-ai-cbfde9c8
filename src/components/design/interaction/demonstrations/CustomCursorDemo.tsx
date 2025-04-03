
import { motion } from "framer-motion";
import { CustomCursorConfig } from "../interactionConfigs";
import { Hand, MousePointer, LucideIcon } from "lucide-react";

interface CustomCursorDemoProps {
  interactionConfig: CustomCursorConfig;
  isDemonstrating: boolean;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CustomCursorDemo = ({ 
  interactionConfig, 
  isDemonstrating, 
  handleMouseMove 
}: CustomCursorDemoProps) => {
  // Custom cursor icons to cycle through
  const cursorIcons: LucideIcon[] = [Hand, MousePointer];

  return (
    <div 
      className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {!isDemonstrating ? (
        <motion.div 
          className="text-center text-gray-500 max-w-[200px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm">Click 'Demonstrate' and move your mouse to see custom cursor effects</p>
        </motion.div>
      ) : (
        <motion.div 
          className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-4 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border border-gray-300 rounded-md"></div>
          ))}
        </motion.div>
      )}
      
      {isDemonstrating && (
        <>
          {/* Instruction text that fades out */}
          <motion.div
            className="absolute top-4 left-0 right-0 text-center text-xs text-gray-500 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, times: [0, 0.1, 1] }}
          >
            Move your mouse around
          </motion.div>
          
          {/* Main custom cursor */}
          <motion.div 
            className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg z-10"
            style={{ 
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.3)",
              mixBlendMode: "lighten" 
            }}
            {...interactionConfig}
          >
            <Hand className="h-6 w-6" />
          </motion.div>
          
          {/* Echo effect cursors */}
          <motion.div 
            className="absolute w-14 h-14 rounded-full bg-purple-400 opacity-20 pointer-events-none"
            animate={{
              x: interactionConfig.animate.x,
              y: interactionConfig.animate.y,
              scale: [1, 1.2, 1],
            }}
            transition={{
              x: { ...interactionConfig.animate.transition, delay: 0.1 },
              y: { ...interactionConfig.animate.transition, delay: 0.1 },
              scale: { duration: 2, repeat: Infinity }
            }}
          />
          
          <motion.div 
            className="absolute w-36 h-36 rounded-full border-2 border-purple-300 opacity-10 pointer-events-none"
            animate={{
              x: interactionConfig.animate.x,
              y: interactionConfig.animate.y,
            }}
            transition={{
              x: { ...interactionConfig.animate.transition, delay: 0.2 },
              y: { ...interactionConfig.animate.transition, delay: 0.2 },
            }}
          />
          
          {/* Particles following cursor */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 pointer-events-none"
              animate={{
                x: interactionConfig.animate.x + (Math.random() * 30 - 15),
                y: interactionConfig.animate.y + (Math.random() * 30 - 15),
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                x: { ...interactionConfig.animate.transition, delay: i * 0.05 },
                y: { ...interactionConfig.animate.transition, delay: i * 0.05 },
                opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.2 },
                scale: { duration: 1.5, repeat: Infinity, delay: i * 0.2 }
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CustomCursorDemo;
