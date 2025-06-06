
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useWireframeRenderer } from '@/hooks/wireframe/use-wireframe-renderer';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import CanvasControls from './controls/CanvasControls';
import CanvasLoadingIndicator from './canvas/CanvasLoadingIndicator';
import CanvasErrorDisplay from './canvas/CanvasErrorDisplay';
import { fabric } from 'fabric';
import { useFabric } from '@/hooks/fabric/use-fabric';
import { TypographyManager } from './typography/TypographyManager';

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
  showTypographyManager?: boolean;
  onTypographyChange?: (typography: any) => void;
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
  onToggleSnapToGrid,
  showTypographyManager = false,
  onTypographyChange
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
  
  // Use fabric hook for additional canvas manipulation
  const { 
    zoomIn: fabricZoomIn, 
    zoomOut: fabricZoomOut, 
    resetZoom: fabricResetZoom 
  } = useFabric({
    initialConfig: mergedConfig
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
  
  // Handle canvas control actions
  const handleZoomIn = () => {
    if (canvas) {
      const newZoom = Math.min(3, canvas.getZoom() + 0.1);
      canvas.setZoom(newZoom);
      canvas.renderAll();
      
      if (onZoomIn) {
        onZoomIn();
      }
    } else if (fabricZoomIn) {
      fabricZoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (canvas) {
      const newZoom = Math.max(0.1, canvas.getZoom() - 0.1);
      canvas.setZoom(newZoom);
      canvas.renderAll();
      
      if (onZoomOut) {
        onZoomOut();
      }
    } else if (fabricZoomOut) {
      fabricZoomOut();
    }
  };
  
  const handleResetZoom = () => {
    if (canvas) {
      canvas.setZoom(1);
      canvas.absolutePan(new fabric.Point(0, 0));
      canvas.renderAll();
      
      if (onResetZoom) {
        onResetZoom();
      }
    } else if (fabricResetZoom) {
      fabricResetZoom();
    }
  };
  
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

  const handleToggleSnapToGrid = () => {
    if (onToggleSnapToGrid) {
      onToggleSnapToGrid();
    }
  };

  const handleTypographyChange = (typography: any) => {
    if (onTypographyChange && wireframe) {
      onTypographyChange(typography);
      
      // Re-render wireframe with updated typography if canvas exists
      if (canvas && wireframe) {
        renderWireframe(
          { ...wireframe, typography },
          canvas,
          {
            deviceType,
            darkMode
          }
        );
      }
    }
  };
  
  return (
    <div className="enhanced-wireframe-canvas-container space-y-6">
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
        
        <CanvasLoadingIndicator isLoading={isRendering} />
        <CanvasErrorDisplay error={error} />
      </div>

      {showTypographyManager && wireframe?.typography && (
        <div className="mt-8">
          <TypographyManager
            typography={wireframe.typography}
            onChange={handleTypographyChange}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedWireframeCanvas;
