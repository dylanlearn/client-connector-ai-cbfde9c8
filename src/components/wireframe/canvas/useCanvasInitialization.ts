
import { useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '../utils/types';
import { updateGridOnCanvas } from '../utils/grid-system';
import { CanvasInitializationOptions, CanvasInitializationResult, CanvasPerformanceOptions } from '../types/canvas-types';

/**
 * Hook for initializing and managing a Fabric.js canvas with optimized performance
 */
export function useCanvasInitialization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: WireframeCanvasConfig,
  onObjectsSelected?: (objects: fabric.Object[]) => void,
  onObjectModified?: (object: fabric.Object) => void,
  onCanvasReady?: (canvas: fabric.Canvas) => void,
  performanceOptions?: CanvasPerformanceOptions
): CanvasInitializationResult {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize canvas with performance optimizations
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Default performance options
      const defaultPerformanceOptions: CanvasPerformanceOptions = {
        enableCaching: true,
        objectCaching: true,
        skipOffscreen: true,
        enableRetina: true,
        renderBatchSize: 50,
        maxRenderingScale: 3
      };
      
      const perfOptions = { ...defaultPerformanceOptions, ...performanceOptions };
      
      // Canvas initialization options
      const canvasOptions: CanvasInitializationOptions = {
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: false, // Optimize by manually calling renderAll
        controlsAboveOverlay: true,
        centeredScaling: false,
        centeredRotation: false
      };
      
      // Create fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, canvasOptions);
      
      // Performance optimizations
      if (perfOptions.objectCaching) {
        canvas.enableRetinaScaling = Boolean(perfOptions.enableRetina);
        canvas.skipOffscreen = Boolean(perfOptions.skipOffscreen);
        
        // Set the maximum rendering scale to prevent performance issues with high-DPI devices
        if (perfOptions.maxRenderingScale) {
          const maxScale = perfOptions.maxRenderingScale;
          const currentScale = canvas.getRetinaScaling();
          if (currentScale > maxScale) {
            canvas.setZoom(maxScale / currentScale);
          }
        }
      }
      
      // Set canvas zoom and pan from config
      if (config.zoom !== 1) {
        canvas.setZoom(config.zoom);
      }
      
      if (config.panOffset.x !== 0 || config.panOffset.y !== 0) {
        canvas.absolutePan(new fabric.Point(
          config.panOffset.x,
          config.panOffset.y
        ));
      }
      
      // Add grid if enabled
      if (config.showGrid) {
        updateGridOnCanvas(
          canvas, 
          {
            visible: config.showGrid,
            size: config.gridSize,
            snapToGrid: config.snapToGrid,
            type: config.gridType,
            columns: 12,
            gutterWidth: 20,
            marginWidth: 40,
            snapThreshold: config.snapTolerance,
            showGuides: config.showSmartGuides,
            guideColor: 'rgba(0, 120, 255, 0.75)',
            showRulers: true,
            rulerSize: 20
          }, 
          config.width, 
          config.height
        );
      }
      
      // Set up event handlers
      canvas.on('selection:created', (e) => {
        if (onObjectsSelected && e.selected) {
          onObjectsSelected(e.selected);
        }
      });
      
      canvas.on('selection:updated', (e) => {
        if (onObjectsSelected && e.selected) {
          onObjectsSelected(e.selected);
        }
      });
      
      canvas.on('selection:cleared', () => {
        if (onObjectsSelected) {
          onObjectsSelected([]);
        }
      });
      
      canvas.on('object:modified', (e) => {
        if (onObjectModified && e.target) {
          onObjectModified(e.target);
        }
      });

      // Batch rendering optimization
      const originalRequestRenderAll = canvas.requestRenderAll.bind(canvas);
      let renderRequested = false;
      
      canvas.requestRenderAll = function() {
        if (!renderRequested) {
          renderRequested = true;
          requestAnimationFrame(() => {
            if (renderRequested) {
              originalRequestRenderAll();
              renderRequested = false;
            }
          });
        }
      };
      
      setFabricCanvas(canvas);
      setIsLoading(false);
      setError(null);
      
      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return () => {
        // Clean up event handlers
        canvas.off();
        
        // Dispose canvas
        canvas.dispose();
        setFabricCanvas(null);
      };
    } catch (err) {
      console.error('Error initializing canvas:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize canvas'));
      setIsLoading(false);
    }
  }, [
    canvasRef, 
    config.width, config.height, config.backgroundColor, config.zoom, 
    config.panOffset.x, config.panOffset.y, config.showGrid, config.snapToGrid, 
    config.gridSize, config.gridType, config.showSmartGuides, config.snapTolerance,
    onObjectsSelected, onObjectModified, onCanvasReady, performanceOptions
  ]);

  return { fabricCanvas, isLoading, error };
}
