
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFabric } from '@/hooks/fabric/use-fabric';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAdvancedSelection } from '@/hooks/wireframe/use-advanced-selection';
import KeyboardShortcutHandler from './controls/KeyboardShortcutHandler';
import MultiTransformControls from './controls/MultiTransformControls';
import SelectionSettingsPanel from './panels/SelectionSettingsPanel';
import { fabric } from 'fabric';
import { SelectionConfig } from './utils/types';
import useCanvasHistory from '@/hooks/wireframe/use-canvas-history';
import { Copy, Trash, Undo, Redo, Selection, MousePointerSquareDashed, Scissors, Pipette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useGridActions } from '@/hooks/fabric/use-grid-actions';

interface AdvancedWireframeEditorProps {
  width?: number;
  height?: number;
  className?: string;
  onSave?: (json: any) => void;
}

const AdvancedWireframeEditor: React.FC<AdvancedWireframeEditorProps> = ({
  width = 1200,
  height = 800,
  className,
  onSave,
}) => {
  const { toast } = useToast();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize Fabric canvas
  const {
    fabricCanvas,
    canvasConfig,
    updateConfig,
    initializeCanvas,
    canvasRef,
    zoomIn,
    zoomOut,
    resetZoom,
    selectedObject,
  } = useFabric({
    initialConfig: {
      width,
      height,
      showGrid: true,
      snapToGrid: true,
      gridSize: 10,
      showSmartGuides: true,
      selectionMode: 'multiple',
      keyboardMovementStep: 1,
      objectSelectionPriority: 'front-to-back',
    },
    persistConfig: true,
  });
  
  // Get grid actions for toggling grid features
  const gridActions = useGridActions(updateConfig, canvasConfig);
  
  // Initialize canvas history for undo/redo
  const { canUndo, canRedo, undo, redo, saveHistoryState } = useCanvasHistory({
    canvas: fabricCanvas,
    maxHistorySteps: 50,
  });

  // Initialize active tool state
  const [activeTool, setActiveTool] = useState<
    'select' | 'rectangle' | 'circle' | 'text' | 'line' | 'path' | 'eraser' | 'eyedropper'
  >('select');
  
  // Initialize selection mode state
  const [selectionConfig, setSelectionConfig] = useState<SelectionConfig>({
    mode: 'multiple',
    allowDeselect: true,
    selectionKey: 'shift',
    dragSelectionKey: 'shift',
    keyboardMovementStep: 1,
    objectSelectionPriority: 'front-to-back',
    style: {
      borderColor: '#2196F3',
      cornerColor: '#2196F3',
      cornerStyle: 'circle',
      cornerSize: 8,
      transparentCorners: false,
      cornerStrokeColor: '#ffffff',
      selectionBackgroundColor: 'rgba(33, 150, 243, 0.1)',
    }
  });

  // Initialize advanced selection
  const {
    selectedObjects,
    groupSelectedObjects,
    ungroupSelectedObjects,
    duplicateSelectedObjects,
    clearSelection,
  } = useAdvancedSelection({
    canvas: fabricCanvas,
    config: selectionConfig,
    onSelectionChange: (objects) => {
      // If we have a selection, save the state for undo/redo
      if (objects.length > 0) {
        // Timeout to ensure the selection is complete
        setTimeout(() => {
          saveHistoryState('Selection changed');
        }, 0);
      }
    },
  });

  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = initializeCanvas(canvasRef.current);
      
      // Add some default shapes to play with
      if (canvas) {
        // Add a rectangle
        const rect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#ff5722',
          strokeWidth: 2,
          stroke: '#e64a19',
          rx: 4,
          ry: 4,
          data: { id: 'rect-1', type: 'rectangle' },
        });
        
        // Add a circle
        const circle = new fabric.Circle({
          left: 300,
          top: 100,
          radius: 50,
          fill: '#2196f3',
          strokeWidth: 2, 
          stroke: '#1565c0',
          data: { id: 'circle-1', type: 'circle' },
        });
        
        // Add a text object
        const text = new fabric.Text('Hello Wireframe', {
          left: 100,
          top: 250,
          fontFamily: 'Arial',
          fontSize: 24,
          fill: '#212121',
          data: { id: 'text-1', type: 'text' },
        });
        
        // Add a triangle
        const triangle = new fabric.Triangle({
          left: 300,
          top: 250,
          width: 100,
          height: 100,
          fill: '#4caf50',
          strokeWidth: 2,
          stroke: '#2e7d32',
          data: { id: 'triangle-1', type: 'triangle' },
        });
        
        canvas.add(rect, circle, text, triangle);
        canvas.renderAll();
        
        // Save initial state for undo/redo
        saveHistoryState('Initial state');
      }
    }
  }, [fabricCanvas, initializeCanvas, canvasRef, saveHistoryState]);

  // Handle tool changes
  const handleToolChange = useCallback((tool: typeof activeTool) => {
    if (!fabricCanvas) return;
    
    // Disable drawing mode for all tools except path
    fabricCanvas.isDrawingMode = tool === 'path';
    
    // Set cursor based on tool
    switch (tool) {
      case 'select':
        fabricCanvas.defaultCursor = 'default';
        break;
      case 'rectangle':
      case 'circle':
      case 'text':
      case 'line':
        fabricCanvas.defaultCursor = 'crosshair';
        break;
      case 'path':
        fabricCanvas.defaultCursor = 'pencil';
        break;
      case 'eraser':
        fabricCanvas.defaultCursor = 'not-allowed';
        break;
      case 'eyedropper':
        fabricCanvas.defaultCursor = 'cell';
        break;
    }
    
    setActiveTool(tool);
    
    // Clear selection when changing tools
    if (tool !== 'select') {
      clearSelection();
    }
    
    // Update canvas to show the new cursor
    fabricCanvas.renderAll();
  }, [fabricCanvas, clearSelection]);

  // Handle canvas click for creating new objects
  const handleCanvasClick = useCallback((e: fabric.IEvent) => {
    if (!fabricCanvas || activeTool === 'select') return;
    
    const pointer = fabricCanvas.getPointer(e.e);
    let object: fabric.Object;
    
    // Create object based on active tool
    switch (activeTool) {
      case 'rectangle':
        object = new fabric.Rect({
          left: pointer.x - 50,
          top: pointer.y - 50,
          width: 100,
          height: 100,
          fill: '#e91e63',
          stroke: '#c2185b',
          strokeWidth: 2,
          data: { id: `rect-${Date.now()}`, type: 'rectangle' },
        });
        break;
        
      case 'circle':
        object = new fabric.Circle({
          left: pointer.x - 50,
          top: pointer.y - 50,
          radius: 50,
          fill: '#9c27b0',
          stroke: '#7b1fa2',
          strokeWidth: 2,
          data: { id: `circle-${Date.now()}`, type: 'circle' },
        });
        break;
        
      case 'text':
        object = new fabric.Textbox('Edit text', {
          left: pointer.x - 50,
          top: pointer.y - 15,
          width: 100,
          fontSize: 18,
          fontFamily: 'Arial',
          fill: '#212121',
          data: { id: `text-${Date.now()}`, type: 'text' },
        });
        break;
        
      case 'line':
        object = new fabric.Line([pointer.x - 50, pointer.y, pointer.x + 50, pointer.y], {
          stroke: '#000000',
          strokeWidth: 2,
          data: { id: `line-${Date.now()}`, type: 'line' },
        });
        break;
        
      default:
        return;
    }
    
    // Add the new object
    fabricCanvas.add(object);
    fabricCanvas.setActiveObject(object);
    fabricCanvas.renderAll();
    
    // Save history state
    saveHistoryState('Added new object');
    
    // Switch back to select tool
    handleToolChange('select');
    
    // Show toast notification
    toast({
      title: 'Object Created',
      description: `New ${activeTool} added to canvas`,
    });
  }, [fabricCanvas, activeTool, handleToolChange, saveHistoryState, toast]);

  // Set up canvas event listeners
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Add mouse down handler for creating new objects
    fabricCanvas.on('mouse:down', handleCanvasClick);
    
    // Save history when objects are modified
    fabricCanvas.on('object:modified', () => {
      saveHistoryState('Object modified');
    });
    
    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
      fabricCanvas.off('object:modified');
    };
  }, [fabricCanvas, handleCanvasClick, saveHistoryState]);

  // Handle selection config changes
  const handleSelectionConfigChange = useCallback((config: Partial<SelectionConfig>) => {
    setSelectionConfig(prev => {
      const newConfig = {
        ...prev,
        ...config,
        style: {
          ...prev.style,
          ...(config.style || {})
        }
      };
      
      // Update fabric canvas with new selection style if available
      if (fabricCanvas && config.style) {
        if (config.style.borderColor) {
          fabric.Object.prototype.set({ borderColor: config.style.borderColor });
          fabricCanvas.selectionBorderColor = config.style.borderColor;
        }
        
        if (config.style.cornerColor) {
          fabric.Object.prototype.set({ cornerColor: config.style.cornerColor });
        }
        
        if (config.style.cornerSize !== undefined) {
          fabric.Object.prototype.set({ cornerSize: config.style.cornerSize });
        }
        
        if (config.style.transparentCorners !== undefined) {
          fabric.Object.prototype.set({ transparentCorners: config.style.transparentCorners });
        }
        
        if (config.style.cornerStyle) {
          fabric.Object.prototype.set({ cornerStyle: config.style.cornerStyle });
        }
        
        if (config.style.cornerStrokeColor) {
          fabric.Object.prototype.set({ cornerStrokeColor: config.style.cornerStrokeColor });
        }
        
        if (config.style.selectionBackgroundColor) {
          fabricCanvas.selectionColor = config.style.selectionBackgroundColor;
        }
        
        fabricCanvas.renderAll();
      }
      
      return newConfig;
    });
  }, [fabricCanvas]);

  // Handle saving the canvas
  const handleSave = useCallback(() => {
    if (!fabricCanvas) return;
    
    const json = fabricCanvas.toJSON(['id', 'name', 'data']);
    
    if (onSave) {
      onSave(json);
    }
    
    toast({
      title: 'Canvas Saved',
      description: 'Your wireframe has been saved successfully',
    });
  }, [fabricCanvas, onSave, toast]);

  // Handle deleting selected objects
  const handleDeleteSelected = useCallback(() => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      
      saveHistoryState('Deleted objects');
      
      toast({
        title: 'Objects Deleted',
        description: `${activeObjects.length} objects have been deleted`,
      });
    }
  }, [fabricCanvas, saveHistoryState, toast]);

  // Handle object ordering (bring forward, send backward)
  const handleBringForward = useCallback(() => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    fabricCanvas.bringForward(activeObject);
    fabricCanvas.renderAll();
    saveHistoryState('Brought object forward');
  }, [fabricCanvas, saveHistoryState]);

  const handleSendBackward = useCallback(() => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    fabricCanvas.sendBackwards(activeObject);
    fabricCanvas.renderAll();
    saveHistoryState('Sent object backward');
  }, [fabricCanvas, saveHistoryState]);

  // Handle locking/unlocking objects
  const handleToggleLock = useCallback(() => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    
    const allLocked = activeObjects.every(obj => obj.lockMovementX && obj.lockMovementY);
    
    // Toggle lock state
    activeObjects.forEach(obj => {
      obj.set({
        lockMovementX: !allLocked,
        lockMovementY: !allLocked,
        lockRotation: !allLocked,
        lockScalingX: !allLocked,
        lockScalingY: !allLocked,
        hasControls: allLocked,
        hoverCursor: allLocked ? 'move' : 'not-allowed',
      });
    });
    
    fabricCanvas.renderAll();
    saveHistoryState('Toggled object lock state');
    
    toast({
      title: allLocked ? 'Objects Unlocked' : 'Objects Locked',
      description: allLocked 
        ? 'The selected objects can now be moved and edited' 
        : 'The selected objects are now locked',
    });
  }, [fabricCanvas, saveHistoryState, toast]);

  // Handle alignment operations
  const alignObjects = useCallback((alignType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length <= 1) return;
    
    // Calculate the bounding box of all selected objects
    const selection = fabricCanvas.getActiveObject() as fabric.ActiveSelection;
    if (!selection || selection.type !== 'activeSelection') return;
    
    let targetValue: number;
    
    switch (alignType) {
      case 'left':
        // Align all objects to the left edge of the selection
        activeObjects.forEach(obj => {
          obj.set({
            left: selection.left
          });
          obj.setCoords();
        });
        break;
      case 'center':
        // Align all objects to the horizontal center of the selection
        targetValue = selection.left + selection.width! / 2;
        activeObjects.forEach(obj => {
          obj.set({
            left: targetValue - obj.width! * obj.scaleX! / 2
          });
          obj.setCoords();
        });
        break;
      case 'right':
        // Align all objects to the right edge of the selection
        targetValue = selection.left + selection.width!;
        activeObjects.forEach(obj => {
          obj.set({
            left: targetValue - obj.width! * obj.scaleX!
          });
          obj.setCoords();
        });
        break;
      case 'top':
        // Align all objects to the top edge of the selection
        activeObjects.forEach(obj => {
          obj.set({
            top: selection.top
          });
          obj.setCoords();
        });
        break;
      case 'middle':
        // Align all objects to the vertical center of the selection
        targetValue = selection.top + selection.height! / 2;
        activeObjects.forEach(obj => {
          obj.set({
            top: targetValue - obj.height! * obj.scaleY! / 2
          });
          obj.setCoords();
        });
        break;
      case 'bottom':
        // Align all objects to the bottom edge of the selection
        targetValue = selection.top + selection.height!;
        activeObjects.forEach(obj => {
          obj.set({
            top: targetValue - obj.height! * obj.scaleY!
          });
          obj.setCoords();
        });
        break;
    }
    
    fabricCanvas.renderAll();
    saveHistoryState(`Aligned objects ${alignType}`);
  }, [fabricCanvas, saveHistoryState]);

  // Handle distribution operations
  const distributeObjects = useCallback((direction: 'horizontal' | 'vertical') => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length <= 2) return;
    
    // Sort objects by position
    const sortedObjects = [...activeObjects];
    if (direction === 'horizontal') {
      sortedObjects.sort((a, b) => (a.left || 0) - (b.left || 0));
    } else {
      sortedObjects.sort((a, b) => (a.top || 0) - (b.top || 0));
    }
    
    // Calculate total space
    const first = sortedObjects[0];
    const last = sortedObjects[sortedObjects.length - 1];
    
    let totalSpace: number;
    if (direction === 'horizontal') {
      totalSpace = (last.left || 0) - (first.left || 0);
    } else {
      totalSpace = (last.top || 0) - (first.top || 0);
    }
    
    // Calculate spacing and distribute objects
    const spacing = totalSpace / (sortedObjects.length - 1);
    
    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const obj = sortedObjects[i];
      
      if (direction === 'horizontal') {
        obj.set({
          left: (first.left || 0) + spacing * i
        });
      } else {
        obj.set({
          top: (first.top || 0) + spacing * i
        });
      }
      
      obj.setCoords();
    }
    
    fabricCanvas.renderAll();
    saveHistoryState(`Distributed objects ${direction}`);
  }, [fabricCanvas, saveHistoryState]);

  return (
    <div className={cn("advanced-wireframe-editor", className)}>
      <div className="editor-toolbar flex items-center gap-2 mb-4 p-2 bg-muted rounded-md">
        <div className="tool-group flex items-center gap-1 mr-4">
          <Button
            size="icon"
            variant={activeTool === 'select' ? 'default' : 'outline'}
            onClick={() => handleToolChange('select')}
            title="Selection Tool (V)"
          >
            <Selection className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={activeTool === 'rectangle' ? 'default' : 'outline'}
            onClick={() => handleToolChange('rectangle')}
            title="Rectangle Tool (R)"
          >
            <MousePointerSquareDashed className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={activeTool === 'circle' ? 'default' : 'outline'}
            onClick={() => handleToolChange('circle')}
            title="Circle Tool (C)"
          >
            <div className="h-4 w-4 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full border-2 border-current"></div>
            </div>
          </Button>
          <Button
            size="icon"
            variant={activeTool === 'text' ? 'default' : 'outline'}
            onClick={() => handleToolChange('text')}
            title="Text Tool (T)"
          >
            <span className="font-bold text-sm">T</span>
          </Button>
          <Button
            size="icon"
            variant={activeTool === 'path' ? 'default' : 'outline'}
            onClick={() => handleToolChange('path')}
            title="Path Tool (P)"
          >
            <Scissors className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={activeTool === 'eyedropper' ? 'default' : 'outline'}
            onClick={() => handleToolChange('eyedropper')}
            title="Eyedropper Tool"
          >
            <Pipette className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="action-group flex items-center gap-1 mr-4">
          <Button
            size="icon"
            variant="outline"
            onClick={duplicateSelectedObjects}
            disabled={!selectedObjects.length}
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleDeleteSelected}
            disabled={!selectedObjects.length}
            title="Delete (Delete)"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="history-group flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="grow"></div>

        <Button onClick={handleSave}>Save Wireframe</Button>
      </div>

      <div className="editor-content flex gap-4">
        <div className="editor-canvas-container relative flex-grow" ref={canvasContainerRef}>
          <div
            className="canvas-wrapper relative border rounded-md overflow-hidden"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              maxWidth: '100%',
              maxHeight: '80vh',
            }}
          >
            <canvas ref={canvasRef} />
            
            {/* Multi-object selection controls */}
            {fabricCanvas && selectedObjects.length > 0 && (
              <MultiTransformControls
                canvas={fabricCanvas}
                selectedObjects={selectedObjects}
                onDuplicate={duplicateSelectedObjects}
                onDelete={handleDeleteSelected}
                onGroup={groupSelectedObjects}
                onUngroup={ungroupSelectedObjects}
                onLockToggle={handleToggleLock}
                onBringForward={handleBringForward}
                onSendBackward={handleSendBackward}
                onAlignLeft={() => alignObjects('left')}
                onAlignCenter={() => alignObjects('center')}
                onAlignRight={() => alignObjects('right')}
                onAlignTop={() => alignObjects('top')}
                onAlignMiddle={() => alignObjects('middle')}
                onAlignBottom={() => alignObjects('bottom')}
                onDistributeHorizontally={() => distributeObjects('horizontal')}
                onDistributeVertically={() => distributeObjects('vertical')}
              />
            )}
          </div>
          
          <div className="canvas-controls flex items-center justify-end gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={zoomOut}
              title="Zoom Out"
            >
              -
            </Button>
            <span className="text-sm">
              {Math.round(canvasConfig.zoom * 100)}%
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomIn}
              title="Zoom In"
            >
              +
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetZoom}
              title="Reset Zoom"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="editor-sidebar w-[300px] flex-shrink-0">
          <Tabs defaultValue="selection">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="selection">Selection</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="guides">Smart Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="selection" className="mt-2">
              <Card>
                <SelectionSettingsPanel
                  config={selectionConfig}
                  onChange={handleSelectionConfigChange}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="grid" className="mt-2">
              <Card>
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Grid Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show Grid</Label>
                      <Switch
                        checked={canvasConfig.showGrid}
                        onCheckedChange={gridActions.toggleGrid}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Snap to Grid</Label>
                      <Switch
                        checked={canvasConfig.snapToGrid}
                        onCheckedChange={gridActions.toggleSnapToGrid}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Grid Size</Label>
                        <span className="text-sm">{canvasConfig.gridSize}px</span>
                      </div>
                      <Slider
                        min={5}
                        max={50}
                        step={5}
                        value={[canvasConfig.gridSize]}
                        onValueChange={(value) => gridActions.setGridSize(value[0])}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Grid Type</Label>
                      <Select
                        value={canvasConfig.gridType}
                        onValueChange={(value: 'lines' | 'dots' | 'columns') => 
                          gridActions.setGridType(value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Grid Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lines">Lines</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="columns">Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides" className="mt-2">
              <Card>
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-medium">Smart Guides</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Smart Guides</Label>
                      <Switch
                        checked={canvasConfig.showSmartGuides}
                        onCheckedChange={(checked) => 
                          updateConfig({ showSmartGuides: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Show Edge Guides</Label>
                      <Switch
                        checked={canvasConfig.showEdgeGuides ?? true}
                        onCheckedChange={(checked) => 
                          updateConfig({ showEdgeGuides: checked })
                        }
                        disabled={!canvasConfig.showSmartGuides}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Show Center Guides</Label>
                      <Switch
                        checked={canvasConfig.showCenterGuides ?? true}
                        onCheckedChange={(checked) => 
                          updateConfig({ showCenterGuides: checked })
                        }
                        disabled={!canvasConfig.showSmartGuides}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Show Distance Indicators</Label>
                      <Switch
                        checked={canvasConfig.showDistanceIndicators ?? false}
                        onCheckedChange={(checked) => 
                          updateConfig({ showDistanceIndicators: checked })
                        }
                        disabled={!canvasConfig.showSmartGuides}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Magnetic Strength</Label>
                        <span className="text-sm">
                          {canvasConfig.magneticStrength || 5}px
                        </span>
                      </div>
                      <Slider
                        min={1}
                        max={20}
                        step={1}
                        value={[canvasConfig.magneticStrength || 5]}
                        onValueChange={(value) => 
                          updateConfig({ magneticStrength: value[0] })
                        }
                        disabled={!canvasConfig.showSmartGuides}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Show selection info if objects are selected */}
          {selectedObjects.length > 0 && (
            <div className="mt-4 p-3 border rounded-md bg-muted/30">
              <h4 className="text-sm font-medium">Selection Info</h4>
              <div className="text-xs text-muted-foreground">
                {selectedObjects.length} object{selectedObjects.length > 1 ? 's' : ''} selected
                
                {selectedObject && (
                  <div className="mt-2 space-y-1">
                    <div>Type: {selectedObject.type}</div>
                    {selectedObject.width && (
                      <div>Width: {Math.round(selectedObject.width * (selectedObject.scaleX || 1))}px</div>
                    )}
                    {selectedObject.height && (
                      <div>Height: {Math.round(selectedObject.height * (selectedObject.scaleY || 1))}px</div>
                    )}
                    <div>Position: ({Math.round(selectedObject.left || 0)}, {Math.round(selectedObject.top || 0)})</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Keyboard shortcuts handler */}
      <KeyboardShortcutHandler
        canvas={fabricCanvas}
        enabled={true}
        onDuplicate={duplicateSelectedObjects}
        onDelete={handleDeleteSelected}
        onGroup={groupSelectedObjects}
        onUngroup={ungroupSelectedObjects}
        onLockToggle={handleToggleLock}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onUndo={undo}
        onRedo={redo}
        keyboardMovementStep={selectionConfig.keyboardMovementStep}
      />
    </div>
  );
};

export default AdvancedWireframeEditor;

// Helper components
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => {
  return (
    <label className="text-sm" {...props}>
      {children}
    </label>
  );
};
