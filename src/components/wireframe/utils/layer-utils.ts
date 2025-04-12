
import { fabric } from 'fabric';
import { LayerInfo } from './types';

/**
 * Converts fabric canvas objects to a layer hierarchy
 */
export function convertCanvasObjectsToLayers(
  canvas: fabric.Canvas,
  selectedIds: string[] = []
): LayerInfo[] {
  if (!canvas) return [];
  
  // Get all objects except grid and guides
  const objects = canvas.getObjects().filter(obj => {
    // Ignore grid lines and guide objects
    return !obj.data?.type?.includes('grid') && 
           !obj.data?.type?.includes('guide') &&
           !obj.data?.type?.includes('dropZone');
  });
  
  // Sort objects by z-index to ensure proper layer ordering
  const sortedObjects = [...objects].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  
  // Convert to layer info
  const layers: LayerInfo[] = sortedObjects.map(obj => {
    const id = obj.data?.id || String(obj.zIndex);
    const isSelected = selectedIds.includes(id);
    
    // Check for group
    const isGroup = fabric.util.object.isType(obj, 'group');
    let children: LayerInfo[] = [];
    
    if (isGroup) {
      const group = obj as fabric.Group;
      children = group.getObjects().map((childObj, idx) => ({
        id: childObj.data?.id || `${id}-child-${idx}`,
        name: childObj.data?.name || childObj.data?.type || 'Item',
        type: childObj.data?.type || childObj.type || 'shape',
        zIndex: childObj.zIndex || idx,
        visible: childObj.visible !== false,
        locked: childObj.lockMovementX && childObj.lockMovementY,
        selected: selectedIds.includes(childObj.data?.id || `${id}-child-${idx}`)
      }));
      
      // Sort group children by z-index
      children.sort((a, b) => (b.zIndex - a.zIndex));
    }
    
    return {
      id,
      name: obj.data?.name || obj.data?.type || 'Layer',
      type: obj.data?.type || obj.type || 'shape',
      zIndex: obj.zIndex || objects.indexOf(obj),
      visible: obj.visible !== false,
      locked: obj.lockMovementX && obj.lockMovementY,
      selected: isSelected,
      children: isGroup ? children : undefined
    };
  });
  
  return layers;
}

/**
 * Applies layer settings to fabric objects
 */
export function applyLayerSettingsToObject(
  canvas: fabric.Canvas,
  layerId: string,
  settings: {
    visible?: boolean;
    locked?: boolean;
    zIndex?: number;
    name?: string;
  }
): void {
  if (!canvas) return;
  
  // Find object by ID
  const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
  if (!object) return;
  
  // Apply settings
  if (settings.visible !== undefined) {
    object.visible = settings.visible;
  }
  
  if (settings.locked !== undefined) {
    object.lockMovementX = settings.locked;
    object.lockMovementY = settings.locked;
    object.selectable = !settings.locked;
  }
  
  if (settings.zIndex !== undefined) {
    object.zIndex = settings.zIndex;
    
    // Re-order objects in the canvas
    canvas.bringToFront(object);
    
    // Adjust position based on zIndex
    const objects = canvas.getObjects()
      .filter(obj => !obj.data?.type?.includes('grid') && !obj.data?.type?.includes('guide'))
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      
    objects.forEach(obj => {
      canvas.sendToBack(obj);
    });
  }
  
  if (settings.name !== undefined && object.data) {
    object.data.name = settings.name;
  }
  
  canvas.requestRenderAll();
}

/**
 * Groups selected objects into a new layer
 */
export function groupSelectedLayers(
  canvas: fabric.Canvas,
  name: string = 'Group'
): string | null {
  if (!canvas) return null;
  
  // Get active selection or selected objects
  const activeObject = canvas.getActiveObject();
  if (!activeObject || !fabric.util.object.isType(activeObject, 'activeSelection')) return null;
  
  // Find the highest z-index among selected objects
  let maxZIndex = -1;
  const selectedObjects = (activeObject as fabric.ActiveSelection).getObjects();
  selectedObjects.forEach(obj => {
    maxZIndex = Math.max(maxZIndex, obj.zIndex || 0);
  });
  
  // Group the objects
  const group = (activeObject as fabric.ActiveSelection).toGroup();
  
  // Add custom data to the group
  const groupId = `group-${Date.now()}`;
  group.data = {
    id: groupId,
    type: 'group',
    name
  };
  
  // Set z-index for the group (higher than its members)
  group.zIndex = maxZIndex + 1;
  
  canvas.requestRenderAll();
  return groupId;
}

