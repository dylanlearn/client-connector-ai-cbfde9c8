
import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, EyeOff, Lock, Unlock, ChevronDown, 
  ChevronRight, Trash, Copy, Edit, MoreHorizontal
} from 'lucide-react';
import { LayerInfo } from '../utils/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface LayerItemProps {
  layer: LayerInfo;
  isSelected: boolean;
  isDragging: boolean;
  depth?: number;
  onSelect: (e: React.MouseEvent) => void;
  onDragStart: () => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleExpanded?: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isSelected,
  isDragging,
  depth = 0,
  onSelect,
  onDragStart,
  onDrop,
  onToggleVisibility,
  onToggleLock,
  onRename,
  onDelete,
  onDuplicate,
  onToggleExpanded
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasChildren = !!layer.parentId;
  const indentPerLevel = 16;
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // Handle name edit submission
  const handleNameSubmit = () => {
    if (editName.trim() !== '') {
      onRename(editName);
    } else {
      setEditName(layer.name); // Reset to original if empty
    }
    setIsEditing(false);
  };
  
  // Handle keyboard events in name input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditName(layer.name); // Reset to original
      setIsEditing(false);
    }
  };
  
  return (
    <div
      className={cn(
        "group flex items-center w-full px-1.5 py-1 gap-1 text-sm rounded-sm transition-colors",
        isSelected ? "bg-accent/80" : "hover:bg-accent/40",
        isDragging && "opacity-50",
        !layer.visible && "opacity-50"
      )}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        // Small delay to allow the visual feedback
        setTimeout(onDragStart, 0);
      }}
      onDragEnd={onDrop}
      style={{ paddingLeft: `${indentPerLevel * depth + 4}px` }}
    >
      {/* Expand/collapse button for groups */}
      {hasChildren && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0.5"
          onClick={onToggleExpanded}
        >
          {layer.isExpanded ? 
            <ChevronDown className="h-3.5 w-3.5" /> : 
            <ChevronRight className="h-3.5 w-3.5" />
          }
        </Button>
      )}
      
      {/* Layer type icon or handle */}
      <div 
        className="flex-shrink-0 h-5 w-5 rounded-sm border border-border/50 bg-background flex items-center justify-center cursor-grab"
        onMouseDown={(e) => {
          // Prevent layer selection when starting drag from handle
          e.stopPropagation();
        }}
      >
        <span className="text-xs text-muted-foreground">{layer.zIndex}</span>
      </div>
      
      {/* Layer name */}
      <div 
        className="flex-grow min-w-0 select-none"
        onClick={onSelect}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="h-6 py-0 px-1 text-xs"
            autoComplete="off"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="truncate">
            {layer.name}
          </div>
        )}
      </div>
      
      {/* Layer actions */}
      <div className="flex items-center gap-0.5">
        {/* Visibility toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0.5 opacity-50 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          title={layer.visible ? "Hide" : "Show"}
        >
          {layer.visible ? 
            <Eye className="h-3.5 w-3.5" /> : 
            <EyeOff className="h-3.5 w-3.5" />
          }
        </Button>
        
        {/* Lock toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0.5 opacity-50 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          title={layer.locked ? "Unlock" : "Lock"}
        >
          {layer.locked ? 
            <Lock className="h-3.5 w-3.5" /> : 
            <Unlock className="h-3.5 w-3.5" />
          }
        </Button>
        
        {/* Actions dropdown - only shown on hover or when selected */}
        <div className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isSelected && "opacity-100"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            title="Rename"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0.5 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayerItem;
