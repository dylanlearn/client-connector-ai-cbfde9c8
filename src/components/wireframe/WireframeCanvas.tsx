
import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import ComponentRenderer from './renderers/ComponentRenderer';
import { useCanvasInteractions } from '@/hooks/wireframe/use-canvas-interactions';
import { useSectionManipulation } from '@/hooks/wireframe/use-section-manipulation';
import SectionQuickActions from './controls/SectionQuickActions';
import CanvasControls from './controls/CanvasControls';
import { useToast } from '@/hooks/use-toast';

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
  editMode?: boolean;
}

const WireframeCanvas: React.FC<WireframeCanvasProps> = memo(({ 
  projectId, 
  className,
  deviceType,
  onSectionClick,
  canvasSettings: propCanvasSettings,
  onUpdateCanvasSettings,
  editMode = true
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { 
    wireframe,
    activeDevice: storeActiveDevice,
    darkMode,
    showGrid,
    highlightSections,
    activeSection,
    hiddenSections,
    canvasSettings: storeCanvasSettings,
    updateSection
  } = useWireframeStore();
  
  // Use device type from props if provided, otherwise use from store
  const activeDevice = deviceType || storeActiveDevice;
  
  // Use canvas settings from props if provided, otherwise use from store
  const canvasSettings = propCanvasSettings || storeCanvasSettings;
  
  // Set up canvas interaction hooks
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    isDragging,
    isSpacePressed
  } = useCanvasInteractions({ 
    canvasRef,
    initialConfig: canvasSettings,
    onConfigChange: onUpdateCanvasSettings
  });
  
  const {
    activeSection: activeManipulationSection,
    draggingSection,
    selectSection,
    startDragSection,
    dragSection,
    stopDragSection,
    applySectionPositions
  } = useSectionManipulation();

  // Effect to handle rendering state for performance feedback
  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => setIsRendering(false), 100);
    return () => clearTimeout(timer);
  }, [wireframe, activeDevice, darkMode, showGrid]);
  
  // Effect to add/remove global event listeners
  useEffect(() => {
    // Use correctly typed event handlers for DOM events
    const handleDocKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };
    
    const handleDocKeyUp = (e: KeyboardEvent) => {
      handleKeyUp(e);
    };
    
    const handleDocMouseUp = (e: MouseEvent) => {
      handleMouseUp(e);
    };
    
    const handleDocMouseMove = (e: MouseEvent) => {
      if (typeof handleMouseMove === 'function') {
        // Cast to any to bypass type checking since we know this will work
        (handleMouseMove as any)(e);
      }
    };
    
    // Add global keyboard event listeners
    document.addEventListener('keydown', handleDocKeyDown);
    document.addEventListener('keyup', handleDocKeyUp);
    
    // Add global mouse event listeners (for dragging)
    document.addEventListener('mouseup', handleDocMouseUp);
    document.addEventListener('mousemove', handleDocMouseMove);
    
    return () => {
      document.removeEventListener('keydown', handleDocKeyDown);
      document.removeEventListener('keyup', handleDocKeyUp);
      document.removeEventListener('mouseup', handleDocMouseUp);
      document.removeEventListener('mousemove', handleDocMouseMove);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseUp, handleMouseMove]);

  // Handle mouse events for section dragging
  const handleSectionMouseDown = useCallback((e: React.MouseEvent, sectionId: string) => {
    if (!editMode) return;
    
    // If space is pressed, we're in pan mode, so don't start dragging
    if (isSpacePressed) return;
    
    // Only handle left mouse button
    if (e.button === 0) {
      e.stopPropagation(); // Prevent canvas drag
      startDragSection(sectionId, e.clientX, e.clientY);
    }
  }, [editMode, isSpacePressed, startDragSection]);
  
  // Handle document mouse move (for section dragging)
  useEffect(() => {
    const handleDocMouseMove = (e: MouseEvent) => {
      if (draggingSection) {
        dragSection(e.clientX, e.clientY);
      }
    };
    
    const handleDocMouseUp = () => {
      if (draggingSection) {
        stopDragSection();
      }
    };
    
    if (draggingSection) {
      document.addEventListener('mousemove', handleDocMouseMove);
      document.addEventListener('mouseup', handleDocMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleDocMouseMove);
      document.removeEventListener('mouseup', handleDocMouseUp);
    };
  }, [draggingSection, dragSection, stopDragSection]);

  // Handle section actions
  const handleSectionEdit = useCallback((sectionId: string) => {
    // This would typically open an edit dialog
    selectSection(sectionId);
  }, [selectSection]);
  
  const handleSectionDelete = useCallback((sectionId: string) => {
    // Use the removeSection function from the store
    useWireframeStore.getState().removeSection(sectionId);
    
    toast({
      title: "Section removed",
      description: "The section has been removed from the wireframe"
    });
  }, [toast]);
  
  const handleSectionDuplicate = useCallback((sectionId: string) => {
    // Find the section to duplicate
    const sectionToDuplicate = wireframe.sections.find(section => section.id === sectionId);
    if (sectionToDuplicate) {
      // Create a copy without the id
      const { id, ...sectionData } = sectionToDuplicate;
      
      // Add the duplicated section
      useWireframeStore.getState().addSection({
        ...sectionData,
        name: `${sectionData.name} (Copy)`, 
      });
      
      toast({
        title: "Section duplicated",
        description: "A copy of the section has been created"
      });
    }
  }, [wireframe.sections, toast]);

  const handleMoveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    const index = wireframe.sections.findIndex(section => section.id === sectionId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' 
      ? Math.max(0, index - 1)
      : Math.min(wireframe.sections.length - 1, index + 1);
    
    if (newIndex !== index) {
      useWireframeStore.getState().reorderSections(index, newIndex);
    }
  }, [wireframe.sections]);
  
  // Memoize the section rendering to prevent excessive re-renders
  const renderSection = useCallback((section, index) => {
    // Skip rendering hidden sections
    if (hiddenSections.includes(section.id)) return null;
    
    // Get section style based on position
    const positionStyle = applySectionPositions(section);
    
    // Get section style from properties
    const sectionStyleProps = section.styleProperties || {};
    
    return (
      <div 
        key={section.id}
        className={cn(
          "wireframe-section relative transition-all",
          {
            "mb-5": !sectionStyleProps.position && !positionStyle.position,
            "ring-2 ring-primary ring-offset-2": 
              highlightSections || section.id === activeSection,
            "cursor-grab": editMode && !isSpacePressed && !draggingSection,
            "cursor-grabbing": editMode && draggingSection === section.id,
            "cursor-move": editMode && isSpacePressed,
          }
        )}
        id={`section-${section.id}`}
        style={{
          ...sectionStyleProps,
          ...positionStyle
        }}
        onClick={(e) => {
          if (onSectionClick) {
            e.stopPropagation();
            onSectionClick(section.id);
          }
        }}
        onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
      >
        {(editMode || highlightSections) && (
          <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 rounded-br-md z-10">
            {section.name}
          </div>
        )}
        
        {editMode && (
          <SectionQuickActions
            compact={activeDevice !== 'desktop'}
            onEdit={() => handleSectionEdit(section.id)}
            onDelete={() => handleSectionDelete(section.id)}
            onDuplicate={() => handleSectionDuplicate(section.id)}
            onMoveUp={() => handleMoveSection(section.id, 'up')}
            onMoveDown={() => handleMoveSection(section.id, 'down')}
          />
        )}
        
        <ComponentRenderer 
          section={section}
          viewMode="preview" 
          darkMode={darkMode}
          deviceType={activeDevice}
        />
      </div>
    );
  }, [
    hiddenSections, activeDevice, darkMode, highlightSections, activeSection, 
    applySectionPositions, onSectionClick, editMode, isSpacePressed, 
    draggingSection, handleSectionMouseDown, handleSectionEdit, 
    handleSectionDelete, handleSectionDuplicate, handleMoveSection
  ]);
  
  return (
    <div className="wireframe-canvas-container relative">
      {/* Canvas Controls */}
      {editMode && (
        <CanvasControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onToggleGrid={toggleGrid}
          onToggleSnapToGrid={toggleSnapToGrid}
          className="mb-2"
        />
      )}
      
      {/* Canvas Area */}
      <div 
        id="wireframe-canvas"
        ref={canvasRef}
        className={cn(
          "wireframe-canvas bg-background border rounded-md overflow-hidden transition-all duration-300",
          darkMode ? "dark bg-slate-900" : "bg-white",
          {
            "grid bg-grid-pattern": showGrid || canvasSettings?.showGrid,
            "p-4": activeDevice === 'desktop',
            "max-w-3xl mx-auto p-4": activeDevice === 'tablet',
            "max-w-sm mx-auto p-2": activeDevice === 'mobile',
            "opacity-80": isRendering,
            "cursor-grab": isSpacePressed && !isDragging,
            "cursor-grabbing": isSpacePressed && isDragging,
          },
          className
        )}
        style={{
          zoom: canvasSettings?.zoom || 1,
          transform: `translate(${canvasSettings?.panOffset?.x || 0}px, ${canvasSettings?.panOffset?.y || 0}px)`,
          height: editMode ? '600px' : 'auto',
          minHeight: '200px'
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        <div 
          className={cn(
            "wireframe-container h-full",
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
    </div>
  );
});

WireframeCanvas.displayName = 'WireframeCanvas';

export default WireframeCanvas;
