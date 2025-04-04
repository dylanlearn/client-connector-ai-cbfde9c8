
import React from 'react';
import DefaultDemo from './demonstrations/DefaultDemo';
import HoverEffectDemo from './demonstrations/HoverEffectDemo';
import ScrollAnimationDemo from './demonstrations/ScrollAnimationDemo';
import ParallaxTiltDemo from './demonstrations/ParallaxTiltDemo';
import CustomCursorDemo from './demonstrations/CustomCursorDemo';
import ModalDialogDemo from './demonstrations/ModalDialogDemo';
import MorphingShapeDemo from './demonstrations/MorphingShapeDemo';
import MagneticElementDemo from './demonstrations/MagneticElementDemo';
import DragInteractionDemo from './demonstrations/DragInteractionDemo';
import ColorShiftDemo from './demonstrations/ColorShiftDemo';
import IntentBasedMotionDemo from './demonstrations/IntentBasedMotionDemo';
import ProgressiveDisclosureDemo from './demonstrations/ProgressiveDisclosureDemo';
import GlassmorphismDemo from './demonstrations/GlassmorphismDemo';
import AIDesignSuggestionDemo from './demonstrations/AIDesignSuggestionDemo';

export interface DemonstrationRendererProps {
  demoId: string;
  isActive?: boolean;
}

/**
 * Renders the appropriate interaction demonstration based on the provided ID
 */
export const DemonstrationRenderer = ({ 
  demoId, 
  isActive = true 
}: DemonstrationRendererProps) => {
  // Render the appropriate demo based on the ID
  const renderDemo = () => {
    switch (demoId) {
      case 'hover-effect':
        return <HoverEffectDemo isActive={isActive} />;
        
      case 'scroll-animation':
        return <ScrollAnimationDemo isActive={isActive} />;
        
      case 'parallax-tilt':
        return <ParallaxTiltDemo isActive={isActive} />;
        
      case 'custom-cursor':
        return <CustomCursorDemo isActive={isActive} />;
        
      case 'modal-dialog':
        return <ModalDialogDemo isActive={isActive} />;
        
      case 'morphing-shape':
        return <MorphingShapeDemo isActive={isActive} />;
        
      case 'magnetic-element':
        return <MagneticElementDemo isActive={isActive} />;
        
      case 'drag-interaction':
        return <DragInteractionDemo isActive={isActive} />;
        
      case 'color-shift':
        return <ColorShiftDemo isActive={isActive} />;
        
      case 'intent-motion':
        return <IntentBasedMotionDemo isActive={isActive} />;
        
      case 'progressive-disclosure':
        return <ProgressiveDisclosureDemo isActive={isActive} />;
        
      case 'glassmorphism':
        return <GlassmorphismDemo isActive={isActive} />;
        
      case 'ai-design-suggestion':
        return <AIDesignSuggestionDemo isActive={isActive} />;
        
      default:
        return <DefaultDemo isActive={isActive} />;
    }
  };

  return (
    <div className="demo-container h-full w-full overflow-hidden">
      {renderDemo()}
    </div>
  );
};

export default DemonstrationRenderer;
