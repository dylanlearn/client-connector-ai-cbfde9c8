
import React, { useRef, useEffect, useState } from 'react';
import { useEnhancedCanvasEngine } from '@/hooks/canvas/use-enhanced-canvas-engine';
import { useEnhancedCanvasControls } from '@/hooks/canvas/use-enhanced-canvas-controls';

export interface HighPerformanceCanvasProps {
  width?: number;
  height?: number;
  optimizationLevel?: 'low' | 'medium' | 'high';
  enableGrid?: boolean;
  backgroundColor?: string;
  enableLayerCaching?: boolean;
  enableMemoryManagement?: boolean;
}

const HighPerformanceCanvas: React.FC<HighPerformanceCanvasProps> = ({
  width = 1200,
  height = 800,
  optimizationLevel = 'medium',
  enableGrid = true,
  backgroundColor = '#ffffff',
  enableLayerCaching = true,
  enableMemoryManagement = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridVisible, setGridVisible] = useState(enableGrid);
  
  // Configure optimization options based on level
  const optimizationOptions = {
    low: {
      useLayerCaching: false,
      incrementalRendering: false,
      hardwareAcceleration: true
    },
    medium: {
      useLayerCaching: true,
      incrementalRendering: false,
      hardwareAcceleration: true
    },
    high: {
      useLayerCaching: true,
      incrementalRendering: true,
      hardwareAcceleration: true
    }
  }[optimizationLevel];
  
  // Initialize enhanced canvas engine
  const {
    canvasRef,
    canvas,
    isDragging,
    isZooming,
    zoom,
    performanceMetrics,
    panCanvas,
    zoomIn, 
    zoomOut,
    resetZoom,
    setZoom,
    toggleGridVisibility
  } = useEnhancedCanvasEngine({
    gridOptions: {
      visible: gridVisible,
      size: 20,
      type: 'lines'
    },
    canvasOptions: {
      width,
      height,
      backgroundColor
    }
  });
  
  // Create canvas controls using our hook
  const canvasControls = useEnhancedCanvasControls({
    canvas,
    zoom,
    isDragging,
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onResetZoom: resetZoom,
    onToggleGrid: () => {
      setGridVisible(prev => !prev);
      toggleGridVisibility();
    },
    onSetZoom: setZoom
  });
  
  // Update grid visibility when prop changes
  useEffect(() => {
    setGridVisible(enableGrid);
  }, [enableGrid]);
  
  return (
    <div className="w-full h-full flex flex-col" ref={containerRef}>
      <div className="flex items-center justify-between bg-background/90 p-2 border-b">
        <div className="text-xs font-mono text-muted-foreground">
          FPS: {performanceMetrics?.rendering?.frameRate || 0} |
          Objects: {performanceMetrics?.rendering?.objectCount || 0} |
          Memory: {(performanceMetrics?.memory?.estimatedMemoryUsage / (1024 * 1024)).toFixed(2) || 0} MB
        </div>
        
        {/* Canvas controls */}
        <div className="flex items-center">
          {canvasControls}
        </div>
      </div>
      
      <div className="flex-grow relative overflow-hidden border border-border">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0" 
        />
      </div>
    </div>
  );
};

export default HighPerformanceCanvas;
