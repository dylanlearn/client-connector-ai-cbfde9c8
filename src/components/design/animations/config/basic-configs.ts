
import { AnimationConfigType } from "./types";

/**
 * Basic animation configurations
 */
export const basicConfigs: Record<string, (isPlaying: boolean) => AnimationConfigType> = {
  // Fade & Slide In Animation
  'animation-1': (isPlaying) => ({
    initial: { opacity: 0, y: 20 },
    animate: isPlaying ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.5 },
    elementStyle: "w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg"
  }),
  
  // Scroll Reveal Animation
  'animation-2': (isPlaying) => ({
    initial: { opacity: 0, y: 50 },
    animate: isPlaying 
      ? { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" }} 
      : { opacity: 0, y: 50 },
    elementStyle: "w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg"
  }),
  
  // Parallax Effects
  'animation-3': (isPlaying) => ({
    initial: { scale: 1 },
    animate: isPlaying 
      ? { scale: [1, 1.05, 0.95, 1], y: [0, -10, 10, 0], rotate: [0, 2, -2, 0] } 
      : { scale: 1 },
    transition: { duration: 4, repeat: Infinity, repeatType: "reverse" },
    elementStyle: "w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg"
  }),
  
  // 3D Transforms
  'animation-4': (isPlaying) => ({
    initial: { rotateY: 0, rotateX: 0, z: 0 },
    animate: isPlaying 
      ? { rotateY: [0, 180, 0], rotateX: [0, 10, 0], z: [0, 50, 0] } 
      : { rotateY: 0, rotateX: 0, z: 0 },
    transition: { duration: 4, repeat: Infinity, repeatDelay: 0.5 },
    elementStyle: "w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg"
  }),
  
  // Microinteractions
  'animation-5': (isPlaying) => ({
    initial: { scale: 1 },
    animate: { scale: 1 },
    whileHover: { scale: 1.1, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
    whileTap: { scale: 0.95 },
    elementStyle: "w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg cursor-pointer",
    content: "Hover me"
  })
};
