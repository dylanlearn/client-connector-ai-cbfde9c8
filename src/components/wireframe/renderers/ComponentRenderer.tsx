
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface ComponentRendererProps {
  section: WireframeSection;
  viewMode: 'preview' | 'flowchart';
  darkMode: boolean;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isSelected: boolean;
  onClick: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  section,
  viewMode,
  darkMode,
  deviceType,
  isSelected,
  onClick
}) => {
  // Simple placeholder component - in a real implementation you'd have
  // specific renderers for each section type
  const getSectionClass = () => {
    let baseClass = "p-4 border rounded";
    
    if (isSelected) {
      baseClass += " ring-2 ring-primary";
    }
    
    if (darkMode) {
      baseClass += " bg-gray-800 text-white border-gray-700";
    } else {
      baseClass += " bg-white text-gray-900 border-gray-200";
    }
    
    return baseClass;
  };
  
  return (
    <div className={getSectionClass()} onClick={onClick}>
      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {section.name || 'Unnamed Section'}
      </h3>
      
      <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>
        {section.sectionType || 'Generic Section'}
      </p>
      
      {viewMode === 'flowchart' && (
        <div className="mt-2 text-xs bg-muted/20 p-1 rounded">
          Components: {section.components?.length || 0}
        </div>
      )}
      
      {section.components && section.components.length > 0 && viewMode === 'preview' && (
        <div className="mt-2 space-y-1">
          {section.components.map((component, idx) => (
            <div key={idx} className="border-t border-gray-100 pt-1">
              <span className="text-xs">{component.type || 'Component'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentRenderer;
