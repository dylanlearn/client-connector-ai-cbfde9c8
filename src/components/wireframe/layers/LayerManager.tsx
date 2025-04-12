
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Eye, EyeOff, Lock, Unlock, ChevronsUp, ChevronsDown, Copy, Trash, Group } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import LayerPanel from './LayerPanel';
import { LayerInfo } from '../utils/types';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
  className?: string;
}

const LayerManager: React.FC<LayerManagerProps> = ({ canvas, selectedObjects, className }) => {
  const { toast } = useToast();
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | undefined>(undefined);
  
  // Update layers when canvas or selected objects change
  useEffect(() => {
    if (!canvas) return;
    
    // Convert fabric objects to layer items
    const updateLayerList = () => {
      const fabricObjects = canvas.getObjects();
      const layerItems: LayerInfo[] = fabricObjects.map(obj => ({
        id: obj.data?.id || obj.id || `obj-${fabricObjects.indexOf(obj)}`,
        name: obj.data?.name || obj.type || 'Untitled',
        type: obj.type || 'object',
        visible: obj.visible !== false,
        locked: obj.locked || false,
        selected: selectedObjects.includes(obj),
        zIndex: obj.zIndex || fabricObjects.indexOf(obj),
        isGroup: obj.type === 'group',
        children: obj.type === 'group' ? getGroupChildren(obj as fabric.Group) : [],
        data: obj.data || {}
      }));
      
      // Sort by zIndex
      layerItems.sort((a, b) => b.zIndex - a.zIndex);
      
      setLayers(layerItems);
      
      // Update selected layer ID
      if (selectedObjects.length === 1) {
        const selectedObj = selectedObjects[0];
        setSelectedLayerId(selectedObj.data?.id || selectedObj.id || undefined);
      } else if (selectedObjects.length === 0) {
        setSelectedLayerId(undefined);
      }
    };
    
    // Get children of a group
    const getGroupChildren = (group: fabric.Group): LayerInfo[] => {
      if (!group._objects) return [];
      
      return group._objects.map((obj, index) => ({
        id: obj.data?.id || obj.id || `group-child-${index}`,
        name: obj.data?.name || obj.type || `Item ${index + 1}`,
        type: obj.type || 'object',
        visible: obj.visible !== false,
        locked: obj.locked || false,
        selected: false,
        zIndex: index,
        isGroup: obj.type === 'group',
        children: obj.type === 'group' ? getGroupChildren(obj as fabric.Group) : [],
        data: obj.data || {}
      }));
    };
    
    // Initial update
    updateLayerList();
    
    // Set up event listeners
    const handleObjectAdded = () => updateLayerList();
    const handleObjectRemoved = () => updateLayerList();
    const handleObjectModified = () => updateLayerList();
    const handleSelectionCreated = () => updateLayerList();
    const handleSelectionUpdated = () => updateLayerList();
    const handleSelectionCleared = () => updateLayerList();
    
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
  
  // Handle selecting a layer
  const handleSelectLayer = (layerId: string) => {
    if (!canvas) return;
    
    setSelectedLayerId(layerId);
    
    // Find the corresponding canvas object
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      // Deselect all objects first
      canvas.discardActiveObject();
      
      // Select the object
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
    }
  };
  
  // Find an object by ID
  const findObjectById = (canvas: fabric.Canvas, id: string): fabric.Object | null => {
    const objects = canvas.getObjects();
    
    for (const obj of objects) {
      if ((obj.data?.id || obj.id) === id) {
        return obj;
      }
      
      // Check group children if it's a group
      if (obj.type === 'group' && (obj as fabric.Group)._objects) {
        const groupObj = obj as fabric.Group;
        for (const child of groupObj._objects) {
          if ((child.data?.id || child.id) === id) {
            return child;
          }
        }
      }
    }
    
    return null;
  };
  
  // Toggle layer visibility
  const handleToggleLayerVisibility = (layerId: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      obj.visible = !obj.visible;
      canvas.requestRenderAll();
      
      toast({
        title: obj.visible ? 'Layer Visible' : 'Layer Hidden',
        description: `Layer "${obj.data?.name || obj.type || 'Untitled'}" ${obj.visible ? 'is now visible' : 'is now hidden'}.`
      });
    }
  };
  
  // Toggle layer lock
  const handleToggleLayerLock = (layerId: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      obj.locked = !obj.locked;
      obj.selectable = !obj.locked;
      obj.evented = !obj.locked;
      
      canvas.requestRenderAll();
      
      toast({
        title: obj.locked ? 'Layer Locked' : 'Layer Unlocked',
        description: `Layer "${obj.data?.name || obj.type || 'Untitled'}" ${obj.locked ? 'is now locked' : 'is now editable'}.`
      });
      
      // Update layers list
      setLayers(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, locked: obj.locked } : layer
      ));
    }
  };
  
  // Delete a layer
  const handleDeleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      canvas.remove(obj);
      
      toast({
        title: 'Layer Deleted',
        description: `Layer "${obj.data?.name || obj.type || 'Untitled'}" has been removed.`
      });
    }
  };
  
  // Duplicate a layer
  const handleDuplicateLayer = (layerId: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      obj.clone((cloned: fabric.Object) => {
        if (cloned) {
          // Offset the clone slightly
          if (cloned.left !== undefined) cloned.left += 20;
          if (cloned.top !== undefined) cloned.top += 20;
          
          // Add new id and data
          cloned.id = `${obj.type}-${Date.now()}`;
          cloned.data = { ...obj.data, id: cloned.id, name: `Copy of ${obj.data?.name || obj.type || 'Untitled'}` };
          
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.requestRenderAll();
          
          toast({
            title: 'Layer Duplicated',
            description: `Created a copy of "${obj.data?.name || obj.type || 'Untitled'}" layer.`
          });
        }
      });
    }
  };
  
  // Move layer up
  const handleMoveLayerUp = (layerId: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      canvas.bringForward(obj);
      canvas.requestRenderAll();
    }
  };
  
  // Move layer down
  const handleMoveLayerDown = (layerId: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      canvas.sendBackwards(obj);
      canvas.requestRenderAll();
    }
  };
  
  // Rename a layer
  const handleRenameLayer = (layerId: string, newName: string) => {
    if (!canvas) return;
    
    const obj = findObjectById(canvas, layerId);
    
    if (obj) {
      if (!obj.data) obj.data = {};
      obj.data.name = newName;
      
      canvas.requestRenderAll();
      
      toast({
        title: 'Layer Renamed',
        description: `Layer has been renamed to "${newName}".`
      });
      
      // Update layers list
      setLayers(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, name: newName } : layer
      ));
    }
  };
  
  // Create a group from selected objects
  const handleCreateGroup = (layerIds: string[]) => {
    if (!canvas) return;
    
    // If no layer IDs provided, use selected objects
    const idsToGroup = layerIds.length > 0 ? layerIds : selectedObjects.map(obj => obj.data?.id || obj.id);
    
    if (idsToGroup.length < 2) {
      toast({
        title: 'Group Creation Failed',
        description: 'Select at least 2 objects to create a group.',
        variant: 'destructive'
      });
      return;
    }
    
    // Find all objects to group
    const objectsToGroup: fabric.Object[] = [];
    
    for (const id of idsToGroup) {
      const obj = findObjectById(canvas, id);
      if (obj) objectsToGroup.push(obj);
    }
    
    if (objectsToGroup.length < 2) return;
    
    // Create group
    canvas.discardActiveObject();
    const group = new fabric.Group(objectsToGroup, {
      id: `group-${Date.now()}`,
      data: {
        id: `group-${Date.now()}`,
        name: 'Group',
        type: 'group'
      }
    });
    
    // Remove original objects and add group
    objectsToGroup.forEach(obj => canvas.remove(obj));
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    
    toast({
      title: 'Group Created',
      description: `Created a group with ${objectsToGroup.length} objects.`
    });
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Layers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <LayerPanel
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={handleSelectLayer}
          onToggleLayerVisibility={handleToggleLayerVisibility}
          onToggleLayerLock={handleToggleLayerLock}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onMoveLayerUp={handleMoveLayerUp}
          onMoveLayerDown={handleMoveLayerDown}
          onRenameLayer={handleRenameLayer}
          onCreateGroup={handleCreateGroup}
          className="border-0 shadow-none"
        />
      </CardContent>
    </Card>
  );
};

export default LayerManager;
