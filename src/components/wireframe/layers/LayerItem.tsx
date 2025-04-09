
import React, { useState } from 'react';
import { LayerInfo } from '../utils/types';
import { Eye, EyeOff, Lock, Unlock, ChevronDown, ChevronRight, Trash, Copy, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface LayerItemProps {
  layer: LayerInfo;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDragStart: () => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDrop,
  onToggleVisibility,
  onToggleLock,
  onRename,
  onDelete,
  onDuplicate
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(layer.name);

  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewName(layer.name);
    setIsRenaming(true);
  };

  const handleRenameSubmit = () => {
    if (newName.trim()) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('layerId', layer.id);
    onDragStart();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div
      className={cn(
        'flex items-center px-1 py-1.5 rounded-sm border border-transparent',
        isSelected && 'bg-accent text-accent-foreground border-accent',
        isDragging && 'opacity-50',
        !isSelected && 'hover:bg-accent/50'
      )}
      onClick={onSelect}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ paddingLeft: `${(layer.parentId ? 24 : 8)}px` }}
    >
      {/* Expand/collapse button (for groups) */}
      {layer.type === 'group' && (
        <Button variant="ghost" size="icon" className="h-4 w-4 mr-1">
          {layer.isExpanded ? 
            <ChevronDown className="h-3.5 w-3.5" /> : 
            <ChevronRight className="h-3.5 w-3.5" />
          }
        </Button>
      )}

      {/* Layer visibility toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 mr-1"
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
      >
        {layer.visible ? 
          <Eye className="h-3.5 w-3.5" /> : 
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
        }
      </Button>

      {/* Layer lock toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 mr-1.5"
        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
      >
        {layer.locked ? 
          <Lock className="h-3.5 w-3.5" /> : 
          <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
        }
      </Button>

      {/* Layer name/content */}
      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleRenameKeyDown}
            className="h-6 px-1.5 py-0.5 text-xs"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm truncate" onDoubleClick={handleRenameStart}>
            {layer.name}
          </div>
        )}
      </div>

      {/* Layer actions menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleRenameStart}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LayerItem;
