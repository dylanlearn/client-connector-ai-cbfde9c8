
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useEnhancedCanvasEngine } from '@/hooks/wireframe/use-enhanced-canvas-engine';
import { Spinner } from '@/components/ui/spinner';
import { useEnhancedCanvasControls } from '@/hooks/wireframe/use-enhanced-canvas-controls';

export interface GridOptions {
  visible: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  color: string;
  opacity: number;
}

export interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
  showRulers: boolean;
}

export interface EnhancedCanvasProps {
  width?: number;
  height?: number;
  gridOptions?: Partial<GridOptions>;
  canvasOptions?: Partial<CanvasOptions>;
  className?: string;
  onReady?: (canvas: any) => void;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  width = 1200,
  height = 800,
  gridOptions = {},
  canvasOptions = {},
  className,
  onReady
}) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  
  const {
    canvas,
    isDragging,
    isZooming,
    zoom,
    initializeCanvas,
    pan,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    toggleGridVisibility
  } = useEnhancedCanvasEngine({
    gridOptions: {
      visible: true,
      size: 20,
      type: 'lines',
      color: '#e0e0e0',
      opacity: 0.4,
      ...gridOptions
    },
    canvasOptions: {
      width,
      height,
      backgroundColor: '#ffffff',
      showRulers: true,
      ...canvasOptions
    }
  });

  // Use the controls hook
  const controls = useEnhancedCanvasControls({
    canvas,
    zoom,
    isDragging,
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onResetZoom: resetZoom,
    onToggleGrid: toggleGridVisibility,
    onSetZoom: setZoom
  });

  // Initialize canvas when ref is available
  useEffect(() => {
    if (canvasElementRef.current) {
      const canvasInstance = initializeCanvas(canvasElementRef.current);
      
      if (onReady) {
        onReady(canvasInstance);
      }
    }
  }, [initializeCanvas, onReady]);

  return (
    <div className={cn("enhanced-canvas-container relative", className)}>
      <canvas 
        ref={canvasElementRef}
        className={cn(
          "enhanced-canvas",
          isDragging && "cursor-grabbing",
          isZooming && "transition-transform"
        )}
        width={width}
        height={height}
      />
      
      {!canvas && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      
      {/* Controls overlay */}
      <div className="canvas-controls absolute bottom-4 right-4">
        {controls}
      </div>
    </div>
  );
};

export default EnhancedCanvas;
