
import React from 'react';
import { useEnhancedCanvasEngine } from '@/hooks/canvas/use-enhanced-canvas-engine';
import { useEnhancedCanvasControls } from '@/hooks/canvas/use-enhanced-canvas-controls';
import { Card } from '@/components/ui/card';

interface WireframeOptimizedDemoProps {
  width?: number;
  height?: number;
}

const WireframeOptimizedDemo: React.FC<WireframeOptimizedDemoProps> = ({
  width = 1200,
  height = 800
}) => {
  const {
    canvasRef,
    canvas,
    isDragging,
    isZooming,
    zoom,
    performanceMetrics,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    toggleGridVisibility,
    renderCanvas,
    addObject,
    removeObject,
    panCanvas
  } = useEnhancedCanvasEngine({
    canvasOptions: {
      width,
      height,
      backgroundColor: '#ffffff'
    },
    gridOptions: {
      visible: true,
      size: 20,
      type: 'lines',
      color: '#e0e0e0',
      opacity: 0.5
    }
  });
  
  // Create canvas controls
  const canvasControls = useEnhancedCanvasControls({
    canvas,
    zoom,
    isDragging,
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onResetZoom: resetZoom,
    onToggleGrid: toggleGridVisibility,
    onSetZoom: setZoom
  });
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex justify-between items-center p-2 bg-muted/50 border-b">
        <div className="text-xs text-muted-foreground">
          Performance: {performanceMetrics?.rendering?.frameRate.toFixed(0) || 0} FPS
        </div>
        <div>{canvasControls}</div>
      </div>
      <div className="relative">
        <canvas 
          ref={canvasRef}
          className={isDragging ? 'cursor-grabbing' : 'cursor-grab'} 
        />
      </div>
    </Card>
  );
};

export default WireframeOptimizedDemo;
