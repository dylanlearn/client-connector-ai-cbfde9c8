
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useHighPerformanceCanvas } from './use-high-performance-canvas';
import { GridConfig } from '@/utils/monitoring/grid-utils';

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
  rulerSize?: number;
  rulerColor?: string;
}

export interface EnhancedCanvasEngineOptions {
  gridOptions?: Partial<GridOptions>;
  canvasOptions?: Partial<CanvasOptions>;
}

export function useEnhancedCanvasEngine(options?: EnhancedCanvasEngineOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const isPointerDown = useRef(false);
  
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
  
  // Use our high performance canvas
  const {
    canvasRef,
    canvas,
    performanceMetrics,
    renderCanvas,
    updateDimensions,
    addObject,
    removeObject,
    optimizeCanvas
  } = useHighPerformanceCanvas({
    width: canvasOptions.width,
    height: canvasOptions.height,
    optimizationOptions: {
      enableLayerCaching: true,
      enableIncrementalRendering: true,
      enableHardwareAcceleration: true,
      autoOptimize: true
    }
  });
  
  // Initialize canvas with event handlers
  const initializeCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    if (!canvasElement) return null;
    
    if (!canvas && canvasRef.current) {
      // Initialize canvas
    }
    
    return canvas;
  }, [canvas, canvasRef]);
  
  // Set up event handlers for pan and zoom
  useEffect(() => {
    if (!canvas) return;
    
    const handleMouseDown = (e: fabric.IEvent) => {
      if (!e.target && e.e instanceof MouseEvent) {
        isPointerDown.current = true;
        lastPointerPos.current = { x: e.e.clientX, y: e.e.clientY };
        setIsDragging(true);
      }
    };
    
    const handleMouseMove = (e: fabric.IEvent) => {
      if (isPointerDown.current && e.e instanceof MouseEvent) {
        const dx = e.e.clientX - lastPointerPos.current.x;
        const dy = e.e.clientY - lastPointerPos.current.y;
        
        if (canvas.viewportTransform) {
          const vpt = canvas.viewportTransform;
          vpt[4] += dx;
          vpt[5] += dy;
          canvas.setViewportTransform(vpt);
          
          setPan({
            x: vpt[4],
            y: vpt[5]
          });
        }
        
        lastPointerPos.current = { x: e.e.clientX, y: e.e.clientY };
      }
    };
    
    const handleMouseUp = () => {
      isPointerDown.current = false;
      setIsDragging(false);
    };
    
    const handleMouseWheel = (e: fabric.IEvent) => {
      if (e.e instanceof WheelEvent) {
        e.e.preventDefault();
        
        const delta = e.e.deltaY;
        let newZoom = zoom;
        
        if (delta > 0) {
          newZoom = Math.max(0.1, zoom - 0.1);
        } else {
          newZoom = Math.min(5, zoom + 0.1);
        }
        
        if (canvas.viewportTransform) {
          const point = new fabric.Point(
            e.e.offsetX, 
            e.e.offsetY
          );
          
          const vpt = canvas.viewportTransform;
          const oldZoom = zoom;
          
          // Calculate new viewport position to zoom at cursor position
          vpt[4] = (point.x - point.x * (newZoom / oldZoom) + vpt[4] * (newZoom / oldZoom));
          vpt[5] = (point.y - point.y * (newZoom / oldZoom) + vpt[5] * (newZoom / oldZoom));
          
          canvas.setViewportTransform([
            newZoom, 0, 0, newZoom, vpt[4], vpt[5]
          ]);
          
          setPan({
            x: vpt[4],
            y: vpt[5]
          });
        }
        
        setZoom(newZoom);
        setIsZooming(true);
        setTimeout(() => setIsZooming(false), 300);
      }
    };
    
    // Register event handlers
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('mouse:wheel', handleMouseWheel);
    
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('mouse:wheel', handleMouseWheel);
    };
  }, [canvas, zoom]);
  
  // Zoom in function
  const zoomIn = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.min(5, zoom + 0.1);
    
    if (canvas.viewportTransform) {
      const vpt = canvas.viewportTransform;
      const center = {
        x: canvas.width! / 2,
        y: canvas.height! / 2
      };
      
      vpt[0] = newZoom;
      vpt[3] = newZoom;
      
      canvas.setViewportTransform(vpt);
    }
    
    setZoom(newZoom);
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300);
  }, [canvas, zoom]);
  
  // Zoom out function
  const zoomOut = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.max(0.1, zoom - 0.1);
    
    if (canvas.viewportTransform) {
      const vpt = canvas.viewportTransform;
      const center = {
        x: canvas.width! / 2,
        y: canvas.height! / 2
      };
      
      vpt[0] = newZoom;
      vpt[3] = newZoom;
      
      canvas.setViewportTransform(vpt);
    }
    
    setZoom(newZoom);
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300);
  }, [canvas, zoom]);
  
  // Reset zoom function
  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300);
  }, [canvas]);
  
  // Pan function
  const pan = useCallback((x: number, y: number) => {
    if (!canvas) return;
    
    if (canvas.viewportTransform) {
      const vpt = canvas.viewportTransform;
      vpt[4] += x;
      vpt[5] += y;
      canvas.setViewportTransform(vpt);
      
      setPan({
        x: vpt[4],
        y: vpt[5]
      });
    }
  }, [canvas]);
  
  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    // Grid toggle would update the grid in canvas and rerender
  }, []);
  
  // Return combined canvas functionality
  return {
    canvasRef,
    canvas,
    isDragging,
    isZooming,
    zoom,
    performanceMetrics,
    initializeCanvas,
    renderCanvas,
    pan,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    toggleGridVisibility,
    updateDimensions,
    addObject,
    removeObject,
    optimizeCanvas
  };
}

export default useEnhancedCanvasEngine;
