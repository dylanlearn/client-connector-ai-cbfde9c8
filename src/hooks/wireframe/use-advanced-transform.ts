
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

export interface TransformationValues {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
}

export interface UseAdvancedTransformOptions {
  canvas: fabric.Canvas | null;
  showToasts?: boolean;
}

export function useAdvancedTransform({
  canvas,
  showToasts = true
}: UseAdvancedTransformOptions) {
  const { toast } = useToast();
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [transformValues, setTransformValues] = useState<TransformationValues>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    skewX: 0,
    skewY: 0,
    flipX: false,
    flipY: false
  });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(false);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1);
  
  // Update selected objects when canvas selection changes
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (e.selected) {
        setSelectedObjects(e.selected);
        updateTransformValues(e.selected);
      }
    };
    
    const handleSelectionUpdated = (e: fabric.IEvent) => {
      if (e.selected) {
        setSelectedObjects(e.selected);
        updateTransformValues(e.selected);
      }
    };
    
    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      resetTransformValues();
    };
    
    const handleObjectModified = (e: fabric.IEvent) => {
      if (canvas.getActiveObject()) {
        updateTransformValues(canvas.getActiveObjects());
      }
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas]);
  
  // Update transform values based on selected objects
  const updateTransformValues = useCallback((objects: fabric.Object[]) => {
    if (objects.length === 0) {
      resetTransformValues();
      return;
    }
    
    if (objects.length === 1) {
      // Single object
      const obj = objects[0];
      
      // Calculate dimensions
      let width, height;
      if (obj.type === 'activeSelection' || obj.type === 'group') {
        const bound = obj.getBoundingRect();
        width = bound.width / obj.scaleX!;
        height = bound.height / obj.scaleY!;
      } else {
        width = obj.width! * obj.scaleX!;
        height = obj.height! * obj.scaleY!;
      }
      
      const newValues: TransformationValues = {
        x: Math.round(obj.left! * 10) / 10,
        y: Math.round(obj.top! * 10) / 10,
        width: Math.round(width * 10) / 10,
        height: Math.round(height * 10) / 10,
        rotation: Math.round(obj.angle! * 10) / 10,
        skewX: Math.round(obj.skewX! * 10) / 10 || 0,
        skewY: Math.round(obj.skewY! * 10) / 10 || 0,
        flipX: obj.flipX || false,
        flipY: obj.flipY || false
      };
      
      setTransformValues(newValues);
      setOriginalAspectRatio(width / height);
    } else {
      // Multiple objects (use active selection or calculate bounds)
      const activeObj = canvas?.getActiveObject();
      
      if (activeObj && (activeObj.type === 'activeSelection' || activeObj.type === 'group')) {
        const bound = activeObj.getBoundingRect();
        
        const newValues: TransformationValues = {
          x: Math.round(activeObj.left! * 10) / 10,
          y: Math.round(activeObj.top! * 10) / 10,
          width: Math.round(bound.width * 10) / 10,
          height: Math.round(bound.height * 10) / 10,
          rotation: Math.round(activeObj.angle! * 10) / 10,
          skewX: 0,
          skewY: 0,
          flipX: false,
          flipY: false
        };
        
        setTransformValues(newValues);
        setOriginalAspectRatio(bound.width / bound.height);
      } else {
        // Calculate bounds of all objects
        const bounds = objects.map(o => o.getBoundingRect());
        const minX = Math.min(...bounds.map(b => b.left));
        const minY = Math.min(...bounds.map(b => b.top));
        const maxX = Math.max(...bounds.map(b => b.left + b.width));
        const maxY = Math.max(...bounds.map(b => b.top + b.height));
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        const newValues: TransformationValues = {
          x: Math.round(minX * 10) / 10,
          y: Math.round(minY * 10) / 10,
          width: Math.round(width * 10) / 10,
          height: Math.round(height * 10) / 10,
          rotation: 0,
          skewX: 0,
          skewY: 0,
          flipX: false,
          flipY: false
        };
        
        setTransformValues(newValues);
        setOriginalAspectRatio(width / height);
      }
    }
  }, [canvas]);
  
  // Reset transform values
  const resetTransformValues = useCallback(() => {
    setTransformValues({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotation: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false
    });
  }, []);
  
  // Apply transformation values to selected objects
  const applyTransformation = useCallback((values: Partial<TransformationValues>) => {
    if (!canvas || selectedObjects.length === 0) return;
    
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    
    const updatedValues = { ...transformValues, ...values };
    
    canvas.discardActiveObject();
    
    if (selectedObjects.length === 1) {
      // Single object
      const obj = selectedObjects[0];
      
      // Calculate scale from width/height if provided
      let scaleX = obj.scaleX;
      let scaleY = obj.scaleY;
      
      if (values.width !== undefined && obj.width) {
        scaleX = values.width / obj.width;
      }
      
      if (values.height !== undefined && obj.height) {
        scaleY = values.height / obj.height;
      }
      
      // Apply transformations
      obj.set({
        left: values.x !== undefined ? values.x : obj.left,
        top: values.y !== undefined ? values.y : obj.top,
        scaleX: scaleX,
        scaleY: scaleY,
        angle: values.rotation !== undefined ? values.rotation : obj.angle,
        skewX: values.skewX !== undefined ? values.skewX : obj.skewX,
        skewY: values.skewY !== undefined ? values.skewY : obj.skewY,
        flipX: values.flipX !== undefined ? values.flipX : obj.flipX,
        flipY: values.flipY !== undefined ? values.flipY : obj.flipY
      });
      
      obj.setCoords();
      canvas.setActiveObject(obj);
    } else {
      // Multiple objects
      const selection = new fabric.ActiveSelection(selectedObjects, { canvas });
      
      // Calculate scale factors for the group
      let scaleX = selection.scaleX;
      let scaleY = selection.scaleY;
      
      if (values.width !== undefined && selection.width) {
        scaleX = values.width / selection.width;
      }
      
      if (values.height !== undefined && selection.height) {
        scaleY = values.height / selection.height;
      }
      
      // Apply transformations to the selection
      selection.set({
        left: values.x !== undefined ? values.x : selection.left,
        top: values.y !== undefined ? values.y : selection.top,
        scaleX: scaleX,
        scaleY: scaleY,
        angle: values.rotation !== undefined ? values.rotation : selection.angle
      });
      
      selection.setCoords();
      canvas.setActiveObject(selection);
    }
    
    canvas.requestRenderAll();
    setTransformValues(updatedValues);
  }, [canvas, selectedObjects, transformValues]);
  
  // Flip objects
  const flipObjects = useCallback((axis: 'horizontal' | 'vertical') => {
    if (!canvas || selectedObjects.length === 0) return;
    
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    
    if (axis === 'horizontal') {
      activeObj.set({ flipX: !activeObj.flipX });
      setTransformValues(prev => ({ ...prev, flipX: !prev.flipX }));
    } else {
      activeObj.set({ flipY: !activeObj.flipY });
      setTransformValues(prev => ({ ...prev, flipY: !prev.flipY }));
    }
    
    activeObj.setCoords();
    canvas.requestRenderAll();
    
    if (showToasts) {
      toast({ 
        title: `Objects Flipped`,
        description: `Objects have been flipped ${axis === 'horizontal' ? 'horizontally' : 'vertically'}`
      });
    }
  }, [canvas, selectedObjects, toast, showToasts]);
  
  // Reset transformations
  const resetTransformations = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    
    activeObj.set({
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false
    });
    
    activeObj.setCoords();
    canvas.requestRenderAll();
    updateTransformValues(selectedObjects);
    
    if (showToasts) {
      toast({ 
        title: "Transformations Reset",
        description: "All transformations have been reset to default values"
      });
    }
  }, [canvas, selectedObjects, updateTransformValues, toast, showToasts]);
  
  // Toggle aspect ratio preservation
  const toggleAspectRatio = useCallback((maintain: boolean) => {
    setMaintainAspectRatio(maintain);
    
    if (showToasts) {
      toast({ 
        title: maintain ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked",
        description: maintain 
          ? "Width and height will scale proportionally" 
          : "Width and height can be adjusted independently"
      });
    }
  }, [toast, showToasts]);
  
  return {
    selectedObjects,
    transformValues,
    maintainAspectRatio,
    originalAspectRatio,
    applyTransformation,
    flipObjects,
    resetTransformations,
    toggleAspectRatio
  };
}
