
import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayerItem, convertCanvasObjectsToLayers } from '../utils/layer-utils';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
  Copy,
  Group,
  FolderPlus,
  Search,
  AlertTriangle,
  Plus,
  ArrowUpToLine,
  ArrowDownToLine
} from 'lucide-react';

interface LayerItemProps {
  layer: LayerItem;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onMoveToTop: (id: string) => void;
  onMoveToBottom: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const LayerItemComponent: React.FC<LayerItemProps> = ({
  layer,
  onToggleVisibility,
  onToggleLock,
  onSelect,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  onMoveToBottom,
  onDelete,
  onDuplicate,
  onRename
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameValue, setNameValue] = useState(layer.name);
  
  const handleRename = () => {
    onRename(layer.id, nameValue);
    setIsRenaming(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNameValue(layer.name);
    }
  };
  
  return (
    <div 
      className={`layer-item p-2 my-1 border rounded-md flex items-center ${
        layer.selected ? 'bg-primary/10 border-primary' : 'hover:bg-accent/10'
      }`}
      onClick={() => onSelect(layer.id)}
    >
      {/* Layer visibility toggle */}
      <Button 
        variant="ghost" 
        size="icon"
        className="h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(layer.id);
        }}
      >
        {layer.visible ? 
          <Eye className="h-4 w-4" /> : 
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        }
      </Button>
      
      {/* Layer lock toggle */}
      <Button 
        variant="ghost" 
        size="icon"
        className="h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLock(layer.id);
        }}
      >
        {layer.locked ? 
          <Lock className="h-4 w-4" /> : 
          <Unlock className="h-4 w-4 text-muted-foreground" />
        }
      </Button>
      
      {/* Layer name */}
      <div className="flex-1 ml-1">
        {isRenaming ? (
          <div className="flex" onClick={(e) => e.stopPropagation()}>
            <Input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-6 py-0 text-xs"
            />
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-sm truncate max-w-[120px]">{layer.name}</span>
            <span className="text-xs text-muted-foreground ml-2">({layer.type})</span>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
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
          className="h-5 w-5"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(layer.id);
          }}
        >
          <Trash className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

interface LayerManagerProps {
  canvas: fabric.Canvas | null;
}

