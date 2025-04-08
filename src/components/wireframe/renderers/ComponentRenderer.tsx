
import React from 'react';
import { WireframeSection } from '@/types/wireframe';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart' | 'edit';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  className?: string;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  className
}) => {
  if (!section) return null;
  
  // Get background color based on section type
  const getBgColor = () => {
    const baseColor = darkMode ? 'bg-slate-800' : 'bg-slate-100';
    
    switch (section.sectionType?.toLowerCase()) {
      case 'hero':
        return darkMode ? 'bg-blue-950' : 'bg-blue-50';
      case 'features':
        return darkMode ? 'bg-green-950' : 'bg-green-50';
      case 'pricing':
        return darkMode ? 'bg-purple-950' : 'bg-purple-50';
      case 'testimonials':
        return darkMode ? 'bg-yellow-950' : 'bg-yellow-50';
      case 'cta':
        return darkMode ? 'bg-red-950' : 'bg-red-50';
      case 'footer':
        return darkMode ? 'bg-gray-900' : 'bg-gray-100';
      default:
        return baseColor;
    }
  };
  
  // Get section height
  const getHeight = () => {
    if (section.dimensions?.height) {
      return section.dimensions.height;
    }
    
    // Default heights based on section type
    switch (section.sectionType?.toLowerCase()) {
      case 'hero':
        return deviceType === 'mobile' ? 400 : 500;
      case 'features':
        return deviceType === 'mobile' ? 600 : 400;
      case 'pricing':
        return deviceType === 'mobile' ? 800 : 500;
      case 'footer':
        return 200;
      default:
        return 300;
    }
  };
  
  return (
    <div 
      className={cn(
        "section-renderer w-full rounded-md p-4",
        getBgColor(),
        className
      )}
      style={{ 
        minHeight: getHeight()
      }}
    >
      <div className={cn(
        "section-content",
        darkMode ? 'text-white' : 'text-gray-800'
      )}>
        <h3 className="text-lg font-semibold">{section.name || section.sectionType}</h3>
        
        {section.description && (
          <p className="text-sm opacity-70 mt-1">{section.description}</p>
        )}
        
        {section.copySuggestions?.heading && (
          <div className="mt-4 py-2 px-3 rounded bg-opacity-10 bg-black dark:bg-white dark:bg-opacity-10">
            <h4 className="font-medium mb-1">{section.copySuggestions.heading}</h4>
            {section.copySuggestions.subheading && (
              <p className="text-sm opacity-80">{section.copySuggestions.subheading}</p>
            )}
          </div>
        )}
        
        {section.components && section.components.length > 0 && (
          <div className="mt-4 grid gap-2">
            {section.components.slice(0, 3).map((component, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-2 rounded",
                  darkMode ? 'bg-gray-800' : 'bg-white',
                  "border",
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                )}
              >
                <span className="text-xs">{component.type || 'Component'}</span>
              </div>
            ))}
            
            {section.components.length > 3 && (
              <p className="text-xs opacity-70 mt-1">
                +{section.components.length - 3} more components...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentRenderer;
