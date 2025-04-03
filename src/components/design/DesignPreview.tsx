import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignOption } from "./VisualPicker";
import { Maximize2, Minimize2, Eye, EyeOff, Layout, Sparkles } from "lucide-react";
import AnimationPreview from "./AnimationPreview";
import InteractionPreview from "./InteractionPreview";

interface DesignPreviewProps {
  selectedDesigns: Record<string, DesignOption>;
  className?: string;
}

const DesignPreview = ({ selectedDesigns, className = "" }: DesignPreviewProps) => {
  const [activeView, setActiveView] = useState<"mobile" | "desktop">("desktop");
  const [activeTab, setActiveTab] = useState<"layout" | "animations">("layout");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const hasHero = Object.values(selectedDesigns).some(design => design.category === "hero");
  const hasNavbar = Object.values(selectedDesigns).some(design => design.category === "navbar");
  const hasAbout = Object.values(selectedDesigns).some(design => design.category === "about");
  const hasFooter = Object.values(selectedDesigns).some(design => design.category === "footer");
  const hasAnimation = Object.values(selectedDesigns).some(design => design.category === "animation");
  const hasInteraction = Object.values(selectedDesigns).some(design => design.category === "interaction");

  const selectedAnimations = Object.values(selectedDesigns).filter(design => design.category === "animation");
  const selectedInteractions = Object.values(selectedDesigns).filter(design => design.category === "interaction");

  const generateLayoutPreview = () => {
    if (Object.keys(selectedDesigns).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <EyeOff className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-muted-foreground">Select designs to preview</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            As you select design elements, they will appear here in a live preview to help you visualize your website.
          </p>
        </div>
      );
    }
    
    return (
      <div className={`overflow-auto ${activeView === "mobile" ? "max-w-[375px] mx-auto" : ""}`} 
           style={{ height: isFullscreen ? "calc(100vh - 150px)" : "500px" }}>
        <div className="bg-white min-h-full flex flex-col">
          {hasNavbar && (
            <div className="sticky top-0 z-10 bg-white border-b">
              {Object.values(selectedDesigns)
                .filter(design => design.category === "navbar")
                .map(design => (
                  <div key={design.id} className="p-4">
                    <img 
                      src={design.imageUrl} 
                      alt={design.title}
                      className="w-full h-auto object-contain max-h-20"
                    />
                  </div>
                ))}
            </div>
          )}
          
          {hasHero && (
            <div className="bg-gray-50">
              {Object.values(selectedDesigns)
                .filter(design => design.category === "hero")
                .map(design => (
                  <div key={design.id}>
                    <img 
                      src={design.imageUrl} 
                      alt={design.title}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
            </div>
          )}
          
          {hasAbout && (
            <div className="py-8 px-4">
              {Object.values(selectedDesigns)
                .filter(design => design.category === "about")
                .map(design => (
                  <div key={design.id}>
                    <img 
                      src={design.imageUrl} 
                      alt={design.title}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
            </div>
          )}
          
          {hasFooter && (
            <div className="mt-auto bg-gray-100">
              {Object.values(selectedDesigns)
                .filter(design => design.category === "footer")
                .map(design => (
                  <div key={design.id}>
                    <img 
                      src={design.imageUrl} 
                      alt={design.title}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const generateAnimationsPreview = () => {
    if (!hasAnimation && !hasInteraction) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-muted-foreground">No animations or interactions selected</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            Select animations and interactions to see them previewed here. These will add life and engagement to your website.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-auto p-4" style={{ height: isFullscreen ? "calc(100vh - 150px)" : "500px" }}>
        {hasAnimation && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Animations</h2>
            <div className="grid grid-cols-1 gap-6">
              {selectedAnimations.map(animation => (
                <AnimationPreview key={animation.id} animation={animation} />
              ))}
            </div>
          </div>
        )}

        {hasInteraction && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Interactions</h2>
            <div className="grid grid-cols-1 gap-6">
              {selectedInteractions.map(interaction => (
                <InteractionPreview key={interaction.id} interaction={interaction} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`shadow-md h-full ${className}`}>
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          Live Preview
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "layout" | "animations")}>
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="layout" className="flex items-center gap-1">
                <Layout className="h-4 w-4" />
                <span>Layout</span>
              </TabsTrigger>
              <TabsTrigger value="animations" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Effects</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === "layout" && (
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "mobile" | "desktop")}>
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === "layout" ? generateLayoutPreview() : generateAnimationsPreview()}
      </CardContent>
    </Card>
  );
};

export default DesignPreview;
