
import React from 'react';
import { AnimatePresence } from 'framer-motion';
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

interface DemonstrationRendererProps {
  selectedInteraction: string;
  isActive: boolean;
}

/**
 * Component that renders the appropriate demonstration based on the selected interaction type
 */
const DemonstrationRenderer: React.FC<DemonstrationRendererProps> = ({ 
  selectedInteraction, 
  isActive 
}) => {
  // Use the isActive prop to control animations in the demonstrations
  const getInteractionConfig = () => ({
    isActive,
    animate: isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.95 },
    initial: { opacity: 0, scale: 0.9 },
    whileHover: { scale: 1.05 },
    drag: isActive,
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 }
  });

  const config = getInteractionConfig();

  return (
    <AnimatePresence mode="wait">
      <div className="w-full h-full flex items-center justify-center">
        {selectedInteraction === 'hover-effect' && (
          <HoverEffectDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'scroll-animation' && (
          <ScrollAnimationDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'parallax-tilt' && (
          <ParallaxTiltDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'custom-cursor' && (
          <CustomCursorDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'modal-dialog' && (
          <ModalDialogDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'morphing-shape' && (
          <MorphingShapeDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'magnetic-element' && (
          <MagneticElementDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'drag-interaction' && (
          <DragInteractionDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'color-shift' && (
          <ColorShiftDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'intent-based-motion' && (
          <IntentBasedMotionDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'progressive-disclosure' && (
          <ProgressiveDisclosureDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'glassmorphism' && (
          <GlassmorphismDemo interactionConfig={config} />
        )}
        {selectedInteraction === 'ai-design-suggestion' && (
          <AIDesignSuggestionDemo />
        )}
        {!selectedInteraction && (
          <DefaultDemo />
        )}
      </div>
    </AnimatePresence>
  );
};

export default DemonstrationRenderer;
