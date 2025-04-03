
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PreviewHeader from "./preview/PreviewHeader";
import LayoutPreview from "./preview/LayoutPreview";
import EffectsPreview from "./preview/EffectsPreview";
import { DesignOption } from "./VisualPicker";

interface DesignPreviewProps {
  selectedDesigns: Record<string, DesignOption>;
  className?: string;
}

const DesignPreview = ({ selectedDesigns, className = "" }: DesignPreviewProps) => {
  const [activeView, setActiveView] = useState<"mobile" | "desktop">("desktop");
  const [activeTab, setActiveTab] = useState<"layout" | "animations">("layout");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Filter selected designs by category
  const hasAnimation = Object.values(selectedDesigns).some(design => design.category === "animation");
  const hasInteraction = Object.values(selectedDesigns).some(design => design.category === "interaction");
  const selectedAnimations = Object.values(selectedDesigns).filter(design => design.category === "animation");
  const selectedInteractions = Object.values(selectedDesigns).filter(design => design.category === "interaction");

  return (
    <Card className={`shadow-md h-full ${className}`}>
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">
          Live Preview
        </CardTitle>
        
        <PreviewHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeView={activeView}
          setActiveView={setActiveView}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />
      </CardHeader>
      
      <CardContent>
        {activeTab === "layout" ? (
          <LayoutPreview 
            selectedDesigns={selectedDesigns} 
            activeView={activeView} 
            isFullscreen={isFullscreen} 
          />
        ) : (
          <EffectsPreview 
            hasAnimation={hasAnimation}
            hasInteraction={hasInteraction}
            selectedAnimations={selectedAnimations}
            selectedInteractions={selectedInteractions}
            isFullscreen={isFullscreen}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DesignPreview;
