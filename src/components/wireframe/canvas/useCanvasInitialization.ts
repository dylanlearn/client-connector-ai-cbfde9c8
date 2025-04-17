
import { useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '../utils/types';
import { updateGridOnCanvas } from '../utils/grid-system';

export function useCanvasInitialization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: WireframeCanvasConfig,
  onObjectsSelected?: (objects: fabric.Object[]) => void,
  onObjectModified?: (object: fabric.Object) => void,
  onCanvasReady?: (canvas: fabric.Canvas) => void
) {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
        selection: true,
        preserveObjectStacking: true
      });
      
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
      
      setFabricCanvas(canvas);
      setIsLoading(false);
      
      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return () => {
        canvas.dispose();
        setFabricCanvas(null);
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      setIsLoading(false);
    }
  }, [
    canvasRef, 
    config.width, config.height, config.backgroundColor, config.zoom, 
    config.panOffset.x, config.panOffset.y, config.showGrid, config.snapToGrid, 
    config.gridSize, config.gridType, config.showSmartGuides,
    onObjectsSelected, onObjectModified, onCanvasReady
  ]);

  return { fabricCanvas, isLoading };
}
