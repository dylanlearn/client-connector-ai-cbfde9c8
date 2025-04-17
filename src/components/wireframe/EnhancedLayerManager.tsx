
import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import EnhancedLayerPanel from './layers/EnhancedLayerPanel';
import { useEnhancedLayers } from '@/hooks/wireframe/use-enhanced-layers';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LayersIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLayerManagerProps {
  canvas: fabric.Canvas | null;
  className?: string;
  maxHeight?: string | number;
  onLayerSelect?: (layerId: string) => void;
}

export default function EnhancedLayerManager({
  canvas,
  className,
  maxHeight = 500,
  onLayerSelect
}: EnhancedLayerManagerProps) {
  const { toast } = useToast();
  
  const {
    layers,
    selectedLayerIds,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    handleReorderLayers,
    renameLayer,
    groupLayers,
    deleteLayer,
    duplicateLayer,
    toggleLayerExpanded
  } = useEnhancedLayers({
    canvas,
    persistSelection: true
  });
  
  // Notify external components when layer selection changes
  useEffect(() => {
    if (onLayerSelect && selectedLayerIds.length === 1) {
      onLayerSelect(selectedLayerIds[0]);
    }
  }, [selectedLayerIds, onLayerSelect]);

  // Handle creating a group of layers
  const handleGroupLayers = (layerIds: string[], groupName: string) => {
    groupLayers(layerIds, groupName);
    toast({
      title: "Group Created",
      description: `Created group '${groupName}' with ${layerIds.length} layers`,
    });
  };
  
  // Handle deleting a layer after confirmation
  const handleDeleteLayer = (layerId: string) => {
    deleteLayer(layerId);
    toast({
      title: "Layer Deleted",
      description: "The layer has been removed",
      variant: "destructive",
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4" />
            Layer Management
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] p-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Layer Management Features:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Drag and drop to reorder layers</li>
                    <li>Toggle visibility with eye icon</li>
                    <li>Lock/unlock layers to prevent editing</li>
                    <li>Group multiple selected layers</li>
                    <li>Rename, duplicate or delete layers</li>
                    <li>Expand/collapse layer groups</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <Separator />
      
      <EnhancedLayerPanel
        layers={layers}
        selectedLayerIds={selectedLayerIds}
        onSelectLayer={selectLayer}
        onToggleVisibility={toggleLayerVisibility}
        onToggleLock={toggleLayerLock}
        onReorderLayers={handleReorderLayers}
        onRenameLayer={renameLayer}
        onGroupLayers={handleGroupLayers}
        onDeleteLayer={handleDeleteLayer}
        onDuplicateLayer={duplicateLayer}
        onExpandLayer={toggleLayerExpanded}
        maxHeight={maxHeight}
      />
    </Card>
  );
}
