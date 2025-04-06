
import React from "react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { 
  Layout, 
  Image, 
  Type, 
  Navigation, 
  Users, 
  CheckSquare, 
  Mail, 
  CreditCard,
  MessageCircle,
  ArrowRight
} from "lucide-react";

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
  // Helper function to get icon for section type
  const getSectionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "hero":
        return <Layout />;
      case "features":
        return <CheckSquare />;
      case "testimonials":
        return <Users />;
      case "gallery":
      case "portfolio":
        return <Image />;
      case "contact":
        return <Mail />;
      case "pricing":
        return <CreditCard />;
      case "faq":
        return <MessageCircle />;
      default:
        return <Type />;
    }
  };

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

  if (viewMode === "flowchart") {
    return (
      <div className="space-y-8">
        {pages.map((page, pageIndex) => (
          <div 
            key={`page-${pageIndex}`}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-md bg-primary/10">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{page.name || `Page ${pageIndex + 1}`}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {(page.sections || []).map((section, sectionIndex) => (
                <div 
                  key={`section-${pageIndex}-${sectionIndex}`}
                  className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/5">
                        {getSectionIcon(section.sectionType)}
                      </div>
                      <span className="font-medium text-sm">
                        {section.name || `Section ${sectionIndex + 1}`}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {section.sectionType || "generic"}
                    </span>
                  </div>
                  
                  {Array.isArray(section.components) && section.components.length > 0 && (
                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                      {section.components.slice(0, 3).map((component, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          <span>{component.type}</span>
                        </div>
                      ))}
                      {section.components.length > 3 && (
                        <div className="text-xs text-right text-gray-400">
                          +{section.components.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Preview mode
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
              // Create visual representation based on section type
              switch (section.sectionType?.toLowerCase()) {
                case "hero":
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-6">
                        <div className="w-20 h-8 bg-gray-300 rounded"></div>
                        <div className="hidden sm:flex space-x-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-4 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                        <div className="w-24 h-8 bg-gray-800 rounded"></div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-6 mt-12">
                        <div className="flex-1 space-y-4">
                          <div className="w-3/4 h-10 bg-gray-300 rounded"></div>
                          <div className="space-y-2">
                            <div className="w-full h-4 bg-gray-200 rounded"></div>
                            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                            <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="pt-4">
                            <div className="w-32 h-10 bg-gray-800 rounded inline-flex items-center justify-center">
                              <div className="w-20 h-4 bg-gray-100 rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Image className="w-12 h-12 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                
                case "features":
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="text-center mb-8">
                        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex flex-col items-center text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <CheckSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="w-24 h-6 bg-gray-300 rounded"></div>
                            <div className="space-y-2">
                              <div className="w-full h-3 bg-gray-200 rounded"></div>
                              <div className="w-5/6 h-3 bg-gray-200 rounded mx-auto"></div>
                              <div className="w-4/6 h-3 bg-gray-200 rounded mx-auto"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case "testimonials":
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="text-center mb-8">
                        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        {[1, 2].map(i => (
                          <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="space-y-2 mb-4">
                              <div className="w-full h-3 bg-gray-200 rounded"></div>
                              <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                              <div className="w-4/6 h-3 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex items-center mt-4">
                              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                              <div className="ml-4">
                                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                                <div className="w-32 h-3 bg-gray-200 rounded mt-2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                
                case "pricing":
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="text-center mb-8">
                        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className={`border ${i === 2 ? 'border-gray-400' : 'border-gray-200'} rounded-lg p-4 bg-white ${i === 2 ? 'relative transform md:scale-105' : ''}`}
                          >
                            {i === 2 && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-100 px-3 py-1 rounded text-xs">
                                Popular
                              </div>
                            )}
                            <div className="text-center border-b border-gray-100 pb-4">
                              <div className="w-20 h-6 bg-gray-300 rounded mx-auto"></div>
                              <div className="w-24 h-8 bg-gray-300 rounded mx-auto mt-4"></div>
                              <div className="w-32 h-3 bg-gray-200 rounded mx-auto mt-2"></div>
                            </div>
                            <div className="py-4 space-y-2">
                              {[1, 2, 3, 4].map(j => (
                                <div key={j} className="flex items-center">
                                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                                  <div className="w-full h-3 bg-gray-200 rounded ml-3"></div>
                                </div>
                              ))}
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                              <div className="w-full h-10 bg-gray-800 rounded flex items-center justify-center">
                                <div className="w-20 h-4 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                
                case "contact":
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="text-center mb-8">
                        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
                      </div>
                      <div className="max-w-lg mx-auto mt-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="w-full h-10 bg-gray-200 rounded"></div>
                          <div className="w-full h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-full h-10 bg-gray-200 rounded"></div>
                        <div className="w-full h-32 bg-gray-200 rounded"></div>
                        <div className="pt-4">
                          <div className="w-32 h-10 bg-gray-800 rounded inline-flex items-center justify-center">
                            <div className="w-20 h-4 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                
                case "footer":
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-4">
                          <div className="w-20 h-8 bg-gray-300 rounded"></div>
                          <div className="space-y-2">
                            <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
                            <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                          </div>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-gray-200"></div>
                            ))}
                          </div>
                        </div>
                        {[1, 2, 3].map(i => (
                          <div key={i} className="space-y-3">
                            <div className="w-24 h-6 bg-gray-300 rounded"></div>
                            <div className="space-y-2">
                              {[1, 2, 3, 4].map(j => (
                                <div key={j} className="w-4/5 h-3 bg-gray-200 rounded"></div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-6 pt-4 text-center">
                        <div className="w-48 h-3 bg-gray-200 rounded mx-auto"></div>
                      </div>
                    </div>
                  );
                
                default:
                  // Generic section
                  return (
                    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="text-center mb-4">
                        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
                      </div>
                      <div className="space-y-4 mt-8">
                        <div className="w-full h-16 bg-gray-200 rounded"></div>
                        <div className="w-full h-16 bg-gray-200 rounded"></div>
                        <div className="w-full h-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  );
              }
            })}
          </div>
        </div>
      ))}

      {/* Fix: Remove jsx prop from style tag */}
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
