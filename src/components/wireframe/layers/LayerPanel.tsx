
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layers, Plus, Group } from 'lucide-react';
import LayerItem from './LayerItem';
import { LayerInfo } from '@/components/wireframe/utils/types';

interface LayerPanelProps {
  layers: LayerInfo[];
  selectedLayerId?: string;
  onSelectLayer: (layerId: string) => void;
  onToggleLayerVisibility: (layerId: string) => void;
  onToggleLayerLock: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onMoveLayerUp?: (layerId: string) => void;
  onMoveLayerDown?: (layerId: string) => void;
  onRenameLayer?: (layerId: string, name: string) => void;
  onCreateGroup?: (layerIds: string[]) => void;
  className?: string;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onRenameLayer,
  onCreateGroup,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter layers by name
  const filteredLayers = searchQuery 
    ? layers.filter(layer => 
        layer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : layers;
  
  // Handle adding a new layer
  const handleAddLayer = () => {
    // You would implement this based on your application needs
    console.log('Add layer clicked');
  };

  // Handle creating a group
  const handleCreateGroup = () => {
    if (onCreateGroup) {
      // You would implement this based on your application needs
      onCreateGroup([]);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Layers
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" className="flex-1" onClick={handleAddLayer}>
            <Plus className="h-4 w-4 mr-1" />
            Add Layer
          </Button>
          {onCreateGroup && (
            <Button size="sm" variant="outline" className="flex-1" onClick={handleCreateGroup}>
              <Group className="h-4 w-4 mr-1" />
              Create Group
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
          {filteredLayers.map((layer) => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={() => onSelectLayer(layer.id)}
              onToggleVisibility={() => onToggleLayerVisibility(layer.id)}
              onToggleLock={() => onToggleLayerLock(layer.id)}
              onDelete={() => onDeleteLayer(layer.id)}
              onDuplicate={() => onDuplicateLayer(layer.id)}
              onMoveUp={onMoveLayerUp ? () => onMoveLayerUp(layer.id) : undefined}
              onMoveDown={onMoveLayerDown ? () => onMoveLayerDown(layer.id) : undefined}
              onRename={onRenameLayer ? (name: string) => onRenameLayer(layer.id, name) : undefined}
            />
          ))}
          
          {filteredLayers.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              {searchQuery ? 'No matching layers found' : 'No layers to display'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerPanel;
