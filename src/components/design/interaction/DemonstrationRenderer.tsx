
import { DesignOption } from "../DesignPreview";
import { getInteractionConfig } from "./interactionConfigs";
import {
  HoverEffectDemo,
  ModalDialogDemo,
  CustomCursorDemo,
  ScrollAnimationDemo,
  DragInteractionDemo,
  DefaultDemo
} from "./demonstrations";

interface DemonstrationRendererProps {
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
  const interactionConfig = getInteractionConfig(interaction.id, isActive, cursorPosition);

  // Different demonstration UI based on interaction type
  switch (interaction.id) {
    case "interaction-1": // Hover Effects
      return <HoverEffectDemo interactionConfig={interactionConfig} />;
    
    case "interaction-2": // Modal Dialogs
      return <ModalDialogDemo interactionConfig={interactionConfig} isActive={isActive} />;
    
    case "interaction-3": // Custom Cursors
      return (
        <CustomCursorDemo
          interactionConfig={interactionConfig}
          isDemonstrating={isDemonstrating}
          handleMouseMove={handleMouseMove}
        />
      );
    
    case "interaction-4": // Scroll Animations
      return <ScrollAnimationDemo interactionConfig={interactionConfig} isActive={isActive} />;
    
    case "interaction-5": // Drag Interactions
      return <DragInteractionDemo interactionConfig={interactionConfig} isActive={isActive} />;
    
    default:
      return <DefaultDemo />;
  }
};

export default DemonstrationRenderer;