/**
 * Ungroups a group layer into individual objects
 */
export function ungroupLayer(
  canvas: fabric.Canvas,
  groupId: string
): boolean {
  if (!canvas) return false;
  
  // Find the group by ID
  const group = canvas.getObjects().find(obj => 
    obj.data?.id === groupId && fabric.util.object.isType(obj, 'group')
  );
  
  if (!group || !fabric.util.object.isType(group, 'group')) return false;
  
  // Store the group's z-index
  const groupZIndex = group.zIndex || 0;
  
  // Get the objects inside the group
  const items = (group as fabric.Group).getObjects();
  
  // Convert group to active selection
  const activeSelection = (group as fabric.Group).toActiveSelection();
  
  // Remove the group
  canvas.remove(group);
  
  // Update z-indices of ungrouped objects
  items.forEach((obj, index) => {
    obj.zIndex = groupZIndex - items.length + index;
    
    // Ensure each object has a proper data.id
    if (!obj.data) {
      obj.data = { id: `object-${Date.now()}-${index}` };
    } else if (!obj.data.id) {
      obj.data.id = `object-${Date.now()}-${index}`;
    }
  });
  
  // Update z-indices of all objects to maintain proper stacking
  updateObjectZIndices(canvas);
  
  canvas.requestRenderAll();
  return true;
}

/**
 * Updates z-indices for all objects on the canvas to maintain proper stacking order
 */
export function updateObjectZIndices(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  // Get all regular objects (excluding grid, guides, etc.)
  const regularObjects = canvas.getObjects().filter(obj =>
    !obj.data?.type?.includes('grid') && 
    !obj.data?.type?.includes('guide') &&
    !obj.data?.type?.includes('dropZone')
  );
  
  // Update z-index based on canvas stack order
  regularObjects.forEach((obj, index) => {
    obj.zIndex = index;
  });
}

/**
 * Brings an object to the front of the canvas
 */
export function bringObjectToFront(canvas: fabric.Canvas, objectId: string): void {
  if (!canvas) return;
  
  const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
  if (!object) return;
  
  canvas.bringToFront(object);
  updateObjectZIndices(canvas);
  canvas.requestRenderAll();
}

/**
 * Sends an object to the back of the canvas
 */
export function sendObjectToBack(canvas: fabric.Canvas, objectId: string): void {
  if (!canvas) return;
  
  const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
  if (!object) return;
  
  canvas.sendToBack(object);
  updateObjectZIndices(canvas);
  canvas.requestRenderAll();
}

/**
 * Brings an object forward one level in the stack
 */
export function bringObjectForward(canvas: fabric.Canvas, objectId: string): void {
  if (!canvas) return;
  
  const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
  if (!object) return;
  
  canvas.bringForward(object);
  updateObjectZIndices(canvas);
  canvas.requestRenderAll();
}

/**
 * Sends an object backward one level in the stack
 */
export function sendObjectBackward(canvas: fabric.Canvas, objectId: string): void {
  if (!canvas) return;
  
  const object = canvas.getObjects().find(obj => obj.data?.id === objectId);
  if (!object) return;
  
  canvas.sendBackwards(object);
  updateObjectZIndices(canvas);
  canvas.requestRenderAll();
}

/**
 * Layer item type for UI representation
 */
export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  children?: LayerItem[];
  depth?: number;
  parent?: string;
}

/**
 * Converts fabric objects to a flat list of layer items
 */
export function getFlatLayerList(canvas: fabric.Canvas, selectedIds: string[] = []): LayerItem[] {
  const layers = convertCanvasObjectsToLayers(canvas, selectedIds);
  const flatList: LayerItem[] = [];
  
  // Recursive function to flatten hierarchy
  const flatten = (items: LayerInfo[], depth = 0, parent?: string) => {
    items.forEach(item => {
      flatList.push({
        ...item,
        depth,
        parent
      });
      
      if (item.children && item.children.length > 0) {
        flatten(item.children, depth + 1, item.id);
      }
    });
  };
  
  flatten(layers);
  return flatList;
}
