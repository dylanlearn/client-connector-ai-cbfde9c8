
import React from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { FlowchartView } from "./FlowchartView";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { PricingSection } from "./sections/PricingSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import { GenericSection } from "./sections/GenericSection";

interface WireframeVisualizerProps {
  wireframeData: WireframeData;
  viewMode?: "flowchart" | "preview";
  deviceType?: "desktop" | "mobile";
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({ 
  wireframeData,
  viewMode = "preview",
  deviceType = "desktop" 
}) => {
  // Get pages from wireframe if they exist, otherwise create a single page with sections
  const pages = wireframeData.pages || [
    {
      id: "page-1",
      name: "Home",
      slug: "home",
      sections: wireframeData.sections || [],
      pageType: "home"
    }
  ];

  // Flowchart mode renders a simplified view showing page and section structure
  if (viewMode === "flowchart") {
    return <FlowchartView pages={pages} />;
  }

  // Preview mode renders a visual representation of the wireframe
  return (
    <div className={`wireframe-preview ${deviceType === "mobile" ? "wireframe-preview-mobile" : ""}`}>
      {pages.map((page, pageIndex) => (
        <div key={`page-${pageIndex}`} className="mb-8">
          {pages.length > 1 && (
            <h3 className="text-lg font-medium mb-3 pb-2 border-b">
              {page.name || `Page ${pageIndex + 1}`}
            </h3>
          )}
          
          <div className="space-y-6">
            {(page.sections || []).map((section, sectionIndex) => {
              // Render the appropriate section component based on section type
              switch (section.sectionType?.toLowerCase()) {
                case "hero":
                  return <HeroSection key={sectionIndex} sectionIndex={sectionIndex} />;
                
                case "features":
                  return <FeaturesSection key={sectionIndex} sectionIndex={sectionIndex} />;

                case "testimonials":
                  return <TestimonialsSection key={sectionIndex} sectionIndex={sectionIndex} />;
                
                case "pricing":
                  return <PricingSection key={sectionIndex} sectionIndex={sectionIndex} />;
                
                case "contact":
                  return <ContactSection key={sectionIndex} sectionIndex={sectionIndex} />;
                
                case "footer":
                  return <FooterSection key={sectionIndex} sectionIndex={sectionIndex} />;
                
                default:
                  return <GenericSection key={sectionIndex} sectionIndex={sectionIndex} />;
              }
            })}
          </div>
        </div>
      ))}

      <style>{`
        .wireframe-preview {
          font-family: system-ui, sans-serif;
        }
        .wireframe-preview-mobile {
          max-width: 100%;
          font-size: 0.85em;
        }
      `}</style>
    </div>
  );
};

export default WireframeVisualizer;
