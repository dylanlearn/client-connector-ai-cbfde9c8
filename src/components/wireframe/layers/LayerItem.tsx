
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, Edit, Trash, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LayerInfo } from '@/components/wireframe/utils/types';

interface LayerItemProps {
  layer: LayerInfo;
  isSelected: boolean;
  onSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDelete: (layerId: string) => void;
  onDuplicate: (layerId: string) => void;
  onMoveUp?: (layerId: string) => void;
  onMoveDown?: (layerId: string) => void;
  onRename?: (layerId: string, name: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onRename
}) => {
  const handleClick = () => {
    onSelect(layer.id);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center p-2 mb-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
        isSelected && "bg-primary/10"
      )}
      onClick={handleClick}
    >
      <div className="flex-1 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(layer.id);
          }}
        >
          {layer.visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 ml-1" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock(layer.id);
          }}
        >
          {layer.locked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4" />
          )}
        </Button>
        
        <span className="ml-2 truncate">{layer.name}</span>
      </div>
      
      <div className="flex">
        {onMoveUp && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(layer.id);
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
        
        {onMoveDown && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(layer.id);
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(layer.id);
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(layer.id);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LayerItem;
