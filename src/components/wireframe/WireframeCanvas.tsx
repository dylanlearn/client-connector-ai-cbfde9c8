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
  
  const activeDevice = deviceType || storeActiveDevice;
  const canvasSettings = propCanvasSettings || storeCanvasSettings;
  
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
    isSpacePressed,
    config
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

  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => setIsRendering(false), 100);
    return () => clearTimeout(timer);
  }, [wireframe, activeDevice, darkMode, showGrid]);
  
  useEffect(() => {
    const handleDocKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };
    
    const handleDocKeyUp = (e: KeyboardEvent) => {
      handleKeyUp(e);
    };
    
    const handleDocMouseUp = () => {
      handleMouseUp();
    };
    
    const handleDocMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };
    
    document.addEventListener('keydown', handleDocKeyDown);
    document.addEventListener('keyup', handleDocKeyUp);
    document.addEventListener('mouseup', handleDocMouseUp);
    document.addEventListener('mousemove', handleDocMouseMove);
    
    return () => {
      document.removeEventListener('keydown', handleDocKeyDown);
      document.removeEventListener('keyup', handleDocKeyUp);
      document.removeEventListener('mouseup', handleDocMouseUp);
      document.removeEventListener('mousemove', handleDocMouseMove);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseUp, handleMouseMove, isDragging]);

  const handleSectionMouseDown = useCallback((e: React.MouseEvent, sectionId: string) => {
    if (!editMode) return;
    
    if (isSpacePressed) return;
    
    if (e.button === 0) {
      e.stopPropagation();
      startDragSection(sectionId, e.clientX, e.clientY);
    }
  }, [editMode, isSpacePressed, startDragSection]);
  
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

  const handleSectionEdit = useCallback((sectionId: string) => {
    selectSection(sectionId);
  }, [selectSection]);
  
  const handleSectionDelete = useCallback((sectionId: string) => {
    useWireframeStore.getState().removeSection(sectionId);
    
    toast({
      title: "Section removed",
      description: "The section has been removed from the wireframe"
    });
  }, [toast]);
  
  const handleSectionDuplicate = useCallback((sectionId: string) => {
    const sectionToDuplicate = wireframe.sections.find(section => section.id === sectionId);
    if (sectionToDuplicate) {
      const { id, ...sectionData } = sectionToDuplicate;
      
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
  
  const renderSection = useCallback((section, index) => {
    if (hiddenSections.includes(section.id)) return null;
    
    const positionStyle = applySectionPositions(section);
    
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
      {editMode && (
        <CanvasControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onToggleGrid={toggleGrid}
          onToggleSnapToGrid={toggleSnapToGrid}
          showGrid={config.showGrid}
          snapToGrid={config.snapToGrid}
          className="mb-2"
        />
      )}
      
      <div 
        id="wireframe-canvas"
        ref={canvasRef}
        className={cn(
          "wireframe-canvas bg-background border rounded-md overflow-hidden transition-all duration-300",
          darkMode ? "dark bg-slate-900" : "bg-white",
          {
            "grid bg-grid-pattern": showGrid || config.showGrid,
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
          zoom: config.zoom || 1,
          transform: `translate(${config.panOffset?.x || 0}px, ${config.panOffset?.y || 0}px)`,
          height: editMode ? '600px' : 'auto',
          minHeight: '200px'
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onMouseMove={(e) => isDragging && handleMouseMove(e)}
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
