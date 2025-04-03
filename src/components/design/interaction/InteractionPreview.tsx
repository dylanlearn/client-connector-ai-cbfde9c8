
import { useState } from "react";
import { DesignOption } from "../DesignPreview";
import DemonstrationRenderer from "./DemonstrationRenderer";
import InteractionControls from "./InteractionControls";

interface InteractionPreviewProps {
  interaction: DesignOption;
}

const InteractionPreview = ({ interaction }: InteractionPreviewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isDemonstrating, setIsDemonstrating] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interaction.id === "interaction-3" && isDemonstrating) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left - 25,
        y: e.clientY - rect.top - 25
      });
    }
  };

  const resetInteraction = () => {
    setIsActive(false);
    setIsDemonstrating(false);
    setCursorPosition({ x: 0, y: 0 });
  };

  const triggerInteraction = () => {
    if (interaction.id === "interaction-3") {
      setIsDemonstrating(!isDemonstrating);
    } else {
      setIsActive(!isActive);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{interaction.title}</h3>
      
      <DemonstrationRenderer 
        interaction={interaction}
        isActive={isActive}
        isDemonstrating={isDemonstrating}
        cursorPosition={cursorPosition}
        handleMouseMove={handleMouseMove}
      />
      
      <p className="text-sm text-gray-600 my-4">{interaction.description}</p>
      
      <InteractionControls 
        interaction={interaction}
        isDemonstrating={isDemonstrating}
        isActive={isActive}
        triggerInteraction={triggerInteraction}
        resetInteraction={resetInteraction}
      />
    </div>
  );
};

export default InteractionPreview;
