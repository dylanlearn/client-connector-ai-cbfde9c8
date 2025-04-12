
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash, Copy, MoreHorizontal, ChevronRight, ChevronDown, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayerInfo } from '@/components/wireframe/utils/types';
import ZIndexControls from './ZIndexControls';

interface LayerItemProps {
  layer: LayerInfo;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRename?: (name: string) => void;
  onBringToFront?: (id: string) => void;
  onSendToBack?: (id: string) => void;
  showZIndexControls?: boolean;
  depth?: number;
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
  onBringToFront,
  onSendToBack,
  showZIndexControls = true,
  depth = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(layer.name);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleRename = () => {
    if (onRename) {
      onRename(nameValue);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNameValue(layer.name);
    }
  };

  // Calculate padding based on depth
  const paddingLeft = `${(depth || 0) * 12 + 8}px`;
  
  // Check if layer has children
  const hasChildren = layer.children && layer.children.length > 0;
  
  return (
    <div className="layer-item">
      <div
        className={`flex items-center px-2 py-1.5 gap-1 ${
          isSelected ? 'bg-accent' : 'hover:bg-muted/50'
        } rounded-md transition-colors group`}
        style={{ paddingLeft }}
        onClick={onSelect}
      >
        {/* Expand/Collapse button for groups */}
        {hasChildren && (
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        {/* Layer type icon (could be enhanced based on layer type) */}
        <div className="w-5 h-5 flex items-center justify-center text-xs bg-muted rounded">
          {layer.type.charAt(0).toUpperCase()}
        </div>
        
        {/* Layer name */}
        {isEditing ? (
          <Input
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="h-6 py-0 px-1 text-xs"
            autoFocus
          />
        ) : (
          <span 
            className="text-sm flex-1 truncate cursor-default"
            onDoubleClick={() => onRename && setIsEditing(true)}
          >
            {layer.name}
          </span>
        )}
        
        {/* Z-index indicator */}
        <span className="text-xs text-muted-foreground mr-1">
          z:{layer.zIndex}
        </span>
        
        {/* Layer actions */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility();
                  }}
                >
                  {layer.visible ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {layer.visible ? 'Hide layer' : 'Show layer'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock();
                  }}
                >
                  {layer.locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Unlock className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {layer.locked ? 'Unlock layer' : 'Lock layer'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onRename && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Rename layer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Duplicate layer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Delete layer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Z-index controls - visible when selected */}
      {isSelected && showZIndexControls && onMoveUp && onMoveDown && onBringToFront && onSendToBack && (
        <div className="flex justify-center mt-1 mb-1">
          <ZIndexControls
            layer={layer}
            onBringForward={onMoveUp}
            onSendBackward={onMoveDown}
            onBringToFront={onBringToFront}
            onSendToBack={onSendToBack}
            disabled={layer.locked}
          />
        </div>
      )}
      
      {/* Render children if expanded */}
      {isExpanded && layer.children && layer.children.map(child => (
        <LayerItem
          key={child.id}
          layer={child}
          isSelected={child.selected}
          onSelect={() => {/* Handle child selection */}}
          onToggleVisibility={() => {/* Handle child visibility */}}
          onToggleLock={() => {/* Handle child locking */}}
          onDelete={() => {/* Handle child deletion */}}
          onDuplicate={() => {/* Handle child duplication */}}
          depth={(depth || 0) + 1}
          showZIndexControls={false}
        />
      ))}
    </div>
  );
};

export default LayerItem;
