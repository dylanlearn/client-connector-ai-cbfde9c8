
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { DesignOption } from "../preview/types";
import { useAnimationAnalytics } from "@/hooks/use-animation-analytics";
import { getAnimationCategory, getAnimationConfig, clearAnimationConfigCache } from "../animations/AnimationConfig";
import { AnimationControls } from "./AnimationControls";
import { WebsitePreview } from "./WebsitePreview";
import { AnimationDisplay } from "./AnimationDisplay";

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

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{animation.title || animation.name}</h3>
      
      {showWebsitePreview ? (
        <WebsitePreview 
          animationType={animation.id} 
          isPlaying={isPlaying} 
          onClose={toggleWebsitePreview} 
        />
      ) : (
        <AnimationDisplay 
          isPlaying={isPlaying} 
          animationKey={key} 
          animationConfig={animationConfig} 
        />
      )}
      
      <p className="text-sm text-gray-600 mb-4">{animation.description}</p>
      
      <AnimationControls 
        isPlaying={isPlaying}
        feedbackGiven={feedbackGiven}
        showWebsitePreview={showWebsitePreview}
        animCategory={animCategory}
        onPlayToggle={togglePlayState}
        onReset={resetAnimation}
        onFeedback={handleFeedback}
        onPreviewToggle={toggleWebsitePreview}
      />
    </div>
  );
});

AnimationPreview.displayName = "AnimationPreview";

export default AnimationPreview;
