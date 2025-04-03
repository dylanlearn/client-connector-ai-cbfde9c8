
import { motion } from "framer-motion";
import { MousePointer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  // Get button text based on interaction type and state
  const getButtonText = () => {
    if (interaction.id === "interaction-3") {
      return isDemonstrating ? "Stop" : "Demonstrate";
    }
    return isActive ? "Deactivate" : "Demonstrate";
  };

  return (
    <div className="flex justify-between">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="outline" 
          size="sm"
          onClick={triggerInteraction}
          className="relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center">
            <MousePointer className="h-4 w-4 mr-2" />
            {getButtonText()}
          </span>
          
          {/* Background shine effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 1.5 }}
          />
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetInteraction}
          className="group"
        >
          <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Reset
        </Button>
      </motion.div>
    </div>
  );
};

export default InteractionControls;
