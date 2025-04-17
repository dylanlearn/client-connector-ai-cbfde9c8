
import React, { useState, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayerItem } from '../utils/layer-utils';
import { cn } from '@/lib/utils';

export interface EnhancedLayerPanelProps {
  layers: LayerItem[];
  selectedLayerIds: string[];
  className?: string;
  onSelectLayer: (id: string, multiSelect?: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorderLayers: (result: DropResult) => void;
  onRenameLayer: (id: string, newName: string) => void;
  onGroupLayers: (layerIds: string[], groupName: string) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onExpandLayer?: (id: string, expanded: boolean) => void;
  maxHeight?: string | number;
}

// Type for layer with expanded state for UI
interface DisplayLayerItem extends LayerItem {
  expanded?: boolean;
  depth: number;
  path: string[];
}

const EnhancedLayerPanel: React.FC<EnhancedLayerPanelProps> = ({
  layers,
  selectedLayerIds,
  className,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onReorderLayers,
  onRenameLayer,
  onGroupLayers,
  onDeleteLayer,
  onDuplicateLayer,
  onExpandLayer,
  maxHeight = "400px"
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Process layers to add depth information and filtering
  const processLayers = useCallback((layerList: LayerItem[], depth = 0, path: string[] = []): DisplayLayerItem[] => {
    return layerList.flatMap(layer => {
      const currentPath = [...path, layer.id];
      const isExpanded = expandedLayers[layer.id] !== false; // Default to expanded
      const currentLayer: DisplayLayerItem = {
        ...layer,
        expanded: isExpanded,
        depth,
        path: currentPath
      };
      
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        layer.name.toLowerCase().includes(searchTerm) ||
        layer.type.toLowerCase().includes(searchTerm);
      
      // If this layer doesn't match but may have children that match, process them
      if (!matchesSearch && layer.children.length > 0) {
        const matchingChildren = processLayers(layer.children, depth + 1, currentPath);
        if (matchingChildren.length > 0) {
          // Force expand if children match
          if (!isExpanded) {
            currentLayer.expanded = true;
          }
          return [currentLayer, ...matchingChildren];
        }
        return [];
      }
      
      if (!matchesSearch) return [];
      
      const result = [currentLayer];
      if (layer.children.length > 0 && isExpanded) {
        result.push(...processLayers(layer.children, depth + 1, currentPath));
      }
      
      return result;
    });
  }, [expandedLayers, searchQuery]);
  
  const displayLayers = processLayers(layers);
  
  const handleToggleExpand = (layerId: string) => {
    setExpandedLayers(prev => {
      const newState = {
        ...prev,
        [layerId]: prev[layerId] === undefined ? false : !prev[layerId]
      };
      if (onExpandLayer) {
        onExpandLayer(layerId, newState[layerId] !== false);
      }
      return newState;
    });
  };
  
  const beginRenaming = (layer: DisplayLayerItem) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  };
  
  const commitRename = () => {
    if (editingLayerId && editingName.trim()) {
      onRenameLayer(editingLayerId, editingName.trim());
    }
    setEditingLayerId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitRename();
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
    }
  };
  
  const handleGroupSelected = () => {
    if (selectedLayerIds.length > 1) {
      onGroupLayers(selectedLayerIds, `Group ${new Date().getTime().toString().slice(-4)}`);
    }
  };
  
  const handleLayerClick = (id: string, e: React.MouseEvent) => {
    onSelectLayer(id, e.ctrlKey || e.metaKey || e.shiftKey);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium flex items-center">
          Layers
          <Badge variant="outline" className="ml-2">
            {layers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-2 py-1">
        <div className="space-y-2">
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 text-sm"
          />
          
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex-1"
              disabled={selectedLayerIds.length < 2}
              onClick={handleGroupSelected}
            >
              Group Selected
            </Button>
          </div>
          
          <ScrollArea style={{ height: maxHeight }} className="pr-2">
            <DragDropContext onDragEnd={onReorderLayers}>
              <Droppable droppableId="layers" type="layer">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-1 min-h-[100px]"
                  >
                    {displayLayers.length > 0 ? (
                      displayLayers.map((layer, index) => (
                        <Draggable key={layer.id} draggableId={layer.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "p-1.5 rounded-sm border text-sm flex items-center",
                                selectedLayerIds.includes(layer.id) ? "bg-muted border-primary" : "border-transparent",
                                snapshot.isDragging && "border-dashed opacity-70",
                                layer.depth > 0 && "ml-" + Math.min(layer.depth * 4, 12)
                              )}
                            >
                              {/* Expand/Collapse button for groups */}
                              {layer.isGroup && layer.children.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 p-0.5 mr-0.5"
                                  onClick={() => handleToggleExpand(layer.id)}
                                >
                                  {layer.expanded ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3" />
                                  )}
                                </Button>
                              )}

                              {/* Drag handle */}
                              <div {...provided.dragHandleProps} className="px-1 cursor-grab">
                                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                              
                              {/* Layer type indicator */}
                              <div 
                                className={cn(
                                  "w-3 h-3 rounded-sm mr-1.5",
                                  layer.isGroup ? "bg-blue-200 dark:bg-blue-900" : "bg-gray-200 dark:bg-gray-700"
                                )}
                              />
                              
                              {/* Layer name */}
                              <div className="flex-grow min-w-0" onClick={(e) => handleLayerClick(layer.id, e)}>
                                {editingLayerId === layer.id ? (
                                  <Input
                                    ref={inputRef}
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={commitRename}
                                    onKeyDown={handleKeyDown}
                                    className="h-6 py-0 px-1 text-xs"
                                    autoFocus
                                  />
                                ) : (
                                  <div className="truncate">
                                    {layer.name}
                                    <span className="text-xs text-muted-foreground ml-1">
                                      {layer.type !== 'group' && `(${layer.type})`}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Action buttons */}
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 p-0.5 ml-0.5"
                                      onClick={() => onToggleVisibility(layer.id)}
                                    >
                                      {layer.visible ? (
                                        <Eye className="h-3 w-3" />
                                      ) : (
                                        <EyeOff className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    {layer.visible ? "Hide" : "Show"}
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 p-0.5"
                                      onClick={() => onToggleLock(layer.id)}
                                    >
                                      {layer.locked ? (
                                        <Lock className="h-3 w-3" />
                                      ) : (
                                        <Unlock className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    {layer.locked ? "Unlock" : "Lock"}
                                  </TooltipContent>
                                </Tooltip>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 p-0.5"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem onClick={() => beginRenaming(layer)}>
                                      <Edit className="h-3.5 w-3.5 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDuplicateLayer(layer.id)}>
                                      <svg className="h-3.5 w-3.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="8" y="8" width="12" height="12" rx="2" />
                                        <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                                      </svg>
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => onDeleteLayer(layer.id)}
                                      className="text-red-500 focus:text-red-500"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TooltipProvider>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="py-10 text-center text-muted-foreground text-sm">
                        {searchQuery 
                          ? "No layers match your search" 
                          : "No layers available"}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLayerPanel;
