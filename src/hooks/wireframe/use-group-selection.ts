
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';

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
      
      // Create a new group from the previously selected objects
      const groupOptions = {
        originX: 'center',
        originY: 'center',
        data: {
          type: 'group',
          id: `group-${Date.now()}`
        }
      };
      
      const group = new fabric.Group(selectedObjects, groupOptions);
      
      // Remove the original objects
      selectedObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Add the group
      canvas.add(group);
      canvas.setActiveObject(group);
      
      // Update state
      setActiveGroup(group);
      setSelectedObjects([]);
      
      // Notify
      if (onGroupCreate) {
        onGroupCreate(group);
      }
      
      canvas.renderAll();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }, [canvas, selectedObjects, onGroupCreate]);
  
  // Ungroup (release) the active group
  const ungroup = useCallback(() => {
    if (!canvas || !activeGroup) return;
    
    try {
      // Get the group's position
      const groupLeft = activeGroup.left || 0;
      const groupTop = activeGroup.top || 0;
      const groupAngle = activeGroup.angle || 0;
      
      // Get all objects in the group
      const items = activeGroup.getObjects();
      
      // Remove the group
      canvas.remove(activeGroup);
      
      // Restore the original objects
      const newObjects: fabric.Object[] = [];
      
      items.forEach(item => {
        // Apply the group's transformations to the item
        const newLeft = groupLeft + (item.left || 0);
        const newTop = groupTop + (item.top || 0);
        
        item.set({
          left: newLeft,
          top: newTop,
          angle: (item.angle || 0) + groupAngle,
        });
        
        // Make the item selectable again
        item.setCoords();
        canvas.add(item);
        newObjects.push(item);
      });
      
      // Select all the objects
      canvas.discardActiveObject();
      const selection = new fabric.ActiveSelection(newObjects, {
        canvas: canvas
      });
      canvas.setActiveObject(selection);
      
      // Update state
      setActiveGroup(null);
      setSelectedObjects(newObjects);
      
      // Notify
      if (onGroupRelease) {
        onGroupRelease(newObjects);
      }
      
      canvas.renderAll();
    } catch (error) {
      console.error('Error ungrouping objects:', error);
    }
  }, [canvas, activeGroup, onGroupRelease]);
  
  // Keyboard shortcut listeners
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Group: Ctrl/Cmd + G
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        createGroup();
      }
      
      // Ungroup: Ctrl/Cmd + Shift + G
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
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
