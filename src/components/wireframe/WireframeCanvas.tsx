
import React, { memo, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import ComponentRenderer from './renderers/ComponentRenderer';

interface WireframeCanvasProps {
  projectId?: string;
  className?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  canvasSettings?: {
    zoom: number;
    panOffset: { x: number, y: number };
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
  onUpdateCanvasSettings?: (updates: any) => void;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = memo(({ 
  projectId, 
  className,
  deviceType,
  onSectionClick,
  canvasSettings: propCanvasSettings,
  onUpdateCanvasSettings
}) => {
  const [isRendering, setIsRendering] = useState(false);
  
  const { 
    wireframe,
    activeDevice: storeActiveDevice,
    darkMode,
    showGrid,
    highlightSections,
    activeSection,
    hiddenSections,
    canvasSettings: storeCanvasSettings
  } = useWireframeStore();
  
  // Use device type from props if provided, otherwise use from store
  const activeDevice = deviceType || storeActiveDevice;
  
  // Use canvas settings from props if provided, otherwise use from store
  const canvasSettings = propCanvasSettings || storeCanvasSettings;
  
  // Effect to handle rendering state for performance feedback
  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => setIsRendering(false), 100);
    return () => clearTimeout(timer);
  }, [wireframe, activeDevice, darkMode, showGrid]);
  
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
        onClick={() => onSectionClick && onSectionClick(section.id)}
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
          deviceType={activeDevice}
        />
      </div>
    );
  }, [hiddenSections, highlightSections, activeSection, darkMode, onSectionClick, activeDevice]);
  
  return (
    <div 
      id="wireframe-canvas"
      className={cn(
        "wireframe-canvas bg-background border rounded-md overflow-hidden transition-all duration-300",
        darkMode ? "dark bg-slate-900" : "bg-white",
        {
          "grid bg-grid-pattern": showGrid || canvasSettings?.showGrid,
          "p-4": activeDevice === 'desktop',
          "max-w-3xl mx-auto p-4": activeDevice === 'tablet',
          "max-w-sm mx-auto p-2": activeDevice === 'mobile',
          "opacity-80": isRendering
        },
        className
      )}
      style={{
        zoom: canvasSettings?.zoom || 1,
        transform: `translate(${canvasSettings?.panOffset?.x || 0}px, ${canvasSettings?.panOffset?.y || 0}px)`
      }}
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
