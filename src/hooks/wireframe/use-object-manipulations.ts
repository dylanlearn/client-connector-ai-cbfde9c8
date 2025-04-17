
import { useCallback } from 'react';
import { fabric } from 'fabric';

/**
 * Hook for common object manipulation operations
 */
export function useObjectManipulations(canvas: fabric.Canvas | null) {
  
  // Duplicate the selected objects
  const duplicateObjects = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    // Clone the objects and position them slightly offset
    const clones: fabric.Object[] = [];
    
    objects.forEach(obj => {
      obj.clone((clone: fabric.Object) => {
        clone.set({
          left: obj.left! + 20,
          top: obj.top! + 20,
          evented: true
        });
        
        if (clone.type === 'activeSelection') {
          // If this is an active selection, clear the group
          // and add the objects individually
          const activeSelection = clone as fabric.ActiveSelection;
          const items = activeSelection.getObjects();
          canvas.discardActiveObject();
          
          activeSelection.getObjects().forEach((item) => {
            item.set({
              left: item.left! + 20,
              top: item.top! + 20
            });
            canvas.add(item);
            clones.push(item);
          });
        } else {
          canvas.add(clone);
          clones.push(clone);
        }
      });
    });
    
    // Select the newly created clones
    if (clones.length > 0) {
      if (clones.length === 1) {
        canvas.setActiveObject(clones[0]);
      } else {
        const selection = new fabric.ActiveSelection(clones, { canvas });
        canvas.setActiveObject(selection);
      }
    }
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Delete the selected objects
  const deleteObjects = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    objects.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Group the selected objects
  const groupObjects = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length <= 1) return;
    
    const group = new fabric.Group(objects, {
      originX: 'center',
      originY: 'center'
    });
    
    objects.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Ungroup a group
  const ungroupObjects = useCallback((group: fabric.Group) => {
    if (!canvas) return;
    
    const items = group.getObjects();
    group._restoreObjectsState();
    
    canvas.remove(group);
    
    for (const item of items) {
      canvas.add(item);
    }
    
    canvas.setActiveObject(new fabric.ActiveSelection(items, { canvas }));
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Toggle the lock state of objects
  const toggleObjectLock = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    // Determine if we should lock or unlock based on the first object
    const firstObjLocked = objects[0].lockMovementX && objects[0].lockMovementY;
    const shouldLock = !firstObjLocked;
    
    objects.forEach(obj => {
      obj.set({
        lockMovementX: shouldLock,
        lockMovementY: shouldLock,
        lockRotation: shouldLock,
        lockScalingX: shouldLock,
        lockScalingY: shouldLock,
        hasControls: !shouldLock,
        selectable: !shouldLock
      });
    });
    
    // If we're locking, clear the selection
    if (shouldLock) {
      canvas.discardActiveObject();
    }
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Bring objects forward in z-index
  const bringForward = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    objects.forEach(obj => {
      canvas.bringForward(obj);
    });
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Send objects backward in z-index
  const sendBackward = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    objects.forEach(obj => {
      canvas.sendBackward(obj);
    });
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Bring objects to front in z-index
  const bringToFront = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    objects.forEach(obj => {
      canvas.bringToFront(obj);
    });
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Send objects to back in z-index
  const sendToBack = useCallback((objects: fabric.Object[]) => {
    if (!canvas || objects.length === 0) return;
    
    objects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Align objects (left, right, top, bottom, center)
  const alignObjects = useCallback((objects: fabric.Object[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!canvas || objects.length <= 1) return;
    
    let minX = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;
    
    // Find the bounding box of all objects
    objects.forEach(obj => {
      const bound = obj.getBoundingRect(true);
      minX = Math.min(minX, bound.left);
      maxX = Math.max(maxX, bound.left + bound.width);
      minY = Math.min(minY, bound.top);
      maxY = Math.max(maxY, bound.top + bound.height);
    });
    
    // Apply alignment
    objects.forEach(obj => {
      const bound = obj.getBoundingRect(true);
      
      switch (alignment) {
        case 'left':
          obj.set({ left: minX });
          break;
        case 'center':
          obj.set({ left: minX + (maxX - minX) / 2 - bound.width / 2 });
          break;
        case 'right':
          obj.set({ left: maxX - bound.width });
          break;
        case 'top':
          obj.set({ top: minY });
          break;
        case 'middle':
          obj.set({ top: minY + (maxY - minY) / 2 - bound.height / 2 });
          break;
        case 'bottom':
          obj.set({ top: maxY - bound.height });
          break;
      }
      
      obj.setCoords();
    });
    
    canvas.requestRenderAll();
  }, [canvas]);
  
  // Mock undo/redo for now (would require a proper history implementation)
  const undo = useCallback(() => {
    console.log('Undo operation (not yet implemented)');
  }, []);
  
  const redo = useCallback(() => {
    console.log('Redo operation (not yet implemented)');
  }, []);
  
  return {
    duplicateObjects,
    deleteObjects,
    groupObjects,
    ungroupObjects,
    toggleObjectLock,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    alignObjects,
    undo,
    redo
  };
}

export default useObjectManipulations;
