import React, { useState } from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { cn } from "@/lib/utils";
import { ChevronRight, ExternalLink, Maximize2, Minimize2, MoreHorizontal } from "lucide-react";

interface WireframeVisualizerProps {
  wireframeData: WireframeData;
}

const WireframeSection: React.FC<{ section: any; isEven: boolean }> = ({ section, isEven }) => {
  const getBgColor = () => {
    if (section.sectionType === "hero") return "bg-blue-50";
    if (section.sectionType === "features") return "bg-gray-50";
    if (section.sectionType === "testimonials") return "bg-purple-50";
    if (section.sectionType === "pricing") return "bg-green-50";
    if (section.sectionType === "faq") return "bg-yellow-50";
    if (section.sectionType === "footer") return "bg-gray-100";
    return isEven ? "bg-slate-50" : "bg-white";
  };

  const renderSectionContent = () => {
    switch (section.sectionType?.toLowerCase()) {
      case "hero":
        return (
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-blue-200 w-4/5 rounded"></div>
              <div className="h-4 bg-blue-100 w-full rounded"></div>
              <div className="h-4 bg-blue-100 w-3/4 rounded"></div>
              <div className="h-10 bg-blue-300 w-1/3 rounded"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-40 bg-blue-200 rounded flex items-center justify-center text-blue-400">
                Image Placeholder
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <div>
            <div className="text-center mb-6">
              <div className="h-6 bg-gray-200 w-1/3 mx-auto rounded mb-4"></div>
              <div className="h-3 bg-gray-100 w-2/3 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 w-3/4 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 w-full rounded"></div>
                  <div className="h-3 bg-gray-100 w-5/6 rounded mt-1"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case "testimonials":
      case "testimonial":
        return (
          <div>
            <div className="text-center mb-6">
              <div className="h-6 bg-purple-200 w-1/3 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="border border-purple-100 rounded p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-purple-200 rounded-full"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-purple-200 w-24 rounded"></div>
                      <div className="h-3 bg-purple-100 w-32 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-purple-100 w-full rounded"></div>
                    <div className="h-3 bg-purple-100 w-full rounded"></div>
                    <div className="h-3 bg-purple-100 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "pricing":
        return (
          <div>
            <div className="text-center mb-6">
              <div className="h-6 bg-green-200 w-1/3 mx-auto rounded mb-4"></div>
              <div className="h-3 bg-green-100 w-2/3 mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "border rounded p-6 flex flex-col",
                    i === 2 ? "border-green-400 relative" : "border-gray-200"
                  )}
                >
                  {i === 2 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-3 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="h-5 bg-green-200 w-1/2 rounded mb-4"></div>
                  <div className="h-8 bg-green-300 w-2/3 rounded mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-green-100 w-full rounded"></div>
                    <div className="h-3 bg-green-100 w-full rounded"></div>
                    <div className="h-3 bg-green-100 w-3/4 rounded"></div>
                  </div>
                  <div className="h-10 bg-green-200 w-full rounded mt-auto"></div>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div>
            <div className="text-center mb-6">
              <div className="h-6 bg-yellow-200 w-1/3 mx-auto rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-yellow-100 rounded p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-yellow-200 w-2/3 rounded"></div>
                    <div className="h-5 w-5 bg-yellow-300 rounded-full"></div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="h-3 bg-yellow-100 w-full rounded"></div>
                    <div className="h-3 bg-yellow-100 w-5/6 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "footer":
        return (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Product", "Resources", "Company", "Social"].map((col, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 w-2/3 rounded"></div>
                    <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
                    <div className="h-3 bg-gray-200 w-3/4 rounded"></div>
                    <div className="h-3 bg-gray-200 w-2/3 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-3 bg-gray-200 w-full rounded mt-8"></div>
          </div>
        );

      case "navbar":
      case "navigation":
        return (
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-16 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-10 w-24 bg-blue-200 rounded"></div>
          </div>
        );

      default:
        // Generic section
        return (
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-4 bg-gray-100 w-full rounded"></div>
            <div className="h-4 bg-gray-100 w-5/6 rounded"></div>
            <div className="h-4 bg-gray-100 w-3/4 rounded"></div>
          </div>
        );
    }
  };

  return (
    <div className={`p-6 border rounded-md mb-4 ${getBgColor()}`}>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-sm text-gray-500 mb-1">
            {section.sectionType?.toUpperCase() || "SECTION"}
          </h3>
          <h4 className="font-semibold">{section.name}</h4>
        </div>
        <div className="text-xs px-2 py-1 bg-white border rounded text-gray-500">
          {section.layoutType || "Standard Layout"}
        </div>
      </div>
      
      <div className="py-2">
        {renderSectionContent()}
      </div>
    </div>
  );
};

const PagePreview: React.FC<{ page: any; isActive: boolean }> = ({ page, isActive }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all duration-300 mb-4",
      isActive ? "border-primary" : "border-gray-200",
      isExpanded ? "col-span-2" : "col-span-1"
    )}>
      <div className={cn(
        "bg-gray-50 p-3 flex items-center justify-between border-b",
        isActive ? "bg-primary/10" : ""
      )}>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isActive ? "bg-primary" : "bg-gray-300"
          )}></div>
          <span className="font-medium text-sm">{page.name || "Unnamed Page"}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
      
      <div className={cn(
        "p-4 bg-white",
        isExpanded ? "max-h-[600px]" : "max-h-[300px]"
      )}>
        {page.sections && page.sections.length > 0 ? (
          <div className={cn(
            "border rounded overflow-hidden transform scale-90 origin-top-left shadow-sm",
            isExpanded ? "scale-[0.95]" : "scale-[0.85]"
          )}>
            {/* Navigation if present */}
            {page.sections.find(s => 
              ["navbar", "navigation"].includes(s.sectionType?.toLowerCase())) && (
              <div className="bg-white p-2 border-b flex justify-between items-center">
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-4 bg-gray-100 rounded"></div>
                  ))}
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            )}
            
            {/* Page preview content */}
            <div className="space-y-2 p-2">
              {page.sections.filter(s => 
                !["navbar", "navigation"].includes(s.sectionType?.toLowerCase())).map((section, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b last:border-b-0`}
                >
                  {section.sectionType?.toLowerCase() === 'hero' ? (
                    <div className="flex space-x-2">
                      <div className="space-y-1 flex-1">
                        <div className="h-4 bg-gray-200 w-4/5 rounded"></div>
                        <div className="h-2 bg-gray-100 w-full rounded"></div>
                        <div className="h-2 bg-gray-100 w-3/4 rounded"></div>
                        <div className="h-6 w-20 bg-gray-300 mt-1 rounded"></div>
                      </div>
                      <div className="w-24 h-16 bg-gray-200 rounded"></div>
                    </div>
                  ) : section.sectionType?.toLowerCase() === 'features' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-1">
                          <div className="mx-auto w-6 h-6 bg-gray-200 rounded-full"></div>
                          <div className="h-2 bg-gray-200 w-3/4 mx-auto rounded"></div>
                          <div className="h-2 bg-gray-100 w-full rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 w-1/3 rounded"></div>
                      <div className="h-2 bg-gray-100 w-full rounded"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400">
            No content defined
          </div>
        )}
      </div>
    </div>
  );
};

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({ wireframeData }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"preview" | "flowchart">("flowchart");
  
  // Extract sections from wireframe data
  const sections = wireframeData.sections || [];
  
  // Check if it's a multi-page wireframe
  const isMultiPage = wireframeData.pages && wireframeData.pages.length > 0;
  const pages = wireframeData.pages || [];
  
  // If there are no pages but we have sections, create a default page
  const displayPages = isMultiPage ? pages : [
    {
      id: "default-page",
      name: wireframeData.title || "Home Page",
      sections: sections
    }
  ];

  // If there are no sections or pages, show placeholder
  if ((sections.length === 0 && !isMultiPage) || (isMultiPage && pages.length === 0)) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <p>This wireframe doesn't contain any sections or pages to display.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50 shadow-sm">
      {/* Tabs for switching between preview/flowchart */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setViewMode("preview")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2",
            viewMode === "preview" ? "border-primary text-primary" : "border-transparent text-gray-500"
          )}
        >
          Preview
        </button>
        <button
          onClick={() => setViewMode("flowchart")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2",
            viewMode === "flowchart" ? "border-primary text-primary" : "border-transparent text-gray-500"
          )}
        >
          Flowchart
        </button>
      </div>
      
      {/* Preview mode */}
      {viewMode === "preview" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pages tabs */}
            <div className="col-span-full flex border-b bg-gray-50 mb-4 overflow-x-auto no-scrollbar">
              {displayPages.map((page, index) => (
                <button
                  key={page.id || index}
                  onClick={() => setActivePageIndex(index)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium whitespace-nowrap",
                    activePageIndex === index 
                      ? "bg-white border-t border-l border-r rounded-t-md text-primary" 
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {page.name || `Page ${index + 1}`}
                </button>
              ))}
            </div>
          
            {/* Active page content */}
            <div className="col-span-full border rounded-md bg-white p-6">
              {/* Display navigation first if exists */}
              {displayPages[activePageIndex]?.sections?.find(section => 
                ["navbar", "navigation"].includes(section.sectionType?.toLowerCase())) && (
                <WireframeSection 
                  section={displayPages[activePageIndex].sections.find(section => 
                    ["navbar", "navigation"].includes(section.sectionType?.toLowerCase()))}
                  isEven={false}
                />
              )}
              
              {/* Display remaining sections */}
              {displayPages[activePageIndex]?.sections
                ?.filter(section => !["navbar", "navigation"].includes(section.sectionType?.toLowerCase()))
                .map((section, index) => (
                  <WireframeSection 
                    key={index} 
                    section={section}
                    isEven={index % 2 === 0}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Flowchart mode */}
      {viewMode === "flowchart" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Pages grid */}
            {displayPages.map((page, index) => (
              <PagePreview 
                key={page.id || index} 
                page={page} 
                isActive={activePageIndex === index}
              />
            ))}
            
            {/* Connection lines */}
            {displayPages.length > 1 && (
              <div className="absolute inset-0 pointer-events-none">
                {/* This would ideally be SVG lines connecting the pages */}
                {/* For simplicity, we're just showing visual connections with CSS */}
                <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-primary">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            )}
          </div>
          
          {/* Wireframe info */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-2">{wireframeData.title || "Untitled Wireframe"}</h3>
            <p className="text-sm text-gray-600">{wireframeData.description || "No description provided"}</p>
            
            {/* Metadata */}
            {wireframeData.designTokens && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">COLOR PALETTE</h4>
                  <div className="flex space-x-2">
                    {Object.entries(wireframeData.designTokens.colors || {})
                      .slice(0, 5)
                      .map(([key, color], i) => (
                        <div 
                          key={key} 
                          className="w-6 h-6 rounded-full border shadow-sm" 
                          style={{backgroundColor: color as string}}
                          title={`${key}: ${color}`}
                        ></div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">TYPOGRAPHY</h4>
                  <p className="text-xs text-gray-600">
                    {wireframeData.designTokens.typography?.headings || "Default"} / 
                    {wireframeData.designTokens.typography?.body || "Default"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WireframeVisualizer;
