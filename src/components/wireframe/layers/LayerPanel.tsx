
import React, { useState } from 'react';
import { 
  Layers, Eye, EyeOff, Lock, Unlock, ChevronDown, 
  ChevronRight, Trash, Copy, Edit, Plus 
} from 'lucide-react';
import { LayerInfo } from '../utils/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import LayerItem from './LayerItem';

interface LayerPanelProps {
  layers: LayerInfo[];
  selectedLayerId?: string;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onReorderLayers: (sourceIndex: number, targetIndex: number) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onRenameLayer: (layerId: string, name: string) => void;
  onCreateGroup: (layerIds: string[]) => void;
  className?: string;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onReorderLayers,
  onDeleteLayer,
  onDuplicateLayer,
  onRenameLayer,
  onCreateGroup,
  className
}) => {
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);

  const handleDragStart = (layerId: string) => {
    setDraggingLayerId(layerId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetLayerId: string) => {
    if (!draggingLayerId || draggingLayerId === targetLayerId) {
      setDraggingLayerId(null);
      return;
    }

    // Find indices
    const sourceIndex = layers.findIndex(l => l.id === draggingLayerId);
    const targetIndex = layers.findIndex(l => l.id === targetLayerId);

    // Reorder
    if (sourceIndex >= 0 && targetIndex >= 0) {
      onReorderLayers(sourceIndex, targetIndex);
    }

    setDraggingLayerId(null);
  };

  const toggleLayerSelection = (layerId: string, multiSelect: boolean) => {
    if (multiSelect) {
      // Add or remove from multi-selection
      setSelectedLayers(prev => 
        prev.includes(layerId) 
          ? prev.filter(id => id !== layerId) 
          : [...prev, layerId]
      );
    } else {
      // Single selection
      setSelectedLayers([layerId]);
      onSelectLayer(layerId);
    }
  };

  const handleCreateGroup = () => {
    if (selectedLayers.length > 1) {
      onCreateGroup(selectedLayers);
      setSelectedLayers([]);
    }
  };

  return (
    <div className={cn("bg-background border rounded-md flex flex-col h-full", className)}>
      <div className="border-b p-2 flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Layers</span>
        </h3>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            title="Add new layer"
            disabled={selectedLayers.length > 0}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            title="Create group from selection"
            disabled={selectedLayers.length < 2}
            onClick={handleCreateGroup}
          >
            <div className="relative">
              <div className="absolute -top-0.5 -left-0.5 h-3 w-3 rounded-sm border border-current"></div>
              <div className="absolute top-0.5 left-0.5 h-3 w-3 rounded-sm border border-current"></div>
            </div>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-1" onDragOver={handleDragOver}>
          {layers.length > 0 ? (
            <div className="space-y-0.5">
              {layers.map((layer) => (
                <LayerItem 
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedLayerId === layer.id || selectedLayers.includes(layer.id)}
                  isDragging={draggingLayerId === layer.id}
                  onSelect={(e) => toggleLayerSelection(layer.id, e.shiftKey)}
                  onDragStart={() => handleDragStart(layer.id)}
                  onDrop={() => handleDrop(layer.id)}
                  onToggleVisibility={() => onToggleVisibility(layer.id)}
                  onToggleLock={() => onToggleLock(layer.id)}
                  onRename={(name) => onRenameLayer(layer.id, name)}
                  onDelete={() => onDeleteLayer(layer.id)}
                  onDuplicate={() => onDuplicateLayer(layer.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Layers className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No layers yet</p>
              <p className="text-xs">Add components to your wireframe</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LayerPanel;
