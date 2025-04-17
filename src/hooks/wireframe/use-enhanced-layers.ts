
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { LayerItem } from '@/components/wireframe/utils/layer-utils';
import { DropResult } from 'react-beautiful-dnd';

export interface UseEnhancedLayersOptions {
  canvas: fabric.Canvas | null;
  onChange?: (layers: LayerItem[]) => void;
  persistSelection?: boolean;
}

export function useEnhancedLayers({
  canvas,
  onChange,
  persistSelection = true
}: UseEnhancedLayersOptions) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  
  // Convert fabric objects to layer structure
  const updateLayersList = useCallback(() => {
    if (!canvas) return;
    
    // Get active objects for selection state
    const activeObjects = canvas.getActiveObjects();
    const selectedIds = activeObjects.map(obj => obj.data?.id || obj.id);
    
    // Get all objects from canvas
    const allObjects = canvas.getObjects();
    
    // Filter out utility objects (grid lines, guidelines, etc.)
    const contentObjects = allObjects.filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline &&
      !obj.data?.isUtility
    );
    
    // Convert objects to layer structure
    const buildLayerTree = (objects: fabric.Object[], parent?: string): LayerItem[] => {
      return objects
        .filter(obj => !parent || obj.data?.parentId === parent)
        .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)) // Sort by z-index descending
        .map(obj => {
          const id = obj.data?.id || `object-${uuidv4().slice(0, 8)}`;
          const isGroup = obj.type === 'group' || !!obj.data?.isGroup;
          
          // Save ID to object if it doesn't have one
          if (!obj.data) obj.data = { id };
          else if (!obj.data.id) obj.data.id = id;
          
          return {
            id,
            name: obj.data?.name || `${obj.type || 'Object'}-${id.slice(-4)}`,
            type: obj.type || 'object',
            visible: obj.visible !== false,
            locked: !!obj.lockMovementX && !!obj.lockMovementY,
            selected: selectedIds.includes(id),
            zIndex: obj.zIndex || 0,
            isGroup: isGroup,
            children: isGroup ? buildLayerTree(contentObjects, id) : [],
            data: obj.data || {}
          };
        });
    };
    
    const newLayers = buildLayerTree(contentObjects);
    setLayers(newLayers);
    
    // Update selected layers if not processing batch operations
    if (!isProcessingAction && (!persistSelection || activeObjects.length > 0)) {
      setSelectedLayerIds(selectedIds);
    }
    
    // Call onChange handler if provided
    if (onChange) {
      onChange(newLayers);
    }
  }, [canvas, onChange, isProcessingAction, persistSelection]);
  
  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    updateLayersList();
    
    const handlers = {
      objectAdded: updateLayersList,
      objectRemoved: updateLayersList,
      objectModified: updateLayersList,
      selectionCreated: updateLayersList,
      selectionUpdated: updateLayersList,
      selectionCleared: updateLayersList,
      'object:visibility:changed': updateLayersList
    };
    
    // Add event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      canvas.on(event as any, handler);
    });
    
    return () => {
      // Clean up event listeners
      Object.entries(handlers).forEach(([event, handler]) => {
        canvas.off(event as any, handler);
      });
    };
  }, [canvas, updateLayersList]);
  
  // Find a layer by ID (recursively search through nested layers)
  const findLayerById = useCallback((id: string, layerList: LayerItem[] = layers): LayerItem | null => {
    for (const layer of layerList) {
      if (layer.id === id) return layer;
      if (layer.children.length > 0) {
        const found = findLayerById(id, layer.children);
        if (found) return found;
      }
    }
    return null;
  }, [layers]);
  
  // Find a fabric object by layer ID
  const findObjectById = useCallback((id: string): fabric.Object | null => {
    if (!canvas) return null;
    return canvas.getObjects().find(obj => obj.data?.id === id) || null;
  }, [canvas]);
  
  // Select a layer and its corresponding fabric object
  const selectLayer = useCallback((id: string, multiSelect: boolean = false) => {
    if (!canvas) return;
    
    const obj = findObjectById(id);
    if (!obj) return;
    
    try {
      if (multiSelect) {
        // Toggle selection for this object
        const isAlreadySelected = canvas.getActiveObjects().includes(obj);
        
        if (isAlreadySelected) {
          canvas.discardActiveObject();
          const remaining = canvas.getActiveObjects().filter(o => o !== obj);
          
          if (remaining.length > 0) {
            const selection = new fabric.ActiveSelection(remaining, { canvas });
            canvas.setActiveObject(selection);
          }
        } else {
          // Add to selection
          const currentSelection = canvas.getActiveObjects();
          currentSelection.push(obj);
          const selection = new fabric.ActiveSelection(currentSelection, { canvas });
          canvas.setActiveObject(selection);
        }
      } else {
        canvas.discardActiveObject();
        canvas.setActiveObject(obj);
      }
      
      canvas.requestRenderAll();
      updateLayersList();
    } catch (error) {
      console.error("Error selecting layer:", error);
    }
  }, [canvas, findObjectById, updateLayersList]);
  
  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((id: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(id);
    if (!obj) return;
    
    setIsProcessingAction(true);
    try {
      obj.visible = !obj.visible;
      
      // If it's a group, toggle visibility for all children
      if (obj instanceof fabric.Group) {
        const toggleChildVisibility = (items: fabric.Object[]) => {
          items.forEach(item => {
            item.visible = obj.visible;
            // Handle nested groups
            if (item instanceof fabric.Group) {
              toggleChildVisibility(item.getObjects());
            }
          });
        };
        
        toggleChildVisibility(obj.getObjects());
      }
      
      // Fire custom event to trigger layer update
      canvas.fire('object:visibility:changed', { target: obj });
      canvas.requestRenderAll();
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, findObjectById]);
  
  // Toggle layer lock state
  const toggleLayerLock = useCallback((id: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(id);
    if (!obj) return;
    
    setIsProcessingAction(true);
    try {
      const isLocked = !!obj.lockMovementX && !!obj.lockMovementY;
      
      // Toggle lock state
      const newLockState = !isLocked;
      obj.lockMovementX = newLockState;
      obj.lockMovementY = newLockState;
      obj.lockRotation = newLockState;
      obj.lockScalingX = newLockState;
      obj.lockScalingY = newLockState;
      
      // If it's a group, toggle lock for all children
      if (obj instanceof fabric.Group) {
        const toggleChildLock = (items: fabric.Object[]) => {
          items.forEach(item => {
            item.lockMovementX = newLockState;
            item.lockMovementY = newLockState;
            item.lockRotation = newLockState;
            item.lockScalingX = newLockState;
            item.lockScalingY = newLockState;
            
            // Handle nested groups
            if (item instanceof fabric.Group) {
              toggleChildLock(item.getObjects());
            }
          });
        };
        
        toggleChildLock(obj.getObjects());
      }
      
      canvas.requestRenderAll();
      updateLayersList();
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, findObjectById, updateLayersList]);
  
  // Handle layer reordering via drag and drop
  const handleReorderLayers = useCallback((result: DropResult) => {
    if (!canvas || !result.destination || result.source.index === result.destination.index) {
      return;
    }
    
    const { source, destination } = result;
    const layerId = layers[source.index].id;
    const obj = findObjectById(layerId);
    if (!obj) return;
    
    setIsProcessingAction(true);
    try {
      const objects = canvas.getObjects();
      
      // Determine the new z-index based on destination
      let newZIndex: number;
      
      if (destination.index === 0) {
        // Moving to top
        newZIndex = Math.max(...objects.map(o => o.zIndex || 0)) + 1;
      } else if (destination.index === layers.length - 1) {
        // Moving to bottom
        newZIndex = Math.min(...objects.map(o => o.zIndex || 0)) - 1;
      } else {
        // Moving between layers
        const targetLayerAbove = layers[Math.max(0, destination.index - 1)];
        const targetLayerBelow = layers[Math.min(layers.length - 1, destination.index)];
        const objAbove = findObjectById(targetLayerAbove.id);
        const objBelow = findObjectById(targetLayerBelow.id);
        
        const zIndexAbove = objAbove?.zIndex || 0;
        const zIndexBelow = objBelow?.zIndex || 0;
        
        newZIndex = Math.floor((zIndexAbove + zIndexBelow) / 2);
      }
      
      // Update the z-index
      obj.zIndex = newZIndex;
      
      // Update canvas render order based on z-index
      canvas._objects.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      canvas.requestRenderAll();
      updateLayersList();
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, layers, findObjectById, updateLayersList]);
  
  // Rename a layer
  const renameLayer = useCallback((id: string, newName: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(id);
    if (!obj) return;
    
    if (!obj.data) obj.data = {};
    obj.data.name = newName;
    
    updateLayersList();
  }, [canvas, findObjectById, updateLayersList]);
  
  // Group selected layers
  const groupLayers = useCallback((layerIds: string[], groupName: string) => {
    if (!canvas || layerIds.length < 2) return;
    
    setIsProcessingAction(true);
    try {
      // Find all objects to group
      const objectsToGroup = layerIds
        .map(id => findObjectById(id))
        .filter(obj => obj !== null) as fabric.Object[];
      
      if (objectsToGroup.length < 2) return;
      
      // First, deselect all objects
      canvas.discardActiveObject();
      
      // Create a selection of all objects to group
      const selection = new fabric.ActiveSelection(objectsToGroup, { canvas });
      
      // Group ID and metadata
      const groupId = `group-${uuidv4().slice(0, 8)}`;
      
      // Convert the selection to a group
      const group = selection.toGroup();
      
      // Set group metadata
      group.data = {
        id: groupId,
        name: groupName,
        type: 'group',
        isGroup: true
      };
      
      // Set object's parent ID to establish hierarchy
      objectsToGroup.forEach(obj => {
        if (!obj.data) obj.data = {};
        obj.data.parentId = groupId;
      });
      
      // Update canvas and select the new group
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
      updateLayersList();
    } catch (error) {
      console.error("Error grouping layers:", error);
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, findObjectById, updateLayersList]);
  
  // Ungroup a layer
  const ungroupLayer = useCallback((id: string) => {
    if (!canvas) return;
    
    const groupObj = findObjectById(id);
    if (!groupObj || !(groupObj instanceof fabric.Group)) return;
    
    setIsProcessingAction(true);
    try {
      // Preserve the original group's position and scale
      const groupLeft = groupObj.left || 0;
      const groupTop = groupObj.top || 0;
      const groupScaleX = groupObj.scaleX || 1;
      const groupScaleY = groupObj.scaleY || 1;
      
      // Get all objects in the group
      const items = (groupObj as fabric.Group).getObjects();
      
      // First remove the group
      canvas.remove(groupObj);
      
      // Add the items back to the canvas with adjusted positions
      items.forEach(item => {
        // Remove parent ID reference
        if (item.data) item.data.parentId = undefined;
        
        // Add to canvas
        canvas.add(item);
      });
      
      // Select all the ungrouped items
      const selection = new fabric.ActiveSelection(items, { canvas });
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
      updateLayersList();
    } catch (error) {
      console.error("Error ungrouping layer:", error);
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, findObjectById, updateLayersList]);
  
  // Delete a layer
  const deleteLayer = useCallback((id: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(id);
    if (!obj) return;
    
    setIsProcessingAction(true);
    try {
      // Remove from canvas
      canvas.remove(obj);
      canvas.requestRenderAll();
      updateLayersList();
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, findObjectById, updateLayersList]);
  
  // Duplicate a layer
  const duplicateLayer = useCallback((id: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(id);
    if (!obj) return;
    
    setIsProcessingAction(true);
    try {
      obj.clone((cloned: fabric.Object) => {
        // Generate new ID
        const newId = `${obj.type || 'object'}-${uuidv4().slice(0, 8)}`;
        
        // Set position slightly offset from original
        cloned.set({
          left: (obj.left || 0) + 20,
          top: (obj.top || 0) + 20,
          evented: true,
        });
        
        // Set new metadata
        if (!cloned.data) cloned.data = {};
        cloned.data.id = newId;
        cloned.data.name = `${obj.data?.name || obj.type || 'Object'} Copy`;
        
        // Add to canvas and select
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        updateLayersList();
      });
    } catch (error) {
      console.error("Error duplicating layer:", error);
    } finally {
      setIsProcessingAction(false);
    }
  }, [canvas, findObjectById, updateLayersList]);
  
  // Toggle layer expansion state in the UI
  const toggleLayerExpanded = useCallback((id: string, expanded: boolean) => {
    setExpandedLayers(prev => ({
      ...prev,
      [id]: expanded
    }));
  }, []);
  
  // Return all the layer management functions and state
  return {
    layers,
    selectedLayerIds,
    expandedLayers,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    handleReorderLayers,
    renameLayer,
    groupLayers,
    ungroupLayer,
    deleteLayer,
    duplicateLayer,
    toggleLayerExpanded,
    findLayerById,
    findObjectById,
    refreshLayers: updateLayersList
  };
}
