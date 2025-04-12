import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

interface GroupSelectionOptions {
  canvas: fabric.Canvas | null;
  onGroupCreate?: (group: fabric.Group) => void;
  onGroupRelease?: (objects: fabric.Object[]) => void;
}

export function useGroupSelection({
  canvas, 
  onGroupCreate,
  onGroupRelease
}: GroupSelectionOptions) {
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [activeGroup, setActiveGroup] = useState<fabric.Group | null>(null);
  
  // Update selected objects when selection changes
  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (e.selected && e.selected.length > 1) {
        setSelectedObjects(e.selected);
      }
    };
    
    const handleSelectionUpdated = (e: fabric.IEvent) => {
      if (e.selected && e.selected.length > 1) {
        setSelectedObjects(e.selected);
      }
    };
    
    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      setActiveGroup(null);
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
  
  // Create a group from selected objects
  const createGroup = useCallback(() => {
    if (!canvas || selectedObjects.length < 2) return;
    
    try {
      // First, deselect all objects
      canvas.discardActiveObject();
      
      // Find the maximum zIndex from the selected objects
      const maxZIndex = Math.max(...selectedObjects.map(obj => obj.zIndex || 0));
      
      // Keep track of the original objects' positions and sizes for proper placement
      let minX = Math.min(...selectedObjects.map(obj => obj.left || 0));
      let minY = Math.min(...selectedObjects.map(obj => obj.top || 0));
      let maxX = Math.max(...selectedObjects.map(obj => (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1)));
      let maxY = Math.max(...selectedObjects.map(obj => (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1)));
      
      // Create a selection of all objects to group
      const selection = new fabric.ActiveSelection(selectedObjects, { canvas });
      
      // Create a new group from the selection
      const groupOptions = {
        originX: 'left',
        originY: 'top',
        left: minX,
        top: minY,
        width: maxX - minX,
        height: maxY - minY,
        zIndex: maxZIndex + 1, // Place the group above its children
        data: {
          type: 'group',
          id: `group-${uuidv4()}`,
          name: 'Group'
        }
      };
      
      // Convert the selection to a group
      const group = selection.toGroup(groupOptions);
      
      // Update state
      setActiveGroup(group);
      setSelectedObjects([]);
      
      // Update z-indices of all objects
      updateZIndicesAfterGrouping(canvas);
      
      // Notify
      if (onGroupCreate) {
        onGroupCreate(group);
      }
      
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }, [canvas, selectedObjects, onGroupCreate]);
  
  // Ungroup (release) the active group
  const ungroup = useCallback(() => {
    if (!canvas || !activeGroup) return;
    
    try {
      // Store the group's z-index and position
      const groupZIndex = activeGroup.zIndex || 0;
      const groupLeft = activeGroup.left || 0;
      const groupTop = activeGroup.top || 0;
      const groupAngle = activeGroup.angle || 0;
      const groupScaleX = activeGroup.scaleX || 1;
      const groupScaleY = activeGroup.scaleY || 1;
      
      // Get all objects in the group
      const items = activeGroup.getObjects();
      
      // Ungroup the items
      activeGroup.toActiveSelection();
      
      // Remove the group
      canvas.remove(activeGroup);
      
      // Process each released object
      const newObjects: fabric.Object[] = [];
      
      items.forEach((item, index) => {
        // Preserve the group's z-order for the items
        item.zIndex = groupZIndex + index;
        
        // Make sure each item has a unique ID
        if (!item.data) {
          item.data = { id: `object-${uuidv4()}` };
        } else if (!item.data.id) {
          item.data.id = `object-${uuidv4()}`;
        }
        
        newObjects.push(item);
      });
      
      // Update z-indices of all objects
      updateZIndicesAfterUngrouping(canvas);
      
      // Update state
      setActiveGroup(null);
      setSelectedObjects(newObjects);
      
      // Notify
      if (onGroupRelease) {
        onGroupRelease(newObjects);
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error ungrouping objects:', error);
    }
  }, [canvas, activeGroup, onGroupRelease]);
  
  // Utility function to update z-index values after grouping
  const updateZIndicesAfterGrouping = (canvas: fabric.Canvas) => {
    // Get all regular objects
    const regularObjects = canvas.getObjects().filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline
    );
    
    // Update z-index based on canvas stack order
    regularObjects.forEach((obj, index) => {
      obj.zIndex = index;
    });
  };
  
  // Utility function to update z-index values after ungrouping
  const updateZIndicesAfterUngrouping = (canvas: fabric.Canvas) => {
    // Get all regular objects
    const regularObjects = canvas.getObjects().filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline
    );
    
    // Update z-index based on canvas stack order
    regularObjects.forEach((obj, index) => {
      obj.zIndex = index;
    });
  };
  
  // Keyboard shortcut listeners for grouping operations
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Group: Ctrl/Cmd + G
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        e.preventDefault();
        createGroup();
      }
      
      // Ungroup: Ctrl/Cmd + Shift + G
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        ungroup();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, createGroup, ungroup]);
  
  return {
    selectedObjects,
    activeGroup,
    createGroup,
    ungroup,
    hasMultipleSelection: selectedObjects.length > 1,
    hasActiveGroup: activeGroup !== null,
  };
}

export default useGroupSelection;
