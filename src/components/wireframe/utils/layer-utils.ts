
import { fabric } from 'fabric';

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  zIndex: number;
  children?: LayerItem[]; // For grouped items
  fabricObject?: fabric.Object;
}

export interface LayerGroup {
  id: string;
  name: string;
  expanded: boolean;
  items: LayerItem[];
}

/**
 * Converts canvas objects to layer items
 */
export function convertCanvasObjectsToLayers(
  canvas: fabric.Canvas,
  selectedObjectIds: string[] = []
): LayerItem[] {
  if (!canvas) return [];
  
  return canvas.getObjects()
    .filter(obj => !obj.data?.type?.includes('grid')) // Filter out grid and guide elements
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
    .map(obj => ({
      id: obj.data?.id || obj.id || String(obj.zIndex),
      name: obj.data?.name || obj.type || 'Layer',
      type: obj.type || 'unknown',
      visible: obj.visible !== false,
      locked: obj.lockMovementX === true && obj.lockMovementY === true,
      selected: selectedObjectIds.includes(obj.data?.id || obj.id || String(obj.zIndex)),
      zIndex: obj.zIndex || 0,
      fabricObject: obj,
      children: obj.type === 'group' ? convertGroupToLayerItems(obj as fabric.Group) : undefined
    }));
}

/**
 * Converts a fabric group to layer items
 */
function convertGroupToLayerItems(group: fabric.Group): LayerItem[] {
  if (!group || !group._objects) return [];
  
  return group._objects.map((obj, index) => ({
    id: obj.data?.id || obj.id || `${group.id}-child-${index}`,
    name: obj.data?.name || obj.type || `Item ${index + 1}`,
    type: obj.type || 'unknown',
    visible: obj.visible !== false,
    locked: obj.lockMovementX === true && obj.lockMovementY === true,
    selected: false, // Group items cannot be individually selected when in a group
    zIndex: obj.zIndex || index,
    fabricObject: obj,
    children: obj.type === 'group' ? convertGroupToLayerItems(obj as fabric.Group) : undefined
  }));
}

/**
 * Groups selected objects
 */
export function groupObjects(
  canvas: fabric.Canvas,
  layerIds: string[],
  groupName: string = 'Group'
): boolean {
  if (!canvas || layerIds.length < 2) return false;
  
  // Find the objects to group
  const objects = canvas.getObjects().filter(obj => {
    const objId = obj.data?.id || obj.id || String(obj.zIndex);
    return layerIds.includes(objId);
  });
  
  if (objects.length < 2) return false;
  
  // Create group
  const group = new fabric.Group(objects, {
    data: { id: `group-${Date.now()}`, name: groupName, type: 'wireframe-group' }
  });
  
  // Add group to canvas
  canvas.add(group);
  
  // Remove original objects
  objects.forEach(obj => canvas.remove(obj));
  
  canvas.requestRenderAll();
  return true;
}

/**
 * Ungroups a group
 */
export function ungroupObjects(canvas: fabric.Canvas, groupId: string): boolean {
  if (!canvas) return false;
  
  const group = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === groupId && obj.type === 'group');
  if (!group || group.type !== 'group') return false;
  
  // Get the group's position
  const groupLeft = group.left || 0;
  const groupTop = group.top || 0;
  
  // Extract objects from group
  const items = (group as fabric.Group).getObjects();
  
  // Clone items and adjust positions
  const ungroupedItems = items.map(item => {
    // Clone object to prevent reference issues
    const clonedObj = fabric.util.object.clone(item);
    
    // Adjust position to maintain world position
    if (clonedObj.left !== undefined && clonedObj.top !== undefined) {
      clonedObj.left += groupLeft;
      clonedObj.top += groupTop;
    }
    
    // Ensure it has data
    clonedObj.data = { ...(item.data || {}), id: item.data?.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
    
    return clonedObj;
  });
  
  // Add individual objects
  ungroupedItems.forEach(obj => {
    canvas.add(obj);
  });
  
  // Remove group
  canvas.remove(group);
  
  canvas.requestRenderAll();
  return true;
}

/**
 * Changes layer visibility
 */
export function toggleLayerVisibility(canvas: fabric.Canvas, layerId: string): boolean {
  if (!canvas) return false;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return false;
  
  object.visible = !object.visible;
  canvas.requestRenderAll();
  
  return true;
}

/**
 * Toggles layer lock status
 */
export function toggleLayerLock(canvas: fabric.Canvas, layerId: string): boolean {
  if (!canvas) return false;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return false;
  
  const isLocked = object.lockMovementX === true && object.lockMovementY === true;
  
  // Toggle lock state
  object.lockMovementX = !isLocked;
  object.lockMovementY = !isLocked;
  object.lockRotation = !isLocked;
  object.lockScalingX = !isLocked;
  object.lockScalingY = !isLocked;
  
  canvas.requestRenderAll();
  return true;
}

