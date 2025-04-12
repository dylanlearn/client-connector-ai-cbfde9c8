
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Unlock, Edit, Trash, Copy, ChevronUp, ChevronDown, Ungroup } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LayerItem as LayerItemType } from '../utils/layer-utils';

interface LayerItemProps {
  layer: LayerItemType;
  isSelected: boolean;
  onSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDelete: (layerId: string) => void;
  onDuplicate: (layerId: string) => void;
  onMoveUp?: (layerId: string) => void;
  onMoveDown?: (layerId: string) => void;
  onRename?: (layerId: string, name: string) => void;
  onUngroup?: (layerId: string) => void;
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
  onRename,
  onUngroup
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(layer.name);
  
  const handleRenameSubmit = () => {
    if (onRename && editedName.trim()) {
      onRename(layer.id, editedName);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(layer.name);
      setIsEditing(false);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col p-2 mb-1 rounded hover:bg-accent/50 cursor-pointer",
        isSelected && "bg-accent/80",
        layer.locked && "opacity-70"
      )}
      onClick={() => onSelect(layer.id)}
    >
      <div className="flex items-center">
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
          className="h-6 w-6" 
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
        
        {isEditing ? (
          <div className="flex-1 mx-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              className="h-7 py-1 text-sm"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex-1 mx-2 flex items-center">
            <span className="truncate text-sm font-medium">
              {layer.name}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {layer.type}
            </span>
          </div>
        )}
        
        <div className="flex">
          {!isEditing && onRename && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          
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
              <ChevronUp className="h-3 w-3" />
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
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
          
          {onUngroup && layer.type === 'group' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={(e) => {
                e.stopPropagation();
                onUngroup(layer.id);
              }}
            >
              <Ungroup className="h-3 w-3" />
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
            <Copy className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:text-destructive" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(layer.id);
            }}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayerItem;