const LayerManager: React.FC<LayerManagerProps> = ({ canvas }) => {
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  
  // Filter layers based on search query
  const filteredLayers = searchQuery
    ? layers.filter(layer => 
        layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        layer.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : layers;
  
  // Update layers when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const updateLayers = () => {
      const fabricObjects = canvas.getActiveObjects();
      const activeIds = fabricObjects.map(obj => obj.data?.id || String(obj.id));
      const layerItems = convertCanvasObjectsToLayers(canvas, activeIds);
      setLayers(layerItems);
      setSelectedLayerIds(activeIds);
    };
    
    // Initial update
    updateLayers();
    
    // Listen for canvas changes
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', updateLayers);
    canvas.on('selection:updated', updateLayers);
    canvas.on('selection:cleared', updateLayers);
    
    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
      canvas.off('selection:created', updateLayers);
      canvas.off('selection:updated', updateLayers);
      canvas.off('selection:cleared', updateLayers);
    };
  }, [canvas]);
  
  // Toggle layer visibility
  const handleToggleVisibility = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      object.visible = !object.visible;
      canvas.renderAll();
    }
  };
  
  // Toggle layer lock
  const handleToggleLock = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      const isLocked = object.lockMovementX && object.lockMovementY;
      object.lockMovementX = !isLocked;
      object.lockMovementY = !isLocked;
      object.lockRotation = !isLocked;
      object.lockScalingX = !isLocked;
      object.lockScalingY = !isLocked;
      canvas.renderAll();
    }
  };
  
  // Select layer
  const handleSelectLayer = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      if (multiSelectEnabled) {
        // Add to selection if multi-select is enabled
        if (canvas.getActiveObjects().includes(object)) {
          canvas.discardActiveObject();
        } else {
          const activeObjects = canvas.getActiveObjects().concat([object]);
          const selection = new fabric.ActiveSelection(activeObjects, { canvas });
          canvas.setActiveObject(selection);
        }
      } else {
        canvas.discardActiveObject();
        canvas.setActiveObject(object);
      }
      
      canvas.renderAll();
    }
  };
  
  // Move layer up
  const handleMoveUp = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      canvas.bringForward(object);
      canvas.renderAll();
    }
  };
  
  // Move layer down
  const handleMoveDown = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      canvas.sendBackwards(object);
      canvas.renderAll();
    }
  };
  
  // Move layer to top
  const handleMoveToTop = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      canvas.bringToFront(object);
      canvas.renderAll();
    }
  };
  
  // Move layer to bottom
  const handleMoveToBottom = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      canvas.sendToBack(object);
      
      // Make sure grid stays at the very back
      const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
      gridObjects.forEach(gridObj => canvas.sendToBack(gridObj));
      
      canvas.renderAll();
    }
  };
  
  // Delete layer
  const handleDeleteLayer = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      canvas.remove(object);
      canvas.renderAll();
    }
  };
  
  // Duplicate layer
  const handleDuplicateLayer = (id: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      object.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          evented: true,
        });
        
        if (!cloned.data) cloned.data = {};
        cloned.data.id = `${id}-copy-${Date.now()}`;
        cloned.data.name = `${object.data?.name || 'Layer'} (Copy)`;
        
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      });
    }
  };
  
  // Rename layer
  const handleRenameLayer = (id: string, newName: string) => {
    if (!canvas) return;
    
    const object = canvas.getObjects().find(obj => {
      const objId = obj.data?.id || String(obj.id);
      return objId === id;
    });
    
    if (object) {
      if (!object.data) object.data = {};
      object.data.name = newName;
      canvas.renderAll();
    }
  };
  
  // Create group
  const handleCreateGroup = () => {
    if (!canvas || selectedLayerIds.length < 2) return;
    
    const objectsToGroup = canvas.getActiveObjects();
    if (objectsToGroup.length < 2) return;
    
    // Create group
    const group = new fabric.Group(objectsToGroup, {
      data: {
        id: `group-${Date.now()}`,
        name: `Group (${objectsToGroup.length})`,
        type: 'group'
      }
    });
    
    // Remove individual objects
    canvas.discardActiveObject();
    objectsToGroup.forEach(obj => canvas.remove(obj));
    
    // Add group
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  };
  
  // Add new shape
  const handleAddShape = () => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'rgba(0, 123, 255, 0.5)',
      stroke: '#007bff',
      strokeWidth: 1,
      data: {
        id: `shape-${Date.now()}`,
        name: `Shape ${layers.length + 1}`,
        type: 'rectangle'
      }
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Layers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        {/* Search and actions */}
        <div className="mb-3">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search layers..."
              className="pl-8 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={handleAddShape}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Shape
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 ${selectedLayerIds.length < 2 ? 'opacity-50' : ''}`}
              onClick={handleCreateGroup}
              disabled={selectedLayerIds.length < 2}
            >
              <Group className="h-3.5 w-3.5 mr-1" />
              Group
            </Button>
          </div>
        </div>
        
        {/* Z-index controls for selected layers */}
        {selectedLayerIds.length > 0 && (
          <div className="mb-3 flex justify-between bg-accent/20 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  selectedLayerIds.forEach(id => handleMoveToTop(id));
                }}
              >
                <ArrowUpToLine className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  selectedLayerIds.forEach(id => handleMoveUp(id));
                }}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  selectedLayerIds.forEach(id => handleMoveDown(id));
                }}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  selectedLayerIds.forEach(id => handleMoveToBottom(id));
                }}
              >
                <ArrowDownToLine className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs flex items-center">
              {selectedLayerIds.length} selected
            </div>
          </div>
        )}
        
        {/* Layer list */}
        {filteredLayers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {layers.length === 0 ? (
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
                <p>No layers found</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="mt-1"
                  onClick={handleAddShape}
                >
                  Add your first shape
                </Button>
              </div>
            ) : (
              <p>No layers match your search</p>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[320px] pr-3">
            {filteredLayers.map(layer => (
              <LayerItemComponent
                key={layer.id}
                layer={layer}
                onToggleVisibility={handleToggleVisibility}
                onToggleLock={handleToggleLock}
                onSelect={handleSelectLayer}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveToTop={handleMoveToTop}
                onMoveToBottom={handleMoveToBottom}
                onDelete={handleDeleteLayer}
                onDuplicate={handleDuplicateLayer}
                onRename={handleRenameLayer}
              />
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default LayerManager;
