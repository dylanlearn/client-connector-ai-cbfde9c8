
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { getDeviceStyles, styleOptionsToTailwind, deviceBreakpoints } from '../registry/component-types';
import { getComponentDefinition } from '../registry/component-registry';

interface ComponentRendererProps {
  section: WireframeSection;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  isSelected?: boolean;
  onClick?: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  section, 
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get component definition from registry
  const componentDef = getComponentDefinition(section.sectionType);
  
  // Default styles based on device type
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

  // Get component-specific responsive styles if available
  const getComponentResponsiveStyles = () => {
    if (!componentDef?.responsiveConfig) return '';
    
    const baseStyles = componentDef.baseStyles || {};
    const responsiveConfig = componentDef.responsiveConfig || {};
    
    // Use the updated function with all three arguments
    const deviceStylesObj = getDeviceStyles(baseStyles, responsiveConfig, deviceType);
    return styleOptionsToTailwind(deviceStylesObj);
  };

  // Placeholder renderer for component types
  const renderComponent = () => {
    // Use flowchart mode for schematic view
    if (viewMode === 'flowchart') {
      return (
        <div className={cn(
          "p-3 border-2 border-dashed rounded-md",
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
        )}>
          <div className="text-xs font-mono mb-1 opacity-70">
            {section.sectionType}
          </div>
          <h3 className="font-medium text-sm">
            {section.name || 'Untitled Section'}
          </h3>
        </div>
      );
    }
    
    // Regular preview rendering
    return (
      <div className={cn(
        getDeviceSpecificStyles(),
        getComponentResponsiveStyles(),
        darkMode ? 'bg-gray-800' : 'bg-gray-50',
        'border',
        darkMode ? 'border-gray-700' : 'border-gray-200',
        isSelected ? 'ring-2 ring-primary' : ''
      )}>
        <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {section.name || componentDef?.name || 'Section'}
        </h3>
        
        {(section.description || componentDef?.description) && (
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {section.description || componentDef?.description || 'No description'}
          </p>
        )}
        
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
        
        {/* Render variant-specific content */}
        {section.componentVariant && componentDef?.variants && (
          <div className="mt-2 text-sm text-muted-foreground">
            Variant: {section.componentVariant}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="component-renderer"
      onClick={onClick}
    >
      {renderComponent()}
    </div>
  );
};

export default ComponentRenderer;
