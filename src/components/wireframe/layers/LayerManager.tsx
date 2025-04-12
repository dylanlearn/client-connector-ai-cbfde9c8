
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { fabric } from 'fabric';
import LayerItem from './LayerItem';
import { LayerInfo } from '@/components/wireframe/utils/types';
import { convertCanvasObjectsToLayers, applyLayerSettingsToObject } from '@/components/wireframe/utils/layer-utils';
import { Button } from '@/components/ui/button';
import GroupingControls from '@/components/wireframe/controls/GroupingControls';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
}

const LayerManager: React.FC<LayerManagerProps> = ({ 
  canvas,
  selectedObjects
}) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);

  // Update layers when canvas objects change
  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects().filter(obj => !obj.data?.isGridLine && !obj.data?.isGuideline);
      const newLayers = convertCanvasObjectsToLayers(objects);
      setLayers(newLayers);
    };

    updateLayers();

    // Listen for object changes
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

  // Update selected layers when canvas selection changes
  useEffect(() => {
    if (!selectedObjects.length) {
      setSelectedLayerIds([]);
      return;
    }

    const ids = selectedObjects
      .map(obj => obj.data?.id)
      .filter((id): id is string => id !== undefined);

    setSelectedLayerIds(ids);
  }, [selectedObjects]);

  // Layer manipulation handlers
  const handleSelectLayer = (layerId: string) => {
    if (!canvas) return;

    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;

    // Select the object in the canvas
    canvas.discardActiveObject();
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  const handleToggleLayerVisibility = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Toggle visibility
    obj.visible = !obj.visible;
    
    // Update layer state
    applyLayerSettingsToObject(obj, { visible: obj.visible });
    
    canvas.requestRenderAll();
  };

  const handleToggleLayerLock = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Toggle lock state
    const locked = !obj.lockMovementX;
    
    // Update layer state
    applyLayerSettingsToObject(obj, { locked });
    
    canvas.requestRenderAll();
  };

  const handleDeleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Remove the object
    canvas.remove(obj);
    canvas.requestRenderAll();
  };

  const handleDuplicateLayer = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Clone the object
    obj.clone((clone: fabric.Object) => {
      clone.set({
        left: (obj.left || 0) + 20,
        top: (obj.top || 0) + 20,
        data: { ...obj.data, id: `object-${Date.now()}` }
      });
      
      canvas.add(clone);
      canvas.setActiveObject(clone);
      canvas.requestRenderAll();
    });
  };

  // Z-index handlers
  const handleBringForward = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Bring forward
    canvas.bringForward(obj);
    updateZIndices(canvas);
    canvas.requestRenderAll();
  };

  const handleSendBackward = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Send backward
    canvas.sendBackwards(obj);
    updateZIndices(canvas);
    canvas.requestRenderAll();
  };

  const handleBringToFront = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Bring to front
    canvas.bringToFront(obj);
    updateZIndices(canvas);
    canvas.requestRenderAll();
  };

  const handleSendToBack = (layerId: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj) return;
    
    // Send to back
    canvas.sendToBack(obj);
    updateZIndices(canvas);
    canvas.requestRenderAll();
  };

  // Update z-index values based on canvas stacking order
  const updateZIndices = (canvas: fabric.Canvas) => {
    const objects = canvas.getObjects();
    
    // Filter out grid lines and guidelines
    const regularObjects = objects.filter(obj => 
      !obj.data?.isGridLine && 
      !obj.data?.isGuideline
    );
    
    // Update z-index based on stack position
    regularObjects.forEach((obj, index) => {
      obj.zIndex = index;
    });
  };

  // Rename layer
  const handleRenameLayer = (layerId: string, name: string) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const obj = canvas.getObjects().find(o => o.data?.id === layerId);
    if (!obj || !obj.data) return;
    
    // Update name
    obj.data.name = name;
    canvas.requestRenderAll();
  };

  // Group related handlers
  const handleGroupCreated = () => {
    if (!canvas) return;
    
    // Update layer information after grouping
    const objects = canvas.getObjects().filter(obj => !obj.data?.isGridLine && !obj.data?.isGuideline);
    const newLayers = convertCanvasObjectsToLayers(objects);
    setLayers(newLayers);
  };

  const handleGroupReleased = () => {
    if (!canvas) return;
    
    // Update layer information after ungrouping
    const objects = canvas.getObjects().filter(obj => !obj.data?.isGridLine && !obj.data?.isGuideline);
    const newLayers = convertCanvasObjectsToLayers(objects);
    setLayers(newLayers);
  };

  return (
    <Card className="layer-manager">
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <Layers className="mr-2 h-4 w-4" />
          Layers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-2 space-y-4">
        <GroupingControls 
          canvas={canvas} 
          selectedObjects={selectedObjects}
          onGroupCreated={handleGroupCreated}
          onGroupReleased={handleGroupReleased}
        />
          
        <div className="layers-list space-y-1 max-h-[400px] overflow-y-auto p-1">
          {layers.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No layers available
            </div>
          ) : (
            layers.map(layer => (
              <LayerItem
                key={layer.id}
                layer={layer}
                isSelected={selectedLayerIds.includes(layer.id)}
                onSelect={handleSelectLayer}
                onToggleVisibility={handleToggleLayerVisibility}
                onToggleLock={handleToggleLayerLock}
                onDelete={handleDeleteLayer}
                onDuplicate={handleDuplicateLayer}
                onBringForward={handleBringForward}
                onSendBackward={handleSendBackward}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onRename={handleRenameLayer}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerManager;
