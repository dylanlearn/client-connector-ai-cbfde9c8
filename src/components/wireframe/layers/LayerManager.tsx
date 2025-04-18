import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LayerItem, LayerInfo } from './LayerTypes'; // Import the type definition
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, Copy, Edit, Eye, EyeOff, Lock, Unlock, Plus, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LayerManagerProps {
  initialLayers?: LayerItem[];
  onLayerChange?: (layers: LayerItem[]) => void;
  onLayerSelect?: (layerId: string) => void;
  selectionConfig?: any;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  initialLayers = [],
  onLayerChange,
  onLayerSelect,
  selectionConfig
}) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

  useEffect(() => {
    initializeLayers(initialLayers);
  }, [initialLayers, initializeLayers]);

  const toggleLayerPanel = () => {
    setIsLayerPanelOpen(!isLayerPanelOpen);
  };

  // Update type conversions when setting layers
  const initializeLayers = useCallback((items: LayerItem[]) => {
    // Convert LayerItem[] to LayerInfo[] by adding depth
    const layersWithDepth: LayerInfo[] = items.map(item => ({
      ...item,
      depth: 0 // Assign default depth
    }));
    setLayers(layersWithDepth);
  }, []);

  useEffect(() => {
    if (onLayerChange) {
      // Convert LayerInfo[] back to LayerItem[] when notifying changes
      const layerItems = layers.map(({ depth, ...rest }) => rest);
      onLayerChange(layerItems);
    }
  }, [layers, onLayerChange]);

  const handleLayerVisibility = (layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleLayerLock = (layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    );
  };

  const handleLayerNameChange = (layerId: string, newName: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, name: newName } : layer
      )
    );
  };

  const handleDuplicateLayer = (layerId: string) => {
    const layerToDuplicate = layers.find(layer => layer.id === layerId);
    if (layerToDuplicate) {
      const duplicatedLayer = {
        ...layerToDuplicate,
        id: `${layerToDuplicate.id}-copy`,
        name: `${layerToDuplicate.name} Copy`,
      };
      setLayers(prevLayers => [...prevLayers, duplicatedLayer]);
      toast({
        title: "Layer Duplicated",
        description: "A new copy of the layer has been created.",
      })
    }
  };

  const handleDeleteLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    toast({
      title: "Layer Deleted",
      description: "The layer has been permanently removed.",
    })
  };

  const handleCreateNewLayer = () => {
    const newLayer: LayerItem = {
      id: `new-layer-${Date.now()}`,
      name: 'New Layer',
      type: 'generic',
      visible: true,
      locked: false,
      order: layers.length,
    };
    const layersWithDepth: LayerInfo[] = [...layers, { ...newLayer, depth: 0 }];
    setLayers(layersWithDepth);
    toast({
      title: "Layer Created",
      description: "A new layer has been added to the canvas.",
    })
  };

  const updateLayerOrder = (reorderedLayers: LayerItem[]) => {
    const layersWithDepth: LayerInfo[] = reorderedLayers.map(item => ({
      ...item,
      depth: (layers.find(l => l.id === item.id)?.depth || 0)
    }));
    setLayers(layersWithDepth);
  };

  const sortLayersByOrder = (layerItems: LayerItem[]) => {
    const layersWithDepth: LayerInfo[] = layerItems.map(item => ({
      ...item,
      depth: (layers.find(l => l.id === item.id)?.depth || 0)
    }));
    setLayers(layersWithDepth);
  };

  const filteredLayers = layers.filter(layer =>
    layer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layer-manager space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Layers</h2>
        <Button variant="outline" size="icon" onClick={handleCreateNewLayer}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Input
        type="search"
        placeholder="Search layers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="layers">
          <AccordionTrigger>All Layers</AccordionTrigger>
          <AccordionContent>
            <div className="layer-list space-y-2">
              {filteredLayers.map(layer => (
                <div key={layer.id} className="layer-item flex items-center justify-between p-2 rounded-md hover:bg-secondary">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`layer-visible-${layer.id}`}
                      checked={layer.visible}
                      onCheckedChange={() => handleLayerVisibility(layer.id)}
                    />
                    <label
                      htmlFor={`layer-visible-${layer.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
                    >
                      {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </label>
                    <button onClick={() => onLayerSelect && onLayerSelect(layer.id)}>
                      <span className="text-sm">{layer.name}</span>
                    </button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleDuplicateLayer(layer.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteLayer(layer.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleLayerLock(layer.id)}>
                        {layer.locked ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Lock
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LayerManager;
