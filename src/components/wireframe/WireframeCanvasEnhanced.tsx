import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useCanvasInteractions } from '@/hooks/wireframe/use-canvas-interactions';
import { useSectionManipulation } from '@/hooks/wireframe/use-section-manipulation';
import { WireframeSection } from '@/stores/wireframe-store'; // Use the type from the store
import { componentToFabricObject, fabricObjectToComponent } from './utils/fabric-converters';
import { calculateSectionBounds, findAlignmentGuides } from './utils/section-utils';
import CanvasControls from './controls/CanvasControls';
import ResizeHandles from './controls/ResizeHandles';
import GridSystem from './canvas/GridSystem';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Grid3x3, Layers, LayoutGrid } from 'lucide-react';

interface WireframeCanvasEnhancedProps {
  projectId?: string;
  className?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  editMode?: boolean;
}

const WireframeCanvasEnhanced = memo(({
  projectId,
  className,
  deviceType,
  onSectionClick,
  editMode = true
}: WireframeCanvasEnhancedProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [isRendering, setIsRendering] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [guidelines, setGuidelines] = useState<Array<{position: number, orientation: 'horizontal' | 'vertical'}>>([]);
  
  const { toast } = useToast();
  
  const {
    wireframe,
    activeDevice: storeActiveDevice,
    darkMode,
    activeSection,
    canvasSettings,
    updateCanvasSettings,
    applyGridLayout,
    redistributeSections,
  } = useWireframeStore();
  
  const activeDevice = deviceType || storeActiveDevice;
  
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
    toggleSmartGuides,
    setGridType,
    setGridSize,
    setSnapTolerance,
    isDragging,
    isSpacePressed,
    config
  } = useCanvasInteractions({
    canvasRef,
    initialConfig: canvasSettings,
    onConfigChange: updateCanvasSettings
  });
  
  const {
    activeSection: manipulationActiveSection,
    draggingSection,
    resizingSection,
    isRotating,
    selectSection,
    startDragSection,
    dragSection,
    startResizeSection,
    resizeSection,
    startRotateSection,
    rotateSection,
    stopManipulation,
    applySectionPositions
  } = useSectionManipulation();
  
  // Initialize fabric canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = new fabric.Canvas(fabricCanvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      selection: true,
      preserveObjectStacking: true,
      backgroundColor: darkMode ? '#1e293b' : '#ffffff'
    });
    
    setFabricCanvas(canvas);
    
    // Clean up
    return () => {
      canvas.dispose();
    };
  }, [canvasSize.width, canvasSize.height, darkMode]);
  
  // Update canvas when sections change
  useEffect(() => {
    if (!fabricCanvas) return;
    
    setIsRendering(true);
    
    fabricCanvas.clear();
    
    // Render each section
    wireframe.sections.forEach((section: WireframeSection) => {
      const fabricObject = componentToFabricObject(section, {
        deviceType: activeDevice,
        interactive: editMode,
        darkMode
      });
      
      if (fabricObject) {
        fabricObject.on('selected', () => {
          selectSection(section.id);
          if (onSectionClick) {
            onSectionClick(section.id);
          }
        });
        
        fabricObject.on('moving', (e) => {
          if (config.showSmartGuides) {
            // Calculate guides for alignment
            const bounds = calculateSectionBounds(wireframe.sections);
            const activeBounds = bounds.find(b => b.id === section.id)?.bounds;
            
            if (activeBounds) {
              const guides = findAlignmentGuides(
                section.id,
                activeBounds,
                bounds,
                config.snapTolerance
              );
              
              setGuidelines(guides);
            }
          }
        });
        
        fabricObject.on('moved', () => {
          const updatedComponent = fabricObjectToComponent(fabricObject);
          if (updatedComponent && updatedComponent.id) {
            // Cast the updatedComponent to store's WireframeSection type
            const update = {
              ...updatedComponent,
              copySuggestions: Array.isArray(updatedComponent.copySuggestions) 
                ? updatedComponent.copySuggestions 
                : []
            };
            
            useWireframeStore.getState().updateSection(
              updatedComponent.id,
              update
            );
            setGuidelines([]);
          }
        });
        
        // Set element opacity based on active selection
        if (activeSection === section.id) {
          fabricObject.set({
            borderColor: '#2563eb',
            borderScaleFactor: 2
          });
        }
        
        fabricCanvas.add(fabricObject);
      }
    });
    
    fabricCanvas.renderAll();
    setIsRendering(false);
  }, [wireframe.sections, activeDevice, darkMode, fabricCanvas, editMode, selectSection, onSectionClick, activeSection, config.showSmartGuides, config.snapTolerance]);
  
  // Apply canvas settings
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.setZoom(config.zoom);
    fabricCanvas.setViewportTransform([
      config.zoom,
      0,
      0,
      config.zoom,
      config.panOffset.x,
      config.panOffset.y
    ]);
    
    // Apply snap to grid
    if (config.snapToGrid) {
      fabricCanvas.on('object:moving', function(options) {
        if (options.target) {
          const target = options.target;
          const grid = config.gridSize;
          
          target.set({
            left: Math.round(target.left! / grid) * grid,
            top: Math.round(target.top! / grid) * grid
          });
        }
      });
      
      fabricCanvas.on('object:scaling', function(options) {
        if (options.target) {
          const target = options.target;
          const grid = config.gridSize;
          const w = target.getScaledWidth();
          const h = target.getScaledHeight();
          
          target.set({
            width: Math.round(w / grid) * grid / target.scaleX!,
            height: Math.round(h / grid) * grid / target.scaleY!,
            scaleX: 1,
            scaleY: 1
          });
        }
      });
    }
    
    fabricCanvas.renderAll();
  }, [fabricCanvas, config.zoom, config.panOffset, config.snapToGrid, config.gridSize]);
  
  // Event handlers
  useEffect(() => {
    const handleDocKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };
    
    const handleDocKeyUp = (e: KeyboardEvent) => {
      handleKeyUp(e);
    };
    
    const handleDocMouseUp = () => {
      handleMouseUp();
      stopManipulation();
      setGuidelines([]);
    };
    
    const handleDocMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e);
      }
      
      if (draggingSection) {
        dragSection(e.clientX, e.clientY);
      }
      
      if (resizingSection) {
        resizeSection(e.clientX, e.clientY);
      }
      
      if (isRotating && manipulationActiveSection) {
        rotateSection(manipulationActiveSection, e.clientX, e.clientY);
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
  }, [
    handleKeyDown, handleKeyUp, handleMouseUp, handleMouseMove, 
    isDragging, draggingSection, resizingSection, isRotating,
    dragSection, resizeSection, rotateSection, stopManipulation,
    manipulationActiveSection
  ]);
  
  // Handle section mouse events
  const handleSectionMouseDown = useCallback((e: React.MouseEvent, sectionId: string) => {
    if (!editMode) return;
    
    if (isSpacePressed) return;
    
    if (e.button === 0) {
      e.stopPropagation();
      selectSection(sectionId);
      startDragSection(sectionId, e.clientX, e.clientY);
    }
  }, [editMode, isSpacePressed, selectSection, startDragSection]);
  
  // Handle resize start
  const handleResizeStart = useCallback((direction: string, e: React.MouseEvent) => {
    if (!manipulationActiveSection) return;
    
    e.stopPropagation();
    startResizeSection(manipulationActiveSection, direction, e.clientX, e.clientY);
  }, [manipulationActiveSection, startResizeSection]);
  
  // Handle rotate start
  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    if (!manipulationActiveSection) return;
    
    e.stopPropagation();
    startRotateSection(manipulationActiveSection, e.clientX, e.clientY);
  }, [manipulationActiveSection, startRotateSection]);
  
  // Apply different grid layouts
  const handleApplyGridLayout = useCallback((columns: number) => {
    applyGridLayout(columns, config.gridSize * 2);
    
    toast({
      title: "Grid Layout Applied",
      description: `Applied a ${columns}-column grid layout`
    });
  }, [applyGridLayout, config.gridSize, toast]);
  
  // Handle canvas resize on mount and window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const { width, height } = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
  
  // Apply styles safely for CSS properties
  const applySectionStyle = (section: WireframeSection) => {
    return applySectionPositions(section);
  };

  // Render the sections and their controls
  const renderSections = useCallback(() => {
    return wireframe.sections.map(section => {
      const isActive = section.id === activeSection;
      const isDragging = section.id === draggingSection;
      const isResizing = section.id === resizingSection;
      const isHovered = section.id === hoveredSection;
      
      const positionStyle = applySectionPositions(section);
      
      return (
        <div
          key={section.id}
          id={`section-${section.id}`}
          className={cn(
            "wireframe-section relative transition-colors",
            {
              "outline-dashed outline-2 outline-blue-500": isActive && !isDragging && !isResizing,
              "outline outline-2 outline-blue-500": isActive && (isDragging || isResizing),
              "opacity-70": !isActive && (activeSection !== null),
              "hover:outline-dotted hover:outline-2 hover:outline-gray-400": !isActive && !isDragging && !isResizing,
            }
          )}
          style={positionStyle}
          onClick={(e) => {
            e.stopPropagation();
            selectSection(section.id);
            if (onSectionClick) {
              onSectionClick(section.id);
            }
          }}
          onMouseDown={(e) => handleSectionMouseDown(e, section.id)}
          onMouseEnter={() => setHoveredSection(section.id)}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div 
            className={cn(
              "w-full h-full bg-white dark:bg-slate-800 rounded-md overflow-hidden",
              { "shadow-md": isActive || isHovered }
            )}
          >
            <div className="p-2 bg-gray-100 dark:bg-slate-700 border-b text-sm font-medium">
              {section.name || `Section ${section.sectionType}`}
            </div>
            
            <div className="p-4">
              {/* Section content here based on section type */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {section.sectionType} section
              </div>
            </div>
          </div>
          
          {isActive && (
            <ResizeHandles 
              show={true} 
              onResizeStart={handleResizeStart}
              onRotateStart={handleRotateStart}
            />
          )}
        </div>
      );
    });
  }, [
    wireframe.sections, activeSection, draggingSection, resizingSection, 
    hoveredSection, applySectionPositions, selectSection, onSectionClick,
    handleSectionMouseDown, handleResizeStart, handleRotateStart
  ]);
  
  return (
    <div className="wireframe-canvas-enhanced-container relative">
      <div className="flex items-center justify-between mb-2">
        <CanvasControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onToggleGrid={toggleGrid}
          onToggleSnapToGrid={toggleSnapToGrid}
          onToggleSmartGuides={toggleSmartGuides}
          onChangeGridType={setGridType}
          onChangeGridSize={setGridSize}
          onChangeSnapTolerance={setSnapTolerance}
          showGrid={config.showGrid}
          snapToGrid={config.snapToGrid}
          showSmartGuides={config.showSmartGuides}
          gridType={config.gridType}
          gridSize={config.gridSize}
          snapTolerance={config.snapTolerance}
          className="flex-1"
        />
        
        {editMode && (
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleApplyGridLayout(1)}
              title="Single column layout"
            >
              <Layers className="h-4 w-4 mr-1" />
              1 Col
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleApplyGridLayout(2)}
              title="Two column layout"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              2 Col
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleApplyGridLayout(3)}
              title="Three column layout"
            >
              <Grid3x3 className="h-4 w-4 mr-1" />
              3 Col
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => redistributeSections()}
              title="Redistribute sections evenly"
            >
              Auto Layout
            </Button>
          </div>
        )}
      </div>
      
      <div
        ref={canvasRef}
        className={cn(
          "wireframe-canvas-enhanced relative bg-background border rounded-md overflow-hidden transition-all duration-300",
          darkMode ? "dark bg-slate-900" : "bg-white",
          {
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
          height: editMode ? '600px' : 'auto',
          minHeight: '200px'
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={() => selectSection(null)}
      >
        {/* Grid system */}
        {config.showGrid && (
          <GridSystem
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            gridSize={config.gridSize}
            gridType={config.gridType}
            guidelines={guidelines}
            darkMode={darkMode}
          />
        )}
        
        {/* Alternative DOM-based section rendering */}
        <div className="sections-container relative" style={{
          transform: `scale(${config.zoom}) translate(${config.panOffset.x / config.zoom}px, ${config.panOffset.y / config.zoom}px)`,
          transformOrigin: '0 0'
        }}>
          {renderSections()}
        </div>
        
        {/* Fabric.js canvas for advanced vector graphics */}
        <canvas 
          ref={fabricCanvasRef} 
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>
    </div>
  );
}); 

WireframeCanvasEnhanced.displayName = 'WireframeCanvasEnhanced';

export default WireframeCanvasEnhanced;
