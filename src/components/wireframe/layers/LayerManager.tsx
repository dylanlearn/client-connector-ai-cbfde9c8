
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { LayerInfo } from '@/components/wireframe/utils/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { List, Layers, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2, Group } from 'lucide-react';
import LayerItem from './LayerItem';
import { cn } from '@/lib/utils';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
  className?: string;
  onLayerSelect?: (objectIds: string[]) => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  canvas,
  selectedObjects,
  className,
  onLayerSelect
}) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  // Update layers when canvas or selected objects change
  useEffect(() => {
    if (!canvas) return;
    
    // Convert canvas objects to layer info structure
    const updateLayers = () => {
      const objects = canvas.getObjects().filter(obj => {
        // Ignore grid lines and guide objects
        return !obj.data?.type?.includes('grid') && 
               !obj.data?.type?.includes('guide') &&
               !obj.data?.type?.includes('dropZone');
      });
      
      // Get selected object IDs
      const selectedIds = selectedObjects.map(o => o.data?.id || '');
      
      // Convert to layer info
      const layerInfos: LayerInfo[] = objects.map(obj => {
        const id = obj.data?.id || String(obj.zIndex);
        const isSelected = selectedIds.includes(id);
        
        return {
          id,
          name: obj.data?.name || obj.data?.type || 'Object',
          type: obj.data?.type || obj.type || 'shape',
          zIndex: obj.zIndex || 0,
          visible: obj.visible !== false,
          locked: obj.lockMovementX && obj.lockMovementY,
          selected: isSelected,
          children: obj.data?.children?.map((child: any) => ({
            id: child.data?.id || String(child.zIndex),
            name: child.data?.name || child.data?.type || 'Child Object',
            type: child.data?.type || child.type || 'shape',
            zIndex: child.zIndex || 0,
            visible: child.visible !== false,
            locked: child.lockMovementX && child.lockMovementY,
            selected: false
          })) || []
        };
      }).sort((a, b) => b.zIndex - a.zIndex);
      
      setLayers(layerInfos);
    };
    
    // Initial update
    updateLayers();
    
    // Set up event listeners for canvas changes
    const handleObjectAdded = () => updateLayers();
    const handleObjectRemoved = () => updateLayers();
    const handleObjectModified = () => updateLayers();
    const handleSelectionCreated = () => updateLayers();
    const handleSelectionUpdated = () => updateLayers();
    const handleSelectionCleared = () => updateLayers();
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, selectedObjects]);
  
  // Handle layer selection
  const handleLayerSelect = (id: string) => {
    if (!canvas) return;
    
    // Find the object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === id);
    if (!object) return;
    
    // Select the object in canvas
    canvas.discardActiveObject();
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
    
    // Notify parent component if callback provided
    if (onLayerSelect) {
      onLayerSelect([id]);
    }
  };
  
  // Handle layer visibility toggle
  const handleVisibilityToggle = (id: string) => {
    if (!canvas) return;
    
    // Find the object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === id);
    if (!object) return;
    
    // Toggle visibility
    object.visible = !object.visible;
    canvas.requestRenderAll();
  };
  
  // Handle layer lock toggle
  const handleLockToggle = (id: string) => {
    if (!canvas) return;
    
    // Find the object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === id);
    if (!object) return;
    
    // Toggle lock
    const isLocked = object.lockMovementX && object.lockMovementY;
    object.lockMovementX = !isLocked;
    object.lockMovementY = !isLocked;
    object.selectable = isLocked;
    canvas.requestRenderAll();
  };
  
  // Move layer up in z-index
  const handleMoveUp = (id: string) => {
    if (!canvas) return;
    
    // Find the object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === id);
    if (!object) return;
    
    // Bring forward
    object.bringForward();
    canvas.requestRenderAll();
  };
  
  // Move layer down in z-index
  const handleMoveDown = (id: string) => {
    if (!canvas) return;
    
    // Find the object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === id);
    if (!object) return;
    
    // Send backward
    object.sendBackwards();
    canvas.requestRenderAll();
  };
  
  // Delete layer
  const handleDelete = (id: string) => {
    if (!canvas) return;
    
    // Find the object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === id);
    if (!object) return;
    
    // Remove object
    canvas.remove(object);
    canvas.requestRenderAll();
  };
  
  // Group selected layers
  const handleGroupSelected = () => {
    if (!canvas) return;
    
    // Get active selection or selected objects
    const activeObject = canvas.getActiveObject();
    if (!activeObject || !fabric.util.object.isType(activeObject, 'activeSelection')) return;
    
    // Group the objects
    const group = (activeObject as fabric.ActiveSelection).toGroup();
    
    // Add custom data to the group
    group.data = {
      id: `group-${Date.now()}`,
      type: 'group',
      name: 'Group'
    };
    
    canvas.requestRenderAll();
  };
  
  // Ungroup selected group
  const handleUngroup = (id: string) => {
    if (!canvas) return;
    
    // Find the group by ID
    const group = canvas.getObjects().find(obj => obj.data?.id === id && fabric.util.object.isType(obj, 'group'));
    if (!group || !fabric.util.object.isType(group, 'group')) return;
    
    // Ungroup
    const items = (group as fabric.Group).getObjects();
    (group as fabric.Group).destroy();
    canvas.remove(group);
    
    // Add the individual objects back to canvas
    canvas.add(...items);
    canvas.requestRenderAll();
  };
  
  // Toggle expanded state for a group
  const toggleGroupExpanded = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <Card className={cn("layer-manager", className)}>
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="flex justify-between px-4 mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGroupSelected}
            disabled={!selectedObjects || selectedObjects.length < 2}
          >
            <Group className="h-4 w-4 mr-1" />
            Group
          </Button>
        </div>
        
        <Separator className="my-2" />
        
        {layers.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No layers available
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {layers.map(layer => (
              <LayerItem 
                key={layer.id}
                layer={layer}
                isExpanded={expandedGroups[layer.id] || false}
                onSelect={() => handleLayerSelect(layer.id)}
                onVisibilityToggle={() => handleVisibilityToggle(layer.id)}
                onLockToggle={() => handleLockToggle(layer.id)}
                onMoveUp={() => handleMoveUp(layer.id)}
                onMoveDown={() => handleMoveDown(layer.id)}
                onDelete={() => handleDelete(layer.id)}
                onToggleExpand={() => toggleGroupExpanded(layer.id)}
                onUngroup={layer.type === 'group' ? () => handleUngroup(layer.id) : undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LayerManager;
