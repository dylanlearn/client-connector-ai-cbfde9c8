
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesignOption } from "../DesignPreview";
import { Play, Pause, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInteractionConfig } from "./interactionConfigs";
import InteractionControls from "./InteractionControls";
import DemonstrationRenderer from "./DemonstrationRenderer";

interface InteractionPreviewProps {
  interaction: DesignOption;
}

const InteractionPreview = ({ interaction }: InteractionPreviewProps) => {
  const [isActive, setIsActive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [key, setKey] = useState(0); // For resetting interactions
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [isDemonstrating, setIsDemonstrating] = useState(false);
  
  // Get interaction config
  const interactionConfig = getInteractionConfig(interaction.id, isActive, cursorPosition);

  // Handle cursor movement
  const handleCursorMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interaction.id === "interaction-3") { // Only track for custom cursor interaction
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Reset interaction
  const resetInteraction = () => {
    setIsActive(false);
    setIsDemonstrating(false);
    setTimeout(() => {
      setKey(prev => prev + 1);
      setIsActive(true);
    }, 100);
  };

  // Trigger the interaction
  const triggerInteraction = () => {
    if (interaction.id === "interaction-3") {
      setIsDemonstrating(!isDemonstrating);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{interaction.title}</h3>
      
      {showWebsitePreview ? (
        <div className="relative h-64 bg-gradient-to-r from-gray-50 to-blue-50 rounded-md flex items-center justify-center mb-4 overflow-hidden">
          <DemonstrationRenderer 
            selectedInteraction={interaction.id}
            isActive={isActive}
            isDemonstrating={isDemonstrating}
            cursorPosition={cursorPosition}
            handleMouseMove={handleCursorMove}
          />
          <button 
            onClick={() => setShowWebsitePreview(false)}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      ) : (
        <div 
          className="relative h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md flex items-center justify-center mb-4"
          onMouseMove={handleCursorMove}
        >
          <InteractionControls
            interaction={interaction}
            isActive={isActive}
            isDemonstrating={isDemonstrating}
            triggerInteraction={triggerInteraction}
            resetInteraction={resetInteraction}
            key={key}
          />
        </div>
      )}
      
      <p className="text-sm text-gray-600 mb-4">{interaction.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={triggerInteraction}
          >
            {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isActive ? "Pause" : "Demonstrate"}
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
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowWebsitePreview(!showWebsitePreview)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {showWebsitePreview ? "Simple View" : "Website Preview"}
        </Button>
      </div>
    </div>
  );
};

export default InteractionPreview;
