
import React, { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import ComponentRenderer from './renderers/ComponentRenderer';

interface WireframeCanvasProps {
  projectId?: string;
  className?: string;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = memo(({ projectId, className }) => {
  const { 
    wireframe,
    activeDevice,
    darkMode,
    showGrid,
    highlightSections,
    activeSection,
    hiddenSections
  } = useWireframeStore();
  
  // Memoize the section rendering to prevent excessive re-renders
  const renderSection = useCallback((section, index) => {
    // Skip rendering hidden sections
    if (hiddenSections.includes(section.id)) return null;
    
    return (
      <div 
        key={section.id}
        className={cn(
          "wireframe-section relative mb-5 transition-all",
          {
            "ring-2 ring-primary ring-offset-2": highlightSections || section.id === activeSection,
          }
        )}
        id={`section-${section.id}`}
      >
        {highlightSections && (
          <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 rounded-br-md z-10">
            {section.name}
          </div>
        )}
        <ComponentRenderer 
          section={section}
          viewMode="preview" 
          darkMode={darkMode} 
        />
      </div>
    );
  }, [hiddenSections, highlightSections, activeSection, darkMode]);
  
  return (
    <div 
      id="wireframe-canvas"
      className={cn(
        "wireframe-canvas bg-background border rounded-md overflow-hidden transition-all duration-300",
        darkMode ? "dark bg-slate-900" : "bg-white",
        {
          "grid bg-grid-pattern": showGrid,
          "p-4": activeDevice === 'desktop',
          "max-w-3xl mx-auto p-4": activeDevice === 'tablet',
          "max-w-sm mx-auto p-2": activeDevice === 'mobile'
        },
        className
      )}
    >
      <div 
        className={cn(
          "wireframe-container",
          { 
            "max-w-7xl mx-auto": activeDevice === 'desktop',
            "max-w-3xl mx-auto": activeDevice === 'tablet',
            "max-w-xs mx-auto": activeDevice === 'mobile'
          }
        )}
      >
        {wireframe.sections && wireframe.sections.length > 0 ? (
          wireframe.sections.map(renderSection)
        ) : (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-md">
            <p className="text-muted-foreground">
              Add sections to start building your wireframe
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

WireframeCanvas.displayName = 'WireframeCanvas';

export default WireframeCanvas;
