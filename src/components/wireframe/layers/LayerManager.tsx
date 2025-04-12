
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Group, Ungroup, Plus, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import LayerItem from './LayerItem';
import { 
  convertCanvasObjectsToLayers, 
  LayerItem as LayerItemType,
  toggleLayerVisibility,
  toggleLayerLock,
  moveLayerUp,
  moveLayerDown,
  moveLayerToTop,
  moveLayerToBottom,
  renameLayer,
  createLayerGroup,
  ungroupLayers
} from '../utils/layer-utils';
import { useToast } from '@/hooks/use-toast';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  className?: string;
}

const LayerManager: React.FC<LayerManagerProps> = ({ canvas, className }) => {
  const [layers, setLayers] = useState<LayerItemType[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayers = () => {
      // Get selected objects IDs
      const selectedObjects = canvas.getActiveObjects();
      const selectedIds = selectedObjects.map(obj => obj.data?.id || String(obj.id));
      
      // Convert canvas objects to layer items
      const layerItems = convertCanvasObjectsToLayers(canvas, selectedIds);
      setLayers(layerItems);
      
      // Update selected layer ID
      if (selectedIds.length === 1 && selectedIds[0]) {
        setSelectedLayerId(selectedIds[0]);
      } else if (selectedIds.length === 0) {
        setSelectedLayerId(null);
      }
    };
    
    // Initial update
    updateLayers();
    
    // Listen for canvas events
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', updateLayers);
    canvas.on('selection:updated', updateLayers);
    canvas.on('selection:cleared', updateLayers);
    
    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
      canvas.off('selection:created', updateLayers);
      canvas.off('selection:updated', updateLayers);
      canvas.off('selection:cleared', updateLayers);
    };
  }, [canvas]);
  
  // Filter layers by search query
  const filteredLayers = searchQuery 
    ? layers.filter(layer => layer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : layers;
  
  // Handle layer selection
  const handleLayerSelect = (layerId: string) => {
    if (!canvas) return;
    
    // Find object by ID
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === layerId;
    });
    
    if (object) {
      canvas.discardActiveObject();
      canvas.setActiveObject(object);
      canvas.renderAll();
      
      setSelectedLayerId(layerId);
    }
  };
  
  // Handle layer visibility toggle
  const handleToggleVisibility = (layerId: string) => {
    if (!canvas) return;
    
    const success = toggleLayerVisibility(canvas, layerId);
    if (success) {
      // Update layers
      setLayers(prevLayers => 
        prevLayers.map(layer => 
          layer.id === layerId 
            ? { ...layer, visible: !layer.visible } 
            : layer
        )
      );
    }
  };
  
  // Handle layer lock toggle
  const handleToggleLock = (layerId: string) => {
    if (!canvas) return;
    
    const success = toggleLayerLock(canvas, layerId);
    if (success) {
      // Update layers
      setLayers(prevLayers => 
        prevLayers.map(layer => 
          layer.id === layerId 
            ? { ...layer, locked: !layer.locked } 
            : layer
        )
      );
    }
  };
  
  // Handle layer deletion
  const handleDeleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    // Find object by ID
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === layerId;
    });
    
    if (object) {
      canvas.remove(object);
      canvas.renderAll();
      
      toast({
        title: "Layer deleted",
        description: "The layer has been removed from the canvas"
      });
    }
  };
  
  // Handle layer duplication
  const handleDuplicateLayer = (layerId: string) => {
    if (!canvas) return;
    
    // Find object by ID
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === layerId;
    });
    
    if (object) {
      // Clone the object
      object.clone((clone: fabric.Object) => {
        clone.set({
          left: (object.left || 0) + 20,
          top: (object.top || 0) + 20,
          data: {
            ...object.data,
            id: `${object.data?.type || 'layer'}-${Date.now()}`,
            name: `${object.data?.name || 'Layer'} (copy)`
          }
        });
        
        canvas.add(clone);
        canvas.setActiveObject(clone);
        canvas.renderAll();
        
        toast({
          title: "Layer duplicated",
          description: "A copy of the layer has been created"
        });
      });
    }
  };
  
  // Handle layer move up
  const handleMoveLayerUp = (layerId: string) => {
    if (!canvas) return;
    
    const success = moveLayerUp(canvas, layerId);
    if (success) {
      toast({
        title: "Layer moved up",
        description: "Layer z-index has been updated"
      });
    }
  };
  
  // Handle layer move down
  const handleMoveLayerDown = (layerId: string) => {
    if (!canvas) return;
    
    const success = moveLayerDown(canvas, layerId);
    if (success) {
      toast({
        title: "Layer moved down",
        description: "Layer z-index has been updated"
      });
    }
  };
  
  // Create layer group
  const handleCreateGroup = () => {
    if (!canvas) return;
    
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length < 2) {
      toast({
        title: "Cannot create group",
        description: "Select at least two layers to create a group",
        variant: "destructive"
      });
      return;
    }
    
    const layerIds = selectedObjects.map(obj => obj.data?.id || String(obj.id));
    const group = createLayerGroup(canvas, layerIds);
    
    if (group) {
      toast({
        title: "Group created",
        description: `Created group with ${selectedObjects.length} layers`
      });
    }
  };
  
  // Ungroup layers
  const handleUngroup = (layerId: string) => {
    if (!canvas) return;
    
    const success = ungroupLayers(canvas, layerId);
    if (success) {
      toast({
        title: "Group ungrouped",
        description: "The group has been split into individual layers"
      });
    }
  };
  
  // Handle layer rename
  const handleRenameLayer = (layerId: string, newName: string) => {
    if (!canvas) return;
    
    const success = renameLayer(canvas, layerId, newName);
    if (success) {
      toast({
        title: "Layer renamed",
        description: `Layer name changed to "${newName}"`
      });
    }
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Layers
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {layers.length} {layers.length === 1 ? 'layer' : 'layers'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Search layers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex flex-row gap-2">
            <Button
              variant="outline" 
              size="sm"
              onClick={handleCreateGroup}
              disabled={!canvas || canvas.getActiveObjects().length < 2}
              className="flex-1"
            >
              <Group className="h-4 w-4 mr-1" />
              Group
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedLayerId || !canvas}
              onClick={() => {
                if (selectedLayerId) {
                  moveLayerToTop(canvas!, selectedLayerId);
                }
              }}
              className="flex-none"
              title="Move to top"
            >
              <ArrowUpToLine className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedLayerId || !canvas}
              onClick={() => {
                if (selectedLayerId) {
                  moveLayerToBottom(canvas!, selectedLayerId);
                }
              }}
              className="flex-none"
              title="Move to bottom"
            >
              <ArrowDownToLine className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filteredLayers.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                {searchQuery ? 'No layers match your search' : 'No layers available'}
              </div>
            ) : (
              filteredLayers.map(layer => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  isSelected={layer.id === selectedLayerId}
                  onSelect={handleLayerSelect}
                  onToggleVisibility={handleToggleVisibility}
                  onToggleLock={handleToggleLock}
                  onDelete={handleDeleteLayer}
                  onDuplicate={handleDuplicateLayer}
                  onMoveUp={handleMoveLayerUp}
                  onMoveDown={handleMoveLayerDown}
                  onRename={handleRenameLayer}
                  onUngroup={layer.type === 'group' ? handleUngroup : undefined}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerManager;
