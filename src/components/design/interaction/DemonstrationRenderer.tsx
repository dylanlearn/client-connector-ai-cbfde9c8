
import { DesignOption } from "../DesignPreview";
import { 
  getInteractionConfig, 
  InteractionConfig, 
  HoverEffectConfig, 
  ModalDialogConfig, 
  CustomCursorConfig,
  ScrollAnimationConfig,
  DragInteractionConfig,
  MagneticElementConfig,
  ColorShiftConfig,
  ParallaxTiltConfig
} from "./interactionConfigs";
import {
  HoverEffectDemo,
  ModalDialogDemo,
  CustomCursorDemo,
  ScrollAnimationDemo,
  DragInteractionDemo,
  DefaultDemo,
  AIDesignSuggestionDemo,
  MagneticElementDemo,
  ColorShiftDemo,
  ParallaxTiltDemo
} from "./demonstrations";

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
  // Get the base interaction config
  const interactionConfig = getInteractionConfig(interaction.id, isActive, cursorPosition);

  // Different demonstration UI based on interaction type
  switch (interaction.id) {
    case "interaction-1": // Hover Effects
      return <HoverEffectDemo interactionConfig={interactionConfig as HoverEffectConfig} />;
    
    case "interaction-2": // Modal Dialogs
      return <ModalDialogDemo interactionConfig={interactionConfig as ModalDialogConfig} isActive={isActive} />;
    
    case "interaction-3": // Custom Cursors
      return (
        <CustomCursorDemo
          interactionConfig={interactionConfig as CustomCursorConfig}
          isDemonstrating={isDemonstrating}
          handleMouseMove={handleMouseMove}
        />
      );
    
    case "interaction-4": // Scroll Animations
      return <ScrollAnimationDemo interactionConfig={interactionConfig as ScrollAnimationConfig} isActive={isActive} />;
    
    case "interaction-5": // Drag Interactions
      return <DragInteractionDemo interactionConfig={interactionConfig as DragInteractionConfig} isActive={isActive} />;
    
    case "interaction-6": // AI Design Suggestion presentation
      return <AIDesignSuggestionDemo isActive={isActive} />;
      
    case "interaction-7": // Magnetic Elements
      return <MagneticElementDemo interactionConfig={interactionConfig as MagneticElementConfig} isActive={isActive} />;
      
    case "interaction-8": // Color Shift
      return <ColorShiftDemo interactionConfig={interactionConfig as ColorShiftConfig} isActive={isActive} />;
      
    case "interaction-9": // Parallax Tilt
      return <ParallaxTiltDemo interactionConfig={interactionConfig as ParallaxTiltConfig} isActive={isActive} />;
    
    default:
      return <DefaultDemo />;
  }
};

export default DemonstrationRenderer;
