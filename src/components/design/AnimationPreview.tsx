import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesignOption } from "./DesignPreview";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimationPreviewProps {
  animation: DesignOption;
}

const AnimationPreview = ({ animation }: AnimationPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting animations

  // Map animation types to actual animations
  const getAnimationConfig = (animationType: string) => {
    switch (animationType) {
      case "animation-1": // Fade & Slide In
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: "easeOut" }
        };
      case "animation-2": // Scroll Reveal
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay: 0.2 }
        };
      case "animation-3": // Parallax Effects
        return {
          initial: { y: 100 },
          animate: { y: 0 },
          transition: { 
            duration: 1.5, 
            ease: [0.25, 1, 0.5, 1],
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse" as const
          }
        };
      case "animation-4": // 3D Transforms
        return {
          initial: { rotateY: 30, perspective: 1000 },
          animate: { rotateY: -30, perspective: 1000 },
          transition: { 
            duration: 2,
            ease: "easeInOut",
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse" as const
          }
        };
      case "animation-5": // Microinteractions
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          animate: isPlaying ? {
            scale: [1, 1.02, 1],
            transition: { 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse" as const
            }
          } : {}
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        };
    }
  };

  // Reset animation
  const resetAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setKey(prev => prev + 1);
      setIsPlaying(true);
    }, 100);
  };

  const animationConfig = getAnimationConfig(animation.id);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{animation.title}</h3>
      
      <div className="relative h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              key={key}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 w-3/4"
              {...animationConfig}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"/>
              <div className="w-full h-3 bg-gray-200 rounded-full"/>
              <div className="w-4/5 h-3 bg-gray-200 rounded-full"/>
              <div className="w-2/3 h-3 bg-gray-200 rounded-full"/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{animation.description}</p>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetAnimation}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default AnimationPreview;
