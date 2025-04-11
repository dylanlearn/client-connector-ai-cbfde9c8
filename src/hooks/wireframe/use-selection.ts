
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to manage selection of components on a fabric canvas
 */
export function useSelection(canvas: fabric.Canvas | null) {
  const { toast } = useToast();
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  
  // Set up selection event handlers
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (e.selected) {
        setSelectedObjects(e.selected);
        setSelectedObject(e.selected[0]);
      }
    };
    
    const handleSelectionUpdated = (e: fabric.IEvent) => {
      if (e.selected) {
        setSelectedObjects(e.selected);
        setSelectedObject(e.selected[0]);
      }
    };
    
    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      setSelectedObject(null);
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas]);
  
  // Update selection appearance
  useEffect(() => {
    if (!canvas) return;
    
    // Customize selection style
    canvas.selectionColor = 'rgba(59, 130, 246, 0.1)';
    canvas.selectionBorderColor = '#3b82f6';
    canvas.selectionLineWidth = 1;
    
    // Corner customization
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#3b82f6',
      cornerStrokeColor: '#ffffff',
      borderColor: '#3b82f6',
      cornerSize: 8,
      padding: 8,
      cornerStyle: 'circle'
    });
    
    canvas.renderAll();
  }, [canvas]);
  
  // Select object by ID
  const selectObjectById = useCallback((id: string) => {
    if (!canvas) return false;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === id);
    
    if (targetObject) {
      canvas.setActiveObject(targetObject);
      canvas.renderAll();
      setSelectedObject(targetObject);
      setSelectedObjects([targetObject]);
      return true;
    }
    
    return false;
  }, [canvas]);
  
  // Select multiple objects by IDs
  const selectMultipleObjectsById = useCallback((ids: string[]) => {
    if (!canvas || ids.length === 0) return false;
    
    const objects = canvas.getObjects();
    const targetObjects = objects.filter(obj => obj.data?.id && ids.includes(obj.data.id));
    
    if (targetObjects.length > 0) {
      if (targetObjects.length === 1) {
        canvas.setActiveObject(targetObjects[0]);
      } else {
        const selection = new fabric.ActiveSelection(targetObjects, { canvas });
        canvas.setActiveObject(selection);
      }
      
      canvas.requestRenderAll();
      setSelectedObjects(targetObjects);
      setSelectedObject(targetObjects[0]);
      return true;
    }
    
    return false;
  }, [canvas]);
  
  // Clear selection
  const clearSelection = useCallback(() => {
    if (!canvas) return;
    
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
    setSelectedObjects([]);
  }, [canvas]);
  
  return {
    selectedObject,
    selectedObjects,
    selectObjectById,
    selectMultipleObjectsById,
    clearSelection
  };
}
