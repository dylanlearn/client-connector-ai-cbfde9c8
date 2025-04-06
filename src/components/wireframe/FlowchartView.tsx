
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
  darkMode?: boolean;
}

export const FlowchartView: React.FC<FlowchartViewProps> = ({ 
  pages = [], 
  showDetails = false,
  darkMode = false 
}) => {
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
  
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-blue-50';
  const borderClass = darkMode ? 'border-gray-700' : 'border-blue-200';
  const textClass = darkMode ? 'text-gray-200' : 'text-blue-800';
  const sectionBgClass = darkMode ? 'bg-gray-800' : 'bg-blue-50/50';
  const sectionBorderClass = darkMode ? 'border-gray-700' : 'border-blue-100';
  
  return (
    <div className={`p-4 ${bgClass} rounded-lg`}>
      <div className="space-y-6">
        {pages.map((page, pageIndex) => (
          <div key={`page-${pageIndex}`} className={`bg-white ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${borderClass} rounded-lg overflow-hidden`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-100'} p-3 border-b ${borderClass}`}>
              <div className="flex items-center space-x-2">
                <ListTree className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                <span className={`font-medium ${textClass}`}>
                  {page.name || `Page ${pageIndex + 1}`}
                  {page.pageType && <span className={`${darkMode ? 'text-blue-300' : 'text-blue-600'} text-sm ml-2`}>({page.pageType})</span>}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              {(page.sections || []).length > 0 ? (
                <div className="space-y-3">
                  {page.sections.map((section: any, sectionIndex: number) => (
                    <div 
                      key={`section-${pageIndex}-${sectionIndex}`} 
                      className={`border ${sectionBorderClass} rounded p-3 ${sectionBgClass}`}
                    >
                      <div className="flex items-center">
                        <div className={`h-6 w-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center mr-2`}>
                          {getSectionIcon(section.sectionType)}
                        </div>
                        <span className={`font-medium ${darkMode ? 'text-gray-200' : ''}`}>
                          {section.name || section.sectionType || `Section ${sectionIndex + 1}`}
                        </span>
                        {section.componentVariant && (
                          <span className={`text-xs ${darkMode ? 'text-blue-300 bg-gray-700' : 'text-blue-600 bg-blue-100'} rounded-full px-2 py-0.5 ml-2`}>
                            {section.componentVariant}
                          </span>
                        )}
                      </div>
                      
                      {showDetails && section.components && section.components.length > 0 && (
                        <div className={`mt-2 pl-8 border-l ${darkMode ? 'border-gray-700' : 'border-blue-100'} ml-3 space-y-1`}>
                          {section.components.map((component: any, compIndex: number) => (
                            <div key={`comp-${compIndex}`} className={`flex items-center text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                              <div className={`w-2 h-2 ${darkMode ? 'bg-blue-500' : 'bg-blue-300'} rounded-full mr-2`}></div>
                              {component.type || `Component ${compIndex + 1}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No sections defined</div>
              )}
            </div>
          </div>
        ))}
        
        {pages.length === 0 && (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <ListTree className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
            <p>No page structure available</p>
          </div>
        )}
      </div>
    </div>
  );
};
