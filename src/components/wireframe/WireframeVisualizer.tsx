
import React, { useState, useEffect } from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { PricingSection } from "./sections/PricingSection";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import { GenericSection } from "./sections/GenericSection";
import { DashboardSection } from "./sections/DashboardSection";
import { FlowchartView } from "./FlowchartView";
import { cn } from "@/lib/utils";

interface WireframeVisualizerProps {
  wireframeData: WireframeData;
  viewMode?: "flowchart" | "preview";
  deviceType?: "desktop" | "mobile" | "tablet";
  darkMode?: boolean;
  showGrid?: boolean;
  highlightSections?: boolean;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({ 
  wireframeData,
  viewMode = "preview",
  deviceType = "desktop",
  darkMode = false,
  showGrid = false,
  highlightSections = false
}) => {
  const [isRendered, setIsRendered] = useState(false);
  
  useEffect(() => {
    // Add a small delay for transition effects
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [wireframeData]);

  // Get pages from wireframe if they exist, otherwise create a single page with sections
  const pages = wireframeData.pages || [
    {
      id: "page-1",
      name: wireframeData.title || "Home",
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
  const styleToken = wireframeData.styleToken || wireframeData.style || 'modern';
  
  // Get color scheme from wireframe data or use defaults
  const colorScheme = wireframeData.colorScheme || {
    primary: "#4F46E5",
    secondary: "#A855F7", 
    accent: "#F59E0B",
    background: darkMode ? "#111827" : "#ffffff"
  };
  
  // Get typography from wireframe data or use defaults
  const typography = wireframeData.typography || {
    headings: "font-raleway",
    body: "font-sans",
    fontPairings: ["Raleway", "Inter"]
  };
  
  // Get style classes based on style token
  const getStyleClasses = () => {
    // Apply dark mode classes if enabled
    const darkModeClass = darkMode ? 'bg-gray-900 text-gray-100' : '';
    
    // Apply tailwind classes based on style token string or object
    if (typeof styleToken === 'string') {
      switch (styleToken.toLowerCase()) {
        case 'brutalist':
          return cn(
            "font-mono",
            darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black',
            "[&_button]:rounded-none [&_div]:rounded-none",
            "border-4 border-black dark:border-white [&_section]:mb-0 [&_section]:border-b-4"
          );
        case 'glassy':
          return cn(
            "font-sans",
            darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50',
            "[&_div]:backdrop-blur-sm [&_section]:mb-4 [&_section]:rounded-xl",
            "[&_button]:bg-white/20 [&_button]:backdrop-blur-md"
          );
        case 'minimalist':
          return cn(
            "font-sans",
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800',
            "[&_h1]:font-light [&_h2]:font-light [&_h3]:font-light",
            "tracking-wide [&_p]:leading-relaxed [&_section]:py-16"
          );
        case 'corporate':
          return cn(
            "font-serif",
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900',
            "[&_section]:border-b",
            `[&_section]:${darkMode ? 'border-gray-700' : 'border-gray-200'}`,
            "[&_h1]:font-bold [&_h2]:font-semibold"
          );
        case 'playful':
          return cn(
            "font-sans",
            darkMode ? 'bg-gray-800' : 'bg-blue-50',
            "[&_button]:rounded-full [&_div]:rounded-lg",
            "[&_section]:p-8 [&_section]:rounded-3xl [&_section]:m-4"
          );
        case 'editorial':
          return cn(
            "font-serif",
            darkMode ? 'text-gray-100' : 'text-gray-900',
            "[&_p]:text-lg [&_h1]:tracking-tight [&_h2]:tracking-tight",
            "[&_section]:max-w-3xl [&_section]:mx-auto"
          );
        case 'tech-forward':
          return cn(
            "font-mono",
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900',
            "[&_div]:rounded-md",
            "[&_section]:border-l-4 [&_section]:pl-4",
            `[&_section]:border-${darkMode ? 'blue-500' : 'blue-600'}`
          );
        case 'bold':
          return cn(
            "font-sans",
            darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
            "[&_h1]:text-4xl [&_h1]:font-black [&_h2]:font-extrabold",
            "[&_section]:mb-8"
          );
        default: // modern
          return cn(
            "font-sans",
            darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white',
            "transition-all duration-300"
          );
      }
    } else {
      // Handle object style definition
      return cn(
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white',
        "transition-all duration-300"
      );
    }
  };
  
  // Device type specific classes
  const getDeviceClasses = () => {
    switch (deviceType) {
      case "mobile":
        return "max-w-[375px] mx-auto text-sm";
      case "tablet":
        return "max-w-[768px] mx-auto";
      default:
        return "";
    }
  };

  // Apply grid overlay for design guidance
  const gridOverlay = showGrid ? (
    <div className="pointer-events-none fixed inset-0 z-50 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 p-4 opacity-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-full bg-blue-500"></div>
      ))}
    </div>
  ) : null;

  // Preview mode renders a visual representation of the wireframe
  return (
    <div 
      className={cn(
        "wireframe-preview relative transition-all duration-300",
        getDeviceClasses(),
        getStyleClasses(),
        isRendered ? "opacity-100" : "opacity-0",
        showGrid ? "overflow-visible" : "overflow-auto"
      )}
      style={{
        '--primary-color': colorScheme.primary,
        '--secondary-color': colorScheme.secondary,
        '--accent-color': colorScheme.accent,
        '--background-color': colorScheme.background,
      } as React.CSSProperties}
    >
      {gridOverlay}
      
      {pages.map((page, pageIndex) => (
        <div key={`page-${pageIndex}`} className="mb-8 transition-all">
          {pages.length > 1 && (
            <h3 className={cn(
              "text-lg font-medium mb-3 pb-2",
              darkMode ? 'border-gray-700' : 'border-b'
            )}>
              {page.name || `Page ${pageIndex + 1}`}
            </h3>
          )}
          
          <div className="space-y-6">
            {(page.sections || []).map((section, sectionIndex) => {
              // Get any style-specific props
              const styleProps = section.styleProperties || {};
              
              // Create section wrapper with highlight option
              const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
                <div 
                  className={cn(
                    "transition-all duration-300",
                    highlightSections ? "hover:outline hover:outline-blue-500/50 relative" : ""
                  )}
                >
                  {highlightSections && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl opacity-75">
                      {section.sectionType || "Section"} {sectionIndex + 1}
                    </div>
                  )}
                  {children}
                </div>
              );
              
              // Render the appropriate section component based on section type
              const sectionContent = (() => {
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
                  
                  case "dashboard":
                    return <DashboardSection 
                      key={sectionIndex} 
                      sectionIndex={sectionIndex} 
                      variant={section.componentVariant}
                      layout={section.layout}
                      darkMode={darkMode}
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
              })();
              
              return (
                <SectionWrapper key={sectionIndex}>
                  {sectionContent}
                </SectionWrapper>
              );
            })}
          </div>
        </div>
      ))}

      <style>
        {`
        .wireframe-preview {
          font-family: ${typography.body || "system-ui"}, sans-serif;
        }
        .wireframe-preview h1, .wireframe-preview h2, .wireframe-preview h3, 
        .wireframe-preview h4, .wireframe-preview h5, .wireframe-preview h6 {
          font-family: ${typography.headings || "system-ui"}, sans-serif;
        }
        .wireframe-preview-mobile {
          max-width: 100%;
          font-size: 0.85em;
        }
        `}
      </style>
    </div>
  );
};

export default WireframeVisualizer;
