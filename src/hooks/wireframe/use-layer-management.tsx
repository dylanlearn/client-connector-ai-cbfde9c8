
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { convertCanvasObjectsToLayers, LayerItem } from '@/components/wireframe/utils/layer-utils';

export function useLayerManagement(canvas: fabric.Canvas | null) {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  
  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayersList = () => {
      const selectedIds = canvas.getActiveObjects().map(obj => obj.data?.id || obj.id || String(obj.zIndex));
      const layerItems = convertCanvasObjectsToLayers(canvas, selectedIds);
      setLayers(layerItems);
      setSelectedObjects(canvas.getActiveObjects());
    };
    
    // Initial update
    updateLayersList();
    
    // Setup event listeners
    canvas.on('object:added', updateLayersList);
    canvas.on('object:removed', updateLayersList);
    canvas.on('object:modified', updateLayersList);
    canvas.on('selection:created', updateLayersList);
    canvas.on('selection:updated', updateLayersList);
    canvas.on('selection:cleared', updateLayersList);
    
    return () => {
      // Cleanup event listeners
      canvas.off('object:added', updateLayersList);
      canvas.off('object:removed', updateLayersList);
      canvas.off('object:modified', updateLayersList);
      canvas.off('selection:created', updateLayersList);
      canvas.off('selection:updated', updateLayersList);
      canvas.off('selection:cleared', updateLayersList);
    };
  }, [canvas]);

  return { layers, selectedObjects };
}
