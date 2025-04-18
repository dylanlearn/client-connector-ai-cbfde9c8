
import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { 
  useEnhancedCanvasNavigation, 
  ViewMode, 
  FocusArea 
} from '@/hooks/wireframe/use-enhanced-canvas-navigation';
import CanvasViewportControls from '../controls/CanvasViewportControls';
import CanvasMinimap from './CanvasMinimap';
import { 
  ZoomIn, ZoomOut, RotateCw, RotateCcw, 
  Maximize, LayoutGrid, SplitSquareVertical, Eye 
} from 'lucide-react';

export interface MultiViewportCanvasProps {
  canvas: fabric.Canvas | null;
  className?: string;
  viewportConfig?: {
    showControls?: boolean;
    showMinimap?: boolean;
    allowMultiViewport?: boolean;
    persistViewportState?: boolean;
    storageKey?: string;
  };
  children?: React.ReactNode;
}

const MultiViewportCanvas: React.FC<MultiViewportCanvasProps> = ({
  canvas,
  className,
  viewportConfig = {
    showControls: true,
    showMinimap: true,
    allowMultiViewport: true,
    persistViewportState: true,
    storageKey: 'canvas-viewport-state'
  },
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    zoom,
    rotation,
    pan,
    viewMode,
    viewports,
    activeViewportId,
    activeViewport,
    isAnimating,
    canvasTransform,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleRotateReset,
    handlePan,
    handleViewModeToggle,
    handleApplyFocusArea,
    addViewport,
    removeViewport,
    switchToViewport
  } = useEnhancedCanvasNavigation({
    canvas,
    persistState: viewportConfig.persistViewportState,
    stateStorageKey: viewportConfig.storageKey,
    animationDuration: 300
  });

  // Set up canvas pan on mouse drag
  useEffect(() => {
    if (!canvas || !containerRef.current) return;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Only start dragging on middle mouse button or when holding space
      if ((e.button === 1) || (e.button === 0 && e.getModifierState && e.getModifierState('Space'))) {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        containerRef.current!.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      handlePan(deltaX, deltaY);
    };

    const handleMouseUp = () => {
      isDragging = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = '';
      }
    };

    // Wheel event for zooming
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    const container = containerRef.current;
    
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [canvas, handlePan, handleZoomIn, handleZoomOut]);

  // Focus on specific area (e.g., for error highlighting)
  const focusOnArea = (area: FocusArea) => {
    handleApplyFocusArea(area);
  };

  // Render multi-viewport layout
  const renderViewports = () => {
    if (viewMode === 'single') {
      return (
        <div 
          className="viewport-container relative w-full h-full overflow-hidden"
          style={{ transform: canvasTransform, transition: isAnimating ? 'transform 0.3s ease-out' : 'none' }}
        >
          {children}
        </div>
      );
    }
    
    if (viewMode === 'split') {
      // Show two viewports side by side
      return (
        <div className="viewports-split flex w-full h-full">
          {viewports.slice(0, 2).map((viewport, index) => (
            <div 
              key={viewport.id}
              className={cn(
                "viewport-container relative w-1/2 h-full overflow-hidden border-r last:border-r-0", 
                { "opacity-80": viewport.id !== activeViewportId }
              )}
              style={{ 
                transform: viewport.id === activeViewportId 
                  ? canvasTransform 
                  : `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
                transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
              }}
              onClick={() => switchToViewport(viewport.id)}
            >
              {viewport.id === activeViewportId && children}
              
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 text-xs rounded shadow-sm">
                Viewport {index + 1}
              </div>
              
              {viewport.id !== activeViewportId && (
                <div className="absolute inset-0 bg-transparent z-10" />
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (viewMode === 'grid') {
      // Show four viewports in a 2x2 grid
      return (
        <div className="viewports-grid grid grid-cols-2 grid-rows-2 w-full h-full">
          {viewports.slice(0, 4).map((viewport, index) => (
            <div 
              key={viewport.id}
              className={cn(
                "viewport-container relative w-full h-full overflow-hidden border-r border-b last:border-r-0 last:border-b-0", 
                { "opacity-80": viewport.id !== activeViewportId }
              )}
              style={{ 
                transform: viewport.id === activeViewportId 
                  ? canvasTransform 
                  : `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
                transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
              }}
              onClick={() => switchToViewport(viewport.id)}
            >
              {viewport.id === activeViewportId && children}
              
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 text-xs rounded shadow-sm">
                Viewport {index + 1}
              </div>
              
              {viewport.id !== activeViewportId && (
                <div className="absolute inset-0 bg-transparent z-10" />
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={cn("multi-viewport-canvas flex flex-col", className)}>
      {viewportConfig.showControls && (
        <div className="viewport-controls flex items-center justify-between p-2 bg-background/95 backdrop-blur-sm shadow-sm z-10">
          <div className="left-controls flex items-center gap-2">
            {/* Zoom controls */}
            <button
              onClick={() => handleZoomOut()}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Zoom Out (Ctrl+-)"
            >
              <ZoomOut size={16} />
            </button>
            
            <div className="zoom-level min-w-[50px] text-center text-xs font-mono">
              {Math.round(zoom * 100)}%
            </div>
            
            <button
              onClick={() => handleZoomIn()}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Zoom In (Ctrl++)"
            >
              <ZoomIn size={16} />
            </button>
            
            <button
              onClick={() => handleZoomReset()}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Reset Zoom (Ctrl+0)"
            >
              <Maximize size={16} />
            </button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            {/* Rotation controls */}
            <button
              onClick={() => handleRotateCounterClockwise()}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Rotate Counter-clockwise"
            >
              <RotateCcw size={16} />
            </button>
            
            <div className="rotation-value min-w-[40px] text-center text-xs font-mono">
              {rotation}°
            </div>
            
            <button
              onClick={() => handleRotateClockwise()}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="Rotate Clockwise"
            >
              <RotateCw size={16} />
            </button>
          </div>
          
          {viewportConfig.allowMultiViewport && (
            <div className="viewport-modes flex items-center gap-2">
              <button
                onClick={() => handleViewModeToggle('single')}
                className={cn(
                  "p-1 rounded transition-colors",
                  viewMode === 'single' 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                )}
                title="Single View"
              >
                <Eye size={16} />
              </button>
              
              <button
                onClick={() => handleViewModeToggle('split')}
                className={cn(
                  "p-1 rounded transition-colors",
                  viewMode === 'split' 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                )}
                title="Split View"
              >
                <SplitSquareVertical size={16} />
              </button>
              
              <button
                onClick={() => handleViewModeToggle('grid')}
                className={cn(
                  "p-1 rounded transition-colors",
                  viewMode === 'grid' 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                )}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              
              {viewMode !== 'single' && (
                <button
                  onClick={() => addViewport()}
                  className="p-1 rounded hover:bg-primary/10 transition-colors"
                  title="Add Viewport"
                >
                  <ZoomIn size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="canvas-container flex-1 relative overflow-hidden"
        style={{ cursor: isAnimating ? 'grabbing' : undefined }}
      >
        {renderViewports()}
        
        {viewportConfig.showMinimap && canvas && (
          <CanvasMinimap 
            canvas={canvas}
            options={{
              position: 'bottom-right',
              alwaysVisible: false,
              showOnHover: true
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MultiViewportCanvas;
