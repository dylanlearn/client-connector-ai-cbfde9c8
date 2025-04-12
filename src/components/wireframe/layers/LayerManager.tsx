
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Layers, Search, Plus, Group, Ungroup } from 'lucide-react';
import { fabric } from 'fabric';
import LayerItem from './LayerItem';
import { convertCanvasObjectsToLayers, applyLayerSettingsToObject, groupSelectedLayers, ungroupLayer, getFlatLayerList } from '../utils/layer-utils';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
}

const LayerManager: React.FC<LayerManagerProps> = ({ canvas, selectedObjects }) => {
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update layers list when canvas or selected objects change
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayers = () => {
      // Convert selected objects to IDs for easy lookup
      const selectedIds = selectedObjects.map(obj => {
        return obj.data?.id || String(obj.zIndex);
      });
      
      // Get all layers from canvas
      const allLayers = getFlatLayerList(canvas, selectedIds);
      setLayers(allLayers);
      setSelectedLayerIds(selectedIds);
    };
    
    // Initial update
    updateLayers();
    
    // Set up event listeners for changes
    const handleObjectModified = () => updateLayers();
    const handleSelectionCleared = () => {
      setSelectedLayerIds([]);
      updateLayers();
    };
    const handleSelectionCreated = () => updateLayers();
    const handleSelectionUpdated = () => updateLayers();
    const handleObjectAdded = () => updateLayers();
    const handleObjectRemoved = () => updateLayers();
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Cleanup event listeners
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, selectedObjects]);
  
  // Filter layers based on search term
  const filteredLayers = searchTerm
    ? layers.filter(layer => layer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : layers;
  
  // Handler for selecting a layer
  const handleLayerSelect = (layerId: string) => {
    if (!canvas) return;
    
    // Clear current selection
    canvas.discardActiveObject();
    
    // Find object by ID
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    // Select this object
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  };
  
  // Handler for toggling layer visibility
  const handleToggleVisibility = (layerId: string) => {
    if (!canvas) return;
    
    applyLayerSettingsToObject(canvas, layerId, {
      visible: !layers.find(layer => layer.id === layerId)?.visible
    });
  };
  
  // Handler for toggling layer lock
  const handleToggleLock = (layerId: string) => {
    if (!canvas) return;
    
    applyLayerSettingsToObject(canvas, layerId, {
      locked: !layers.find(layer => layer.id === layerId)?.locked
    });
  };
  
  // Handler for deleting a layer
  const handleDeleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    canvas.remove(object);
    canvas.requestRenderAll();
  };
  
  // Handler for duplicating a layer
  const handleDuplicateLayer = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    object.clone((clone: fabric.Object) => {
      // Offset the clone slightly
      clone.set({
        left: (clone.left || 0) + 10,
        top: (clone.top || 0) + 10,
        data: {
          ...object.data,
          id: `${object.data?.id || 'layer'}-copy-${Date.now()}`
        }
      });
      
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.requestRenderAll();
    });
  };
  
  // Handler for moving a layer up in the stack (increase z-index)
  const handleMoveLayerUp = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    // Get all objects except grid and guidelines
    const regularObjects = canvas.getObjects().filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline
    );
    
    // Find the current index of the object
    const currentIndex = regularObjects.indexOf(object);
    
    // If object is already at the top, do nothing
    if (currentIndex === regularObjects.length - 1) return;
    
    // Bring object forward one level
    canvas.bringForward(object);
    
    // Update z-index values for all objects
    updateZIndicesAfterReorder(canvas);
    
    canvas.requestRenderAll();
  };
  
  // Handler for moving a layer down in the stack (decrease z-index)
  const handleMoveLayerDown = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    // Get all objects except grid and guidelines
    const regularObjects = canvas.getObjects().filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline
    );
    
    // Find the current index of the object
    const currentIndex = regularObjects.indexOf(object);
    
    // If object is already at the bottom, do nothing
    if (currentIndex === 0) return;
    
    // Send object backward one level
    canvas.sendBackwards(object);
    
    // Update z-index values for all objects
    updateZIndicesAfterReorder(canvas);
    
    canvas.requestRenderAll();
  };
  
  // Handler for bringing a layer to the front of the stack
  const handleBringToFront = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    // Bring object to front
    canvas.bringToFront(object);
    
    // Update z-index values for all objects
    updateZIndicesAfterReorder(canvas);
    
    canvas.requestRenderAll();
  };
  
  // Handler for sending a layer to the back of the stack
  const handleSendToBack = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => obj.data?.id === layerId);
    if (!object) return;
    
    // Send object to back
    canvas.sendToBack(object);
    
    // Update z-index values for all objects
    updateZIndicesAfterReorder(canvas);
    
    canvas.requestRenderAll();
  };
  
  // Utility function to update z-index values after reordering
  const updateZIndicesAfterReorder = (canvas: fabric.Canvas) => {
    // Get all objects except grid and guidelines
    const regularObjects = canvas.getObjects().filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline
    );
    
    // Update z-index values based on current stack order
    regularObjects.forEach((obj, idx) => {
      obj.zIndex = idx;
    });
  };
  
  // Handler for renaming a layer
  const handleRenameLayer = (layerId: string, name: string) => {
    if (!canvas) return;
    
    applyLayerSettingsToObject(canvas, layerId, { name });
  };
  
  // Handler for creating a group
  const handleCreateGroup = () => {
    if (!canvas || selectedObjects.length < 2) return;
    
    // Group the selected objects
    const groupId = groupSelectedLayers(canvas, 'New Group');
    canvas.requestRenderAll();
  };
  
  // Handler for ungrouping a layer
  const handleUngroupLayer = (layerId: string) => {
    if (!canvas) return;
    
    const wasUngrouped = ungroupLayer(canvas, layerId);
    if (wasUngrouped) {
      canvas.requestRenderAll();
    }
  };
  
  // Detect if current selection can be grouped
  const canGroup = selectedObjects.length > 1;
  
  // Detect if current selection is a group that can be ungrouped
  const canUngroup = selectedObjects.length === 1 && 
    selectedObjects[0].type === 'group';
  
  return (
    <Card className="layer-manager">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base font-medium">
          <Layers className="h-4 w-4 mr-2" />
          Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-3">
          {/* Search and actions row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search layers..."
                className="pl-8 h-8 text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8"
              title="Create group"
              disabled={!canGroup}
              onClick={handleCreateGroup}
            >
              <Group className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8"
              title="Ungroup selection"
              disabled={!canUngroup}
              onClick={() => {
                const groupObj = selectedObjects[0];
                if (groupObj && groupObj.data?.id) {
                  handleUngroupLayer(groupObj.data.id);
                }
              }}
            >
              <Ungroup className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Layers list */}
          <div className="space-y-0.5 max-h-[300px] overflow-y-auto p-1 -mx-1">
            {filteredLayers.length > 0 ? (
              filteredLayers.map(layer => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedLayerIds.includes(layer.id)}
                  onSelect={() => handleLayerSelect(layer.id)}
                  onToggleVisibility={() => handleToggleVisibility(layer.id)}
                  onToggleLock={() => handleToggleLock(layer.id)}
                  onDelete={() => handleDeleteLayer(layer.id)}
                  onDuplicate={() => handleDuplicateLayer(layer.id)}
                  onMoveUp={() => handleMoveLayerUp(layer.id)}
                  onMoveDown={() => handleMoveLayerDown(layer.id)}
                  onRename={(name) => handleRenameLayer(layer.id, name)}
                  onBringToFront={() => handleBringToFront(layer.id)}
                  onSendToBack={() => handleSendToBack(layer.id)}
                  depth={layer.depth}
                />
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {searchTerm ? 'No matching layers found' : 'No layers available'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerManager;
