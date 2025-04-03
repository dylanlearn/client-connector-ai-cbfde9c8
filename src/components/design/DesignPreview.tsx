
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignOption } from "./VisualPicker";
import { Maximize2, Minimize2, Eye, EyeOff } from "lucide-react";

interface DesignPreviewProps {
  selectedDesigns: Record<string, DesignOption>;
  className?: string;
}

const DesignPreview = ({ selectedDesigns, className = "" }: DesignPreviewProps) => {
  const [activeView, setActiveView] = useState<"mobile" | "desktop">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const hasHero = Object.values(selectedDesigns).some(design => design.category === "hero");
  const hasNavbar = Object.values(selectedDesigns).some(design => design.category === "navbar");
  const hasAbout = Object.values(selectedDesigns).some(design => design.category === "about");
  const hasFooter = Object.values(selectedDesigns).some(design => design.category === "footer");

  // Generate preview based on selected designs
  const generatePreview = () => {
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
          {/* Navbar Preview */}
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
          
          {/* Hero Preview */}
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
          
          {/* About Preview */}
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
          
          {/* Footer Preview */}
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

  return (
    <Card className={`shadow-md h-full ${className}`}>
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          Live Preview
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "mobile" | "desktop")}>
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
        {generatePreview()}
      </CardContent>
    </Card>
  );
};

export default DesignPreview;
