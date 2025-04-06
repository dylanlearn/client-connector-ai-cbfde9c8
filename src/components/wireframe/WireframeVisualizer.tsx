
import React from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { PricingSection } from "./sections/PricingSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import { GenericSection } from "./sections/GenericSection";
import { FlowchartView } from "./FlowchartView";

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
    return <FlowchartView pages={pages} showDetails={true} />;
  }

  // Apply style tokens if available
  const styleToken = wireframeData.styleToken || 'modern';
  
  // Get style classes based on style token
  const getStyleClasses = () => {
    switch (styleToken?.toLowerCase()) {
      case 'brutalist':
        return 'font-mono bg-white text-black [&_button]:rounded-none [&_div]:rounded-none';
      case 'glassy':
        return 'font-sans bg-gradient-to-br from-blue-50 to-purple-50 [&_div]:backdrop-blur-sm';
      case 'minimalist':
        return 'font-sans bg-white text-gray-800 [&_h1]:font-light [&_h2]:font-light [&_h3]:font-light';
      case 'corporate':
        return 'font-serif bg-white text-gray-900 [&_section]:border-b [&_section]:border-gray-100';
      case 'playful':
        return 'font-sans bg-blue-50 [&_button]:rounded-full [&_div]:rounded-lg';
      case 'editorial':
        return 'font-serif text-gray-900 [&_p]:text-lg [&_h1]:tracking-tight [&_h2]:tracking-tight';
      case 'tech-forward':
        return 'font-mono bg-gray-900 text-gray-100 [&_div]:rounded-md';
      default: // modern
        return 'font-sans bg-white';
    }
  };

  // Preview mode renders a visual representation of the wireframe
  return (
    <div className={`wireframe-preview ${deviceType === "mobile" ? "wireframe-preview-mobile" : ""} ${getStyleClasses()}`}>
      {pages.map((page, pageIndex) => (
        <div key={`page-${pageIndex}`} className="mb-8">
          {pages.length > 1 && (
            <h3 className="text-lg font-medium mb-3 pb-2 border-b">
              {page.name || `Page ${pageIndex + 1}`}
            </h3>
          )}
          
          <div className="space-y-6">
            {(page.sections || []).map((section, sectionIndex) => {
              // Get any style-specific props
              const styleProps = section.styleProperties || {};
              
              // Render the appropriate section component based on section type
              switch (section.sectionType?.toLowerCase()) {
                case "hero":
                  return <HeroSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    variant={section.componentVariant}
                    {...styleProps}
                  />;
                
                case "features":
                  return <FeaturesSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    variant={section.componentVariant}
                    layout={section.layout}
                    {...styleProps}
                  />;

                case "testimonials":
                  return <TestimonialsSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    variant={section.componentVariant}
                    {...styleProps}
                  />;
                
                case "pricing":
                  return <PricingSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    variant={section.componentVariant}
                    {...styleProps}
                  />;
                
                case "contact":
                  return <ContactSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    variant={section.componentVariant}
                    {...styleProps}
                  />;
                
                case "footer":
                  return <FooterSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    variant={section.componentVariant}
                    {...styleProps}
                  />;
                
                default:
                  return <GenericSection 
                    key={sectionIndex} 
                    sectionIndex={sectionIndex} 
                    name={section.name}
                    layout={section.layout}
                    components={section.components}
                    {...styleProps}
                  />;
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
