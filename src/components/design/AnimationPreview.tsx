
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesignOption } from "./DesignPreview";
import { Play, Pause, RefreshCw, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimationAnalytics } from "@/hooks/use-animation-analytics";
import { getAnimationCategory, getAnimationConfig } from "./animations/AnimationConfig";
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

const AnimationPreview = ({ animation }: AnimationPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For resetting animations
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  
  // Animation analytics tracking
  const { trackAnimation } = useAnimationAnalytics();
  const trackingRef = useRef<{ startTime: number }>({ startTime: Date.now() });
  
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

  // Get animation configuration based on animation type
  const animationConfig = getAnimationConfig(animation.id, isPlaying);

  // Reset animation
  const resetAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setKey(prev => prev + 1);
      setIsPlaying(true);
    }, 100);
  };

  // Get website mockup based on animation type
  const getWebsiteMockup = (animationType: string) => {
    switch (animationType) {
      case "animation-1": // Fade & Slide In
        return <WebsiteFadeSlideDemo isPlaying={isPlaying} />;
      case "animation-2": // Scroll Reveal
        return <WebsiteScrollRevealDemo isPlaying={isPlaying} />;
      case "animation-3": // Parallax Effects
        return <WebsiteParallaxDemo isPlaying={isPlaying} />;
      case "animation-4": // 3D Transforms
        return <Website3DDemo isPlaying={isPlaying} />;
      case "animation-5": // Microinteractions
        return <WebsiteMicrointeractionsDemo isPlaying={isPlaying} />;
      case "animation-6": // Text Animation
        return <WebsiteTextAnimationDemo isPlaying={isPlaying} />;
      case "animation-7": // Staggered Reveal
        return <WebsiteStaggeredRevealDemo isPlaying={isPlaying} />;
      case "animation-8": // Floating Elements
        return <WebsiteFloatingElementsDemo isPlaying={isPlaying} />;
      case "animation-9": // Elastic Motion
        return <WebsiteElasticMotionDemo isPlaying={isPlaying} />;
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

export default AnimationPreview;
