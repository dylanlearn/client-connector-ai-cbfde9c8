
import React from "react";
import { Nodes, Edge, Node } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutGrid, 
  Columns, 
  Rows, 
  Layers, 
  GripVertical, 
  ChevronDown, 
  ChevronRight
} from "lucide-react";

interface FlowchartViewProps {
  pages: any[];
  showDetails?: boolean;
  onSectionClick?: (section: any, pageIndex: number, sectionIndex: number) => void;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ 
  pages, 
  showDetails = false,
  onSectionClick 
}) => {
  const [expandedPages, setExpandedPages] = React.useState<Record<number, boolean>>(
    pages.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  
  const togglePageExpansion = (pageIndex: number) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageIndex]: !prev[pageIndex]
    }));
  };
  
  const getLayoutIcon = (layoutType?: string) => {
    switch (layoutType?.toLowerCase()) {
      case 'grid':
        return <LayoutGrid className="h-3 w-3" />;
      case 'columns':
      case 'column':
      case 'two-column':
      case 'three-column':
        return <Columns className="h-3 w-3" />;
      case 'rows':
      case 'row':
        return <Rows className="h-3 w-3" />;
      case 'overlay':
      case 'overlapping':
        return <Layers className="h-3 w-3" />;
      default:
        return <GripVertical className="h-3 w-3" />;
    }
  };

  return (
    <div className="flowchart-view p-4 bg-blue-50/70 rounded-lg overflow-auto min-h-[500px]">
      {pages.map((page, pageIndex) => (
        <div key={`page-${pageIndex}`} className="mb-6">
          <div 
            className="flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => togglePageExpansion(pageIndex)}
          >
            {expandedPages[pageIndex] ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
            <h3 className="text-lg font-medium">
              {page.name || `Page ${pageIndex + 1}`}
            </h3>
          </div>
          
          {expandedPages[pageIndex] && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="space-y-3">
                {(page.sections || []).map((section: any, sectionIndex: number) => (
                  <div
                    key={`section-${sectionIndex}`}
                    className={`p-3 border rounded ${
                      onSectionClick ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={onSectionClick ? () => onSectionClick(section, pageIndex, sectionIndex) : undefined}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-blue-100 flex items-center justify-center">
                          {getLayoutIcon(section.layout)}
                        </div>
                        <div className="font-medium">{section.name || section.sectionType || `Section ${sectionIndex + 1}`}</div>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {section.sectionType || "Generic"}
                      </Badge>
                    </div>
                    
                    {showDetails && (
                      <div className="mt-2 text-xs text-gray-500">
                        <div className="grid grid-cols-2 gap-2">
                          {section.layout && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Layout:</span>
                              <span className="capitalize">{section.layout}</span>
                            </div>
                          )}
                          {section.componentVariant && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Variant:</span>
                              <span className="capitalize">{section.componentVariant}</span>
                            </div>
                          )}
                        </div>
                        
                        {section.components && Array.isArray(section.components) && section.components.length > 0 && (
                          <div className="mt-2">
                            <div className="font-medium mb-1">Components:</div>
                            <div className="flex flex-wrap gap-1">
                              {section.components.map((comp: any, compIdx: number) => (
                                <Badge key={compIdx} variant="secondary" className="text-xs">
                                  {typeof comp === 'string' ? comp : comp.type || 'Component'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {section.styleToken && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="font-medium">Style:</span>
                            <Badge variant="outline" className="text-xs">{section.styleToken}</Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
