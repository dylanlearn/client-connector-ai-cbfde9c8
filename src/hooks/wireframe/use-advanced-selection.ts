
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { SelectionConfig } from '@/components/wireframe/utils/types';

/**
 * Hook to manage advanced selection functionality
 */
export function useAdvancedSelection(canvas: fabric.Canvas | null) {
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
  
  // Apply selection styling
  useEffect(() => {
    if (!canvas) return;
    
    // Apply default selection styling
    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: '#2196f3',
      cornerColor: '#2196f3',
      cornerStyle: 'circle',
      cornerSize: 10,
      padding: 5,
      cornerStrokeColor: '#ffffff'
    });
    
    canvas.selectionColor = 'rgba(33, 150, 243, 0.1)';
    canvas.selectionBorderColor = '#2196f3';
    canvas.selectionLineWidth = 1;
    
    canvas.renderAll();
  }, [canvas]);
  
  // Apply selection configuration
  const applySelectionConfig = useCallback((config: SelectionConfig) => {
    if (!canvas) return;
    
    // Apply selection styling
    fabric.Object.prototype.set({
      transparentCorners: config.style.transparentCorners,
      borderColor: config.style.borderColor,
      cornerColor: config.style.cornerColor,
      cornerStyle: config.style.cornerStyle,
      cornerSize: config.style.cornerSize,
      cornerStrokeColor: config.style.cornerStrokeColor
    });
    
    canvas.selectionColor = config.style.selectionBackgroundColor || 'rgba(33, 150, 243, 0.1)';
    canvas.selectionBorderColor = config.style.borderColor;
    
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
    clearSelection,
    applySelectionConfig
  };
}

export default useAdvancedSelection;
