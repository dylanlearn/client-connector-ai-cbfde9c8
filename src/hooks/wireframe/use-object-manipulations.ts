
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

interface UseObjectManipulationsProps {
  canvas: fabric.Canvas | null;
  onHistorySave?: (label: string) => void;
}

export function useObjectManipulations({ canvas, onHistorySave }: UseObjectManipulationsProps) {
  const { toast } = useToast();

  // Duplicate objects
  const duplicate = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    // Clone the object
    activeObject.clone((cloned: fabric.Object) => {
      canvas.discardActiveObject();
      
      // If it's a selection of multiple objects
      if (cloned.type === 'activeSelection') {
        // Get the grouped objects from _objects property
        const activeSelection = cloned as unknown as { _objects: fabric.Object[] };
        const newObjects: fabric.Object[] = [];
        
        activeSelection._objects.forEach((obj: fabric.Object) => {
          // Clone each object in the group
          const duplicate = fabric.util.object.clone(obj);
          
          // Offset the position
          duplicate.set({
            left: (obj.left || 0) + 20,
            top: (obj.top || 0) + 20,
          });
          
          canvas.add(duplicate);
          newObjects.push(duplicate);
        });
        
        // Select all the duplicated objects
        if (newObjects.length > 0) {
          const selection = new fabric.ActiveSelection(newObjects, { canvas });
          canvas.setActiveObject(selection);
        }
      } else {
        // Single object duplication
        cloned.set({
          left: (activeObject.left || 0) + 20,
          top: (activeObject.top || 0) + 20,
        });
        
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
      }
      
      canvas.renderAll();
      
      if (onHistorySave) {
        onHistorySave('Duplicated objects');
      }
      
      toast({
        title: 'Objects Duplicated',
        description: 'Objects have been duplicated and offset slightly.',
      });
    });
  }, [canvas, toast, onHistorySave]);
  
  // Delete selected objects
  const remove = useCallback(() => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Deleted objects');
    }
    
    toast({
      title: 'Objects Deleted',
      description: `${activeObjects.length} object${activeObjects.length === 1 ? '' : 's'} deleted.`,
    });
  }, [canvas, toast, onHistorySave]);
  
  // Group selected objects
  const group = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'activeSelection') return;
    
    // Convert active selection to a group
    const group = (activeObject as fabric.ActiveSelection).toGroup();
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Grouped objects');
    }
    
    toast({
      title: 'Objects Grouped',
      description: 'Selected objects have been grouped together.',
    });
    
    return group;
  }, [canvas, toast, onHistorySave]);
  
  // Ungroup a grouped object
  const ungroup = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'group') return;
    
    // Convert group to active selection
    const items = (activeObject as fabric.Group).getObjects();
    (activeObject as fabric.Group).destroy();
    canvas.remove(activeObject);
    
    canvas.add(...items);
    
    const selection = new fabric.ActiveSelection(items, { canvas });
    canvas.setActiveObject(selection);
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Ungrouped objects');
    }
    
    toast({
      title: 'Group Ungrouped',
      description: 'Group has been split into individual objects.',
    });
    
    return items;
  }, [canvas, toast, onHistorySave]);
  
  // Toggle lock state of objects
  const toggleLock = useCallback(() => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    const allLocked = activeObjects.every(obj => 
      obj.lockMovementX && obj.lockMovementY && obj.lockRotation && obj.lockScalingX && obj.lockScalingY
    );
    
    // Toggle the lock state
    activeObjects.forEach(obj => {
      obj.set({
        lockMovementX: !allLocked,
        lockMovementY: !allLocked,
        lockRotation: !allLocked,
        lockScalingX: !allLocked,
        lockScalingY: !allLocked,
        hasControls: allLocked,
        selectable: allLocked,
        hoverCursor: allLocked ? 'move' : 'not-allowed',
      });
    });
    
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave(`${allLocked ? 'Unlocked' : 'Locked'} objects`);
    }
    
    toast({
      title: allLocked ? 'Objects Unlocked' : 'Objects Locked',
      description: allLocked 
        ? 'Objects can now be moved and edited.' 
        : 'Objects are now locked and cannot be modified.',
    });
    
    return !allLocked;
  }, [canvas, toast, onHistorySave]);
  
  // Bring selected objects forward
  const bringForward = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.bringForward(activeObject);
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Brought objects forward');
    }
  }, [canvas, onHistorySave]);
  
  // Send selected objects backward
  const sendBackward = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.sendBackwards(activeObject);
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Sent objects backward');
    }
  }, [canvas, onHistorySave]);
  
  // Bring selected objects to front (top)
  const bringToFront = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.bringToFront(activeObject);
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Brought objects to front');
    }
  }, [canvas, onHistorySave]);
  
  // Send selected objects to back (bottom)
  const sendToBack = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.sendToBack(activeObject);
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave('Sent objects to back');
    }
  }, [canvas, onHistorySave]);
  
  // Align objects horizontally or vertically
  const alignObjects = useCallback((alignType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'activeSelection' && activeObject.type !== 'group')) {
      return;
    }
    
    const selection = activeObject as fabric.ActiveSelection | fabric.Group;
    let targetValue: number;
    
    const objects = selection.type === 'activeSelection' 
      ? (selection as fabric.ActiveSelection).getObjects()
      : (selection as fabric.Group).getObjects();
    
    if (objects.length <= 1) return;
    
    switch (alignType) {
      case 'left':
        objects.forEach(obj => {
          obj.set({ left: 0 }).setCoords();
        });
        break;
        
      case 'center':
        objects.forEach(obj => {
          obj.set({ 
            left: (selection.width! / 2) - (obj.width! * obj.scaleX! / 2) 
          }).setCoords();
        });
        break;
        
      case 'right':
        objects.forEach(obj => {
          obj.set({ 
            left: selection.width! - obj.width! * obj.scaleX! 
          }).setCoords();
        });
        break;
        
      case 'top':
        objects.forEach(obj => {
          obj.set({ top: 0 }).setCoords();
        });
        break;
        
      case 'middle':
        objects.forEach(obj => {
          obj.set({ 
            top: (selection.height! / 2) - (obj.height! * obj.scaleY! / 2) 
          }).setCoords();
        });
        break;
        
      case 'bottom':
        objects.forEach(obj => {
          obj.set({ 
            top: selection.height! - obj.height! * obj.scaleY! 
          }).setCoords();
        });
        break;
    }
    
    if (selection.type === 'group') {
      selection.addWithUpdate();
    }
    
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave(`Aligned objects ${alignType}`);
    }
  }, [canvas, onHistorySave]);
  
  // Distribute objects evenly
  const distributeObjects = useCallback((direction: 'horizontal' | 'vertical') => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'activeSelection') {
      return;
    }
    
    const selection = activeObject as fabric.ActiveSelection;
    const objects = selection.getObjects();
    
    if (objects.length <= 2) return;
    
    // Get objects sorted by position
    const sortedObjects = [...objects];
    if (direction === 'horizontal') {
      sortedObjects.sort((a, b) => (a.left || 0) - (b.left || 0));
    } else {
      sortedObjects.sort((a, b) => (a.top || 0) - (b.top || 0));
    }
    
    // Get the first and last objects
    const firstObject = sortedObjects[0];
    const lastObject = sortedObjects[sortedObjects.length - 1];
    
    // Calculate bounds
    let totalSpace: number;
    let objectSizes: number = 0;
    
    if (direction === 'horizontal') {
      const minLeft = firstObject.left || 0;
      const maxRight = (lastObject.left || 0) + (lastObject.width || 0) * (lastObject.scaleX || 1);
      totalSpace = maxRight - minLeft;
      
      // Calculate total object widths
      sortedObjects.forEach(obj => {
        objectSizes += (obj.width || 0) * (obj.scaleX || 1);
      });
    } else {
      const minTop = firstObject.top || 0;
      const maxBottom = (lastObject.top || 0) + (lastObject.height || 0) * (lastObject.scaleY || 1);
      totalSpace = maxBottom - minTop;
      
      // Calculate total object heights
      sortedObjects.forEach(obj => {
        objectSizes += (obj.height || 0) * (obj.scaleY || 1);
      });
    }
    
    // Calculate spacing between objects
    const spacing = (totalSpace - objectSizes) / (objects.length - 1);
    
    // Distribute objects
    let currentPosition = direction === 'horizontal' 
      ? firstObject.left || 0
      : firstObject.top || 0;
    
    sortedObjects.forEach((obj, index) => {
      if (index === 0) return;
      
      if (direction === 'horizontal') {
        currentPosition += (sortedObjects[index-1].width || 0) * (sortedObjects[index-1].scaleX || 1) + spacing;
        obj.set({ left: currentPosition }).setCoords();
      } else {
        currentPosition += (sortedObjects[index-1].height || 0) * (sortedObjects[index-1].scaleY || 1) + spacing;
        obj.set({ top: currentPosition }).setCoords();
      }
    });
    
    canvas.renderAll();
    
    if (onHistorySave) {
      onHistorySave(`Distributed objects ${direction}`);
    }
  }, [canvas, onHistorySave]);

  return {
    duplicate,
    remove,
    group,
    ungroup,
    toggleLock,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    alignObjects,
    distributeObjects,
  };
}
