
import { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function useFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  // Define the initializeFabric function
  const initializeFabric = (canvasElement?: HTMLCanvasElement) => {
    const canvasEl = canvasElement || canvasRef.current;
    if (!canvasEl) return null;
    
    // Create new canvas instance
    const canvas = new fabric.Canvas(canvasEl, {
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

    setFabricCanvas(canvas);
    return canvas;
  };

  useEffect(() => {
    // Initialize Fabric canvas
    const canvas = initializeFabric();
    
    // Cleanup on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, []);

  // Add object to canvas
  const addObject = (obj: fabric.Object) => {
    if (!fabricCanvas) return;
    fabricCanvas.add(obj);
    fabricCanvas.renderAll();
  };

  // Remove object from canvas
  const removeObject = (obj: fabric.Object) => {
    if (!fabricCanvas) return;
    fabricCanvas.remove(obj);
    fabricCanvas.renderAll();
  };

  // Clear all objects from canvas
  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
  };

  // Save canvas as JSON
  const saveCanvasAsJSON = () => {
    if (!fabricCanvas) return null;
    return fabricCanvas.toJSON();
  };

  // Load canvas from JSON
  const loadCanvasFromJSON = (json: any) => {
    if (!fabricCanvas) return;
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
    });
  };

  return {
    canvasRef,
    fabricCanvas,
    selectedObject,
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    // Also expose these for WireframeCanvasEngine
    canvas: fabricCanvas,
    initializeFabric
  };
}

export default useFabric;
