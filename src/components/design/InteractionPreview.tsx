
import { useState } from "react";
import { motion } from "framer-motion";
import { DesignOption } from "./AnimatedVisualPicker";
import { MousePointer, RefreshCw, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractionPreviewProps {
  interaction: DesignOption;
}

const InteractionPreview = ({ interaction }: InteractionPreviewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isDemonstrating, setIsDemonstrating] = useState(false);

  // Get interaction configuration based on interaction type
  const getInteractionConfig = (interactionType: string) => {
    switch (interactionType) {
      case "interaction-1": // Hover Effects
        return {
          initial: {},
          whileHover: { 
            scale: 1.05, 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          },
          animate: isActive ? { 
            scale: 1.05,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          } : {}
        };
      case "interaction-2": // Modal Dialogs
        return {
          initial: { scale: 0 },
          animate: isActive ? { 
            scale: 1,
            transition: { type: "spring", stiffness: 500, damping: 30 }
          } : { scale: 0 }
        };
      case "interaction-3": // Custom Cursors
        return {
          initial: {},
          animate: {
            x: cursorPosition.x,
            y: cursorPosition.y,
            transition: { type: "spring", damping: 25, stiffness: 300 }
          }
        };
      case "interaction-4": // Scroll Animations
        return {
          initial: { opacity: 0, y: 50 },
          animate: isActive ? { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
          } : { opacity: 0, y: 50 }
        };
      case "interaction-5": // Drag Interactions
        return {
          initial: {},
          animate: isActive ? { x: 50 } : { x: 0 },
          drag: true,
          dragConstraints: { left: 0, right: 100, top: 0, bottom: 0 },
          whileDrag: { scale: 1.1 }
        };
      default:
        return {};
    }
  };

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
      setIsDemonstrating(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const interactionConfig = getInteractionConfig(interaction.id);

  // Different demonstration UI based on interaction type
  const renderDemonstration = () => {
    switch (interaction.id) {
      case "interaction-1": // Hover Effects
        return (
          <div className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
            <motion.div 
              className="bg-white p-6 rounded-lg w-3/4"
              {...interactionConfig}
            >
              <div className="w-full h-4 bg-gray-200 rounded-full mb-3" />
              <div className="w-5/6 h-4 bg-gray-200 rounded-full mb-3" />
              <div className="w-4/6 h-4 bg-gray-200 rounded-full" />
            </motion.div>
          </div>
        );
      
      case "interaction-2": // Modal Dialogs
        return (
          <div className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-400 rounded" />
              </div>
            </div>
            
            {/* Modal overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
            >
              <motion.div 
                className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-xs"
                {...interactionConfig}
              >
                <h4 className="font-medium mb-2">Modal Dialog</h4>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full" />
                  <div className="w-5/6 h-3 bg-gray-200 rounded-full" />
                </div>
                <div className="flex justify-end mt-4">
                  <div className="w-16 h-6 bg-blue-500 rounded-md" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        );
      
      case "interaction-3": // Custom Cursors
        return (
          <div 
            className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            <div className="text-center text-gray-500">
              {isDemonstrating ? "Move your mouse in this area" : "Click 'Demonstrate' to start"}
            </div>
            
            {isDemonstrating && (
              <motion.div 
                className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white"
                {...interactionConfig}
              >
                <Hand className="h-6 w-6" />
              </motion.div>
            )}
          </div>
        );
      
      case "interaction-4": // Scroll Animations
        return (
          <div className="relative bg-gray-100 h-64 rounded-md flex flex-col items-center justify-start p-4 overflow-hidden">
            <div className="w-full flex justify-between mb-4">
              <div className="w-24 h-4 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded-full" />
            </div>
            
            <div className="w-full space-y-4">
              <motion.div 
                className="w-full h-12 bg-white rounded-md shadow"
                {...interactionConfig}
              />
              
              {isActive && (
                <>
                  <motion.div 
                    className="w-full h-12 bg-white rounded-md shadow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  />
                  <motion.div 
                    className="w-full h-12 bg-white rounded-md shadow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  />
                </>
              )}
            </div>
          </div>
        );
      
      case "interaction-5": // Drag Interactions
        return (
          <div className="relative bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
            <div className="w-3/4 h-1 bg-gray-300 rounded-full"></div>
            <motion.div 
              className="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl cursor-grab active:cursor-grabbing"
              {...interactionConfig}
            >
              {isActive ? "Drag me!" : "Activate first"}
            </motion.div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
            <div className="text-gray-500">Select an interaction to preview</div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{interaction.title}</h3>
      
      {renderDemonstration()}
      
      <p className="text-sm text-gray-600 my-4">{interaction.description}</p>
      
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
    </div>
  );
};

export default InteractionPreview;
