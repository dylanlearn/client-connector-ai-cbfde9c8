
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { LayerInfo } from '@/components/wireframe/utils/types';
import { v4 as uuidv4 } from 'uuid';

export interface UseLayerManagementOptions {
  fabricCanvas: fabric.Canvas | null;
  onLayerChange?: (layers: LayerInfo[]) => void;
  persistLayers?: boolean;
}

/**
 * Hook to manage layer operations in the wireframe canvas
 */
export function useLayerManagement(options: UseLayerManagementOptions) {
  const { fabricCanvas, onLayerChange, persistLayers = true } = options;
  
  // Layer state
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | undefined>();
  
  // Sync canvas objects to layers on init and when canvas changes
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const syncCanvasToLayers = () => {
      const canvasObjects = fabricCanvas.getObjects();
      
      // First, map existing objects to layers
      const newLayers: LayerInfo[] = canvasObjects.map((obj, index) => {
        // Try to find existing layer for this object
        const existingLayer = layers.find(layer => layer.id === (obj as any).id);
        const id = (obj as any).id || uuidv4();
        
        // Store ID on object if not already there
        if (!(obj as any).id) {
          (obj as any).id = id;
        }
        
        return {
          id,
          name: existingLayer?.name || (obj as any).name || `Layer ${index + 1}`,
          type: (obj as any).type || 'object',
          visible: existingLayer?.visible !== undefined ? existingLayer.visible : true,
          locked: existingLayer?.locked !== undefined ? existingLayer.locked : false,
          zIndex: fabricCanvas.getObjects().indexOf(obj),
          parentId: (obj as any).parentId
        };
      });
      
      setLayers(newLayers);
      
      // Notify if callback provided
      if (onLayerChange) {
        onLayerChange(newLayers);
      }
    };
    
    // Initial sync
    syncCanvasToLayers();
    
    // Set up event listeners for canvas changes
    fabricCanvas.on('object:added', syncCanvasToLayers);
    fabricCanvas.on('object:removed', syncCanvasToLayers);
    fabricCanvas.on('selection:created', (e) => {
      const selected = e.selected?.[0];
      if (selected && (selected as any).id) {
        setSelectedLayerId((selected as any).id);
      }
    });
    fabricCanvas.on('selection:cleared', () => {
      setSelectedLayerId(undefined);
    });
    
    return () => {
      fabricCanvas.off('object:added', syncCanvasToLayers);
      fabricCanvas.off('object:removed', syncCanvasToLayers);
    };
  }, [fabricCanvas, layers, onLayerChange]);
  
  // Select a layer
  const selectLayer = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
    
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects();
      const targetObject = objects.find(obj => (obj as any).id === layerId);
      
      if (targetObject) {
        // Deselect all first
        fabricCanvas.discardActiveObject();
        
        // Select the target object
        fabricCanvas.setActiveObject(targetObject);
        fabricCanvas.renderAll();
      }
    }
  }, [fabricCanvas]);
  
  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    setLayers(prevLayers => {
      const newLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          // Toggle visibility
          const newVisibility = !layer.visible;
          
          // Update object in canvas
          const targetObject = fabricCanvas.getObjects().find(obj => (obj as any).id === layerId);
          if (targetObject) {
            targetObject.visible = newVisibility;
            fabricCanvas.renderAll();
          }
          
          return { ...layer, visible: newVisibility };
        }
        return layer;
      });
      
      // Notify if callback provided
      if (onLayerChange) {
        onLayerChange(newLayers);
      }
      
      return newLayers;
    });
  }, [fabricCanvas, onLayerChange]);
  
  // Toggle layer lock
  const toggleLayerLock = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    setLayers(prevLayers => {
      const newLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          // Toggle lock
          const newLockState = !layer.locked;
          
          // Update object in canvas
          const targetObject = fabricCanvas.getObjects().find(obj => (obj as any).id === layerId);
          if (targetObject) {
            targetObject.selectable = !newLockState;
            targetObject.evented = !newLockState;
            fabricCanvas.renderAll();
          }
          
          return { ...layer, locked: newLockState };
        }
        return layer;
      });
      
      // Notify if callback provided
      if (onLayerChange) {
        onLayerChange(newLayers);
      }
      
      return newLayers;
    });
  }, [fabricCanvas, onLayerChange]);
  
  // Reorder layers
  const reorderLayers = useCallback((sourceIndex: number, targetIndex: number) => {
    if (!fabricCanvas) return;
    
    // Reorder in state
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const [movedLayer] = newLayers.splice(sourceIndex, 1);
      newLayers.splice(targetIndex, 0, movedLayer);
      
      // Update zIndex values
      const updatedLayers = newLayers.map((layer, index) => ({
        ...layer,
        zIndex: newLayers.length - index // Reverse order so higher index = higher z-index
      }));
      
      // Reorder objects in canvas to match
      const canvasObjects = fabricCanvas.getObjects();
      
      // Remove all objects
      fabricCanvas.clear();
      
      // Add back in new order
      updatedLayers.forEach(layer => {
        const obj = canvasObjects.find(o => (o as any).id === layer.id);
        if (obj) {
          fabricCanvas.add(obj);
        }
      });
      
      fabricCanvas.renderAll();
      
      // Notify if callback provided
      if (onLayerChange) {
        onLayerChange(updatedLayers);
      }
      
      return updatedLayers;
    });
  }, [fabricCanvas, onLayerChange]);
  
  // Delete a layer
  const deleteLayer = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    // Find and remove the object from canvas
    const targetObject = fabricCanvas.getObjects().find(obj => (obj as any).id === layerId);
    if (targetObject) {
      fabricCanvas.remove(targetObject);
    }
    
    // Remove from layers state
    setLayers(prevLayers => {
      const newLayers = prevLayers.filter(layer => layer.id !== layerId);
      
      // Notify if callback provided
      if (onLayerChange) {
        onLayerChange(newLayers);
      }
      
      return newLayers;
    });
  }, [fabricCanvas, onLayerChange]);
  
  // Duplicate a layer
  const duplicateLayer = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    // Find the object to duplicate
    const targetObject = fabricCanvas.getObjects().find(obj => (obj as any).id === layerId);
    if (!targetObject) return;
    
    // Clone the object
    targetObject.clone((cloned: fabric.Object) => {
      // Generate new ID
      const newId = uuidv4();
      (cloned as any).id = newId;
      
      // Position slightly offset
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20
      });
      
      // Add to canvas
      fabricCanvas.add(cloned);
      fabricCanvas.renderAll();
      
      // No need to manually update layers state as the object:added event will handle it
    });
  }, [fabricCanvas]);
  
  // Rename a layer
  const renameLayer = useCallback((layerId: string, newName: string) => {
    setLayers(prevLayers => {
      const newLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          // Update name
          const updatedLayer = { ...layer, name: newName };
          
          // Update object in canvas if it has a name property
          if (fabricCanvas) {
            const targetObject = fabricCanvas.getObjects().find(obj => (obj as any).id === layerId);
            if (targetObject) {
              (targetObject as any).name = newName;
            }
          }
          
          return updatedLayer;
        }
        return layer;
      });
      
      // Notify if callback provided
      if (onLayerChange) {
        onLayerChange(newLayers);
      }
      
      return newLayers;
    });
  }, [fabricCanvas, onLayerChange]);
  
  // Create a group from multiple layers
  const createGroup = useCallback((layerIds: string[]) => {
    if (!fabricCanvas || layerIds.length < 2) return;
    
    // Find all objects to group
    const objectsToGroup = layerIds
      .map(id => fabricCanvas.getObjects().find(obj => (obj as any).id === id))
      .filter(obj => obj !== undefined) as fabric.Object[];
    
    if (objectsToGroup.length < 2) return;
    
    // Create group
    const group = new fabric.Group(objectsToGroup, {
      name: 'Group'
    });
    
    // Generate new ID for the group
    const groupId = uuidv4();
    (group as any).id = groupId;
    
    // Store child IDs
    objectsToGroup.forEach(obj => {
      (obj as any).parentId = groupId;
    });
    
    // Remove individual objects
    objectsToGroup.forEach(obj => {
      fabricCanvas.remove(obj);
    });
    
    // Add group
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();
    
    // No need to manually update layers state as the canvas events will handle it
  }, [fabricCanvas]);
  
  // Move layer up in z-index
  const moveLayerUp = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    if (layerIndex > 0) {
      reorderLayers(layerIndex, layerIndex - 1);
    }
  }, [fabricCanvas, layers, reorderLayers]);
  
  // Move layer down in z-index
  const moveLayerDown = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    if (layerIndex < layers.length - 1) {
      reorderLayers(layerIndex, layerIndex + 1);
    }
  }, [fabricCanvas, layers, reorderLayers]);
  
  // Move layer to top
  const moveLayerToTop = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    if (layerIndex > 0) {
      reorderLayers(layerIndex, 0);
    }
  }, [fabricCanvas, layers, reorderLayers]);
  
  // Move layer to bottom
  const moveLayerToBottom = useCallback((layerId: string) => {
    if (!fabricCanvas) return;
    
    const layerIndex = layers.findIndex(layer => layer.id === layerId);
    if (layerIndex < layers.length - 1) {
      reorderLayers(layerIndex, layers.length - 1);
    }
  }, [fabricCanvas, layers, reorderLayers]);

  return {
    layers,
    selectedLayerId,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    reorderLayers,
    deleteLayer,
    duplicateLayer,
    renameLayer,
    createGroup,
    moveLayerUp,
    moveLayerDown,
    moveLayerToTop,
    moveLayerToBottom
  };
}
