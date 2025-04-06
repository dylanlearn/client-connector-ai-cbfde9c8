
import React, { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  Tablet,
  Grid3x3,
  Eye,
  Share2,
  ListTree,
  Download
} from "lucide-react";

interface WireframeVisualizerProps {
  wireframeData: WireframeData;
  viewMode?: "flowchart" | "preview";
  deviceType?: "desktop" | "mobile" | "tablet";
  darkMode?: boolean;
  showGrid?: boolean;
  highlightSections?: boolean;
  onSectionClick?: (section: any) => void;
  interactive?: boolean;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({ 
  wireframeData,
  viewMode: initialViewMode = "preview",
  deviceType: initialDeviceType = "desktop",
  darkMode = false,
  showGrid = false,
  highlightSections = false,
  onSectionClick,
  interactive = false
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"flowchart" | "preview">(initialViewMode);
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile" | "tablet">(initialDeviceType);
  const [activeTab, setActiveTab] = useState("preview");
  const [selectedSection, setSelectedSection] = useState<any>(null);
  
  useEffect(() => {
    console.log("WireframeVisualizer received wireframeData:", wireframeData);
    console.log("Pages:", wireframeData.pages);
    console.log("Sections:", wireframeData.sections);
  }, [wireframeData]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [wireframeData]);

  const validatedData = React.useMemo(() => {
    const data = {...wireframeData};
    
    if (!data.pages && !data.sections) {
      data.sections = [];
    }
    
    return data;
  }, [wireframeData]);

  const pages = validatedData.pages || [
    {
      id: "page-1",
      name: validatedData.title || "Home",
      slug: "home",
      sections: validatedData.sections || [],
      pageType: "home"
    }
  ];

  // Handle entering and exiting fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle node expansion in flowchart view
  const handleNodeExpand = useCallback((nodeId: string) => {
    console.log("Expanding node:", nodeId);
    // In a real implementation, you might update state to show more details
    // about this particular node
  }, []);

  // Handle node collapsing in flowchart view
  const handleNodeCollapse = useCallback((nodeId: string) => {
    console.log("Collapsing node:", nodeId);
    // In a real implementation, you might update state to hide details
    // about this particular node
  }, []);

  // Handle node click in flowchart view
  const handleNodeClick = useCallback((nodeId: string, nodeData: any) => {
    console.log("Node clicked:", nodeId, nodeData);
    
    // If the node represents a section, find and select that section
    if (nodeId.startsWith('section-')) {
      const sectionData = nodeData.sectionData;
      setSelectedSection(sectionData);
      // If we're in flowchart view and interactive mode is on, switch to preview
      if (viewMode === "flowchart" && interactive) {
        setViewMode("preview");
      }
    }
    
    // If the node represents a page, deselect any section
    if (nodeId.startsWith('page-')) {
      setSelectedSection(null);
    }
  }, [viewMode, interactive]);

  // Handle section click in preview mode
  const handleSectionClick = useCallback((section: any) => {
    console.log("Section clicked:", section);
    setSelectedSection(section);
    
    // Call external handler if provided
    if (onSectionClick) {
      onSectionClick(section);
    }
  }, [onSectionClick]);

  const handleDownloadJSON = useCallback(() => {
    const dataStr = JSON.stringify(wireframeData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', `wireframe-${wireframeData.title || 'export'}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, [wireframeData]);

  // Switch to flowchart view
  if (viewMode === "flowchart") {
    return (
      <div className={cn(
        "wireframe-preview relative", 
        darkMode ? "bg-gray-900" : "bg-white",
        isFullscreen ? "fixed inset-0 z-50 p-4" : "rounded-lg",
        isRendered ? "opacity-100" : "opacity-0",
      )}>
        {interactive && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setViewMode("preview")}
              className={darkMode ? "bg-gray-800 border-gray-700" : ""}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleFullscreen}
              className={darkMode ? "bg-gray-800 border-gray-700" : ""}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
        
        <FlowchartView 
          pages={pages} 
          showDetails={true} 
          darkMode={darkMode} 
          interactive={interactive}
          onNodeClick={handleNodeClick}
          onNodeExpand={handleNodeExpand}
          onNodeCollapse={handleNodeCollapse}
        />
      </div>
    );
  }

  const styleToken = validatedData.styleToken || validatedData.style || 'modern';
  
  const colorScheme = validatedData.colorScheme || {
    primary: "#4F46E5",
    secondary: "#A855F7", 
    accent: "#F59E0B",
    background: darkMode ? "#111827" : "#ffffff"
  };
  
  const typography = validatedData.typography || {
    headings: "font-raleway",
    body: "font-sans",
    fontPairings: ["Raleway", "Inter"]
  };
  
  const getStyleClasses = () => {
    const darkModeClass = darkMode ? 'bg-gray-900 text-gray-100' : '';
    
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
      return cn(
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white',
        "transition-all duration-300"
      );
    }
  };

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

  const gridOverlay = showGrid ? (
    <div className="pointer-events-none fixed inset-0 z-50 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 p-4 opacity-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-full bg-blue-500"></div>
      ))}
    </div>
  ) : null;

