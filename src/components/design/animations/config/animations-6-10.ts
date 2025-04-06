
import { AnimationConfigType, AnimationPreferenceOptions } from "./types";

/**
 * Configuration for advanced animations (6-10)
 */
export const getAdvancedAnimationConfig = (
  animationType: string,
  options?: AnimationPreferenceOptions
): AnimationConfigType => {
  const speedFactor = options?.speedFactor || 1;
  const intensityFactor = options?.intensityFactor || 1;
  
  // Adjust duration based on speed factor
  const adjustDuration = (baseDuration: number) => baseDuration / speedFactor;
  
  // Adjust intensity of animations
  const adjustIntensity = (baseValue: number) => baseValue * intensityFactor;

  switch (animationType) {
    case "magnetic":
      return {
        initial: { scale: 1 },
        animate: { scale: 1 },
        whileHover: { 
          scale: adjustIntensity(1.05),
          transition: { duration: adjustDuration(0.2), type: "spring", stiffness: 300 }
        },
        whileTap: { scale: adjustIntensity(0.95) },
        transition: { duration: adjustDuration(0.3) },
        elementStyle: "w-32 h-32 bg-gradient-to-tr from-indigo-600 to-blue-400 rounded-xl shadow-lg flex items-center justify-center",
        content: "Magnetic",
        drag: true,
        dragConstraints: { left: -100, right: 100, top: -50, bottom: 50 }
      };

    case "morph":
      return {
        initial: { borderRadius: "16px" },
        animate: { borderRadius: "16px" },
        whileHover: { 
          borderRadius: "50%",
          transition: { duration: adjustDuration(0.5) }
        },
        transition: { duration: adjustDuration(0.5), ease: "easeInOut" },
        elementStyle: "w-32 h-32 bg-gradient-to-tr from-purple-600 to-pink-400 shadow-lg flex items-center justify-center text-white",
        content: "Morph"
      };

    case "particle":
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        whileHover: { 
          scale: adjustIntensity(1.1)
        },
        transition: { duration: adjustDuration(0.3) },
        elementStyle: "w-32 h-32 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg shadow-lg flex items-center justify-center text-white",
        content: "Particles",
        secondaryElements: Array.from({ length: 8 }).map((_, i) => ({
          className: `absolute w-4 h-4 rounded-full bg-amber-300`,
          style: { 
            left: `calc(50% + ${Math.sin(i * (Math.PI * 2) / 8) * 40}px)`,
            top: `calc(50% + ${Math.cos(i * (Math.PI * 2) / 8) * 40}px)`,
          },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: [0, 1, 0], scale: [0, 1, 0], x: [0, Math.sin(i * (Math.PI * 2) / 8) * 100, 0], y: [0, Math.cos(i * (Math.PI * 2) / 8) * 100, 0] },
          transition: { duration: adjustDuration(2), repeat: Infinity, repeatDelay: 0.2, ease: "easeOut" }
        }))
      };

    case "parallax":
      return {
        initial: { y: 0 },
        animate: { y: 0 },
        transition: { duration: adjustDuration(0.5) },
        elementStyle: "w-40 h-32 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg shadow-xl flex items-center justify-center text-white overflow-hidden relative",
        content: "Parallax",
        secondaryElements: [
          {
            className: "absolute w-full h-full bg-opacity-30 bg-teal-300 z-10",
            initial: { y: 0 },
            animate: { y: [-5, 5, -5] },
            transition: { duration: adjustDuration(4), repeat: Infinity, ease: "easeInOut" }
          },
          {
            className: "absolute w-full h-full bg-pattern-dots bg-opacity-10 z-20",
            initial: { y: 0 },
            animate: { y: [5, -5, 5] },
            transition: { duration: adjustDuration(3), repeat: Infinity, ease: "easeInOut", delay: 0.1 }
          }
        ]
      };

    case "glitch":
      return {
        initial: { x: 0, y: 0 },
        animate: { x: 0, y: 0 },
        whileHover: { 
          x: [0, -3, 5, -2, 0],
          y: [0, 2, -4, 6, 0],
          transition: { duration: adjustDuration(0.5), repeat: 2 }
        },
        transition: { duration: adjustDuration(0.2) },
        elementStyle: "w-32 h-32 bg-gray-900 border-2 border-cyan-500 rounded-md flex items-center justify-center text-white relative overflow-hidden",
        content: "Glitch",
        secondaryElements: [
          {
            className: "absolute w-full h-full bg-cyan-500 bg-opacity-20 left-0 top-0",
            initial: { x: 0, opacity: 0 },
            animate: { x: [0, -5, 10, -10, 0], opacity: [0, 1, 0.5, 0.1, 0] },
            transition: { duration: adjustDuration(0.2), repeat: Infinity, repeatDelay: 3 }
          },
          {
            className: "absolute w-full h-full bg-red-500 bg-opacity-20 left-0 top-0",
            initial: { x: 0, opacity: 0 },
            animate: { x: [0, 5, -10, 5, 0], opacity: [0, 0.5, 1, 0.5, 0] },
            transition: { duration: adjustDuration(0.2), repeat: Infinity, repeatDelay: 3, delay: 0.05 }
          }
        ]
      };

    default:
      return {
        initial: {},
        animate: {},
        transition: {}
      };
  }
};
