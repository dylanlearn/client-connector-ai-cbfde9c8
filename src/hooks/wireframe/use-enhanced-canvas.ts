
import { useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { GridConfig } from '@/utils/monitoring/grid-utils';

// Define the GridOptions interface for consistency
export interface GridOptions {
  visible: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  color: string;
  opacity: number;
  breakpoints?: Array<{
    name: string;
    width: number;
    columns: number;
    gutterWidth: number;
    marginWidth: number;
  }>;
}

export interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
  showRulers: boolean;
  rulerSize?: number;
  rulerColor?: string;
}

export function useEnhancedCanvas(options?: {
  gridOptions?: Partial<GridOptions>;
  canvasOptions?: Partial<CanvasOptions>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  
  // Default options
  const gridOptions: GridOptions = {
    visible: true,
    size: 20,
    type: 'lines',
    color: '#e0e0e0',
    opacity: 0.5,
    ...(options?.gridOptions || {})
  };
  
  const canvasOptions: CanvasOptions = {
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    showRulers: true,
    rulerSize: 20,
    rulerColor: '#bbbbbb',
    ...(options?.canvasOptions || {})
  };
  
  // Initialize canvas
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: canvasOptions.width,
      height: canvasOptions.height,
      backgroundColor: canvasOptions.backgroundColor
    });
    
    setCanvas(fabricCanvas);
    return fabricCanvas;
  }, [canvasOptions]);
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    if (!canvas) return;
    setZoom(prev => Math.min(5, prev + 0.1));
  }, [canvas]);
  
  const zoomOut = useCallback(() => {
    if (!canvas) return;
    setZoom(prev => Math.max(0.1, prev - 0.1));
  }, [canvas]);
  
  const resetZoom = useCallback(() => {
    if (!canvas) return;
    setZoom(1);
  }, [canvas]);
  
  const toggleGridVisibility = useCallback(() => {
    // Implementation would need to modify the gridOptions state
  }, []);
  
  // Pan function
  const pan = useCallback((deltaX: number, deltaY: number) => {
    if (!canvas) return;
    canvas.relativePan(new fabric.Point(deltaX, deltaY));
  }, [canvas]);
  
  return {
    canvas,
    gridOptions,
    canvasOptions,
    isDragging,
    isZooming,
    zoom,
    initializeCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGridVisibility,
    pan,
    setZoom
  };
}

export default useEnhancedCanvas;
