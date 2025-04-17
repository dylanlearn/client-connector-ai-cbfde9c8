
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Layers, 
  Grid, 
  Move, 
  Section, 
  SlidersHorizontal, 
  Eye, 
  EyeOff,
  Lock, 
  Unlock, 
  Trash2,
  Copy, 
  CornerDownRight,
  CornerUpLeft,
  MoveHorizontal,
  MoveVertical,
  Expand,
  Ruler
} from 'lucide-react';

import { useFabric } from '@/hooks/fabric/use-fabric';
import { useAdvancedSelection } from '@/hooks/wireframe/use-advanced-selection';
import { useObjectManipulations } from '@/hooks/wireframe/use-object-manipulations';
import KeyboardShortcutHandler from '../wireframe/controls/KeyboardShortcutHandler';
import MultiTransformControls from './controls/MultiTransformControls';
import SelectionSettingsPanel from './panels/SelectionSettingsPanel';

// Types
import { SelectionConfig } from '@/components/wireframe/utils/types';

interface AdvancedWireframeEditorProps {
  width?: number;
  height?: number;
  className?: string;
  onSelectionChange?: (selectedObjects: fabric.Object[]) => void;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
}

const AdvancedWireframeEditor: React.FC<AdvancedWireframeEditorProps> = ({
  width = 1200,
  height = 800,
  className,
  onSelectionChange,
  onCanvasReady
}) => {
  // References
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [activeTab, setActiveTab] = useState<string>('select');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('multiple');
  const [showSmartGuides, setShowSmartGuides] = useState<boolean>(true);
  const [magneticStrength, setMagneticStrength] = useState<number>(5);
  const [showEdgeGuides, setShowEdgeGuides] = useState<boolean>(true);
  const [showCenterGuides, setShowCenterGuides] = useState<boolean>(true);
  const [showDistanceIndicators, setShowDistanceIndicators] = useState<boolean>(false);
  const [keyboardMovementStep, setKeyboardMovementStep] = useState<number>(1);
  
  // Custom hooks
  const { 
    fabricCanvas, 
    canvasConfig, 
    updateConfig, 
    initializeCanvas,
    addObject,
    removeObject,
    zoomIn,
    zoomOut,
    resetZoom
  } = useFabric({
    initialConfig: {
      width,
      height,
      showGrid,
      snapToGrid,
      gridSize,
      showSmartGuides,
      magneticStrength,
      showEdgeGuides,
      showCenterGuides,
      showDistanceIndicators,
      keyboardMovementStep
    }
  });
  
  const { 
    selectedObjects, 
    selectedObject,
    selectObjectById,
    selectMultipleObjectsById,
    clearSelection
  } = useAdvancedSelection(fabricCanvas);
  
  const {
    duplicateObjects,
    deleteObjects,
    groupObjects,
    ungroupObjects,
    toggleObjectLock,
    bringForward,
    sendBackward,
    undo,
    redo
  } = useObjectManipulations(fabricCanvas);
  
  // Initialize the canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = initializeCanvas(canvasRef.current);
      
      if (canvas && onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Add some example objects for testing
      if (canvas) {
        // Add a rectangle
        const rect = new fabric.Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: '#f5f5f5',
          stroke: '#333333',
          strokeWidth: 1,
          rx: 10,
          ry: 10
        });
        
        // Add a circle
        const circle = new fabric.Circle({
          left: 400,
          top: 150,
          radius: 75,
          fill: '#e6f7ff',
          stroke: '#0099cc',
          strokeWidth: 2
        });
        
        // Add a text object
        const text = new fabric.Textbox('Edit this text', {
          left: 150,
          top: 300,
          width: 300,
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#333333'
        });
        
        canvas.add(rect, circle, text);
        canvas.renderAll();
      }
    }
  }, [fabricCanvas, initializeCanvas, onCanvasReady]);
  
  // Update canvas configuration when settings change
  useEffect(() => {
    updateConfig({
      showGrid,
      snapToGrid,
      gridSize,
      showSmartGuides,
      magneticStrength,
      showEdgeGuides,
      showCenterGuides,
      showDistanceIndicators,
      keyboardMovementStep
    });
  }, [
    updateConfig, 
    showGrid, 
    snapToGrid, 
    gridSize,
    showSmartGuides,
    magneticStrength,
    showEdgeGuides,
    showCenterGuides,
    showDistanceIndicators,
    keyboardMovementStep
  ]);
  
  // Notify selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedObjects);
    }
  }, [selectedObjects, onSelectionChange]);
  
  // Selection configuration
  const selectionConfig: SelectionConfig = {
    mode: selectionMode,
    allowDeselect: true, 
    selectionKey: 'shift',
    dragSelectionKey: 'shift',
    keyboardMovementStep,
    objectSelectionPriority: 'front-to-back',
    style: {
      borderColor: '#2196f3',
      cornerColor: '#2196f3',
      cornerStyle: 'circle',
      cornerSize: 10,
      transparentCorners: false,
      cornerStrokeColor: '#ffffff',
      selectionBackgroundColor: 'rgba(33, 150, 243, 0.1)'
    }
  };
  
  // Handlers
  const handleDuplicate = () => {
    if (selectedObjects.length > 0) {
      duplicateObjects(selectedObjects);
    }
  };
  
  const handleDelete = () => {
    if (selectedObjects.length > 0) {
      deleteObjects(selectedObjects);
    }
  };
  
  const handleGroup = () => {
    if (selectedObjects.length > 1) {
      groupObjects(selectedObjects);
    }
  };
  
  const handleUngroup = () => {
    if (selectedObject && selectedObject.type === 'group') {
      ungroupObjects(selectedObject as fabric.Group);
    }
  };
  
  const handleLockToggle = () => {
    if (selectedObjects.length > 0) {
      toggleObjectLock(selectedObjects);
    }
  };
  
  const handleBringForward = () => {
    if (selectedObjects.length > 0) {
      bringForward(selectedObjects);
    }
  };
  
  const handleSendBackward = () => {
    if (selectedObjects.length > 0) {
      sendBackward(selectedObjects);
    }
  };
  
  return (
    <div className={cn("advanced-wireframe-editor", className)}>
      <div className="wireframe-toolbar bg-background border-b p-2 flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="select" className="flex items-center gap-1">
              <Move size={16} />
              Select
            </TabsTrigger>
            <TabsTrigger value="layers" className="flex items-center gap-1">
              <Layers size={16} />
              Layers
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-1">
              <Grid size={16} />
              Grid
            </TabsTrigger>
            <TabsTrigger value="smart-guides" className="flex items-center gap-1">
              <Ruler size={16} />
              Smart Guides
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <SlidersHorizontal size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            title="Zoom Out"
          >
            -
          </Button>
          <span className="text-sm">
            {Math.round((canvasConfig.zoom || 1) * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            title="Zoom In"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            title="Reset Zoom"
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="flex">
        <div 
          className="canvas-container flex-1 relative overflow-auto"
          ref={canvasWrapperRef}
        >
          <canvas ref={canvasRef} />
          
          {/* Transform controls for selected objects */}
          {fabricCanvas && selectedObjects.length > 0 && (
            <MultiTransformControls 
              canvas={fabricCanvas}
              selectedObjects={selectedObjects}
            />
          )}
          
          {/* Keyboard shortcuts handler */}
          {fabricCanvas && (
            <KeyboardShortcutHandler
              canvas={fabricCanvas}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onGroup={handleGroup}
              onUngroup={handleUngroup}
              onLockToggle={handleLockToggle}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onUndo={undo}
              onRedo={redo}
              keyboardMovementStep={keyboardMovementStep}
            />
          )}
        </div>
        
        {/* Right sidebar with settings */}
        <div className="settings-sidebar w-64 border-l bg-background p-4">
          <TabsContent value="select" className="mt-0">
            {selectedObjects.length > 0 ? (
              <SelectionSettingsPanel 
                selectedObjects={selectedObjects}
                canvas={fabricCanvas}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onBringForward={handleBringForward}
                onSendBackward={handleSendBackward}
                onLockToggle={handleLockToggle}
              />
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <p>Select an object to edit</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="layers" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Layers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage the stacking order of elements on the canvas
                </p>
                
                {/* Layer management UI would go here */}
                <div className="text-center p-4 text-muted-foreground">
                  <p>Layer management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="grid" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Grid Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure the grid system for better alignment
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Grid</span>
                    <Switch 
                      checked={showGrid} 
                      onCheckedChange={setShowGrid} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Snap to Grid</span>
                    <Switch 
                      checked={snapToGrid} 
                      onCheckedChange={setSnapToGrid} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm">Grid Size: {gridSize}px</span>
                    <Slider 
                      value={[gridSize]} 
                      min={5} 
                      max={50} 
                      step={5}
                      onValueChange={([value]) => setGridSize(value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm">Grid Type</span>
                    <Select
                      value={canvasConfig.gridType}
                      onValueChange={(value: 'lines' | 'dots' | 'columns') => 
                        updateConfig({ gridType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lines">Lines</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="columns">Columns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="smart-guides" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Smart Guides</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure intelligent alignment guides
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Smart Guides</span>
                    <Switch 
                      checked={showSmartGuides} 
                      onCheckedChange={setShowSmartGuides} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Edge Alignment</span>
                    <Switch 
                      checked={showEdgeGuides} 
                      onCheckedChange={setShowEdgeGuides} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Center Alignment</span>
                    <Switch 
                      checked={showCenterGuides} 
                      onCheckedChange={setShowCenterGuides} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Distance Indicators</span>
                    <Switch 
                      checked={showDistanceIndicators} 
                      onCheckedChange={setShowDistanceIndicators} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm">Magnetic Strength: {magneticStrength}</span>
                    <Slider 
                      value={[magneticStrength]} 
                      min={0} 
                      max={10} 
                      step={1}
                      onValueChange={([value]) => setMagneticStrength(value)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Editor Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure general editor behavior
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm">Selection Mode</span>
                    <Select
                      value={selectionMode}
                      onValueChange={(value: 'single' | 'multiple') => 
                        setSelectionMode(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Object</SelectItem>
                        <SelectItem value="multiple">Multiple Objects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm">Keyboard Movement: {keyboardMovementStep}px</span>
                    <Slider 
                      value={[keyboardMovementStep]} 
                      min={1} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => setKeyboardMovementStep(value)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default AdvancedWireframeEditor;
