
import { motion } from "framer-motion";
import { MousePointer, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignOption } from "../DesignPreview";

export interface InteractionControlsProps {
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

  // Get dynamic button color based on state
  const getButtonVariant = () => {
    if (isDemonstrating || isActive) {
      return "default";
    }
    return "outline";
  };

  return (
    <div className="flex justify-between">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button 
          variant={getButtonVariant()} 
          size="sm"
          onClick={triggerInteraction}
          className="relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center">
            {isDemonstrating || isActive ? (
              <Sparkles className="h-4 w-4 mr-2 text-white" />
            ) : (
              <MousePointer className="h-4 w-4 mr-2" />
            )}
            {getButtonText()}
          </span>
          
          {/* Enhanced background shine effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 1.5 }}
          />
          
          {/* Subtle particle effects for active state */}
          {(isDemonstrating || isActive) && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/60"
                  initial={{ 
                    x: Math.random() * 100, 
                    y: Math.random() * 30,
                    opacity: 0.7,
                    scale: 0
                  }}
                  animate={{ 
                    y: [null, -20],
                    opacity: [null, 0],
                    scale: [null, 1]
                  }}
                  transition={{ 
                    duration: 1 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.6
                  }}
                />
              ))}
            </motion.div>
          )}
        </Button>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetInteraction}
          className="group"
        >
          <motion.div
            animate={isActive || isDemonstrating ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          </motion.div>
          Reset
        </Button>
      </motion.div>
    </div>
  );
};

export default InteractionControls;
