
import React from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { PricingSection } from "./sections/PricingSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import { GenericSection } from "./sections/GenericSection";

// Let's create a simple FlowchartView component directly in this file
// since it seems to be missing or causing import issues
const FlowchartView: React.FC<{ pages: any[] }> = ({ pages }) => {
  return (
    <div className="flowchart-view p-4 bg-blue-50/70 rounded-lg overflow-auto min-h-[500px]">
      {pages.map((page, pageIndex) => (
        <div key={`page-${pageIndex}`} className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {page.name || `Page ${pageIndex + 1}`}
          </h3>
          <div className="border rounded-lg p-4 bg-white">
            <div className="space-y-2">
              {(page.sections || []).map((section: any, sectionIndex: number) => (
                <div
                  key={`section-${sectionIndex}`}
                  className="p-2 border rounded bg-gray-50 flex items-center"
                >
                  <div className="mr-2 p-1 rounded bg-blue-100">
                    <span className="text-xs">{section.sectionType || "Generic"}</span>
                  </div>
                  <div className="text-sm">{section.name || `Section ${sectionIndex + 1}`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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
