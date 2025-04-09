
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
  const [isHovered, setIsHovered] = useState(false);

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

  // Generate type-specific icon or color
  const getTypeIndicator = () => {
    switch (layer.type) {
      case 'section':
        return <div className="w-2 h-2 rounded-full bg-blue-500" />;
      case 'group':
        return <div className="w-2 h-2 rounded-full bg-purple-500" />;
      case 'text':
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'image':
        return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'shape':
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div
      className={cn(
        'flex items-center px-1 py-1.5 rounded-sm border border-transparent group',
        isSelected && 'bg-accent text-accent-foreground border-accent',
        isDragging && 'opacity-50',
        !isSelected && 'hover:bg-accent/50',
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ paddingLeft: `${(layer.parentId ? 24 : 8)}px` }}
    >
      {/* Expand/collapse button (for groups) */}
      {layer.type === 'group' ? (
        <Button variant="ghost" size="icon" className="h-4 w-4 mr-1">
          {layer.isExpanded ? 
            <ChevronDown className="h-3.5 w-3.5" /> : 
            <ChevronRight className="h-3.5 w-3.5" />
          }
        </Button>
      ) : (
        <div className="h-4 w-4 mr-1 flex items-center justify-center">
          {getTypeIndicator()}
        </div>
      )}

      {/* Layer visibility toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-5 w-5 mr-1", !layer.visible && "text-muted-foreground")}
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
      >
        {layer.visible ? 
          <Eye className="h-3.5 w-3.5" /> : 
          <EyeOff className="h-3.5 w-3.5" />
        }
      </Button>

      {/* Layer lock toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-5 w-5 mr-1.5", layer.locked && "text-orange-500")}
        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
      >
        {layer.locked ? 
          <Lock className="h-3.5 w-3.5" /> : 
          <Unlock className="h-3.5 w-3.5 opacity-50" />
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
          <div 
            className="text-sm truncate flex items-center gap-2" 
            onDoubleClick={handleRenameStart}
          >
            <span className="truncate">{layer.name}</span>
            {layer.locked && <span className="text-xs text-muted-foreground">(locked)</span>}
          </div>
        )}
      </div>

      {/* Layer actions menu - Only visible when hovered or selected */}
      <div className={cn("flex opacity-0", (isHovered || isSelected) && "opacity-100")}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          title="Duplicate"
        >
          <Copy className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit className="h-3 w-3" />
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
    </div>
  );
};

export default LayerItem;
