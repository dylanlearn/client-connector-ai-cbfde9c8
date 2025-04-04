
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { DesignOption } from "./DesignPreview";
import { Play, Pause, RefreshCw, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimationAnalytics } from "@/hooks/use-animation-analytics";
import { AnimationCategory } from "@/types/animations";

// Define a type for the animation demos
interface AnimationDemoProps {
  isPlaying: boolean;
  animationConfig?: any;
}

interface AnimationPreviewProps {
  animation: DesignOption;
}

const AnimationPreview = ({ animation }: AnimationPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting animations
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  
  // Animation analytics tracking
  const { trackAnimation } = useAnimationAnalytics();
  const trackingRef = useRef<{ startTime: number }>({ startTime: Date.now() });
  
  // Map animation ID to AnimationCategory for analytics
  const getAnimationCategory = (id: string): AnimationCategory => {
    const categoryMapping: Record<string, AnimationCategory> = {
      "animation-1": "morphing_shape", // Changed from "fade_in"
      "animation-2": "scroll_animation",
      "animation-3": "parallax_tilt", // Changed from "parallax_effect"
      "animation-4": "glassmorphism", // Changed from "3d_transform"
      "animation-5": "hover_effect",
      "animation-6": "color_shift", // Changed from "text_animation"
      "animation-7": "progressive_disclosure",
      "animation-8": "magnetic_element", // Changed from "floating_element"
      "animation-9": "modal_dialog", // Changed from "elastic_motion"
    };
    return (categoryMapping[id] || "hover_effect") as AnimationCategory;
  };
  
  // Track view on mount
  useEffect(() => {
    trackingRef.current.startTime = Date.now();
    const animCategory = getAnimationCategory(animation.id);
    trackAnimation(animCategory);
    
    return () => {
      // Track duration on unmount
      const duration = Date.now() - trackingRef.current.startTime;
      trackAnimation(animCategory, { duration });
    };
  }, [animation.id, trackAnimation]);
  
  // Submit feedback
  const handleFeedback = (feedback: 'positive' | 'negative') => {
    setFeedbackGiven(feedback);
    trackAnimation(
      getAnimationCategory(animation.id),
      undefined,
      feedback
    );
  };

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
      case "animation-6": // Text Animation - Enhanced
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.8,
              staggerChildren: 0.12,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 2.5,
              repeatType: "reverse" as const
            }
          },
          exit: { opacity: 0, scale: 0.8 }
        };
      case "animation-7": // Staggered Reveal - Enhanced
        return {
          initial: { opacity: 0, y: 20 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
              staggerDirection: 1,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 3,
              repeatType: "reverse" as const
            }
          },
          exit: { opacity: 0, y: 20 }
        };
      case "animation-8": // Floating Elements - Enhanced
        return {
          animate: isPlaying ? { 
            y: [0, -12, 0, -8, 0],
            rotate: [0, 2, 0, -2, 0],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          } : {}
        };
      case "animation-9": // Elastic Motion - Enhanced
        return {
          animate: isPlaying ? {
            scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
            rotate: [0, 1, -1, 2, -2, 0],
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 5,
              repeat: Infinity,
              repeatDelay: 0.8,
              duration: 2.5
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
          <WebsiteFadeSlideDemo isPlaying={isPlaying} />
        );
      case "animation-2": // Scroll Reveal
        return (
          <WebsiteScrollRevealDemo isPlaying={isPlaying} />
        );
      case "animation-3": // Parallax Effects
        return (
          <WebsiteParallaxDemo isPlaying={isPlaying} />
        );
      case "animation-4": // 3D Transforms
        return (
          <Website3DDemo isPlaying={isPlaying} />
        );
      case "animation-5": // Microinteractions
        return (
          <WebsiteMicrointeractionsDemo isPlaying={isPlaying} />
        );
      case "animation-6": // Text Animation
        return (
          <WebsiteTextAnimationDemo isPlaying={isPlaying} />
        );
      case "animation-7": // Staggered Reveal
        return (
          <WebsiteStaggeredRevealDemo isPlaying={isPlaying} />
        );
      case "animation-8": // Floating Elements
        return (
          <WebsiteFloatingElementsDemo isPlaying={isPlaying} />
        );
      case "animation-9": // Elastic Motion
        return (
          <WebsiteElasticMotionDemo isPlaying={isPlaying} />
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
        
        <div className="flex items-center gap-2">
          {/* Feedback buttons */}
          <div className="flex gap-1 mr-2">
            <Button
              variant={feedbackGiven === 'positive' ? 'default' : 'ghost'}
              size="sm" 
              className={feedbackGiven === 'positive' ? 'bg-green-500 hover:bg-green-600' : ''}
              onClick={() => handleFeedback('positive')}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant={feedbackGiven === 'negative' ? 'default' : 'ghost'}
              size="sm"
              className={feedbackGiven === 'negative' ? 'bg-red-500 hover:bg-red-600' : ''}
              onClick={() => handleFeedback('negative')}
            >
              <ThumbsDown className="h-4 w-4" />
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
    </div>
  );
};

