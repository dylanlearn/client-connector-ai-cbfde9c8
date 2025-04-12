
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { LayerInfo } from './types';

/**
 * Converts canvas objects to layer information
 */
export function convertCanvasObjectsToLayers(objects: fabric.Object[]): LayerInfo[] {
  // Assuming objects have been initialized with appropriate data properties
  return objects.map(obj => {
    const data = obj.data || {};
    const isGroup = obj.type === 'group';
    const children: LayerInfo[] = [];
    
    // If it's a group, process its objects
    if (isGroup && obj instanceof fabric.Group) {
      const groupObjects = obj.getObjects();
      // Convert nested objects to layers recursively
      const childLayers = convertCanvasObjectsToLayers(groupObjects);
      childLayers.forEach(layer => children.push(layer));
    }
    
    return {
      id: data.id || `object-${uuidv4()}`,
      name: data.name || `${obj.type || 'Object'} ${obj.zIndex || 0}`,
      type: obj.type || 'object',
      zIndex: obj.zIndex || 0,
      visible: obj.visible !== false,
      locked: !!obj.lockMovementX && !!obj.lockMovementY,
      selected: !!obj.active,
      isGroup: isGroup,
      children: children,
      data: data
    };
  });
}

/**
 * Apply layer settings to an object
 */
export function applyLayerSettingsToObject(object: fabric.Object, settings: Partial<LayerInfo>): void {
  if (!object) return;
  
  if (settings.visible !== undefined) {
    object.visible = settings.visible;
  }
  
  if (settings.locked !== undefined) {
    object.lockMovementX = settings.locked;
    object.lockMovementY = settings.locked;
    object.lockRotation = settings.locked;
    object.lockScalingX = settings.locked;
    object.lockScalingY = settings.locked;
  }
  
  if (settings.zIndex !== undefined) {
    object.zIndex = settings.zIndex;
  }
  
  if (settings.name && object.data) {
    object.data.name = settings.name;
  }
}

/**
 * Group selected layers
 */
export function groupSelectedLayers(canvas: fabric.Canvas, selectedLayerIds: string[]): string | null {
  if (!canvas || selectedLayerIds.length < 2) return null;
  
  const objectsToGroup: fabric.Object[] = [];
  const allObjects = canvas.getObjects();
  
  // Find the objects to group
  selectedLayerIds.forEach(id => {
    const obj = allObjects.find(o => o.data?.id === id);
    if (obj) objectsToGroup.push(obj);
  });
  
  if (objectsToGroup.length < 2) return null;
  
  // Create a new group
  const groupId = `group-${uuidv4()}`;
  const group = new fabric.Group(objectsToGroup, {
    data: {
      id: groupId,
      name: `Group ${groupId.substring(0, 4)}`,
      type: 'group'
    }
  });
  
  // Remove the original objects
  objectsToGroup.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Add the group
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
  
  return groupId;
}

/**
 * Ungroup a layer
 */
export function ungroupLayer(canvas: fabric.Canvas, groupId: string): string[] {
  if (!canvas) return [];
  
  const allObjects = canvas.getObjects();
  const groupObj = allObjects.find(o => o.data?.id === groupId && o.type === 'group') as fabric.Group;
  
  if (!groupObj) return [];
  
  const childObjects = groupObj.getObjects();
  const childIds: string[] = [];
  
  // Ungroup the objects
  groupObj.destroy();
  canvas.remove(groupObj);
  
  // Add the child objects back to the canvas
  childObjects.forEach(obj => {
    if (!obj.data) obj.data = {};
    if (!obj.data.id) obj.data.id = `object-${uuidv4()}`;
    childIds.push(obj.data.id);
    canvas.add(obj);
  });
  
  canvas.requestRenderAll();
  
  return childIds;
}

/**
 * Gets a flat list of layers including all children
 */
export function getFlatLayerList(layers: LayerInfo[]): LayerInfo[] {
  let result: LayerInfo[] = [];
  
  layers.forEach(layer => {
    result.push(layer);
    if (layer.isGroup && layer.children.length > 0) {
      result = [...result, ...getFlatLayerList(layer.children)];
    }
  });
  
  return result;
}
