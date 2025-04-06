
import React from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  Image as ImageIcon, 
  Type, 
  ListTree, 
  ShoppingCart, 
  MessageCircle, 
  PanelRight, 
  BarChart3, 
  PieChart,
  Table
} from 'lucide-react';

interface FlowchartViewProps {
  pages: any[];
  showDetails?: boolean;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ pages = [], showDetails = false }) => {
  // Get icon based on section type
  const getSectionIcon = (sectionType: string) => {
    switch (sectionType?.toLowerCase()) {
      case 'hero':
        return <ImageIcon className="h-4 w-4" />;
      case 'features':
        return <LayoutGrid className="h-4 w-4" />;
      case 'testimonials':
        return <MessageCircle className="h-4 w-4" />;
      case 'pricing':
        return <ShoppingCart className="h-4 w-4" />;
      case 'dashboard':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'chart':
        return <BarChart3 className="h-4 w-4" />;
      case 'pie-chart':
        return <PieChart className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'sidebar':
        return <PanelRight className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="space-y-6">
        {pages.map((page, pageIndex) => (
          <div key={`page-${pageIndex}`} className="bg-white border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-100 p-3 border-b border-blue-200">
              <div className="flex items-center space-x-2">
                <ListTree className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">
                  {page.name || `Page ${pageIndex + 1}`}
                  {page.pageType && <span className="text-blue-600 text-sm ml-2">({page.pageType})</span>}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              {(page.sections || []).length > 0 ? (
                <div className="space-y-3">
                  {page.sections.map((section: any, sectionIndex: number) => (
                    <div 
                      key={`section-${pageIndex}-${sectionIndex}`} 
                      className="border border-blue-100 rounded p-3 bg-blue-50/50"
                    >
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          {getSectionIcon(section.sectionType)}
                        </div>
                        <span className="font-medium">
                          {section.name || section.sectionType || `Section ${sectionIndex + 1}`}
                        </span>
                        {section.componentVariant && (
                          <span className="text-xs text-blue-600 bg-blue-100 rounded-full px-2 py-0.5 ml-2">
                            {section.componentVariant}
                          </span>
                        )}
                      </div>
                      
                      {showDetails && section.components && section.components.length > 0 && (
                        <div className="mt-2 pl-8 border-l border-blue-100 ml-3 space-y-1">
                          {section.components.map((component: any, compIndex: number) => (
                            <div key={`comp-${compIndex}`} className="flex items-center text-sm text-blue-700">
                              <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
                              {component.type || `Component ${compIndex + 1}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No sections defined</div>
              )}
            </div>
          </div>
        ))}
        
        {pages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ListTree className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p>No page structure available</p>
          </div>
        )}
      </div>
    </div>
  );
};