// Website demo components for each animation type
const WebsiteFadeSlideDemo = ({ isPlaying }: AnimationDemoProps) => {
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
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
            <motion.div
              className="w-full h-3 bg-gray-300 rounded"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, delay: 0.1, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
            <motion.div
              className="w-full h-3 bg-gray-300 rounded"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, delay: 0.2, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
            <motion.div
              className="w-20 h-6 bg-blue-500 rounded mt-2"
              animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
              transition={{ duration: 1.5, delay: 0.3, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            />
          </div>
          <motion.div
            className="w-1/2 h-32 bg-gray-200 rounded"
            animate={isPlaying ? { opacity: [0, 1], y: [20, 0] } : {}}
            transition={{ duration: 1.5, delay: 0.4, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
          />
        </div>
      </div>
    </div>
  );
};

const WebsiteScrollRevealDemo = ({ isPlaying }: AnimationDemoProps) => {
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
              animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
              transition={{ duration: 1.2, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
              transition={{ duration: 1.2, delay: 0.2, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            >
              <div className="w-8 h-8 rounded-full bg-green-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
            
            <motion.div
              className="bg-gray-100 p-2 rounded flex flex-col items-center"
              animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
              transition={{ duration: 1.2, delay: 0.4, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-400 mb-2"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </motion.div>
          </div>
          
          <motion.div
            className="h-20 bg-gray-100 rounded p-3 flex gap-4"
            animate={isPlaying ? { opacity: [0, 1], scale: [0.9, 1] } : {}}
            transition={{ duration: 1.2, delay: 0.6, repeat: isPlaying ? Infinity : 0, repeatDelay: 2, repeatType: "reverse" }}
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

// Text Animation Demo
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

// Staggered Reveal Demo
const WebsiteStaggeredRevealDemo = ({ isPlaying }: AnimationDemoProps) => {
  const containerControls = useAnimationControls();
  
  useEffect(() => {
    if (isPlaying) {
      const animation = async () => {
        await containerControls.start("visible");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await containerControls.start("hidden");
        await new Promise(resolve => setTimeout(resolve, 500));
        animation();
      };
      animation();
    } else {
      containerControls.stop();
    }
    
    return () => {
      containerControls.stop();
    };
  }, [isPlaying, containerControls]);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 }
    }
  };
  
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
      
      <div className="bg-white h-56 p-4 overflow-hidden">
        {/* Header */}
        <motion.div 
          className="w-full flex justify-center mb-4"
          variants={container}
          initial="hidden"
          animate={containerControls}
        >
          <motion.div variants={item} className="w-40 h-6 bg-indigo-600 rounded"></motion.div>
        </motion.div>
        
        {/* Feature items */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          animate={containerControls}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              variants={item}
              className="bg-white shadow-md rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-${i % 2 === 0 ? 'blue' : 'indigo'}-${i % 3 === 0 ? '500' : '400'}`}></div>
                <div className="w-16 h-3 bg-gray-800 rounded"></div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded"></div>
              <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
              <div className="w-3/5 h-2 bg-gray-200 rounded"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Floating Elements Demo
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
      
      <div className="bg-gradient-to-b from-indigo-50 to-blue-100 h-56 p-4 relative">
        {/* Floating hero content */}
        <div className="absolute inset-x-0 top-4 flex justify-center">
          <motion.div 
            className="bg-white rounded-lg p-3 w-4/5 shadow-lg"
            animate={isPlaying ? {
              y: [0, -8, 0],
              rotate: [0, 1, 0, -1, 0]
            } : {}}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full flex justify-center mb-2">
              <div className="w-32 h-4 bg-indigo-600 rounded"></div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
            <div className="w-4/5 mx-auto h-2 bg-gray-200 rounded mb-3"></div>
            <div className="flex justify-center">
              <div className="w-24 h-6 bg-blue-500 rounded-full"></div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute w-12 h-12 rounded-full bg-blue-200 opacity-60 left-4 top-24"
          animate={isPlaying ? {
            y: [-10, 10, -10],
            x: [0, 5, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-indigo-300 opacity-60 right-8 top-12"
          animate={isPlaying ? {
            y: [-8, 8, -8],
            x: [0, -5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.div
          className="absolute w-6 h-6 rounded-full bg-purple-200 opacity-70 right-16 bottom-16"
          animate={isPlaying ? {
            y: [-6, 6, -6],
            x: [-3, 3, -3],
            scale: [1, 1.08, 1]
          } : {}}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div
          className="absolute w-10 h-10 rounded-full bg-cyan-200 opacity-70 left-16 bottom-12"
          animate={isPlaying ? {
            y: [-7, 7, -7],
            x: [3, -3, 3],
            scale: [1, 1.06, 1]
          } : {}}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.75
          }}
        />
        
        {/* Background floating shapes */}
        <motion.div
          className="absolute w-20 h-20 rounded-full border-2 border-indigo-100 opacity-50 right-2 bottom-2"
          animate={isPlaying ? {
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0]
          } : {}}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-16 h-16 rounded-lg border-2 border-blue-100 opacity-40 left-4 bottom-4 rotate-12"
          animate={isPlaying ? {
            scale: [1, 1.1, 1],
            rotate: [12, -12, 12]
          } : {}}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
    </div>
  );
};

// Elastic Motion Demo
const WebsiteElasticMotionDemo = ({ isPlaying }: AnimationDemoProps) => {
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
      
      <div className="bg-white h-56 p-4 flex flex-col items-center justify-center">
        {/* Elastic bouncing logo */}
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg"
          animate={isPlaying ? {
            scale: [1, 1.2, 0.9, 1.1, 0.95, 1],
            rotate: [0, 10, -10, 5, -5, 0],
            borderRadius: ["16px", "40%", "35%", "25%", "40%", "16px"]
          } : {}}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            repeatDelay: 1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <motion.div 
            className="w-12 h-12 rounded-full bg-white opacity-90 flex items-center justify-center"
            animate={isPlaying ? {
              scale: [1, 0.9, 1.1, 0.95, 1.05, 1]
            } : {}}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1
            }}
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
          </motion.div>
        </motion.div>
        
        {/* Elastic text lines */}
        <div className="space-y-3 w-full max-w-xs">
          <motion.div
            className="w-3/4 h-4 bg-gray-800 rounded mx-auto"
            animate={isPlaying ? {
              width: ["75%", "80%", "70%", "78%", "75%"],
              x: [0, 5, -5, 2, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
          
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-full h-2 bg-gray-200 rounded"
                animate={isPlaying ? {
                  width: i === 1 ? ["100%", "95%", "100%"] : 
                         i === 2 ? ["100%", "90%", "98%", "100%"] : 
                         ["100%", "92%", "96%", "100%"],
                  x: i === 1 ? [0, 5, 0] : 
                      i === 2 ? [0, -5, 2, 0] : 
                      [0, 3, -2, 0]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: isPlaying ? Infinity : 0,
                  repeatDelay: 1,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
          
          {/* Button with elastic effect */}
          <motion.div
            className="w-32 h-8 bg-indigo-500 rounded-full mx-auto mt-4 flex items-center justify-center"
            animate={isPlaying ? {
              scale: [1, 1.05, 0.95, 1.02, 1],
              width: ["128px", "140px", "120px", "132px", "128px"]
            } : {}}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <div className="w-16 h-2 bg-white opacity-90 rounded"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPreview;
