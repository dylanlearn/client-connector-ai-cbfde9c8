
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Layers, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, 
  Copy, Trash, Group, Ungroup, Edit, MoreVertical, Search, Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  LayerItem,
  convertCanvasObjectsToLayers,
  toggleLayerVisibility,
  toggleLayerLock,
  moveLayerUp,
  moveLayerDown,
  bringLayerToFront,
  sendLayerToBack,
  duplicateLayer,
  renameLayer,
  groupObjects,
  ungroupObjects
} from '@/components/wireframe/utils/layer-utils';
import { useToast } from '@/hooks/use-toast';

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
  className?: string;
}

const LayerManager: React.FC<LayerManagerProps> = ({ canvas, className }) => {
  const { toast } = useToast();
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingLayer, setEditingLayer] = useState<{ id: string, name: string } | null>(null);
  
  // Load layers from canvas
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayers = () => {
      const currentSelectedIds = canvas.getActiveObjects().map(obj => obj.data?.id || obj.id || String(obj.zIndex));
      const layerItems = convertCanvasObjectsToLayers(canvas, currentSelectedIds);
      setLayers(layerItems);
      setSelectedLayers(currentSelectedIds);
    };
    
    // Initial update
    updateLayers();
    
    // Setup event listeners
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', updateLayers);
    canvas.on('selection:updated', updateLayers);
    canvas.on('selection:cleared', updateLayers);
    
    return () => {
      // Cleanup event listeners
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
      canvas.off('selection:created', updateLayers);
      canvas.off('selection:updated', updateLayers);
      canvas.off('selection:cleared', updateLayers);
    };
  }, [canvas]);
  
  // Filter layers based on search query
  const filteredLayers = searchQuery
    ? layers.filter(layer => 
        layer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : layers;
    
  // Select layer
  const handleSelectLayer = (layerId: string, multiSelect: boolean = false) => {
    if (!canvas) return;
    
    // Find the object in the canvas
    const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
    if (!object) return;
    
    if (multiSelect) {
      // Multi-select behavior
      const isSelected = selectedLayers.includes(layerId);
      
      if (isSelected) {
        // Deselect if already selected
        canvas.discardActiveObject();
        
        // Create new selection without this object
        const activeObjects = canvas.getActiveObjects().filter(obj => 
          (obj.data?.id || obj.id) !== layerId);
          
        if (activeObjects.length > 0) {
          const selection = new fabric.ActiveSelection(activeObjects, { canvas });
          canvas.setActiveObject(selection);
        }
        
        setSelectedLayers(prev => prev.filter(id => id !== layerId));
      } else {
        // Add to selection
        if (canvas.getActiveObjects().length > 0) {
          const selection = canvas.getActiveObject() as fabric.ActiveSelection;
          if (selection instanceof fabric.ActiveSelection) {
            selection.addWithUpdate(object);
            canvas.setActiveObject(selection);
          } else {
            const newSelection = new fabric.ActiveSelection([selection as fabric.Object, object], { canvas });
            canvas.setActiveObject(newSelection);
          }
        } else {
          canvas.setActiveObject(object);
        }
        
        setSelectedLayers(prev => [...prev, layerId]);
      }
    } else {
      // Single select behavior
      canvas.discardActiveObject();
      canvas.setActiveObject(object);
      setSelectedLayers([layerId]);
    }
    
    canvas.requestRenderAll();
  };
  
  // Toggle visibility
  const handleToggleVisibility = (layerId: string) => {
    if (!canvas) return;
    
    if (toggleLayerVisibility(canvas, layerId)) {
      // Update layers after change
      setLayers(prevLayers => prevLayers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        return layer;
      }));
    }
  };
  
  // Toggle lock
  const handleToggleLock = (layerId: string) => {
    if (!canvas) return;
    
    if (toggleLayerLock(canvas, layerId)) {
      // Update layers after change
      setLayers(prevLayers => prevLayers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, locked: !layer.locked };
        }
        return layer;
      }));
    }
  };
  
  // Move up
  const handleMoveUp = (layerId: string) => {
    if (!canvas) return;
    
    if (moveLayerUp(canvas, layerId)) {
      // Toast success message
      toast({
        title: "Layer moved up",
        description: "Layer has been moved one level up"
      });
    }
  };
  
  // Move down
  const handleMoveDown = (layerId: string) => {
    if (!canvas) return;
    
    if (moveLayerDown(canvas, layerId)) {
      // Toast success message
      toast({
        title: "Layer moved down",
        description: "Layer has been moved one level down"
      });
    }
  };
  
  // Bring to front
  const handleBringToFront = (layerId: string) => {
    if (!canvas) return;
    
    if (bringLayerToFront(canvas, layerId)) {
      // Toast success message
      toast({
        title: "Layer brought to front",
        description: "Layer has been brought to the front"
      });
    }
  };
  
  // Send to back
  const handleSendToBack = (layerId: string) => {
    if (!canvas) return;
    
    if (sendLayerToBack(canvas, layerId)) {
      // Toast success message
      toast({
        title: "Layer sent to back",
        description: "Layer has been sent to the back"
      });
    }
  };
  
  // Duplicate layer
  const handleDuplicate = (layerId: string) => {
    if (!canvas) return;
    
    if (duplicateLayer(canvas, layerId)) {
      // Toast success message
      toast({
        title: "Layer duplicated",
        description: "Layer has been duplicated"
      });
    }
  };
  
  // Delete layer
  const handleDelete = (layerId: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => (obj.data?.id || obj.id) === layerId);
    if (!object) return;
    
    canvas.remove(object);
    toast({
      title: "Layer deleted",
      description: "Layer has been removed from the canvas"
    });
  };
  
  // Start renaming layer
  const handleStartRename = (layerId: string, currentName: string) => {
    setEditingLayer({ id: layerId, name: currentName });
  };
  
  // Save rename
  const handleSaveRename = () => {
    if (!canvas || !editingLayer) return;
    
    if (renameLayer(canvas, editingLayer.id, editingLayer.name)) {
      // Toast success message
      toast({
        title: "Layer renamed",
        description: `Layer has been renamed to '${editingLayer.name}'`
      });
      
      // Reset editing state
      setEditingLayer(null);
    }
  };
  
  // Group selected layers
  const handleGroupLayers = () => {
    if (!canvas || selectedLayers.length < 2) return;
    
    if (groupObjects(canvas, selectedLayers, 'Group')) {
      // Toast success message
      toast({
        title: "Layers grouped",
        description: `${selectedLayers.length} layers have been grouped`
      });
    }
  };
  
  // Ungroup layer
  const handleUngroupLayer = (layerId: string) => {
    if (!canvas) return;
    
    if (ungroupObjects(canvas, layerId)) {
      // Toast success message
      toast({
        title: "Group ungrouped",
        description: "Group has been split into individual layers"
      });
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Layer Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search layers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {selectedLayers.length > 1 && (
            <Button variant="outline" size="sm" onClick={handleGroupLayers}>
              <Group className="h-4 w-4 mr-1" />
              Group
            </Button>
          )}
        </div>
        
        {/* Layer count badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {filteredLayers.length} {filteredLayers.length === 1 ? 'layer' : 'layers'}
          </Badge>
          
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          )}
        </div>
        
        <Separator />
        
        {/* Layers list */}
        <ScrollArea className="h-[350px] pr-4">
          {filteredLayers.length > 0 ? (
            <div className="space-y-1">
              {filteredLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={cn(
                    "flex items-center p-2 rounded-md",
                    layer.selected ? "bg-primary/10" : "hover:bg-secondary/30",
                    { "opacity-50": !layer.visible }
                  )}
                >
                  {/* Visibility toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(layer.id);
                    }}
                    title={layer.visible ? "Hide layer" : "Show layer"}
                  >
                    {layer.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {/* Lock toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(layer.id);
                    }}
                    title={layer.locked ? "Unlock layer" : "Lock layer"}
                  >
                    {layer.locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {/* Layer name */}
                  <div
                    className="ml-1 flex-1 cursor-pointer overflow-hidden"
                    onClick={() => handleSelectLayer(layer.id, false)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleSelectLayer(layer.id, true);
                    }}
                  >
                    {editingLayer && editingLayer.id === layer.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveRename();
                        }}
                      >
                        <Input
                          value={editingLayer.name}
                          onChange={(e) => setEditingLayer({ ...editingLayer, name: e.target.value })}
                          onBlur={handleSaveRename}
                          autoFocus
                          className="h-7 py-0"
                        />
                      </form>
                    ) : (
                      <div className="flex items-center">
                        <span className="truncate font-medium">{layer.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{layer.type}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Layer actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Layer Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStartRename(layer.id, layer.name)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(layer.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(layer.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBringToFront(layer.id)}>
                        Bring to Front
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMoveUp(layer.id)}>
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMoveDown(layer.id)}>
                        <ArrowDown className="mr-2 h-4 w-4" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendToBack(layer.id)}>
                        Send to Back
                      </DropdownMenuItem>
                      {layer.type === 'group' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUngroupLayer(layer.id)}>
                            <Ungroup className="mr-2 h-4 w-4" />
                            Ungroup
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery ? (
                <div>
                  <p>No layers matching "{searchQuery}"</p>
                  <Button variant="link" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                </div>
              ) : (
                <p>No layers found. Add some elements to the canvas.</p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LayerManager;
