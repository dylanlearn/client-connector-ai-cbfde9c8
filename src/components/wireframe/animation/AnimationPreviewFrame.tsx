
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FidelityLevel } from '../fidelity/FidelityLevels';
import { useFidelity } from '../fidelity/FidelityContext';

interface AnimationPreviewFrameProps {
  fidelityLevel: FidelityLevel;
  isPlaying: boolean;
  onTransitionEnd?: () => void;
}

const AnimationPreviewFrame: React.FC<AnimationPreviewFrameProps> = ({
  fidelityLevel,
  isPlaying,
  onTransitionEnd
}) => {
  const { settings } = useFidelity();
  const [animationKey, setAnimationKey] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  // Reset animation when the play state changes
  useEffect(() => {
    if (isPlaying) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isPlaying]);

  // Get animation properties based on fidelity level
  const getAnimationProperties = () => {
    const baseProperties = {
      duration: 0.8,
      delay: 0.1,
      ease: "easeInOut"
    };

    // Adjust animation properties based on fidelity level
    switch (fidelityLevel) {
      case 'wireframe':
        return {
          ...baseProperties,
          duration: 0.5, // Faster, simpler animations
          ease: "linear" // Simple easing
        };
      case 'low':
        return {
          ...baseProperties,
          duration: 0.6,
          ease: "easeOut"
        };
      case 'medium':
        return {
          ...baseProperties,
          duration: 0.8
        };
      case 'high':
        return {
          ...baseProperties,
          duration: 1.0, // More deliberate animations
          delay: 0.2, // Slight delay for polish
          ease: "easeInOut" // Smoother easing
        };
      default:
        return baseProperties;
    }
  };

  // Create animation variants based on material and fidelity
  const getAnimationVariants = () => {
    const animProps = getAnimationProperties();
    
    return {
      initial: { 
        scale: 0.8, 
        opacity: 0, 
        y: 20 
      },
      animate: { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        transition: {
          duration: animProps.duration,
          delay: animProps.delay,
          ease: animProps.ease
        }
      },
      exit: {
        scale: 0.8,
        opacity: 0,
        y: -20,
        transition: {
          duration: animProps.duration / 2
        }
      },
      // Continuous animation for high fidelity when playing
      pulse: isPlaying && fidelityLevel === 'high' ? {
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      } : {}
    };
  };

  // Get material style based on fidelity level
  const getMaterialStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '200px',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    };

    switch (fidelityLevel) {
      case 'wireframe':
        return {
          ...baseStyle,
          background: '#f3f4f6',
          border: '2px solid #d1d5db'
        };
      case 'low':
        return {
          ...baseStyle,
          background: '#f3f4f6',
          boxShadow: settings.showShadows ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          border: '1px solid #e5e7eb'
        };
      case 'medium':
        return {
          ...baseStyle,
          background: settings.showGradients ? 'linear-gradient(to bottom, #f9fafb, #f3f4f6)' : '#f3f4f6',
          boxShadow: settings.showShadows ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          border: '1px solid #e5e7eb'
        };
      case 'high':
        return {
          ...baseStyle,
          background: settings.showGradients ? 'linear-gradient(135deg, #f9fafb, #e5e7eb)' : '#f3f4f6',
          boxShadow: settings.showShadows ? `0 8px 16px rgba(0,0,0,${settings.shadowIntensity * 0.2})` : 'none',
          border: settings.showBorders ? '1px solid #e5e7eb' : 'none',
          backdropFilter: 'blur(10px)'
        };
      default:
        return baseStyle;
    }
  };

  // Content elements based on fidelity level
  const getContentElements = () => {
    switch (fidelityLevel) {
      case 'wireframe':
        return (
          <div className="flex flex-col space-y-2 p-4">
            <div className="h-4 w-3/4 bg-gray-300"></div>
            <div className="h-3 w-5/6 bg-gray-300"></div>
            <div className="h-3 w-2/3 bg-gray-300"></div>
          </div>
        );
      case 'low':
        return (
          <div className="flex flex-col space-y-3 p-4">
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
            <div className="mt-4 h-8 w-1/3 bg-blue-500 rounded"></div>
          </div>
        );
      case 'medium':
        return (
          <div className="flex flex-col space-y-3 p-4">
            <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-400 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-400 rounded"></div>
            <div className="mt-6 h-10 w-1/3 bg-blue-600 rounded flex items-center justify-center">
              <div className="h-4 w-2/3 bg-white/80 rounded"></div>
            </div>
          </div>
        );
      case 'high':
        return (
          <div className="flex flex-col space-y-3 p-5">
            <div className="h-7 w-3/4 bg-gray-800 rounded-md"></div>
            <div className="h-5 w-5/6 bg-gray-500 rounded-md"></div>
            <div className="h-5 w-2/3 bg-gray-500 rounded-md"></div>
            <div className="flex space-x-2 mt-2">
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            </div>
            <div className="mt-6 h-12 w-1/3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center shadow-lg">
              <div className="h-4 w-2/3 bg-white/90 rounded"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animation-preview-container relative" ref={frameRef}>
      <motion.div
        key={`preview-${fidelityLevel}-${animationKey}`}
        style={getMaterialStyle()}
        variants={getAnimationVariants()}
        initial="initial"
        animate={isPlaying ? ["animate", "pulse"] : "initial"}
        exit="exit"
        className="animation-preview-frame"
        onAnimationComplete={() => onTransitionEnd && onTransitionEnd()}
      >
        {getContentElements()}
      </motion.div>
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
          <div className="text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-md shadow">
            Press Play to start animation
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationPreviewFrame;
