
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MaterialType, SurfaceTreatment, generateMaterialStyles } from '../fidelity/FidelityLevels';
import '../materials/materials.css';

export interface TransitionPreviewFrameProps {
  material: MaterialType;
  surfaceTreatment: SurfaceTreatment;
  color: string;
  intensity: number;
  isPlaying: boolean;
  onTransitionEnd?: () => void;
}

const TransitionPreviewFrame: React.FC<TransitionPreviewFrameProps> = ({
  material,
  surfaceTreatment,
  color,
  intensity,
  isPlaying,
  onTransitionEnd
}) => {
  const [animationKey, setAnimationKey] = useState<number>(0);
  
  // Reset animation when play status changes
  useEffect(() => {
    if (isPlaying) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isPlaying]);

  // Generate base styles from material properties
  const materialStyles = generateMaterialStyles(
    material,
    surfaceTreatment,
    color,
    intensity
  );

  // Convert RGB color string for variable use
  const getRgbFromHex = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
    
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "0, 0, 0";
  };

  // Generate CSS variables for material effects
  const cssVariables = {
    '--color-rgb': getRgbFromHex(color),
    '--color-fill': color
  } as React.CSSProperties;

  // Get animation based on material type
  const getMaterialAnimation = () => {
    if (!isPlaying) return {};

    switch (material) {
      case 'metallic':
        return {
          scale: [1, 1.02, 1],
          rotate: [0, 0.5, 0],
          transition: {
            repeat: Infinity,
            repeatType: "loop" as const,
            duration: 4
          }
        };
      case 'glass':
        return {
          y: [0, -3, 0],
          transition: {
            repeat: Infinity,
            repeatType: "loop" as const,
            duration: 3
          }
        };
      case 'glossy':
        return {
          boxShadow: [
            '0 4px 8px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2)',
            '0 6px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
            '0 4px 8px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2)'
          ],
          transition: {
            repeat: Infinity,
            repeatType: "loop" as const,
            duration: 3.5
          }
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative w-full aspect-video flex items-center justify-center bg-grid-pattern rounded-lg overflow-hidden">
      <motion.div
        key={`material-${animationKey}`}
        className={`
          material-preview 
          material-${material} 
          surface-${surfaceTreatment}
          w-3/4 h-2/3 rounded-lg
        `}
        style={{
          ...materialStyles,
          ...cssVariables
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          ...getMaterialAnimation()
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        onAnimationComplete={onTransitionEnd}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="text-sm font-medium">
            {material.charAt(0).toUpperCase() + material.slice(1)}
          </div>
          <div className="text-xs text-muted">
            {surfaceTreatment} surface
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransitionPreviewFrame;
