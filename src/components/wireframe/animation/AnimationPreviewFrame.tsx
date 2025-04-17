
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants, TargetAndTransition } from 'framer-motion';
import { FidelityLevel } from '../fidelity/FidelityLevels';
import { useFidelityRenderer } from '@/hooks/wireframe/use-fidelity-renderer';

interface AnimationPreviewFrameProps {
  fidelityLevel: FidelityLevel;
  isPlaying: boolean;
  onTransitionEnd?: () => void;
  customAnimation?: string;
}

const AnimationPreviewFrame: React.FC<AnimationPreviewFrameProps> = ({
  fidelityLevel,
  isPlaying,
  onTransitionEnd,
  customAnimation
}) => {
  const { settings } = useFidelityRenderer();
  const [showContent, setShowContent] = useState<boolean>(true);
  const [animationKey, setAnimationKey] = useState<number>(0);
  
  // Reset animation state when play status changes
  useEffect(() => {
    if (isPlaying) {
      setShowContent(true);
      setAnimationKey(prev => prev + 1);
    } else {
      // Keep current state when paused
    }
  }, [isPlaying]);

  // Animation variants with proper TypeScript typing
  const getAnimationVariants = (): Variants => {
    // Base animation variants
    const variants: Variants = {
      initial: { 
        scale: 0.95, 
        opacity: 0, 
        y: 10 
      },
      animate: { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5, 
          delay: 0.1,
          ease: "easeOut" 
        }
      },
      exit: { 
        scale: 0.95, 
        opacity: 0, 
        y: 10,
        transition: { 
          duration: 0.3,
          ease: "easeIn"
        }
      }
    };

    // Add different effects based on fidelity level
    if (fidelityLevel === 'high' && isPlaying) {
      variants.animate = {
        ...variants.animate,
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          delay: 0.1,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 10
        }
      };
    }

    return variants;
  };

  // Get pulsing animation as a separate variant (not part of the main variants object)
  const getPulseAnimation = (): TargetAndTransition => {
    if (isPlaying && fidelityLevel !== 'wireframe') {
      return {
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }
      };
    }
    return {};
  };

  // Content to display in the preview frame
  const renderContent = () => {
    return (
      <div className="space-y-4">
        <div className="h-6 rounded bg-muted-foreground/20" />
        <div className="h-24 rounded bg-muted-foreground/30 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Content Preview</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded bg-muted-foreground/20" />
          <div className="h-12 rounded bg-muted-foreground/30" />
          <div className="h-12 rounded bg-muted-foreground/20" />
        </div>
        <div className="h-10 rounded bg-primary/50 flex items-center justify-center">
          <div className="text-xs text-primary-foreground">Action Element</div>
        </div>
      </div>
    );
  };

  // Get animation class based on fidelity level
  const getAnimationClass = () => {
    if (!isPlaying) return "";
    switch (fidelityLevel) {
      case 'high':
        return 'shadow-lg';
      case 'medium':
        return 'shadow-md';
      case 'low':
        return 'shadow-sm';
      default:
        return '';
    }
  };

  return (
    <div 
      className="relative w-full aspect-video border rounded-lg overflow-hidden bg-background"
      style={{ minHeight: '240px' }}
    >
      <AnimatePresence mode="wait" onExitComplete={onTransitionEnd}>
        {showContent && (
          <motion.div
            key={`content-${animationKey}`}
            className={`absolute inset-0 p-6 ${getAnimationClass()}`}
            variants={getAnimationVariants()}
            initial="initial"
            animate={{
              ...getAnimationVariants().animate,
              ...getPulseAnimation()
            }}
            exit="exit"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Fidelity: {fidelityLevel}
      </div>
    </div>
  );
};

export default AnimationPreviewFrame;
