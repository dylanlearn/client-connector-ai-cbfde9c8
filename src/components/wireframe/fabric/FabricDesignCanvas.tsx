
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useFabric } from '@/hooks/use-fabric';
import { useCanvasInteractions } from '@/hooks/wireframe/use-canvas-interactions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CanvasControls from '../controls/CanvasControls';
import CanvasRulers from '../canvas/CanvasRulers';
import PropertyPanel from './PropertyPanel';
import HistoryControls from './HistoryControls';
import { useToast } from '@/hooks/use-toast';

interface FabricDesignCanvasProps {
  className?: string;
  width?: number;
  height?: number;
  showRulers?: boolean;
  showPropertyPanel?: boolean;
  onSave?: (json: any) => void;
  initialJson?: any;
}

const FabricDesignCanvas: React.FC<FabricDesignCanvasProps> = ({
  className,
  width = 1200,
  height = 800,
  showRulers = true,
  showPropertyPanel = true,
  onSave,
  initialJson
}) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize fabric canvas with our custom hook
  const {
    canvasRef,
    fabricCanvas,
    canvasConfig,
    selectedObject,
    updateConfig,
    initializeCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useFabric({
    persistConfig: true,
    initialConfig: {
      width,
      height,
      showGrid: true,
      snapToGrid: true,
      showRulers
    }
  });

  // Handle mouse interactions for pan/zoom
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
    isDragging,
    isSpacePressed
  } = useCanvasInteractions({
    canvasRef: containerRef,
    initialConfig: canvasConfig,
    onConfigChange: updateConfig
  });

  // Initialize the canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = initializeCanvas(canvasRef.current);
      
      // Load initial JSON if provided
      if (initialJson && canvas) {
        try {
          loadCanvasFromJSON(initialJson);
        } catch (error) {
          console.error('Failed to load initial canvas data:', error);
          toast({
            title: "Error",
            description: "Failed to load canvas data",
            variant: "destructive"
          });
        }
      }
    }
  }, [initializeCanvas, initialJson, loadCanvasFromJSON, toast]);

  // Track container dimensions for rulers
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Save the canvas data
  const handleSave = () => {
    if (!fabricCanvas || !onSave) return;
    
    try {
      const json = saveCanvasAsJSON();
      onSave(json);
      toast({
        title: "Success",
        description: "Canvas saved successfully"
      });
    } catch (error) {
      console.error('Failed to save canvas:', error);
      toast({
        title: "Error",
        description: "Failed to save canvas",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <HistoryControls 
            onUndo={undo} 
            onRedo={redo} 
            canUndo={canUndo} 
            canRedo={canRedo} 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <CanvasControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            onToggleGrid={toggleGrid}
            onToggleSnapToGrid={toggleSnapToGrid}
            showGrid={canvasConfig.showGrid}
            snapToGrid={canvasConfig.snapToGrid}
          />
          
          {onSave && (
            <Button variant="outline" size="sm" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className={cn(
            "relative flex-1 overflow-hidden bg-muted/20",
            className
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          tabIndex={0} // Make div focusable for keyboard events
          style={{
            cursor: isSpacePressed ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        >
          {showRulers && fabricCanvas && (
            <CanvasRulers
              width={containerDimensions.width}
              height={containerDimensions.height}
              zoom={canvasConfig.zoom}
              panOffset={canvasConfig.panOffset}
              rulerSize={20}
              className="z-10"
            />
          )}
          
          <div 
            className={cn(
              "absolute",
              showRulers ? "top-5 left-5 right-0 bottom-0" : "inset-0"
            )}
          >
            <canvas 
              ref={canvasRef}
              className="shadow-sm bg-white"
            />
          </div>
        </div>
        
        {showPropertyPanel && (
          <PropertyPanel
            selectedObject={selectedObject}
            fabricCanvas={fabricCanvas}
          />
        )}
      </div>
    </div>
  );
};

export default FabricDesignCanvas;
