
import React from 'react';
import ComponentRenderer from './renderers/ComponentRenderer';
import { cn } from '@/lib/utils';

export interface WireframeVisualizerProps {
  wireframe: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    sections: Array<{
      id: string;
      name: string;
      description?: string;
      imageUrl?: string;
      sectionType?: string;
      componentVariant?: string;
      data?: Record<string, any>;
    }>;
    version?: string;
    lastUpdated?: string;
  };
  viewMode?: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean; // Add this prop
  onSelect?: (id: string) => void; // Add this prop
  className?: string;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  deviceType = 'desktop',
  darkMode = false, // Use the prop with default value
  onSelect, // Use the prop
  className
}) => {
  if (!wireframe || !wireframe.sections) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No wireframe data available
      </div>
    );
  }

  return (
    <div className={cn(
      "wireframe-visualizer", 
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900", 
      className
    )}>
      <div className="mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {wireframe.title || 'Untitled Wireframe'}
        </h2>
        {wireframe.description && (
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>
            {wireframe.description}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {wireframe.sections?.map((section) => (
          <div 
            key={section.id} 
            className="wireframe-section"
            onClick={() => onSelect && onSelect(section.id)}
          >
            <ComponentRenderer 
              section={section}
              viewMode={viewMode}
              darkMode={darkMode}
              deviceType={deviceType}
              isSelected={false}
              onClick={() => onSelect && onSelect(section.id)}
            />
          </div>
        ))}
      </div>

      {wireframe.version && (
        <div className="mt-4 text-xs text-muted-foreground">
          Version: {wireframe.version} • Last updated: {wireframe.lastUpdated || 'Unknown'}
        </div>
      )}
    </div>
  );
};

export default WireframeVisualizer;
