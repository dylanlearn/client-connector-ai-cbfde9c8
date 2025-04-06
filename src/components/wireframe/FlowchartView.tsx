
import React from "react";

interface FlowchartViewProps {
  pages: any[];
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ pages }) => {
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
