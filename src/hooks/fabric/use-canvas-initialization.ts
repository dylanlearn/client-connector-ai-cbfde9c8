
import { fabric } from 'fabric';
import { useCallback } from 'react';
import { WireframeCanvasConfig } from '@/types/wireframe';

export function useCanvasInitialization(
  canvasConfig: WireframeCanvasConfig, 
  setSelectedObject: (obj: fabric.Object | null) => void, 
  setIsDrawing: (isDrawing: boolean) => void,
  isDrawing: boolean
) {
  // Initialize Fabric canvas
  const initializeFabric = useCallback((canvasElement?: HTMLCanvasElement) => {
    if (!canvasElement) return null;
    
    // Create new canvas instance
    const canvas = new fabric.Canvas(canvasElement, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true
    });

    // Set up event handlers
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    canvas.on('mouse:down', () => {
      if (canvas.isDrawingMode) {
        setIsDrawing(true);
      }
    });
    
    canvas.on('mouse:up', () => {
      if (isDrawing) {
        setIsDrawing(false);
      }
    });
    
    // Apply saved canvas configuration
    if (canvasConfig.zoom !== 1) {
      canvas.setZoom(canvasConfig.zoom);
    }
    
    if (canvasConfig.panOffset.x !== 0 || canvasConfig.panOffset.y !== 0) {
      canvas.absolutePan(new fabric.Point(canvasConfig.panOffset.x, canvasConfig.panOffset.y));
    }
    
    // Set snap to grid if enabled
    if (canvasConfig.snapToGrid) {
      canvas.on('object:moving', (options) => {
        if (options.target) {
          const target = options.target;
          const gridSize = canvasConfig.gridSize;
          
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    }

    return canvas;
  }, [canvasConfig, isDrawing, setIsDrawing, setSelectedObject]);

  return { initializeFabric };
}
