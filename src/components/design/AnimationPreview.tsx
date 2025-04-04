
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesignOption } from "./DesignPreview";
import { Play, Pause, RefreshCw, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimationAnalytics } from "@/hooks/use-animation-analytics";
import { getAnimationCategory, getAnimationConfig, clearAnimationConfigCache } from "./animations/AnimationConfig";
import {
  WebsiteFadeSlideDemo,
  WebsiteScrollRevealDemo,
  WebsiteParallaxDemo,
  Website3DDemo,
  WebsiteMicrointeractionsDemo,
  WebsiteTextAnimationDemo,
  WebsiteStaggeredRevealDemo,
  WebsiteFloatingElementsDemo,
  WebsiteElasticMotionDemo
} from "./animations/demos";

interface AnimationPreviewProps {
  animation: DesignOption;
}

// Memoized component to avoid unnecessary re-renders
const AnimationPreview = memo(({ animation }: AnimationPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting animations
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  
  // Animation analytics tracking
  const { trackAnimation } = useAnimationAnalytics();
  const trackingRef = useRef<{ startTime: number }>({ startTime: Date.now() });
  const animCategory = getAnimationCategory(animation.id);
  
  // Track view on mount and cleanup on unmount
  useEffect(() => {
    trackingRef.current.startTime = Date.now();
    trackAnimation(animCategory);
    
    // Clear animation cache on unmount to prevent memory leaks
    return () => {
      const duration = Date.now() - trackingRef.current.startTime;
      trackAnimation(animCategory, { duration });
      
      // Cleanup animation resources when component unmounts
      if (isPlaying) {
        setIsPlaying(false);
      }
    };
  }, [animation.id, trackAnimation, animCategory]);
  
  // Submit feedback - memoized to prevent recreation on each render
  const handleFeedback = useCallback((feedback: 'positive' | 'negative') => {
    setFeedbackGiven(feedback);
    trackAnimation(animCategory, undefined, feedback);
  }, [trackAnimation, animCategory]);

  // Reset animation with debouncing to prevent multiple rapid resets
  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    // Small timeout to ensure animation states are properly reset
    const timerId = setTimeout(() => {
      setKey(prev => prev + 1);
      setIsPlaying(true);
    }, 100);
    
    return () => clearTimeout(timerId);
  }, []);

  // Toggle play state
  const togglePlayState = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Toggle website preview
  const toggleWebsitePreview = useCallback(() => {
    setShowWebsitePreview(prev => !prev);
  }, []);

  // Memoized animation config to prevent re-creation on each render
  const animationConfig = getAnimationConfig(animation.id, isPlaying);

  // Clear cached configurations when animation type changes
  useEffect(() => {
    return () => {
      // Clean up animation resources when type changes
      clearAnimationConfigCache();
    };
  }, [animation.id]);
  
  // Memoized website mockup renderer to prevent recreation on each render
  const getWebsiteMockup = useCallback((animationType: string) => {
    // We're passing only necessary props to child components
    const demoProps = { isPlaying };
    
    switch (animationType) {
      case "animation-1": return <WebsiteFadeSlideDemo {...demoProps} />;
      case "animation-2": return <WebsiteScrollRevealDemo {...demoProps} />;
      case "animation-3": return <WebsiteParallaxDemo {...demoProps} />;
      case "animation-4": return <Website3DDemo {...demoProps} />;
      case "animation-5": return <WebsiteMicrointeractionsDemo {...demoProps} />;
      case "animation-6": return <WebsiteTextAnimationDemo {...demoProps} />;
      case "animation-7": return <WebsiteStaggeredRevealDemo {...demoProps} />;
      case "animation-8": return <WebsiteFloatingElementsDemo {...demoProps} />;
      case "animation-9": return <WebsiteElasticMotionDemo {...demoProps} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No preview available</p>
          </div>
        );
    }
  }, [isPlaying]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{animation.title}</h3>
      
      {showWebsitePreview ? (
        <div className="relative h-64 bg-gradient-to-r from-gray-50 to-blue-50 rounded-md flex items-center justify-center mb-4 overflow-hidden">
          {getWebsiteMockup(animation.id)}
          <button 
            onClick={toggleWebsitePreview}
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
            onClick={togglePlayState}
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
            onClick={toggleWebsitePreview}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {showWebsitePreview ? "Simple View" : "Website Preview"}
          </Button>
        </div>
      </div>
    </div>
  );
});

AnimationPreview.displayName = "AnimationPreview";

export default AnimationPreview;
