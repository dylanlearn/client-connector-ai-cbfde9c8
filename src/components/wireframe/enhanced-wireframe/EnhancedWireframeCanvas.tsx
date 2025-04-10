
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeRenderer } from '@/hooks/wireframe/use-wireframe-renderer';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import CanvasControls from '../controls/CanvasControls';
import { Loader2 } from 'lucide-react';
import { fabric } from 'fabric';

export interface EnhancedWireframeCanvasProps {
  wireframe: WireframeData | null;
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  canvasConfig?: Partial<WireframeCanvasConfig>;
  className?: string;
  onSectionClick?: (sectionId: string, section: any) => void;
  onRenderComplete?: (canvas: fabric.Canvas) => void;
  interactive?: boolean;
  showControls?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onToggleGrid?: () => void;
  onToggleSnapToGrid?: () => void;
}

const EnhancedWireframeCanvas: React.FC<EnhancedWireframeCanvasProps> = ({
  wireframe,
  darkMode = false,
  deviceType = 'desktop',
  canvasConfig = {},
  className,
  onSectionClick,
  onRenderComplete,
  interactive = true,
  showControls = true,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default canvas configuration
  const defaultConfig: Partial<WireframeCanvasConfig> = {
    width: 1200,
    height: 800,
    zoom: 1,
    showGrid: true,
    gridSize: 20,
    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
    gridColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0'
  };
  
  // Merge with provided config
  const mergedConfig = { ...defaultConfig, ...canvasConfig };
  
  // Use the wireframe renderer hook
  const {
    canvasRef,
    initializeCanvas,
    renderWireframe,
    isRendering,
    error,
    canvas
  } = useWireframeRenderer({
    darkMode,
    deviceType,
    interactive,
    canvasConfig: mergedConfig,
    onSectionClick,
    onRenderComplete
  });
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = initializeCanvas(canvasRef.current);
      
      if (fabricCanvas && wireframe) {
        renderWireframe(wireframe, fabricCanvas, {
          deviceType,
          darkMode
        });
      }
    }
  }, [initializeCanvas, wireframe, deviceType, darkMode, renderWireframe]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    if (canvas) {
      const newZoom = Math.min(3, canvas.getZoom() + 0.1);
      canvas.setZoom(newZoom);
      canvas.renderAll();
      
      if (onZoomIn) {
        onZoomIn();
      }
    }
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    if (canvas) {
      const newZoom = Math.max(0.1, canvas.getZoom() - 0.1);
      canvas.setZoom(newZoom);
      canvas.renderAll();
      
      if (onZoomOut) {
        onZoomOut();
      }
    }
  };
  
  // Handle reset zoom
  const handleResetZoom = () => {
    if (canvas) {
      canvas.setZoom(1);
      canvas.absolutePan(new fabric.Point(0, 0));
      canvas.renderAll();
      
      if (onResetZoom) {
        onResetZoom();
      }
    }
  };
  
  // Toggle grid visibility
  const handleToggleGrid = () => {
    if (canvas) {
      // Remove existing grid lines
      const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
      gridObjects.forEach(obj => canvas.remove(obj));
      
      // Create new grid if needed
      const showGrid = !Boolean(gridObjects.length);
      
      if (showGrid) {
        // Re-render with grid
        if (wireframe) {
          renderWireframe(wireframe, canvas, {
            deviceType,
            darkMode,
            renderGrid: true
          });
        }
      } else {
        canvas.renderAll();
      }
      
      if (onToggleGrid) {
        onToggleGrid();
      }
    }
  };

  // Handle toggle snap to grid
  const handleToggleSnapToGrid = () => {
    if (onToggleSnapToGrid) {
      onToggleSnapToGrid();
    }
  };
  
  return (
    <div className="enhanced-wireframe-canvas-container">
      {showControls && (
        <CanvasControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onToggleGrid={handleToggleGrid}
          onToggleSnapToGrid={handleToggleSnapToGrid}
          showGrid={mergedConfig.showGrid}
          snapToGrid={mergedConfig.snapToGrid || false}
          className="mb-2"
        />
      )}
      
      <div 
        ref={containerRef}
        className={cn(
          "enhanced-wireframe-canvas relative border rounded-md overflow-hidden transition-all duration-300",
          darkMode ? "bg-gray-900" : "bg-white",
          {
            "opacity-70": isRendering,
          },
          className
        )}
        style={{
          width: `${mergedConfig.width}px`,
          height: `${mergedConfig.height}px`,
          maxWidth: "100%",
          maxHeight: "80vh"
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm">
            <div className="bg-card p-4 rounded-md shadow-lg">
              <h3 className="font-semibold text-destructive">Rendering Error</h3>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWireframeCanvas;
