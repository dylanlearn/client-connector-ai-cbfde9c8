
import { EyeOff } from "lucide-react";
import { DesignOption } from "./types";

interface LayoutPreviewProps {
  selectedDesigns: Record<string, DesignOption>;
  activeView: "mobile" | "desktop";
  isFullscreen: boolean;
}

const LayoutPreview = ({ 
  selectedDesigns, 
  activeView, 
  isFullscreen 
}: LayoutPreviewProps) => {
  const hasHero = Object.values(selectedDesigns).some(design => design.category === "hero");
  const hasNavbar = Object.values(selectedDesigns).some(design => design.category === "navbar");
  const hasAbout = Object.values(selectedDesigns).some(design => design.category === "about");
  const hasFooter = Object.values(selectedDesigns).some(design => design.category === "footer");

  if (Object.keys(selectedDesigns).length === 0) {
    return <EmptyPreview />;
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
                    src={design.imageUrl || design.preview || '/placeholder-navbar.png'} 
                    alt={design.title || design.name}
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
                    src={design.imageUrl || design.preview || '/placeholder-hero.png'} 
                    alt={design.title || design.name}
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
                    src={design.imageUrl || design.preview || '/placeholder-about.png'} 
                    alt={design.title || design.name}
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
                    src={design.imageUrl || design.preview || '/placeholder-footer.png'} 
                    alt={design.title || design.name}
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

const EmptyPreview = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <EyeOff className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-lg font-medium text-muted-foreground">Select designs to preview</h3>
    <p className="text-sm text-muted-foreground max-w-md mt-2">
      As you select design elements, they will appear here in a live preview to help you visualize your website.
    </p>
  </div>
);

export default LayoutPreview;
