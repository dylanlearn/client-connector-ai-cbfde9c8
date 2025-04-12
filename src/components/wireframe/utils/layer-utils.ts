import { fabric } from 'fabric';

export interface LayerItem {
  id: string;
  name: string;
  type: string;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  selected: boolean;
  childLayers?: LayerItem[];
  parentId?: string;
}

/**
 * Convert fabric canvas objects to layer items
 */
export function convertCanvasObjectsToLayers(
  canvas: fabric.Canvas,
  selectedIds: string[] = []
): LayerItem[] {
  const layers: LayerItem[] = [];
  const objectsArray = canvas.getObjects();
  
  // Filter out grid and guide objects
  const validObjects = objectsArray.filter(
    obj => !(obj.data?.type === 'grid' || obj.data?.type === 'guide')
  );
  
  // Process each object
  validObjects.forEach((obj, index) => {
    const id = obj.data?.id || String(obj.id) || `layer-${index}`;
    const name = obj.data?.name || `Layer ${index + 1}`;
    const type = obj.get('type') || 'unknown';
    
    const layer: LayerItem = {
      id,
      name,
      type,
      zIndex: obj.zIndex || index,
      visible: !obj.hidden,
      locked: obj.lockMovementX && obj.lockMovementY,
      selected: selectedIds.includes(id)
    };
    
    layers.push(layer);
  });
  
  // Sort layers by z-index
  return layers.sort((a, b) => b.zIndex - a.zIndex);
}

/**
 * Create a group from multiple layers
 */
export function createLayerGroup(
  canvas: fabric.Canvas,
  layerIds: string[]
): fabric.Group | null {
  if (!canvas || layerIds.length === 0) return null;
  
  // Find objects to group
  const objectsToGroup = canvas.getObjects().filter(obj => {
    const objId = obj.data?.id || String(obj.id);
    return layerIds.includes(objId);
  });
  
  if (objectsToGroup.length === 0) return null;
  
  // Create group
  const group = new fabric.Group(objectsToGroup, {
    data: {
      id: `group-${Date.now()}`,
      name: `Group (${objectsToGroup.length})`,
      type: 'group'
    }
  });
  
  // Remove individual objects and add group
  objectsToGroup.forEach(obj => canvas.remove(obj));
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.renderAll();
  
  return group;
}

/**
 * Ungroup a layer group
 */
export function ungroupLayers(
  canvas: fabric.Canvas,
  groupId: string
): boolean {
  if (!canvas) return false;
  
  // Find group object
  const groupObj = canvas.getObjects().find(obj => {
    const objId = obj.data?.id || String(obj.id);
    return objId === groupId && obj.type === 'group';
  }) as fabric.Group;
  
  if (!groupObj) return false;
  
  // Ungroup the object
  const items = groupObj.getObjects();
  groupObj.removeWithUpdate();
  
  // Add individual objects back to canvas
  items.forEach(item => {
    canvas.add(item);
  });
  
  canvas.renderAll();
  return true;
}

/**
 * Change layer visibility
 */
export function toggleLayerVisibility(
  canvas: fabric.Canvas,
  layerId: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Toggle visibility
  obj.visible = !obj.visible;
  
  canvas.renderAll();
  return true;
}

/**
 * Lock/unlock layer movement
 */
export function toggleLayerLock(
  canvas: fabric.Canvas,
  layerId: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Toggle lock state
  const isLocked = obj.lockMovementX && obj.lockMovementY;
  obj.lockMovementX = !isLocked;
  obj.lockMovementY = !isLocked;
  obj.lockRotation = !isLocked;
  obj.lockScalingX = !isLocked;
  obj.lockScalingY = !isLocked;
  
  canvas.renderAll();
  return true;
}

/**
 * Move layer up in z-order
 */
export function moveLayerUp(
  canvas: fabric.Canvas,
  layerId: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Bring forward
  canvas.bringForward(obj);
  canvas.renderAll();
  
  return true;
}

/**
 * Move layer down in z-order
 */
export function moveLayerDown(
  canvas: fabric.Canvas,
  layerId: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Send backward
  canvas.sendBackwards(obj);
  canvas.renderAll();
  
  return true;
}

/**
 * Move layer to top of z-order
 */
export function moveLayerToTop(
  canvas: fabric.Canvas,
  layerId: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Bring to front
  canvas.bringToFront(obj);
  canvas.renderAll();
  
  return true;
}

/**
 * Move layer to bottom of z-order
 */
export function moveLayerToBottom(
  canvas: fabric.Canvas,
  layerId: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Send to back (but keep above grid lines)
  canvas.sendToBack(obj);
  
  // Make sure grid stays at the very back
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(gridObj => canvas.sendToBack(gridObj));
  
  canvas.renderAll();
  return true;
}

/**
 * Rename a layer
 */
export function renameLayer(
  canvas: fabric.Canvas,
  layerId: string,
  newName: string
): boolean {
  if (!canvas) return false;
  
  // Find the object
  const obj = findObjectById(canvas, layerId);
  if (!obj) return false;
  
  // Update name in data
  if (!obj.data) obj.data = {};
  obj.data.name = newName;
  
  canvas.renderAll();
  return true;
}

/**
 * Helper function to find an object by ID
 */
function findObjectById(canvas: fabric.Canvas, id: string): fabric.Object | undefined {
  return canvas.getObjects().find(obj => {
    const objId = obj.data?.id || String(obj.id);
    return objId === id;
  });
}
