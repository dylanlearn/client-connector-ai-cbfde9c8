import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesignOption } from "./DesignPreview";
import { Play, Pause, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define a type for the animation demos
interface AnimationDemoProps {
  isPlaying: boolean;
  animationConfig: any;
}

interface AnimationPreviewProps {
  animation: DesignOption;
}

const AnimationPreview = ({ animation }: AnimationPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting animations
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);

  // Map animation types to actual animations
  const getAnimationConfig = (animationType: string) => {
    switch (animationType) {
      case "animation-1": // Fade & Slide In
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { 
            duration: 1.8, // Slower fade
            ease: "easeOut",
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 3,
            repeatType: "reverse" as const
          }
        };
      case "animation-2": // Scroll Reveal
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { 
            duration: 1.5, // Slower reveal
            delay: 0.2,
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 3,
            repeatType: "reverse" as const
          }
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
      case "animation-6": // Text Animation
        return {
          initial: { opacity: 0, y: 50 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 1,
              staggerChildren: 0.1,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 3,
              repeatType: "reverse" as const
            }
          }
        };
      case "animation-7": // Staggered Reveal
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 4,
              repeatType: "reverse" as const
            }
          }
        };
      case "animation-8": // Floating Elements
        return {
          animate: isPlaying ? { 
            y: [0, -10, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          } : {}
        };
      case "animation-9": // Elastic Motion
        return {
          animate: isPlaying ? {
            scale: [1, 1.1, 0.9, 1.05, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
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

  // Get website mockup based on animation type
  const getWebsiteMockup = (animationType: string) => {
    switch (animationType) {
      case "animation-1": // Fade & Slide In
        return (
          <WebsiteFadeSlideDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-2": // Scroll Reveal
        return (
          <WebsiteScrollRevealDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-3": // Parallax Effects
        return (
          <WebsiteParallaxDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-4": // 3D Transforms
        return (
          <Website3DDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-5": // Microinteractions
        return (
          <WebsiteMicrointeractionsDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-6": // Text Animation
        return (
          <WebsiteTextAnimationDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-7": // Staggered Reveal
        return (
          <WebsiteStaggeredRevealDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-8": // Floating Elements
        return (
          <WebsiteFloatingElementsDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      case "animation-9": // Elastic Motion
        return (
          <WebsiteElasticMotionDemo isPlaying={isPlaying} animationConfig={animationConfig} />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No preview available</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{animation.title}</h3>
      
      {showWebsitePreview ? (
        <div className="relative h-64 bg-gradient-to-r from-gray-50 to-blue-50 rounded-md flex items-center justify-center mb-4 overflow-hidden">
          {getWebsiteMockup(animation.id)}
          <button 
            onClick={() => setShowWebsitePreview(false)}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      ) : (
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
      )}
      
      <p className="text-sm text-gray-600 mb-4">{animation.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
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
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowWebsitePreview(!showWebsitePreview)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {showWebsitePreview ? "Simple View" : "Website Preview"}
        </Button>
      </div>
    </div>
  );
};

// Website demo components for each animation type
const WebsiteFadeSlideDemo = ({ isPlaying, animationConfig }: { isPlaying: boolean, animationConfig: any }) => {
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
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
            />
            <motion.div
              className="w-full h-3 bg-gray-300 rounded"
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
              transition={{...animationConfig.transition, delay: 0.1}}
            />
            <motion.div
              className="w-full h-3 bg-gray-300 rounded"
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
              transition={{...animationConfig.transition, delay: 0.2}}
            />
            <motion.div
              className="w-20 h-6 bg-blue-500 rounded mt-2"
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
              transition={{...animationConfig.transition, delay: 0.3}}
            />
          </div>
          <motion.div
            className="w-1/2 h-32 bg-gray-200 rounded"
            {...animationConfig}
            animate={isPlaying ? animationConfig.animate : {}}
            initial={animationConfig.initial}
            transition={{...animationConfig.transition, delay: 0.4}}
          />
        </div>
      </div>
    </div>
  );
};

const WebsiteScrollRevealDemo = ({ isPlaying, animationConfig }: { isPlaying: boolean, animationConfig: any }) => {
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
        {/* Content with scroll reveal effect */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="h-10 w-full flex justify-center items-center">
            <div className="w-1/2 h-4 bg-gray-800 rounded"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
              transition={{...animationConfig.transition, delay: 0.2}}
            >
              <div className="w-8 h-8 rounded-full bg-green-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              {...animationConfig}
              animate={isPlaying ? animationConfig.animate : {}}
              initial={animationConfig.initial}
              transition={{...animationConfig.transition, delay: 0.4}}
            >
              <div className="w-8 h-8 rounded-full bg-purple-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
          </div>
          
          <motion.div
            className="h-20 bg-gray-100 rounded p-3 flex gap-4"
            {...animationConfig}
            animate={isPlaying ? animationConfig.animate : {}}
            initial={animationConfig.initial}
            transition={{...animationConfig.transition, delay: 0.6}}
          >
            <div className="w-1/3 bg-gray-200 rounded"></div>
            <div className="w-2/3 flex flex-col justify-center gap-2">
              <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
              <div className="w-full h-3 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const WebsiteParallaxDemo = ({ isPlaying, animationConfig }: { isPlaying: boolean, animationConfig: any }) => {
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
            {...animationConfig}
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

const Website3DDemo = ({ isPlaying, animationConfig }: { isPlaying: boolean, animationConfig: any }) => {
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

const WebsiteMicrointeractionsDemo = ({ isPlaying, animationConfig }: { isPlaying: boolean, animationConfig: any }) => {
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
            {...animationConfig}
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
              <div className="w-8 h-8 rounded-full bg-green-400 mb-2"></div>
              <div className="w-16 h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-12 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="w-24 h-24 bg-gray-100 rounded-lg p-2 flex flex-col justify-center items-center"
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              animate={isPlaying ? { y: [-2, 0, -2] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-400 mb-2"></div>
              <div className="w-16 h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-12 h-2 bg-gray-300 rounded"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom nav with hover indicator */}
        <div className="h-8 flex justify-center gap-8 items-center">
          <motion.div className="h-full flex flex-col items-center justify-center relative">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <motion.div 
              className="absolute bottom-0 w-0 h-0.5 bg-blue-500" 
              whileHover={{ width: "100%" }}
              animate={isPlaying ? { width: ["0%", "100%", "0%"] } : {}}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </motion.div>
          
          <motion.div className="h-full flex flex-col items-center justify-center relative">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <motion.div 
              className="absolute bottom-0 w-0 h-0.5 bg-blue-500" 
              whileHover={{ width: "100%" }}
            />
          </motion.div>
          
          <motion.div className="h-full flex flex-col items-center justify-center relative">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <motion.div 
              className="absolute bottom-0 w-0 h-0.5 bg-blue-500" 
              whileHover={{ width: "100%" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// New Animation Demos - Fixed implementations
const WebsiteTextAnimationDemo = ({ isPlaying, animationConfig }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3">
        {/* Hero Section with text animation */}
        <div className="w-full h-full flex flex-col items-center justify-center">
          <motion.div 
            className="flex flex-col items-center"
            variants={animationConfig}
            initial="initial"
            animate={isPlaying ? "animate" : "initial"}
          >
            <motion.div
              className="w-48 h-8 mb-4 flex items-center justify-center"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
            </motion.div>
            
            <motion.div 
              className="w-64 h-4 bg-gray-200 rounded mb-2"
              variants={{
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 }
              }}
            ></motion.div>
            
            <motion.div 
              className="w-48 h-4 bg-gray-200 rounded mb-2"
              variants={{
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 }
              }}
            ></motion.div>
            
            <motion.div 
              className="w-56 h-4 bg-gray-200 rounded mb-4"
              variants={{
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 }
              }}
            ></motion.div>
            
            <motion.button
              className="w-32 h-10 bg-indigo-600 rounded-lg"
              variants={{
                initial: { opacity: 0, y: 20, scale: 0.9 },
                animate: { opacity: 1, y: 0, scale: 1 }
              }}
            ></motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const WebsiteStaggeredRevealDemo = ({ isPlaying, animationConfig }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3">
        {/* Gallery with staggered reveal */}
        <div className="w-full h-full flex flex-col">
          <div className="h-10 w-full flex items-center">
            <div className="w-1/3 h-5 bg-gray-800 rounded mx-auto"></div>
          </div>
          
          <div className="flex-1 grid grid-cols-3 gap-2 p-2">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isPlaying ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.15,
                  repeat: isPlaying ? Infinity : 0,
                  repeatDelay: 3,
                  repeatType: "reverse"
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${
                  i % 3 === 0 ? 'from-blue-200 to-blue-300' : 
                  i % 3 === 1 ? 'from-purple-200 to-purple-300' : 
                  'from-pink-200 to-pink-300'
                }`}></div>
              </motion.div>
            ))}
          </div>
          
          <div className="h-10 flex justify-center items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WebsiteFloatingElementsDemo = ({ isPlaying, animationConfig }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3">
        {/* Hero with floating elements */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
          {/* Background shapes */}
          <motion.div
            className="absolute w-20 h-20 rounded-full bg-blue-200 opacity-40 top-5 left-10"
            animate={isPlaying ? { y: [-8, 0, -8], rotate: [0, 5, 0] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-purple-200 opacity-40 bottom-8 right-10"
            animate={isPlaying ? { y: [-6, 2, -6], rotate: [0, -5, 0] } : {}}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          ></motion.div>
          
          <motion.div
            className="absolute w-12 h-12 rounded-full bg-indigo-200 opacity-40 top-20 right-16"
            animate={isPlaying ? { y: [-4, 4, -4], rotate: [0, 10, 0] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          ></motion.div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="w-40 h-40 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 gap-3"
              animate={isPlaying ? { y: [-5, 5, -5] } : {}}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded-full"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded-full"></div>
            </motion.div>
          </div>
          
          {/* Small particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white opacity-70"
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 20}%`,
              }}
              animate={isPlaying ? { 
                y: [-15, 0, -15], 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1, 0.8]
              } : {}}
              transition={{ 
                duration: 2 + i, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.2
              }}
            ></motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WebsiteElasticMotionDemo = ({ isPlaying, animationConfig }: AnimationDemoProps) => {
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
      <div className="bg-white h-56 p-3">
        {/* Elastic motion header */}
        <div className="flex flex-col items-center h-full">
          <div className="h-12 w-full flex items-center justify-center">
            <motion.div
              className="w-1/2 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
              animate={isPlaying ? {
                scale: [1, 1.1, 0.9, 1.05, 1],
                borderRadius: ["10px", "25px", "10px", "25px", "10px"]
              } : {}}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
            ></motion.div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4 w-full mt-4">
            <div className="flex flex-col gap-3">
              <motion.div
                className="w-full h-4 bg-gray-200 rounded"
                animate={isPlaying ? {
                  scaleX: [1, 1.05, 0.95, 1],
                  x: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              ></motion.div>
              <motion.div
                className="w-3/4 h-4 bg-gray-200 rounded"
                animate={isPlaying ? {
                  scaleX: [1, 1.05, 0.95, 1],
                  x: [0, 3, -3, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.1 }}
              ></motion.div>
              <motion.div
                className="w-full h-4 bg-gray-200 rounded"
                animate={isPlaying ? {
                  scaleX: [1, 1.05, 0.95, 1],
                  x: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.2 }}
              ></motion.div>
              
              <motion.div
                className="w-32 h-10 bg-indigo-500 rounded-lg mt-2"
                animate={isPlaying ? {
                  scale: [1, 1.1, 0.95, 1.02, 1],
                  rotate: [0, 1, -1, 0.5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              ></motion.div>
            </div>
            
            <motion.div
              className="bg-gray-100 rounded-lg w-full h-full"
              animate={isPlaying ? {
                scale: [1, 1.02, 0.98, 1.01, 1],
                rotate: [0, 0.5, -0.5, 0.2, 0],
                borderRadius: ["10px", "15px", "10px", "12px", "10px"]
              } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-3">
                <div className="w-full h-2/3 bg-white rounded-md"></div>
                <div className="flex gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div className="flex flex-col gap-1">
                    <div className="w-20 h-3 bg-gray-300 rounded"></div>
                    <div className="w-16 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPreview;
