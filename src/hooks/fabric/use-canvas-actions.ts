
import { fabric } from 'fabric';
import { useCallback } from 'react';
import { WireframeCanvasConfig } from '@/types/wireframe';

export function useCanvasActions(
  fabricCanvas: fabric.Canvas | null, 
  updateConfig: (config: Partial<WireframeCanvasConfig>) => void,
  canvasConfig: WireframeCanvasConfig
) {
  // Methods for canvas manipulation
  const addObject = useCallback((obj: fabric.Object) => {
    if (!fabricCanvas) return;
    fabricCanvas.add(obj);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const removeObject = useCallback((obj: fabric.Object) => {
    if (!fabricCanvas) return;
    fabricCanvas.remove(obj);
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
  }, [fabricCanvas]);

  const saveCanvasAsJSON = useCallback(() => {
    if (!fabricCanvas) return null;
    return fabricCanvas.toJSON();
  }, [fabricCanvas]);

  const loadCanvasFromJSON = useCallback((json: any) => {
    if (!fabricCanvas) return;
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
    });
  }, [fabricCanvas]);
  
  // Methods for zoom and pan
  const zoomIn = useCallback(() => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.min(3, canvasConfig.zoom + 0.1);
    fabricCanvas.setZoom(newZoom);
    
    updateConfig({ zoom: newZoom });
  }, [fabricCanvas, canvasConfig.zoom, updateConfig]);
  
  const zoomOut = useCallback(() => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.max(0.1, canvasConfig.zoom - 0.1);
    fabricCanvas.setZoom(newZoom);
    
    updateConfig({ zoom: newZoom });
  }, [fabricCanvas, canvasConfig.zoom, updateConfig]);
  
  const resetZoom = useCallback(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.setZoom(1);
    fabricCanvas.absolutePan(new fabric.Point(0, 0));
    
    updateConfig({ zoom: 1, panOffset: { x: 0, y: 0 } });
  }, [fabricCanvas, updateConfig]);
  
  const pan = useCallback((x: number, y: number) => {
    if (!fabricCanvas) return;
    
    fabricCanvas.relativePan(new fabric.Point(x, y));
    
    const viewportTransform = fabricCanvas.viewportTransform;
    if (viewportTransform) {
      updateConfig({
        panOffset: { x: viewportTransform[4], y: viewportTransform[5] }
      });
    }
  }, [fabricCanvas, updateConfig]);
  
  return {
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    zoomIn,
    zoomOut,
    resetZoom,
    pan
  };
}
