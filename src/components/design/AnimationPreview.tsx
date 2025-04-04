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
  animationConfig: any;
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
      "animation-1": "fade_in", 
      "animation-2": "scroll_animation",
      "animation-3": "parallax_effect",
      "animation-4": "3d_transform",
      "animation-5": "hover_effect",
      "animation-6": "text_animation",
      "animation-7": "progressive_disclosure",
      "animation-8": "floating_element",
      "animation-9": "elastic_motion",
      // Map to actual AnimationCategory enum values
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
const WebsiteTextAnimationDemo = ({ isPlaying }: { isPlaying: boolean }) => {
  const controls = useAnimationControls();
  
  // Reference for colors to cycle through
  const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981'];
  const [colorIndex, setColorIndex] = useState(0);
  
  useEffect(() => {
    let intervalId: number;
    if (isPlaying) {
      // Animate text by cycling through colors
      intervalId = window.setInterval(() => {
        controls.start({
          color: colors[colorIndex],
          scale: [1, 1.1, 1],
          transition: { duration: 0.8 }
        });
        setColorIndex((prev) => (prev + 1) % colors.length);
      }, 2000);
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isPlaying, colorIndex, controls]);
  
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4
      }
    })
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };
  
  const titleText = "ANIMATED TEXT";
  
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
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Animated Title with letters that animate individually */}
          <motion.div
            className="mb-6"
            variants={containerVariants}
            initial="hidden"
            animate={isPlaying ? "visible" : "hidden"}
          >
            <div className="flex space-x-1">
              {titleText.split("").map((letter, i) => (
                <motion.span
                  key={`letter-${i}`}
                  variants={letterVariants}
                  custom={i}
                  className="text-3xl font-black tracking-wider"
                  animate={controls}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          {/* Animated subtitle with rainbow effect */}
          <motion.p
            className="text-sm mt-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
            animate={isPlaying ? {
              backgroundPosition: ['0% center', '100% center', '0% center'],
              backgroundSize: ['100%', '200%', '100%']
            } : {}}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Colors, sizing, and effects that grab attention
          </motion.p>
          
          {/* Typing effect simulation */}
          <motion.div 
            className="mt-6 w-64 h-12 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isPlaying ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="flex items-center"
              initial={{ width: 0 }}
              animate={isPlaying ? { width: "auto" } : { width: 0 }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                repeatDelay: 1.5,
                repeatType: "reverse"
              }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <p className="text-sm text-gray-600">Engage users with dynamic text...</p>
              <motion.span
                animate={isPlaying ? { opacity: [0, 1, 0] } : {}}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  repeatDelay: 0.2 
                }}
                className="ml-1 h-4 w-0.5 bg-gray-400"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const WebsiteStaggeredRevealDemo = ({ isPlaying }: { isPlaying: boolean }) => {
  const gridItems = [
    { color: "from-blue-400 to-blue-500", delay: 0 },
    { color: "from-purple-400 to-purple-500", delay: 0.1 },
    { color: "from-pink-400 to-pink-500", delay: 0.2 },
    { color: "from-amber-400 to-amber-500", delay: 0.3 },
    { color: "from-green-400 to-green-500", delay: 0.4 },
    { color: "from-cyan-400 to-cyan-500", delay: 0.5 },
  ];
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut"
      }
    }),
    exit: { 
      opacity: 0, 
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring", 
        stiffness: 200, 
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
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
      <div className="bg-white h-56 p-3">
        <div className="w-full h-full flex flex-col">
          <motion.div 
            className="h-8 mb-2 flex items-center justify-center"
            variants={fadeInUpVariants}
            custom={0}
            initial="hidden"
            animate={isPlaying ? "visible" : "hidden"}
            exit="exit"
          >
            <div className="w-40 h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md"></div>
          </motion.div>
          
          <AnimatePresence>
            {isPlaying && (
              <motion.div 
                className="grid grid-cols-3 gap-2 flex-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key="grid-container"
              >
                {gridItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-lg flex items-center justify-center bg-gradient-to-br ${item.color} shadow-sm p-2`}
                    variants={cardVariants}
                    custom={item.delay}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-8 h-8 bg-white/30 rounded-full mb-1"></div>
                      <div className="w-12 h-2 bg-white/30 rounded-full"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const WebsiteFloatingElementsDemo = ({ isPlaying }: { isPlaying: boolean }) => {
  const floatingElements = [
    { size: 'w-16 h-16', color: 'bg-gradient-to-br from-blue-300 to-indigo-400', x: 'left-10', y: 'top-6', delay: 0, duration: 4 },
    { size: 'w-12 h-12', color: 'bg-gradient-to-br from-pink-300 to-purple-400', x: 'right-12', y: 'top-4', delay: 0.5, duration: 3.5 },
    { size: 'w-10 h-10', color: 'bg-gradient-to-br from-yellow-300 to-amber-400', x: 'left-16', y: 'bottom-8', delay: 1, duration: 5 },
    { size: 'w-14 h-14', color: 'bg-gradient-to-br from-teal-300 to-emerald-400', x: 'right-8', y: 'bottom-10', delay: 0.8, duration: 4.5 },
    { size: 'w-8 h-8', color: 'bg-gradient-to-br from-sky-300 to-cyan-400', x: 'left-32', y: 'top-14', delay: 0.3, duration: 6 }
  ];
  
  const particlesCount = 12;
  const particles = Array.from({ length: particlesCount }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2, // 2-8px
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 4 // 4-7s
  }));
  
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
      <div className="bg-white h-56 p-0">
        {/* Background with gradient */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 overflow-hidden">
          
          {/* Floating elements */}
          {isPlaying && floatingElements.map((item, i) => (
            <motion.div
              key={`float-${i}`}
              className={`absolute ${item.size} ${item.color} rounded-full opacity-60 ${item.x} ${item.y}`}
              animate={{
                y: [0, -15, 0, -10, 0],
                x: [0, 8, 0, -8, 0],
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 0.95, 1]
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Small glowing particles */}
          {isPlaying && particles.map(particle => (
            <motion.div
              key={`particle-${particle.id}`}
              className="absolute rounded-full bg-white"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.3)'
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Central content */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-xl w-56 flex flex-col items-center"
              animate={isPlaying ? {
                y: [0, -8, 0],
                rotateZ: [0, 1, 0, -1, 0]
              } : {}}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-3 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30"></div>
              </div>
              <div className="w-32 h-3 bg-gray-300 rounded-full mb-2"></div>
              <div className="w-24 h-3 bg-gray-300 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WebsiteElasticMotionDemo = ({ isPlaying }: { isPlaying: boolean }) => {
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 15
  };
  
  const buttonControls = useAnimationControls();
  
  useEffect(() => {
    if (isPlaying) {
      // Animate button with pulse effect
      const interval = setInterval(() => {
        buttonControls.start({
          scale: [1, 1.15, 0.95, 1.05, 1],
          rotate: [0, 2, -2, 1, 0],
          transition: springConfig
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, buttonControls]);
  
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
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center h-12 border-b border-gray-100 mb-4">
            <div className="w-20 h-6 bg-gray-800 rounded"></div>
            
            <div className="flex gap-4">
              {["Menu 1", "Menu 2", "Menu 3"].map((_, i) => (
                <motion.div
                  key={`menu-${i}`}
                  className="w-14 h-4 bg-gray-300 rounded"
                  whileHover={isPlaying ? {
                    scale: 1.1,
                    y: -2,
                    transition: springConfig
                  } : {}}
                  animate={isPlaying && i === 1 ? {
                    y: [-2, 0, -2],
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex">
            {/* Left column */}
            <div className="w-1/2 pr-4 flex flex-col justify-center">
              <motion.div
                className="w-3/4 h-5 bg-gray-800 rounded mb-3"
                animate={isPlaying ? {
                  x: [-5, 0, -5],
                  scale: [0.98, 1, 0.98]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="w-full h-3 bg-gray-200 rounded mb-2"
                animate={isPlaying ? {
                  x: [-3, 0, -3],
                  scaleX: [0.95, 1, 0.95]
                } : {}}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1
                }}
              />
              
              <motion.div
                className="w-full h-3 bg-gray-200 rounded mb-2"
                animate={isPlaying ? {
                  x: [-4, 0, -4],
                  scaleX: [0.97, 1, 0.97]
                } : {}}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              
              <motion.div
                className="w-3/4 h-3 bg-gray-200 rounded mb-4"
                animate={isPlaying ? {
                  x: [-2, 0, -2],
                  scaleX: [0.96, 1, 0.96]
                } : {}}
                transition={{
                  duration: 3.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              
              <motion.div
                className="w-32 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
                animate={buttonControls}
                whileHover={isPlaying ? {
                  scale: 1.05,
                  transition: springConfig
                } : {}}
                whileTap={isPlaying ? {
                  scale: 0.95,
                  transition: springConfig
                } : {}}
              />
            </div>
            
            {/* Right column */}
            <motion.div
              className="w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
              animate={isPlaying ? {
                rotate: [0, 1, -1, 0.5, 0],
                scale: [1, 1.02, 0.98, 1.01, 1],
                y: [0, -5, 5, -2, 0]
              } : {}}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative w-32 h-32">
                {/* Animated shapes */}
                <motion.div
                  className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-2xl"
                  animate={isPlaying ? {
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 0.9, 1],
                    borderRadius: ["1rem", "50%", "30%", "1rem"]
                  } : {}}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full"
                  animate={isPlaying ? {
                    rotate: [0, -20, 20, 0],
                    scale: [1, 0.9, 1.1, 1],
                    borderRadius: ["50%", "30%", "50%", "40%"]
                  } : {}}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPreview;
