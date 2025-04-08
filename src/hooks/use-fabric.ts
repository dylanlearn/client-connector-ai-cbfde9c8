
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface UseFabricOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onObjectSelected?: (obj: fabric.Object | null) => void;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
}

export function useFabric({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onObjectSelected,
  onCanvasReady
}: UseFabricOptions = {}) {
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasElRef.current) return;
    
    // Clean up any existing canvas
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }
    
    // Create new fabric canvas
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width,
      height,
      backgroundColor,
      preserveObjectStacking: true,
      selection: true,
      renderOnAddRemove: true
    });
    
    fabricRef.current = canvas;
    
    // Set up selection events
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected ? e.selected[0] : null);
      if (onObjectSelected) {
        onObjectSelected(e.selected ? e.selected[0] : null);
      }
    });
    
    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected ? e.selected[0] : null);
      if (onObjectSelected) {
        onObjectSelected(e.selected ? e.selected[0] : null);
      }
    });
    
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      if (onObjectSelected) {
        onObjectSelected(null);
      }
    });

    // Call onCanvasReady if provided
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
    
    return () => {
      canvas.dispose();
    };
  }, [width, height, backgroundColor, onObjectSelected, onCanvasReady]);

  // Method to add objects to canvas
  const addObject = (obj: fabric.Object) => {
    if (!fabricRef.current) return;
    fabricRef.current.add(obj);
    fabricRef.current.renderAll();
  };

  // Method to remove objects from canvas
  const removeObject = (obj: fabric.Object) => {
    if (!fabricRef.current) return;
    fabricRef.current.remove(obj);
    fabricRef.current.renderAll();
  };

  // Method to clear canvas
  const clearCanvas = () => {
    if (!fabricRef.current) return;
    fabricRef.current.clear();
    fabricRef.current.setBackgroundColor(backgroundColor, () => {
      fabricRef.current?.renderAll();
    });
  };

  // Method to save canvas as JSON
  const saveCanvasAsJSON = () => {
    if (!fabricRef.current) return null;
    return fabricRef.current.toJSON();
  };

  // Method to load canvas from JSON
  const loadCanvasFromJSON = (json: any) => {
    if (!fabricRef.current) return;
    fabricRef.current.loadFromJSON(json, () => {
      fabricRef.current?.renderAll();
    });
  };

  return {
    canvasRef: canvasElRef,
    fabricCanvas: fabricRef.current,
    selectedObject,
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON
  };
}

export default useFabric;
