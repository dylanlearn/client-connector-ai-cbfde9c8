
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, ChevronRight, ChevronDown, PenLine, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LayerInfo } from '@/components/wireframe/utils/types';
import ZIndexControls from './ZIndexControls';

interface LayerItemProps {
  layer: LayerInfo;
  isSelected: boolean;
  onSelect: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onDelete: (layerId: string) => void;
  onDuplicate: (layerId: string) => void;
  onBringForward: (layerId: string) => void;
  onSendBackward: (layerId: string) => void;
  onBringToFront: (layerId: string) => void;
  onSendToBack: (layerId: string) => void;
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
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onRename
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(layer.name);
  const [showControls, setShowControls] = useState(false);

  const handleToggleExpand = () => {
    if (layer.isGroup && layer.children.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleRename = () => {
    if (onRename && nameInput.trim() !== '') {
      onRename(layer.id, nameInput);
    }
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setNameInput(layer.name);
    setIsRenaming(false);
  };

  return (
    <div className="layer-item">
      <div 
        className={cn(
          "flex items-center gap-1 p-1 rounded text-xs border border-transparent",
          isSelected && "bg-accent border-accent-foreground/20",
          !isSelected && "hover:bg-muted/50"
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Expand/Collapse button for groups */}
        <div className="w-4 flex-shrink-0">
          {layer.isGroup && layer.children.length > 0 ? (
            <Button 
              variant="ghost"
              size="icon" 
              className="h-4 w-4 p-0"
              onClick={handleToggleExpand}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <span className="h-4 w-4" />
          )}
        </div>

        {/* Layer visibility toggle */}
        <Button 
          variant="ghost"
          size="icon" 
          className="h-5 w-5 p-0"
          onClick={() => onToggleVisibility(layer.id)}
          title={layer.visible ? "Hide layer" : "Show layer"}
        >
          {layer.visible ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </Button>

        {/* Layer lock toggle */}
        <Button 
          variant="ghost"
          size="icon" 
          className="h-5 w-5 p-0"
          onClick={() => onToggleLock(layer.id)}
          title={layer.locked ? "Unlock layer" : "Lock layer"}
        >
          {layer.locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
        </Button>

        {/* Layer name */}
        <div 
          className="flex-grow cursor-pointer min-w-0"
          onClick={() => onSelect(layer.id)}
        >
          {isRenaming ? (
            <div className="flex items-center gap-1">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="h-5 text-xs py-0 px-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') handleCancelRename();
                }}
              />
              <Button 
                variant="ghost"
                size="icon" 
                className="h-4 w-4 p-0"
                onClick={handleRename}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost"
                size="icon" 
                className="h-4 w-4 p-0"
                onClick={handleCancelRename}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div 
              className="truncate text-xs py-1" 
              title={`${layer.name} (z-index: ${layer.zIndex})`}
            >
              {layer.name}
              <span className="text-muted-foreground ml-2">({layer.type})</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showControls && (
          <div className="flex items-center">
            {onRename && (
              <Button 
                variant="ghost"
                size="icon" 
                className="h-5 w-5 p-0"
                onClick={() => setIsRenaming(true)}
                title="Rename layer"
              >
                <PenLine className="h-3 w-3" />
              </Button>
            )}

            <Button 
              variant="ghost"
              size="icon" 
              className="h-5 w-5 p-0"
              onClick={() => onDuplicate(layer.id)}
              title="Duplicate layer"
            >
              <Copy className="h-3 w-3" />
            </Button>

            <Button 
              variant="ghost"
              size="icon" 
              className="h-5 w-5 p-0"
              onClick={() => onDelete(layer.id)}
              title="Delete layer"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Z-index controls appear on hover */}
      {showControls && (
        <div className="ml-6 mt-1">
          <ZIndexControls
            layer={layer}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onBringToFront={onBringToFront}
            onSendToBack={onSendToBack}
            disabled={layer.locked}
          />
        </div>
      )}

      {/* Render children for groups */}
      {layer.isGroup && isExpanded && layer.children.length > 0 && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-muted pl-2">
          {layer.children.map(childLayer => (
            <LayerItem
              key={childLayer.id}
              layer={childLayer}
              isSelected={isSelected}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onToggleLock={onToggleLock}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onBringForward={onBringForward}
              onSendBackward={onSendBackward}
              onBringToFront={onBringToFront}
              onSendToBack={onSendToBack}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerItem;
