
import { Button } from "@/components/ui/button";
import { MousePointer, RefreshCw } from "lucide-react";
import { DesignOption } from "../DesignPreview";

interface InteractionControlsProps {
  interaction: DesignOption;
  isDemonstrating: boolean;
  isActive: boolean;
  triggerInteraction: () => void;
  resetInteraction: () => void;
}

const InteractionControls = ({
  interaction,
  isDemonstrating,
  isActive,
  triggerInteraction,
  resetInteraction
}: InteractionControlsProps) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        size="sm"
        onClick={triggerInteraction}
      >
        <MousePointer className="h-4 w-4 mr-2" />
        {interaction.id === "interaction-3" 
          ? (isDemonstrating ? "Stop" : "Demonstrate") 
          : (isActive ? "Deactivate" : "Demonstrate")}
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={resetInteraction}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default InteractionControls;
