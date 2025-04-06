
import React from "react";
import { Layout } from "lucide-react";
import { WireframeData } from "@/services/ai/wireframe/wireframe-types";
import { getSectionIcon } from "./utils/sectionUtils";

interface FlowchartViewProps {
  pages: any[];
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ pages }) => {
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
};
