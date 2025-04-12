
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayerInfo } from '@/components/wireframe/utils/types';
import { Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2, ChevronDown, ChevronRight, Group } from 'lucide-react';
import { cn } from '@/lib/utils';

// Map of icons for different layer types
const layerTypeIcons: Record<string, React.ReactNode> = {
  section: <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/30 rounded-sm" />,
  text: <span className="text-xs font-bold">T</span>,
  button: <div className="w-4 h-3 bg-indigo-500/20 border border-indigo-500/30 rounded-sm" />,
  image: <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded-sm flex items-center justify-center">
    <span className="text-[8px] text-green-600">IMG</span>
  </div>,
  group: <Group className="h-4 w-4 text-amber-600" />,
  shape: <div className="w-3 h-3 bg-purple-500/20 border border-purple-500/30 rounded-full" />,
};

interface LayerItemProps {
  layer: LayerInfo;
  isExpanded?: boolean;
  depth?: number;
  onSelect: () => void;
  onVisibilityToggle: () => void;
  onLockToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onToggleExpand?: () => void;
  onUngroup?: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isExpanded = false,
  depth = 0,
  onSelect,
  onVisibilityToggle,
  onLockToggle,
  onMoveUp,
  onMoveDown,
  onDelete,
  onToggleExpand,
  onUngroup
}) => {
  const { id, name, type, visible, locked, selected, children } = layer;
  const hasChildren = children && children.length > 0;
  const isGroup = type === 'group';
  
  // Get icon for layer type
  const layerIcon = layerTypeIcons[type] || <div className="w-4 h-4 bg-gray-300 rounded-sm" />;
  
  // Handle expand/collapse
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    }
  };
  
  return (
    <div>
      {/* Layer row */}
      <div 
        className={cn(
          "flex items-center px-2 py-1 hover:bg-accent/50 border-l-2 transition-all",
          selected ? "border-primary bg-accent/40" : "border-transparent",
          depth > 0 && "pl-4"
        )}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
        onClick={onSelect}
      >
        {/* Expand/collapse button for groups */}
        {hasChildren && (
          <button
            onClick={handleToggleExpand}
            className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground mr-1"
          >
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        )}
        
        {/* Layer icon and name */}
        <div className="flex items-center flex-1 overflow-hidden">
          <div className="flex items-center justify-center h-5 w-5 mr-2">
            {layerIcon}
          </div>
          <span className="text-sm truncate">{name}</span>
        </div>
        
        {/* Layer actions */}
        <div className="flex items-center">
          {/* Ungroup button for groups */}
          {isGroup && onUngroup && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => { e.stopPropagation(); onUngroup(); }}
              title="Ungroup"
            >
              <Group className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {/* Visibility toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onVisibilityToggle(); }}
            title={visible ? "Hide" : "Show"}
          >
            {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </Button>
          
          {/* Lock toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onLockToggle(); }}
            title={locked ? "Unlock" : "Lock"}
          >
            {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </Button>
          
          {/* Move up */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            title="Bring Forward"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          
          {/* Move down */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            title="Send Backward"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          
          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Children (if expanded) */}
      {isExpanded && hasChildren && (
        <div className="layer-children">
          {children!.map(child => (
            <LayerItem
              key={child.id}
              layer={child}
              depth={depth + 1}
              onSelect={onSelect}
              onVisibilityToggle={onVisibilityToggle}
              onLockToggle={onLockToggle}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerItem;
