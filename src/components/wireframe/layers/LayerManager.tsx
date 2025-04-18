import React, { useState, useEffect, useCallback } from 'react';
import { LayerItem, LayerInfo, LayerOperationResult } from './LayerTypes';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MoreHorizontal, Plus, Eye, EyeOff, Lock, Unlock, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

interface LayerManagerProps {
  initialLayers?: LayerItem[];
  onLayerChange?: (layers: LayerItem[]) => void;
  onLayerSelect?: (layerId: string) => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({ initialLayers = [], onLayerChange, onLayerSelect }) => {
  const [layers, setLayers] = useState<LayerItem[]>(initialLayers);
  const { toast } = useToast();

  // Function to calculate the depth of a layer
  const calculateLayerDepth = (layer: LayerItem, allLayers: LayerItem[]): number => {
    let depth = 0;
    let currentLayer = layer;

    while (currentLayer.parentId) {
      const parent = allLayers.find(l => l.id === currentLayer.parentId);
      if (parent) {
        depth++;
        currentLayer = parent;
      } else {
        break; // Break if parent is not found to avoid infinite loops
      }
    }

    return depth;
  };

  // Function to initialize layers with depth information
  const initializeLayers = (layerItems: LayerItem[]): LayerInfo[] => {
    return layerItems.map(item => ({
      ...item,
      depth: calculateLayerDepth(item, layerItems)
    }));
  };

  // Initialize layers on component mount
  useEffect(() => {
    setLayers(initialLayers);
  }, [initialLayers]);

  // Notify parent component about layer changes
  useEffect(() => {
    if (onLayerChange) {
      onLayerChange(layers);
    }
  }, [layers, onLayerChange]);

  // Add a new layer
  const addLayer = useCallback((parentId?: string) => {
    const newLayer: LayerItem = {
      id: uuidv4(),
      name: 'New Layer',
      type: 'layer',
      visible: true,
      locked: false,
      parentId: parentId,
      order: layers.length,
    };

    setLayers(prevLayers => {
      if (parentId) {
        // Add as a child to the parent layer
        return prevLayers.map(layer => {
          if (layer.id === parentId) {
            const children = layer.children ? [...layer.children, newLayer] : [newLayer];
            return { ...layer, children: children };
          }
          return layer;
        });
      } else {
        // Add as a top-level layer
        return [...prevLayers, newLayer];
      }
    });

    toast({
      title: 'Layer Added',
      description: 'A new layer has been added to the canvas.',
    });
  }, [layers, toast]);

  // Update layer properties
  const updateLayer = useCallback((layerId: string, updates: Partial<LayerItem>): LayerOperationResult => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );

    return { success: true, layerId: layerId };
  }, []);

  // Delete a layer
  const deleteLayer = useCallback((layerId: string): LayerOperationResult => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));

    toast({
      title: 'Layer Deleted',
      description: 'The layer has been removed from the canvas.',
    });

    return { success: true, layerId: layerId };
  }, [toast]);

  // Move a layer
  const moveLayer = useCallback((layerId: string, newOrder: number): LayerOperationResult => {
    setLayers(prevLayers => {
      const layerToMove = prevLayers.find(layer => layer.id === layerId);
      if (!layerToMove) return prevLayers;

      const updatedLayers = prevLayers.filter(layer => layer.id !== layerId);
      updatedLayers.splice(newOrder, 0, layerToMove);

      return updatedLayers.map((layer, index) => ({ ...layer, order: index }));
    });

    return { success: true, layerId: layerId };
  }, []);

  // Group layers
  const groupLayers = useCallback((layerIds: string[], groupName: string): LayerOperationResult => {
    // Implementation for grouping layers
    return { success: true, layerId: 'groupId' };
  }, []);

  // Ungroup layers
  const ungroupLayers = useCallback((groupId: string): LayerOperationResult => {
    // Implementation for ungrouping layers
    return { success: true, layerId: groupId };
  }, []);

  // Toggle layer lock
  const toggleLock = useCallback((layerId: string): LayerOperationResult => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    );

    return { success: true, layerId: layerId };
  }, []);

  // Toggle layer visibility
  const toggleVisibility = useCallback((layerId: string): LayerOperationResult => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );

    return { success: true, layerId: layerId };
  }, []);

  // Render a single layer item
  const renderLayerItem = (layer: LayerItem, depth: number = 0) => {
    const paddingLeft = 20 + (depth * 10);

    return (
      <div key={layer.id} className="layer-item">
        <div 
          className="flex items-center justify-between py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer"
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => onLayerSelect ? onLayerSelect(layer.id) : null}
        >
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            {layer.locked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Unlock className="h-4 w-4 text-muted-foreground" />
            )}
            {layer.visible ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{layer.name}</span>
          </div>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem onClick={() => toggleVisibility(layer.id)}>
                {layer.visible ? 'Hide Layer' : 'Show Layer'}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toggleLock(layer.id)}>
                {layer.locked ? 'Unlock Layer' : 'Lock Layer'}
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => addLayer(layer.id)}>
                Add Child Layer
              </ContextMenuItem>
              <ContextMenuItem onClick={() => deleteLayer(layer.id)} className="text-red-500 focus:text-red-500">
                Delete Layer
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
        {layer.children && (
          <div className="layer-children">
            {layer.children.map(child => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="layer-manager space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Layers</h2>
        <Button variant="outline" size="sm" onClick={() => addLayer()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Layer
        </Button>
      </div>
      <Accordion type="multiple">
        {layers.map(layer => (
          <AccordionItem value={layer.id} key={layer.id}>
            <AccordionTrigger className="font-medium">{layer.name}</AccordionTrigger>
            <AccordionContent>
              {renderLayerItem(layer)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LayerManager;
