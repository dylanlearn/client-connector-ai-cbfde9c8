
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
  isDemonstrating?: boolean;
  cursorPosition?: { x: number; y: number };
  handleMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Component that renders the appropriate demonstration based on the selected interaction type
 */
const DemonstrationRenderer: React.FC<DemonstrationRendererProps> = ({ 
  selectedInteraction, 
  isActive,
  isDemonstrating = false,
  cursorPosition = { x: 0, y: 0 },
  handleMouseMove = () => {}
}) => {
  return (
    <AnimatePresence mode="wait">
      <div className="w-full h-full flex items-center justify-center">
        {selectedInteraction === 'hover-effect' && (
          <HoverEffectDemo 
            interactionConfig={{}} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'scroll-animation' && (
          <ScrollAnimationDemo 
            interactionConfig={{
              initial: { opacity: 0, y: 50 },
              animate: { opacity: 1, y: 0 }
            }} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'parallax-tilt' && (
          <ParallaxTiltDemo 
            interactionConfig={{
              animate: { rotateX: 0, rotateY: 0 }
            }} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'custom-cursor' && (
          <CustomCursorDemo 
            interactionConfig={{
              animate: { x: cursorPosition.x, y: cursorPosition.y }
            }} 
            isDemonstrating={isDemonstrating}
            handleMouseMove={handleMouseMove} 
          />
        )}
        {selectedInteraction === 'modal-dialog' && (
          <ModalDialogDemo 
            interactionConfig={{}} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'morphing-shape' && (
          <MorphingShapeDemo 
            interactionConfig={{}} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'magnetic-element' && (
          <MagneticElementDemo 
            interactionConfig={{
              animate: { x: 0, y: 0 }
            }} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'drag-interaction' && (
          <DragInteractionDemo 
            interactionConfig={{
              drag: true,
              dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 }
            }} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'color-shift' && (
          <ColorShiftDemo 
            interactionConfig={{
              animate: {},
              whileHover: {}
            }} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'intent-based-motion' && (
          <IntentBasedMotionDemo 
            interactionConfig={{}} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'progressive-disclosure' && (
          <ProgressiveDisclosureDemo 
            interactionConfig={{}} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'glassmorphism' && (
          <GlassmorphismDemo 
            interactionConfig={{}} 
            isActive={isActive} 
          />
        )}
        {selectedInteraction === 'ai-design-suggestion' && (
          <AIDesignSuggestionDemo isActive={isActive} />
        )}
        {!selectedInteraction && (
          <DefaultDemo />
        )}
      </div>
    </AnimatePresence>
  );
};

export default DemonstrationRenderer;
