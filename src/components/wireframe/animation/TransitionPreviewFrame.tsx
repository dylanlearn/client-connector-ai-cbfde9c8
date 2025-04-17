
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FidelitySettings, MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';

interface TransitionPreviewFrameProps {
  materialStyle: React.CSSProperties;
  materialType: MaterialType;
  surfaceTreatment: SurfaceTreatment;
  isPlaying: boolean;
  settings: FidelitySettings;
}

export const TransitionPreviewFrame: React.FC<TransitionPreviewFrameProps> = ({
  materialStyle,
  materialType,
  surfaceTreatment,
  isPlaying,
  settings
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  
  // Reset animation when play state changes
  useEffect(() => {
    if (isPlaying) {
      setAnimationKey(prevKey => prevKey + 1);
    }
  }, [isPlaying, materialType, surfaceTreatment]);

  // Get animation variants based on material type
  const getAnimationVariants = () => {
    const baseTransition = {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 1
    };
    
    // Adjust animation based on material type
    switch (materialType) {
      case 'basic':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: { ...baseTransition, stiffness: 80, damping: 10 }
          },
          exit: { opacity: 0, scale: 0.9 }
        };
        
      case 'flat':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: { ...baseTransition }
          },
          exit: { opacity: 0, y: -20 }
        };
        
      case 'matte':
        return {
          initial: { opacity: 0, scale: 0.8, rotate: -2 },
          animate: { 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            transition: { ...baseTransition, stiffness: 120 }
          },
          exit: { opacity: 0, scale: 0.8, rotate: 2 }
        };
        
      case 'glossy':
        return {
          initial: { opacity: 0, y: 30, rotateX: 20 },
          animate: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            transition: { ...baseTransition, stiffness: 130, damping: 20 }
          },
          exit: { opacity: 0, y: -30, rotateX: -20 }
        };
        
      case 'metallic':
        return {
          initial: { opacity: 0, scale: 1.1, filter: 'brightness(1.5)' },
          animate: { 
            opacity: 1, 
            scale: 1, 
            filter: 'brightness(1)',
            transition: { ...baseTransition, stiffness: 150, damping: 25 }
          },
          exit: { opacity: 0, scale: 0.9, filter: 'brightness(0.8)' }
        };
        
      case 'glass':
        return {
          initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
          animate: { 
            opacity: 1, 
            scale: 1, 
            filter: 'blur(0px)',
            transition: { ...baseTransition, stiffness: 90, damping: 15 }
          },
          exit: { opacity: 0, scale: 1.1, filter: 'blur(10px)' }
        };
        
      case 'textured':
        return {
          initial: { opacity: 0, scale: 0.9, rotateY: 15 },
          animate: { 
            opacity: 1, 
            scale: 1, 
            rotateY: 0,
            transition: { ...baseTransition, stiffness: 110, damping: 18 }
          },
          exit: { opacity: 0, scale: 0.9, rotateY: -15 }
        };
        
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  // Get additional animation based on surface treatment
  const getSurfaceAnimation = () => {
    switch (surfaceTreatment) {
      case 'rough':
        return {
          animate: {
            scale: [1, 1.01, 0.99, 1],
            rotate: [0, 0.5, -0.5, 0],
            transition: {
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 2,
            }
          }
        };
      case 'bumpy':
        return {
          animate: {
            y: [0, -2, 2, 0],
            transition: {
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 3,
            }
          }
        };
      case 'engraved':
        return {
          animate: {
            boxShadow: [
              'inset 0 2px 4px rgba(0,0,0,0.1)',
              'inset 0 4px 8px rgba(0,0,0,0.15)',
              'inset 0 2px 4px rgba(0,0,0,0.1)'
            ],
            transition: {
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 4,
            }
          }
        };
      case 'embossed':
        return {
          animate: {
            boxShadow: [
              '0 2px 4px rgba(0,0,0,0.1)',
              '0 4px 8px rgba(0,0,0,0.15)',
              '0 2px 4px rgba(0,0,0,0.1)'
            ],
            transition: {
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 4,
            }
          }
        };
      case 'smooth':
      default:
        return {};
    }
  };

  // Content to display based on material
  const getContentForMaterial = () => {
    // Base content with customization based on material type
    return (
      <div className="p-5 h-full flex flex-col">
        {/* Sample content that changes based on material type */}
        <div className="mb-3">
          <div className={`h-4 ${materialType === 'textured' ? 'bg-white/70' : 'bg-gray-800/80'} rounded w-3/4 mb-2`}></div>
          <div className={`h-3 ${materialType === 'textured' ? 'bg-white/60' : 'bg-gray-600/70'} rounded w-1/2 mb-2`}></div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          {materialType === 'glass' ? (
            // Special glass content with layered effect
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <div className="absolute inset-2 bg-white/30 rounded-full"></div>
              <div className="absolute inset-4 bg-white/40 rounded-full"></div>
            </div>
          ) : materialType === 'metallic' ? (
            // Metallic icon/content
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/30 to-transparent flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/50"></div>
            </div>
          ) : (
            // Default content for other materials
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-lg ${materialType === 'textured' ? 'bg-white/20' : 'bg-primary/30'} mb-3 flex items-center justify-center`}>
                <div className={`w-8 h-8 rounded ${materialType === 'textured' ? 'bg-white/50' : 'bg-primary/60'}`}></div>
              </div>
              <div className={`h-3 ${materialType === 'textured' ? 'bg-white/60' : 'bg-gray-600/70'} rounded w-12`}></div>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className={`h-8 w-24 rounded-full ${materialType === 'textured' ? 'bg-white/30' : 'bg-primary/80'} mx-auto flex items-center justify-center`}>
            <div className={`h-3 w-12 ${materialType === 'textured' ? 'bg-white/80' : 'bg-white/90'} rounded-full`}></div>
          </div>
        </div>
      </div>
    );
  };

  // Combine animation variants
  const animationVariants = getAnimationVariants();
  const surfaceAnimationProps = getSurfaceAnimation();
  
  return (
    <div className="transition-preview-container relative h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-md overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.div
            key={`material-preview-${materialType}-${surfaceTreatment}-${animationKey}`}
            style={materialStyle}
            className="w-4/5 h-4/5 rounded-lg overflow-hidden"
            variants={animationVariants}
            initial="initial"
            animate={["animate", surfaceAnimationProps.animate]}
            exit="exit"
          >
            {getContentForMaterial()}
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
            <div className="text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-md shadow">
              Press Play to start animation
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransitionPreviewFrame;
