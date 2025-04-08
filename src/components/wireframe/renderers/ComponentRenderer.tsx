
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  section, 
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop'
}) => {
  // Apply device-specific styling
  const getDeviceSpecificStyles = () => {
    const baseStyles = `p-4 rounded-md ${darkMode ? 'text-gray-200' : 'text-gray-800'}`;
    
    switch (deviceType) {
      case 'mobile':
        return `${baseStyles} text-sm`;
      case 'tablet':
        return `${baseStyles} text-base`;
      case 'desktop':
      default:
        return `${baseStyles} text-base`;
    }
  };

  // Placeholder renderer for component types
  const renderComponent = () => {
    // This is a simplified renderer - in a real app, you'd map section.sectionType
    // to specific component renderers based on the type
    return (
      <div className={cn(
        getDeviceSpecificStyles(),
        darkMode ? 'bg-gray-800' : 'bg-gray-50',
        'border',
        darkMode ? 'border-gray-700' : 'border-gray-200'
      )}>
        <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {section.name}
        </h3>
        
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          {section.description || 'No description'}
        </p>
        
        {/* Render child components if they exist */}
        {section.components && section.components.length > 0 && (
          <div className={cn(
            "grid gap-4",
            {
              "grid-cols-1": deviceType === 'mobile',
              "grid-cols-2": deviceType === 'tablet',
              "grid-cols-3": deviceType === 'desktop'
            }
          )}>
            {section.components.map((component, i) => (
              <div 
                key={component.id || `component-${i}`}
                className={cn(
                  "p-3 rounded border",
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                )}
              >
                {component.content || `Component ${i+1}`}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="component-renderer">
      {renderComponent()}
    </div>
  );
};

export default ComponentRenderer;