/**
 * Duplicates a layer
 */
export function duplicateLayer(canvas: fabric.Canvas, layerId: string): string | null {
  if (!canvas) return null;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return null;
  
  // Clone the object
  object.clone((clonedObj: fabric.Object) => {
    // Generate new ID
    const newId = `${layerId}-copy-${Date.now()}`;
    
    // Update data
    clonedObj.data = { ...(object.data || {}), id: newId };
    
    // Offset position slightly
    clonedObj.set({
      left: (clonedObj.left || 0) + 10,
      top: (clonedObj.top || 0) + 10
    });
    
    // Add to canvas
    canvas.add(clonedObj);
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  });
  
  return layerId; // Will return newId in real implementation, but need to wait for async clone
}

/**
 * Changes layer z-index
 */
export function changeLayerZindex(canvas: fabric.Canvas, layerId: string, newIndex: number): boolean {
  if (!canvas) return false;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return false;
  
  // Set new z-index
  object.zIndex = newIndex;
  
  // Re-order canvas objects
  canvas.discardActiveObject();
  canvas.sendToBack(object); // First move to back
  
  // Then move forward to the correct position
  const sortedObjects = canvas.getObjects()
    .filter(obj => !obj.data?.type?.includes('grid')) // Ignore grid objects
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  for (const obj of sortedObjects) {
    if (obj !== object) {
      canvas.bringForward(obj);
    }
  }
  
  canvas.requestRenderAll();
  return true;
}

/**
 * Moves layer one step up in z-index
 */
export function moveLayerUp(canvas: fabric.Canvas, layerId: string): boolean {
  if (!canvas) return false;
  
  const sortedObjects = canvas.getObjects()
    .filter(obj => !obj.data?.type?.includes('grid'))
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  const index = sortedObjects.findIndex(obj => (obj.data?.id || obj.id) === layerId);
  if (index === -1 || index === sortedObjects.length - 1) return false;
  
  // Swap z-index with next object
  const currentObject = sortedObjects[index];
  const nextObject = sortedObjects[index + 1];
  
  const tempZIndex = nextObject.zIndex;
  nextObject.zIndex = currentObject.zIndex;
  currentObject.zIndex = tempZIndex;
  
  // Re-render canvas with updated z-index
  canvas.bringForward(currentObject);
  canvas.requestRenderAll();
  
  return true;
}

/**
 * Moves layer one step down in z-index
 */
export function moveLayerDown(canvas: fabric.Canvas, layerId: string): boolean {
  if (!canvas) return false;
  
  const sortedObjects = canvas.getObjects()
    .filter(obj => !obj.data?.type?.includes('grid'))
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  const index = sortedObjects.findIndex(obj => (obj.data?.id || obj.id) === layerId);
  if (index === -1 || index === 0) return false;
  
  // Swap z-index with previous object
  const currentObject = sortedObjects[index];
  const prevObject = sortedObjects[index - 1];
  
  const tempZIndex = prevObject.zIndex;
  prevObject.zIndex = currentObject.zIndex;
  currentObject.zIndex = tempZIndex;
  
  // Re-render canvas with updated z-index
  canvas.sendBackwards(currentObject);
  canvas.requestRenderAll();
  
  return true;
}

/**
 * Brings layer to front
 */
export function bringLayerToFront(canvas: fabric.Canvas, layerId: string): boolean {
  if (!canvas) return false;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return false;
  
  // Get highest z-index
  const highestZIndex = Math.max(...canvas.getObjects()
    .filter(obj => !obj.data?.type?.includes('grid'))
    .map(obj => obj.zIndex || 0));
  
  // Set new z-index
  object.zIndex = highestZIndex + 1;
  
  // Bring to front
  canvas.bringToFront(object);
  canvas.requestRenderAll();
  
  return true;
}

/**
 * Sends layer to back
 */
export function sendLayerToBack(canvas: fabric.Canvas, layerId: string): boolean {
  if (!canvas) return false;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return false;
  
  // Get lowest z-index
  const lowestZIndex = Math.min(...canvas.getObjects()
    .filter(obj => !obj.data?.type?.includes('grid'))
    .map(obj => obj.zIndex || 0));
  
  // Set new z-index
  object.zIndex = lowestZIndex - 1;
  
  // Send to back
  canvas.sendToBack(object);
  canvas.requestRenderAll();
  
  return true;
}

/**
 * Renames a layer
 */
export function renameLayer(canvas: fabric.Canvas, layerId: string, newName: string): boolean {
  if (!canvas || !newName) return false;
  
  const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
  if (!object) return false;
  
  // Update data
  object.data = { ...(object.data || {}), name: newName };
  
  return true;
}
