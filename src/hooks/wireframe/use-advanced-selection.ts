
import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { SelectionConfig } from '@/components/wireframe/utils/types';

export interface UseAdvancedSelectionProps {
  canvas: fabric.Canvas | null;
  config?: Partial<SelectionConfig>;
  onSelectionChange?: (selectedObjects: fabric.Object[]) => void;
}

const DEFAULT_SELECTION_CONFIG: SelectionConfig = {
  mode: 'multiple',
  allowDeselect: true,
  selectionKey: 'shift',
  dragSelectionKey: 'shift',
  keyboardMovementStep: 1,
  objectSelectionPriority: 'front-to-back',
  style: {
    borderColor: '#2196F3',
    cornerColor: '#2196F3',
    cornerStyle: 'circle',
    cornerSize: 8,
    transparentCorners: false,
    cornerStrokeColor: '#ffffff',
    selectionBackgroundColor: 'rgba(33, 150, 243, 0.1)',
  }
};

export function useAdvancedSelection({
  canvas,
  config = {},
  onSelectionChange,
}: UseAdvancedSelectionProps) {
  const { toast } = useToast();
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);
  const selectionConfig = useRef<SelectionConfig>({ ...DEFAULT_SELECTION_CONFIG, ...config });
  const keysDown = useRef<Set<string>>(new Set());
  
  // Update the selection style
  const updateSelectionStyle = useCallback(() => {
    if (!canvas) return;
    
    const style = selectionConfig.current.style;
    fabric.Object.prototype.set({
      borderColor: style.borderColor,
      cornerColor: style.cornerColor,
      cornerStyle: style.cornerStyle,
      cornerSize: style.cornerSize,
      transparentCorners: style.transparentCorners,
      cornerStrokeColor: style.cornerStrokeColor,
    });
    
    canvas.selectionColor = style.selectionBackgroundColor;
    canvas.selectionBorderColor = style.borderColor;
    canvas.selectionLineWidth = 1;
    canvas.renderAll();
  }, [canvas]);
  
  // Initialize the selection style when the canvas is ready
  useEffect(() => {
    if (!canvas) return;
    
    updateSelectionStyle();
  }, [canvas, updateSelectionStyle]);
  
  // Update the config when it changes
  useEffect(() => {
    selectionConfig.current = { ...DEFAULT_SELECTION_CONFIG, ...config };
    updateSelectionStyle();
  }, [config, updateSelectionStyle]);
  
  // Handle selection events
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (e.selected) {
        setSelectedObjects(e.selected);
        if (onSelectionChange) {
          onSelectionChange(e.selected);
        }
      }
    };
    
    const handleSelectionUpdated = (e: fabric.IEvent) => {
      if (e.selected) {
        setSelectedObjects(e.selected);
        if (onSelectionChange) {
          onSelectionChange(e.selected);
        }
      }
    };
    
    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, onSelectionChange]);
  
  // Handle keyboard events for multi-selection and movement
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Store the key that was pressed
      keysDown.current.add(e.key.toLowerCase());
      
      // Check for multi-selection key
      const isSelectionKey = e.key.toLowerCase() === selectionConfig.current.selectionKey.toLowerCase() ||
                            (e.key === 'Control' && selectionConfig.current.selectionKey === 'ctrl') ||
                            (e.key === 'Alt' && selectionConfig.current.selectionKey === 'alt');
      
      if (isSelectionKey) {
        setIsMultiSelecting(true);
      }
      
      // Handle arrow keys for movement
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedObjects.length > 0) {
        e.preventDefault(); // Prevent page scrolling
        
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        
        const step = keysDown.current.has('shift') 
          ? selectionConfig.current.keyboardMovementStep * 10 
          : selectionConfig.current.keyboardMovementStep;
        
        switch (e.key) {
          case 'ArrowUp':
            activeObject.top! -= step;
            break;
          case 'ArrowDown':
            activeObject.top! += step;
            break;
          case 'ArrowLeft':
            activeObject.left! -= step;
            break;
          case 'ArrowRight':
            activeObject.left! += step;
            break;
        }
        
        activeObject.setCoords();
        canvas.renderAll();
        canvas.trigger('object:modified', { target: activeObject });
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current.delete(e.key.toLowerCase());
      
      // Check if multi-selection key was released
      const isSelectionKey = e.key.toLowerCase() === selectionConfig.current.selectionKey.toLowerCase() ||
                            (e.key === 'Control' && selectionConfig.current.selectionKey === 'ctrl') ||
                            (e.key === 'Alt' && selectionConfig.current.selectionKey === 'alt');
      
      if (isSelectionKey) {
        setIsMultiSelecting(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas, selectedObjects, selectionConfig]);
  
  // Setup intelligent object selection for overlapping objects
  useEffect(() => {
    if (!canvas) return;
    
    // Override the findTarget method to implement custom selection priority
    const originalFindTarget = canvas.findTarget;
    
    canvas.findTarget = function(e: Event, skipGroup: boolean) {
      // Call the original method to get all potential targets
      const target = originalFindTarget.call(canvas, e, skipGroup);
      
      // If no target or not in front-to-back mode, just return the result
      if (!target || selectionConfig.current.objectSelectionPriority !== 'front-to-back') {
        return target;
      }
      
      // If we're using front-to-back priority, get all objects at the point
      const pointer = canvas.getPointer(e as MouseEvent);
      const objects = canvas.getObjects().filter(obj => {
        return obj.visible && obj.evented && obj.containsPoint(pointer);
      });
      
      if (objects.length <= 1) {
        return target;
      }
      
      // Find which object index we're currently selecting
      const targetIndex = objects.indexOf(target as fabric.Object);
      
      // If we're holding the selection key, cycle to the next object
      if (keysDown.current.has(selectionConfig.current.selectionKey) && targetIndex >= 0) {
        // Get the next object in the stack (or wrap around to the beginning)
        const nextIndex = (targetIndex + 1) % objects.length;
        return objects[nextIndex];
      }
      
      return target;
    };
    
    return () => {
      // Restore the original findTarget method when cleaning up
      canvas.findTarget = originalFindTarget;
    };
  }, [canvas]);

  // Methods for programmatic selection handling
  const selectObjectById = useCallback((id: string) => {
    if (!canvas) return false;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === id);
    
    if (targetObject) {
      if (isMultiSelecting) {
        // Add to existing selection
        const currentSelection = canvas.getActiveObjects();
        const newSelection = [...currentSelection, targetObject];
        
        const activeSelection = new fabric.ActiveSelection(newSelection, { canvas });
        canvas.setActiveObject(activeSelection);
      } else {
        // Single selection
        canvas.setActiveObject(targetObject);
      }
      
      canvas.requestRenderAll();
      return true;
    }
    
    return false;
  }, [canvas, isMultiSelecting]);
  
  // Select multiple objects
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
      return true;
    }
    
    return false;
  }, [canvas]);
  
  // Clear selection
  const clearSelection = useCallback(() => {
    if (!canvas) return;
    
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Group selected objects
  const groupSelectedObjects = useCallback(() => {
    if (!canvas || selectedObjects.length < 2) return;
    
    const group = new fabric.Group(selectedObjects);
    canvas.remove(...selectedObjects);
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    
    toast({
      title: "Objects Grouped",
      description: `${selectedObjects.length} objects have been grouped together.`,
    });
  }, [canvas, selectedObjects, toast]);
  
  // Ungroup selected group
  const ungroupSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || !(activeObject as fabric.Group).toGroup) {
      return;
    }
    
    const group = activeObject as fabric.Group;
    const items = group.getObjects();
    
    // Convert the group coords to absolute for all objects
    const groupLeft = group.left || 0;
    const groupTop = group.top || 0;
    
    // Ungroup and spread the items
    group.destroy();
    canvas.remove(group);
    
    items.forEach(item => {
      // Adjust to absolute position
      item.set({
        left: groupLeft + (item.left || 0),
        top: groupTop + (item.top || 0)
      });
      item.setCoords();
      canvas.add(item);
    });
    
    // Select all the ungrouped objects
    const ungroupedSelection = new fabric.ActiveSelection(items, { canvas });
    canvas.setActiveObject(ungroupedSelection);
    canvas.requestRenderAll();
    
    toast({
      title: "Group Ungrouped",
      description: `Group has been ungrouped into ${items.length} individual objects.`,
    });
  }, [canvas, toast]);
  
  // Copy selected objects
  const duplicateSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    // Clone objects
    activeObject.clone((clonedObj: fabric.Object) => {
      canvas.discardActiveObject();
      
      // If it's a collection of objects, handle each one
      if (clonedObj.type === 'activeSelection') {
        const activeSelection = clonedObj as fabric.ActiveSelection;
        // Access the _objects property for grouped items
        const objects = (activeSelection as any)._objects;
        
        const clonedObjects: fabric.Object[] = [];
        
        objects.forEach((obj: fabric.Object) => {
          const clonedObject = fabric.util.object.clone(obj);
          clonedObject.set({
            left: (obj.left || 0) + 20,
            top: (obj.top || 0) + 20,
            evented: true,
          });
          canvas.add(clonedObject);
          clonedObjects.push(clonedObject);
        });
        
        // Select all the cloned objects
        if (clonedObjects.length > 0) {
          const sel = new fabric.ActiveSelection(clonedObjects, { canvas });
          canvas.setActiveObject(sel);
        }
      } else {
        // Handle a single object
        clonedObj.set({
          left: (clonedObj.left || 0) + 20,
          top: (clonedObj.top || 0) + 20,
          evented: true,
        });
        canvas.add(clonedObj);
        canvas.setActiveObject(clonedObj);
      }
      
      canvas.requestRenderAll();
      
      toast({
        title: "Objects Duplicated",
        description: "Objects have been duplicated and offset.",
      });
    });
  }, [canvas, toast]);
  
  return {
    selectedObjects,
    isMultiSelecting,
    selectionConfig: selectionConfig.current,
    // Selection methods
    selectObjectById,
    selectMultipleObjectsById,
    clearSelection,
    groupSelectedObjects,
    ungroupSelectedObjects,
    duplicateSelectedObjects,
    // Update config
    updateSelectionStyle
  };
}
