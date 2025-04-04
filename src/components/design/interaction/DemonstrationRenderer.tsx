
import React from 'react';
import { DesignOption } from '../DesignPreview';
import {
  DefaultDemo,
  HoverEffectDemo,
  ScrollAnimationDemo,
  ParallaxTiltDemo,
  CustomCursorDemo,
  ModalDialogDemo,
  MorphingShapeDemo,
  MagneticElementDemo,
  DragInteractionDemo,
  ColorShiftDemo,
  IntentBasedMotionDemo,
  ProgressiveDisclosureDemo,
  GlassmorphismDemo,
  AIDesignSuggestionDemo
} from './demonstrations';

export interface DemonstrationRendererProps {
  interaction: DesignOption;
  isActive: boolean;
  isDemonstrating: boolean;
  cursorPosition: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const DemonstrationRenderer = ({
  interaction,
  isActive,
  isDemonstrating,
  cursorPosition,
  handleMouseMove
}: DemonstrationRendererProps) => {
  const interactionConfig = { isActive };

  // Render the appropriate demonstration based on the interaction ID
  switch (interaction.id) {
    case 'interaction-1':
      return <HoverEffectDemo interactionConfig={interactionConfig} />;
    case 'interaction-2':
      return <ScrollAnimationDemo interactionConfig={interactionConfig} />;
    case 'interaction-3':
      return <ParallaxTiltDemo interactionConfig={interactionConfig} />;
    case 'interaction-4':
      return <CustomCursorDemo interactionConfig={interactionConfig} cursorPosition={cursorPosition} />;
    case 'interaction-5':
      return <ModalDialogDemo interactionConfig={interactionConfig} />;
    case 'interaction-6':
      return <MorphingShapeDemo interactionConfig={interactionConfig} />;
    case 'interaction-7':
      return <MagneticElementDemo interactionConfig={interactionConfig} />;
    case 'interaction-8':
      return <DragInteractionDemo interactionConfig={interactionConfig} />;
    case 'interaction-9':
      return <ColorShiftDemo interactionConfig={interactionConfig} />;
    case 'interaction-10':
      return <IntentBasedMotionDemo interactionConfig={interactionConfig} />;
    case 'interaction-11':
      return <ProgressiveDisclosureDemo interactionConfig={interactionConfig} />;
    case 'interaction-12':
      return <GlassmorphismDemo interactionConfig={interactionConfig} />;
    case 'interaction-13':
      return <AIDesignSuggestionDemo interactionConfig={interactionConfig} />;
    default:
      return <DefaultDemo interactionConfig={interactionConfig} />;
  }
};

export default DemonstrationRenderer;
