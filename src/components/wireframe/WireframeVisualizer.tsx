
import React from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { cn } from "@/lib/utils";

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

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({ wireframeData }) => {
  // Extract sections from wireframe data
  const sections = wireframeData.sections || [];
  
  // Check if it's a multi-page wireframe
  const isMultiPage = wireframeData.pages && wireframeData.pages.length > 0;
  const pages = wireframeData.pages || [];

  // If there are no sections or pages, show placeholder
  if ((sections.length === 0 && !isMultiPage) || (isMultiPage && pages.length === 0)) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <p>This wireframe doesn't contain any sections or pages to display.</p>
      </div>
    );
  }

  if (isMultiPage) {
    // Show multi-page wireframe with tabs for each page
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="flex border-b bg-gray-50">
          {pages.map((page, index) => (
            <div 
              key={index} 
              className={`px-4 py-2 text-sm font-medium cursor-pointer ${index === 0 ? 'bg-white border-b-2 border-blue-500' : ''}`}
            >
              {page.name || `Page ${index + 1}`}
            </div>
          ))}
        </div>
        
        <div className="p-4">
          {/* Display first page sections by default */}
          {pages[0]?.sections?.map((section: any, index: number) => (
            <WireframeSection 
              key={index} 
              section={section} 
              isEven={index % 2 === 0} 
            />
          ))}
        </div>
      </div>
    );
  }

  // Show single-page wireframe
  return (
    <div className="border rounded-md p-4 bg-white">
      {/* First check if there's a navbar/navigation section and show it first */}
      {sections.find(section => ["navbar", "navigation"].includes(section.sectionType?.toLowerCase())) && (
        <WireframeSection 
          section={sections.find(section => ["navbar", "navigation"].includes(section.sectionType?.toLowerCase()))} 
          isEven={false}
        />
      )}
      
      {/* Show remaining sections in order */}
      {sections
        .filter(section => !["navbar", "navigation"].includes(section.sectionType?.toLowerCase()))
        .map((section, index) => (
          <WireframeSection 
            key={index} 
            section={section}
            isEven={index % 2 === 0}
          />
        ))
      }
    </div>
  );
};

export default WireframeVisualizer;
