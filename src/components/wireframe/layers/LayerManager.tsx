
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LayersIcon, PlusIcon, GroupIcon, Eye, EyeOff, Lock, Unlock, Trash2, Copy } from 'lucide-react';
import { LayerItem } from '@/components/wireframe/layers/LayerItem';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LayerInfo } from '@/components/wireframe/utils/types';
import { getFlatLayerList, groupSelectedLayers } from '@/components/wireframe/utils/layer-utils';
import { fabric } from 'fabric';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
  className?: string;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  canvas,
  selectedObjects = [],
  className
}) => {
  const { toast } = useToast();
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Update layers when canvas or selected objects change
  useEffect(() => {
    if (!canvas) return;
    
    updateLayersList();
    
    // Set up event listeners for canvas changes
    canvas.on('object:added', updateLayersList);
    canvas.on('object:removed', updateLayersList);
    canvas.on('object:modified', updateLayersList);
    canvas.on('selection:created', updateSelectionFromCanvas);
    canvas.on('selection:updated', updateSelectionFromCanvas);
    canvas.on('selection:cleared', clearLayerSelection);
    
    return () => {
      // Clean up event listeners
      canvas.off('object:added', updateLayersList);
      canvas.off('object:removed', updateLayersList);
      canvas.off('object:modified', updateLayersList);
      canvas.off('selection:created', updateSelectionFromCanvas);
      canvas.off('selection:updated', updateSelectionFromCanvas);
      canvas.off('selection:cleared', clearLayerSelection);
    };
  }, [canvas]);
  
  // Update selected layer IDs when selected objects change
  useEffect(() => {
    if (selectedObjects.length > 0) {
      const ids = selectedObjects
        .map(obj => obj.data?.id || String(obj.zIndex))
        .filter(Boolean);
      setSelectedLayerIds(ids);
    } else {
      setSelectedLayerIds([]);
    }
  }, [selectedObjects]);
  
  // Update the layers list from canvas
  const updateLayersList = () => {
    if (!canvas) return;
    
    const allLayers = getFlatLayerList(canvas, selectedLayerIds);
    setLayers(allLayers);
  };
  
  // Update selection from canvas selection
  const updateSelectionFromCanvas = () => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    const ids = activeObjects
      .map(obj => obj.data?.id || String(obj.zIndex))
      .filter(Boolean);
    
    setSelectedLayerIds(ids);
  };
  
  // Clear layer selection
  const clearLayerSelection = () => {
    setSelectedLayerIds([]);
  };
  
  // Handle layer selection
  const handleSelectLayer = (layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === layerId);
    
    if (targetObject) {
      canvas.discardActiveObject();
      canvas.setActiveObject(targetObject);
      canvas.requestRenderAll();
    }
    
    setSelectedLayerIds([layerId]);
  };
  
  // Toggle layer visibility
  const handleToggleVisibility = (layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === layerId);
    
    if (targetObject) {
      targetObject.visible = !targetObject.visible;
      canvas.requestRenderAll();
      
      toast({
        title: targetObject.visible ? 'Layer Shown' : 'Layer Hidden',
        description: `Layer ${targetObject.data?.name || 'Unknown'} is now ${targetObject.visible ? 'visible' : 'hidden'}.`
      });
      
      updateLayersList();
    }
  };
  
  // Toggle layer lock
  const handleToggleLock = (layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === layerId);
    
    if (targetObject) {
      const isLocked = targetObject.lockMovementX && targetObject.lockMovementY;
      
      targetObject.lockMovementX = !isLocked;
      targetObject.lockMovementY = !isLocked;
      targetObject.selectable = isLocked;
      
      canvas.requestRenderAll();
      
      toast({
        title: isLocked ? 'Layer Unlocked' : 'Layer Locked',
        description: `Layer ${targetObject.data?.name || 'Unknown'} is now ${isLocked ? 'unlocked' : 'locked'}.`
      });
      
      updateLayersList();
    }
  };
  
  // Delete layer
  const handleDeleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === layerId);
    
    if (targetObject) {
      canvas.remove(targetObject);
      
      toast({
        title: 'Layer Deleted',
        description: `Layer ${targetObject.data?.name || 'Unknown'} has been deleted.`
      });
      
      updateLayersList();
    }
  };
  
  // Duplicate layer
  const handleDuplicateLayer = (layerId: string) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === layerId);
    
    if (targetObject) {
      targetObject.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (targetObject.left || 0) + 20,
          top: (targetObject.top || 0) + 20,
          data: {
            ...targetObject.data,
            id: uuidv4(),
            name: `${targetObject.data?.name || 'Layer'} (Copy)`
          }
        });
        
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        
        toast({
          title: 'Layer Duplicated',
          description: `Layer ${targetObject.data?.name || 'Unknown'} has been duplicated.`
        });
        
        updateLayersList();
      });
    }
  };
  
  // Create layer group
  const handleCreateGroup = () => {
    if (!canvas || selectedLayerIds.length < 2) {
      toast({
        title: 'Cannot Create Group',
        description: 'Select at least two layers to create a group.',
        variant: 'destructive'
      });
      return;
    }
    
    const groupId = groupSelectedLayers(canvas, `Group ${layers.filter(l => l.type === 'group').length + 1}`);
    
    if (groupId) {
      toast({
        title: 'Group Created',
        description: 'Selected layers have been grouped together.'
      });
      
      updateLayersList();
    } else {
      toast({
        title: 'Failed to Create Group',
        description: 'Could not create group from selected layers.',
        variant: 'destructive'
      });
    }
  };
  
  // Filter layers by search term
  const filteredLayers = searchTerm 
    ? layers.filter(layer => layer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : layers;
  
  return (
    <Card className={cn("layer-manager", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <LayersIcon className="mr-2 h-5 w-5" />
          Layers
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search layers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1"
            />
            
            <Button 
              size="sm" 
              variant="outline" 
              title="Create Group" 
              disabled={selectedLayerIds.length < 2}
              onClick={handleCreateGroup}
            >
              <GroupIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="layer-list max-h-[300px] overflow-y-auto border rounded-md">
            {filteredLayers.length > 0 ? (
              <div className="py-1">
                {filteredLayers.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    isSelected={selectedLayerIds.includes(layer.id)}
                    depth={layer.depth || 0}
                    onSelect={handleSelectLayer}
                    onToggleVisibility={handleToggleVisibility}
                    onToggleLock={handleToggleLock}
                    onDelete={handleDeleteLayer}
                    onDuplicate={handleDuplicateLayer}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? 'No matching layers found' : 'No layers available'}
              </div>
            )}
          </div>
          
          <div className="layer-info text-xs text-muted-foreground">
            Total: {layers.length} layers
            {selectedLayerIds.length > 0 && ` (${selectedLayerIds.length} selected)`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerManager;
