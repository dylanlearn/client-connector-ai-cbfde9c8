
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LayersIcon, 
  EyeIcon, 
  EyeOffIcon, 
  LockIcon, 
  UnlockIcon, 
  TrashIcon, 
  ChevronsUpIcon, 
  ChevronsDownIcon,
  CopyIcon,
  GroupIcon
} from 'lucide-react';
import { fabric } from 'fabric';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LayerItem from './LayerItem';
import { LayerItem as LayerItemType } from '../utils/layer-utils';
import { 
  convertCanvasObjectsToLayers, 
  toggleLayerVisibility, 
  toggleLayerLock,
  moveLayerUp,
  moveLayerDown,
  renameLayer,
  createLayerGroup,
  ungroupLayers
} from '../utils/layer-utils';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  onLayerSelect?: (layerId: string) => void;
  selectedLayerId?: string;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  canvas,
  onLayerSelect,
  selectedLayerId
}) => {
  const [layers, setLayers] = useState<LayerItemType[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  
  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayersList = () => {
      const newLayers = convertCanvasObjectsToLayers(canvas, selectedLayers);
      setLayers(newLayers);
    };
    
    // Initial update
    updateLayersList();
    
    // Update on canvas changes
    canvas.on('object:added', updateLayersList);
    canvas.on('object:removed', updateLayersList);
    canvas.on('object:modified', updateLayersList);
    canvas.on('selection:created', updateLayersList);
    canvas.on('selection:updated', updateLayersList);
    canvas.on('selection:cleared', updateLayersList);
    
    return () => {
      canvas.off('object:added', updateLayersList);
      canvas.off('object:removed', updateLayersList);
      canvas.off('object:modified', updateLayersList);
      canvas.off('selection:created', updateLayersList);
      canvas.off('selection:updated', updateLayersList);
      canvas.off('selection:cleared', updateLayersList);
    };
  }, [canvas, selectedLayers]);
  
  // Handle layer selection
  const handleLayerSelect = (layerId: string) => {
    if (isMultiSelect) {
      // Toggle selection for multi-select
      setSelectedLayers(prev => 
        prev.includes(layerId) 
          ? prev.filter(id => id !== layerId)
          : [...prev, layerId]
      );
    } else {
      // Single selection
      setSelectedLayers([layerId]);
      
      if (onLayerSelect) {
        onLayerSelect(layerId);
      }
      
      // Select the object in canvas
      if (canvas) {
        const objects = canvas.getObjects();
        const targetObject = objects.find(obj => obj.data?.id === layerId);
        
        if (targetObject) {
          canvas.discardActiveObject();
          canvas.setActiveObject(targetObject);
          canvas.requestRenderAll();
        }
      }
    }
  };
  
  // Toggle layer visibility
  const handleToggleVisibility = (layerId: string) => {
    if (canvas) {
      toggleLayerVisibility(canvas, layerId);
    }
  };
  
  // Toggle layer lock
  const handleToggleLock = (layerId: string) => {
    if (canvas) {
      toggleLayerLock(canvas, layerId);
    }
  };
  
  // Delete layer
  const handleDeleteLayer = (layerId: string) => {
    if (canvas) {
      const objects = canvas.getObjects();
      const targetObject = objects.find(obj => obj.data?.id === layerId);
      
      if (targetObject) {
        canvas.remove(targetObject);
        canvas.requestRenderAll();
      }
    }
  };
  
  // Duplicate layer
  const handleDuplicateLayer = (layerId: string) => {
    if (canvas) {
      const objects = canvas.getObjects();
      const targetObject = objects.find(obj => obj.data?.id === layerId);
      
      if (targetObject) {
        // Clone the object
        targetObject.clone((cloned: fabric.Object) => {
          // Modify clone properties
          cloned.set({
            left: (targetObject.left || 0) + 15,
            top: (targetObject.top || 0) + 15,
            evented: true,
          });
          
          // Set new unique ID
          if (!cloned.data) cloned.data = {};
          cloned.data.id = `${layerId}-copy-${Date.now()}`;
          cloned.data.name = `${targetObject.data?.name || 'Layer'} (Copy)`;
          
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.requestRenderAll();
        });
      }
    }
  };
  
  // Move layer up
  const handleMoveUp = (layerId: string) => {
    if (canvas) {
      moveLayerUp(canvas, layerId);
    }
  };
  
  // Move layer down
  const handleMoveDown = (layerId: string) => {
    if (canvas) {
      moveLayerDown(canvas, layerId);
    }
  };
  
  // Rename layer
  const handleRename = (layerId: string, name: string) => {
    if (canvas) {
      renameLayer(canvas, layerId, name);
    }
  };
  
  // Group selected layers
  const handleGroupLayers = () => {
    if (canvas && selectedLayers.length > 1) {
      const group = createLayerGroup(canvas, selectedLayers);
      if (group) {
        setSelectedLayers([group.data?.id as string]);
      }
    }
  };
  
  // Ungroup layer
  const handleUngroup = (layerId: string) => {
    if (canvas) {
      ungroupLayers(canvas, layerId);
    }
  };
  
  // Toggle multi-select mode
  const toggleMultiSelect = () => {
    setIsMultiSelect(!isMultiSelect);
    if (isMultiSelect) {
      // Clear multi-selection when turning off
      setSelectedLayers([]);
    }
  };
  
  return (
    <Card className="layer-manager w-full h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <LayersIcon className="mr-2 h-4 w-4" />
          Layer Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="mb-3 flex justify-between items-center">
          <Button 
            size="sm" 
            variant={isMultiSelect ? "secondary" : "outline"} 
            onClick={toggleMultiSelect}
            className="gap-1 text-xs py-1 h-8"
          >
            <GroupIcon className="h-3 w-3" />
            {isMultiSelect ? 'Cancel Multi-select' : 'Multi-select'}
          </Button>
          
          {isMultiSelect && selectedLayers.length > 1 && (
            <Button 
              size="sm" 
              variant="default" 
              onClick={handleGroupLayers}
              className="gap-1 text-xs py-1 h-8"
            >
              <GroupIcon className="h-3 w-3" />
              Group Selected ({selectedLayers.length})
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100vh-300px)] pr-2 mb-3">
          <div className="space-y-1">
            {layers.map(layer => (
              <LayerItem
                key={layer.id}
                layer={layer}
                isSelected={selectedLayers.includes(layer.id)}
                onSelect={handleLayerSelect}
                onToggleVisibility={handleToggleVisibility}
                onToggleLock={handleToggleLock}
                onDelete={handleDeleteLayer}
                onDuplicate={handleDuplicateLayer}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onRename={handleRename}
                onUngroup={layer.type === 'group' ? handleUngroup : undefined}
              />
            ))}
            
            {layers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>No layers available</p>
                <p className="text-xs mt-1">Add objects to the canvas to create layers</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="text-xs text-muted-foreground">
          <p>Total layers: {layers.length}</p>
          {selectedLayers.length > 0 && (
            <p>Selected: {selectedLayers.length}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerManager;