  if (pages.length === 0 || (pages.length === 1 && pages[0].sections.length === 0)) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="mb-2 font-medium">No sections defined</p>
        <p className="text-sm">This wireframe doesn't contain any sections or pages yet.</p>
      </div>
    );
  }

  if (interactive) {
    return (
      <div className={cn(
        "wireframe-interactive-preview",
        isFullscreen ? "fixed inset-0 z-50" : "rounded-lg border",
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className={cn(
          "flex items-center justify-between p-2 border-b",
          darkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="preview" onClick={() => setViewMode("preview")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="structure" onClick={() => setViewMode("flowchart")}>
                  <ListTree className="h-4 w-4 mr-2" />
                  Structure
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex items-center gap-2">
            {viewMode === "preview" && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDeviceType("desktop")} 
                  className={cn(
                    deviceType === "desktop" ? "bg-primary text-primary-foreground" : "",
                    darkMode && deviceType !== "desktop" ? "bg-gray-800 border-gray-700" : ""
                  )}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDeviceType("tablet")} 
                  className={cn(
                    deviceType === "tablet" ? "bg-primary text-primary-foreground" : "",
                    darkMode && deviceType !== "tablet" ? "bg-gray-800 border-gray-700" : ""
                  )}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDeviceType("mobile")} 
                  className={cn(
                    deviceType === "mobile" ? "bg-primary text-primary-foreground" : "",
                    darkMode && deviceType !== "mobile" ? "bg-gray-800 border-gray-700" : ""
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    showGrid ? "bg-primary text-primary-foreground" : "",
                    darkMode && !showGrid ? "bg-gray-800 border-gray-700" : ""
                  )}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={handleDownloadJSON}>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleFullscreen}
              className={darkMode ? "bg-gray-800 border-gray-700" : ""}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className={cn(
          "wireframe-content overflow-auto transition-all duration-300",
          isFullscreen ? "h-[calc(100%-56px)]" : "h-[600px]",
        )}>
          {activeTab === "preview" && viewMode === "preview" && (
            <div 
              className={cn(
                "wireframe-preview relative transition-all duration-300 p-4",
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
                      const styleProps = section.styleProperties || {};
                      const isSelected = selectedSection && 
                        (selectedSection.id === section.id || 
                        (section.name && selectedSection.name === section.name));
                      
                      const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
                        <div 
                          className={cn(
                            "transition-all duration-300",
                            highlightSections || interactive ? "hover:outline hover:outline-blue-500/50 relative" : "",
                            isSelected ? "outline outline-2 outline-blue-500" : ""
                          )}
                          onClick={() => interactive && handleSectionClick(section)}
                        >
                          {(highlightSections || interactive) && (
                            <div className={cn(
                              "absolute top-0 right-0 text-white text-xs px-2 py-1 rounded-bl z-10",
                              isSelected ? "bg-blue-500" : "bg-blue-500/70"
                            )}>
                              {section.sectionType || "Section"} {sectionIndex + 1}
                            </div>
                          )}
                          {children}
                        </div>
                      );
                      
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
            </div>
          )}

          {activeTab === "structure" && viewMode === "flowchart" && (
            <FlowchartView 
              pages={pages} 
              showDetails={true} 
              darkMode={darkMode} 
              interactive={interactive}
              onNodeClick={handleNodeClick}
              onNodeExpand={handleNodeExpand}
              onNodeCollapse={handleNodeCollapse}
            />
          )}
        </div>

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
  }

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
              const styleProps = section.styleProperties || {};
              
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
