
import React, { useState } from 'react';
import { 
  Layers, Eye, EyeOff, Lock, Unlock, ChevronDown, 
  ChevronRight, Trash, Copy, Edit, Plus,
  FolderPlus, MoveVertical
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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dragOverLayerId, setDragOverLayerId] = useState<string | null>(null);

  const handleDragStart = (layerId: string) => {
    setDraggingLayerId(layerId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, layerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverLayerId(layerId);
  };

  const handleDragLeave = () => {
    setDragOverLayerId(null);
  };

  const handleDrop = (targetLayerId: string) => {
    if (!draggingLayerId || draggingLayerId === targetLayerId) {
      setDraggingLayerId(null);
      setDragOverLayerId(null);
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
    setDragOverLayerId(null);
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
  
  // Filter layers based on search query
  const filteredLayers = searchQuery 
    ? layers.filter(layer => layer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : layers;

  return (
    <div className={cn("bg-background border rounded-md flex flex-col h-full", className)}>
      <div className="border-b p-2 flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Layers</span> 
          {selectedLayers.length > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {selectedLayers.length}
            </span>
          )}
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
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                disabled={selectedLayers.length === 0}
              >
                <MoveVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => console.log('Move to front')}>
                Move to Front
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log('Move forward')}>
                Move Forward
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log('Move backward')}>
                Move Backward
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log('Move to back')}>
                Move to Back
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="border-b px-2 py-1.5">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search layers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-1">
          {filteredLayers.length > 0 ? (
            <div className="space-y-0.5">
              {filteredLayers.map((layer) => (
                <div
                  key={layer.id}
                  onDragOver={(e) => handleDragOver(e, layer.id)}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "transition-colors",
                    dragOverLayerId === layer.id && "bg-accent/30 rounded-sm"
                  )}
                >
                  <LayerItem 
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
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Layers className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">
                {searchQuery ? 'No matching layers found' : 'No layers yet'}
              </p>
              <p className="text-xs">
                {searchQuery ? 'Try a different search term' : 'Add components to your wireframe'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {selectedLayers.length > 0 && (
        <div className="border-t p-2 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {selectedLayers.length} layer{selectedLayers.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedLayers([])}
            >
              Clear
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="h-7 text-xs"
              onClick={handleCreateGroup}
              disabled={selectedLayers.length < 2}
            >
              Group
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
