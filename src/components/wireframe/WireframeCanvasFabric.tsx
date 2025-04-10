import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useFabric } from '@/hooks/use-fabric';
import { useCanvasInteractions } from '@/hooks/wireframe/use-canvas-interactions';
import CanvasControls from './controls/CanvasControls';
import { useToast } from '@/hooks/use-toast';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

interface WireframeCanvasFabricProps {
  projectId?: string;
  className?: string;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSectionClick?: (sectionId: string) => void;
  canvasSettings?: Partial<WireframeCanvasConfig>;
  onUpdateCanvasSettings?: (updates: Partial<WireframeCanvasConfig>) => void;
  editMode?: boolean;
}

const WireframeCanvasFabric: React.FC<WireframeCanvasFabricProps> = memo(({ 
  projectId, 
  className,
  deviceType,
  onSectionClick,
  canvasSettings: propCanvasSettings,
  onUpdateCanvasSettings,
  editMode = true
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const { 
    wireframe,
    activeDevice: storeActiveDevice,
    darkMode,
    showGrid,
    canvasSettings: storeCanvasSettings,
    updateCanvasSettings
  } = useWireframeStore();
  
  const activeDevice = deviceType || storeActiveDevice;
  
  const effectiveCanvasSettings = propCanvasSettings || storeCanvasSettings;
  
  const {
    canvasRef,
    fabricCanvas,
    canvasConfig,
    zoomIn: fabricZoomIn,
    zoomOut: fabricZoomOut,
    resetZoom: fabricResetZoom,
    toggleGrid: fabricToggleGrid,
    toggleSnapToGrid: fabricToggleSnapToGrid,
    updateConfig,
    initializeCanvas
  } = useFabric({
    initialConfig: effectiveCanvasSettings
  });
  
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
    canvasRef: canvasContainerRef,
    initialConfig: effectiveCanvasSettings,
    onConfigChange: (config) => {
      updateConfig(config);
      if (onUpdateCanvasSettings) {
        onUpdateCanvasSettings(config);
      }
    }
  });

  const getGridSize = () => {
    return typeof canvasConfig.gridSize === 'number' ? 
      canvasConfig.gridSize : 
      Number(canvasConfig.gridSize || 10);
  };

  const gridSize = getGridSize();

  useEffect(() => {
    if (fabricCanvasRef.current && !fabricCanvas) {
      const canvas = new fabric.Canvas(fabricCanvasRef.current, {
        width: canvasConfig.width || 800,
        height: canvasConfig.height || 600,
        backgroundColor: canvasConfig.backgroundColor || '#ffffff'
      });
      
      initializeCanvas(fabricCanvasRef.current);
    }
  }, [fabricCanvasRef, fabricCanvas, canvasConfig, initializeCanvas]);

  useEffect(() => {
    if (fabricCanvas && wireframe && wireframe.sections) {
      try {
        fabricCanvas.clear();
        
        if (canvasConfig.showGrid) {
          const width = fabricCanvas.getWidth();
          const height = fabricCanvas.getHeight();
          const gridSize = canvasConfig.gridSize;
          
          for (let i = 0; i < width / gridSize; i++) {
            fabricCanvas.add(
              new fabric.Line([i * gridSize, 0, i * gridSize, height], {
                stroke: canvasConfig.gridColor,
                selectable: false,
                evented: false,
                strokeWidth: 1
              })
            );
          }
          
          for (let i = 0; i < height / gridSize; i++) {
            fabricCanvas.add(
              new fabric.Line([0, i * gridSize, width, i * gridSize], {
                stroke: canvasConfig.gridColor,
                selectable: false,
                evented: false,
                strokeWidth: 1
              })
            );
          }
        }
        
        let topPosition = 20;
        
        wireframe.sections.forEach((section, index) => {
          if (!section) return;
          
          let width = fabricCanvas.getWidth() - 40;
          if (activeDevice === 'tablet') width = Math.min(width, 700);
          if (activeDevice === 'mobile') width = Math.min(width, 350);
          
          const height = section.dimensions?.height || 200;
          
          const rect = new fabric.Rect({
            left: 20,
            top: topPosition,
            width,
            height,
            fill: darkMode ? '#2d3748' : '#f9f9f9',
            stroke: darkMode ? '#4a5568' : '#ddd',
            strokeWidth: 1,
            rx: 5,
            ry: 5,
            selectable: editMode,
            hasControls: editMode,
            hasBorders: editMode,
            data: {
              id: section.id,
              type: 'section',
              sectionType: section.sectionType
            }
          });
          
          const label = new fabric.Text(section.name || `Section ${index + 1}`, {
            left: 30,
            top: topPosition + 10,
            fontSize: 14,
            fontFamily: 'Arial',
            fill: darkMode ? '#e2e8f0' : '#333333',
            selectable: false
          });
          
          const sectionGroup = new fabric.Group([rect, label], {
            data: {
              id: section.id,
              type: 'section',
              sectionType: section.sectionType
            }
          });
          
          fabricCanvas.add(sectionGroup);
          
          sectionGroup.on('selected', () => {
            if (onSectionClick) {
              onSectionClick(section.id);
            }
          });
          
          topPosition += height + 20;
        });
        
        fabricCanvas.renderAll();
      } catch (error) {
        console.error('Error rendering wireframe to fabric canvas:', error);
        toast({
          title: "Error",
          description: "Failed to render wireframe",
          variant: "destructive"
        });
      }
    }
  }, [fabricCanvas, wireframe, activeDevice, darkMode, canvasConfig.showGrid, 
      canvasConfig.gridSize, canvasConfig.gridColor, editMode, onSectionClick, toast]);

  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => setIsRendering(false), 100);
    return () => clearTimeout(timer);
  }, [wireframe, activeDevice, darkMode, showGrid]);
  
  useEffect(() => {
    const handleDocMouseUp = () => {
      handleMouseUp();
    };
    
    const handleDocKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };
    
    const handleDocKeyUp = (e: KeyboardEvent) => {
      handleKeyUp(e);
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
  
  return (
    <div className="wireframe-canvas-fabric-container relative">
      {editMode && (
        <CanvasControls
          onZoomIn={fabricZoomIn || zoomIn}
          onZoomOut={fabricZoomOut || zoomOut}
          onResetZoom={fabricResetZoom || resetZoom}
          onToggleGrid={fabricToggleGrid || toggleGrid}
          onToggleSnapToGrid={fabricToggleSnapToGrid || toggleSnapToGrid}
          showGrid={canvasConfig.showGrid}
          snapToGrid={canvasConfig.snapToGrid}
          className="mb-2"
        />
      )}
      
      <div 
        id="wireframe-canvas-fabric"
        ref={canvasContainerRef}
        className={cn(
          "wireframe-canvas-fabric bg-background border rounded-md overflow-hidden transition-all duration-300",
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
        onMouseMove={(e) => isDragging && handleMouseMove(e)}
        onWheel={handleWheel}
      >
        <canvas 
          ref={fabricCanvasRef} 
          className="w-full h-full"
        />
      </div>
    </div>
  );
});

WireframeCanvasFabric.displayName = 'WireframeCanvasFabric';

export default WireframeCanvasFabric;
