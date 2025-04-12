
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
  
  // Convert to layer info
  const layers: LayerInfo[] = objects.map(obj => {
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
  }).sort((a, b) => b.zIndex - a.zIndex);
  
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
  
  // Group the objects
  const group = (activeObject as fabric.ActiveSelection).toGroup();
  
  // Add custom data to the group
  const groupId = `group-${Date.now()}`;
  group.data = {
    id: groupId,
    type: 'group',
    name
  };
  
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
  
  // Ungroup
  const items = (group as fabric.Group).getObjects();
  (group as fabric.Group).destroy();
  canvas.remove(group);
  
  // Add the individual objects back to canvas
  canvas.add(...items);
  canvas.requestRenderAll();
  
  return true;
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
