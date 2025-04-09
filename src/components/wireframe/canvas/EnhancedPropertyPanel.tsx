
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EnhancedPropertyPanelProps {
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  onUpdate?: () => void;
  className?: string;
  onSaveHistoryState?: (description: string) => void;
}

const EnhancedPropertyPanel: React.FC<EnhancedPropertyPanelProps> = ({
  selectedObject,
  canvas,
  onUpdate,
  className,
  onSaveHistoryState
}) => {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [fill, setFill] = useState('#ffffff');
  const [stroke, setStroke] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [locked, setLocked] = useState(false);

  // Update local state when selected object changes
  useEffect(() => {
    if (!selectedObject) return;
    
    setPosition({
      left: Math.round(selectedObject.left || 0),
      top: Math.round(selectedObject.top || 0),
    });
    
    // Check if object is a group with scaleX/scaleY applied
    let width = selectedObject.width || 0;
    let height = selectedObject.height || 0;
    
    if (selectedObject.scaleX) {
      width *= selectedObject.scaleX;
    }
    
    if (selectedObject.scaleY) {
      height *= selectedObject.scaleY;
    }
    
    setSize({
      width: Math.round(width),
      height: Math.round(height),
    });
    
    setAngle(selectedObject.angle || 0);
    setOpacity(Math.round((selectedObject.opacity || 1) * 100));
    setFill(selectedObject.fill?.toString() || '#ffffff');
    setStroke(selectedObject.stroke?.toString() || '#000000');
    setStrokeWidth(selectedObject.strokeWidth || 1);
    setLocked(!!selectedObject.lockMovementX && !!selectedObject.lockMovementY);
    
  }, [selectedObject]);

  const saveState = (description: string) => {
    if (onSaveHistoryState) {
      onSaveHistoryState(description);
    }
  };
  
  // Handle position changes
  const handlePositionChange = (axis: 'left' | 'top', value: number) => {
    if (!selectedObject || !canvas) return;
    
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    
    selectedObject.set(axis, value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  const handlePositionChangeComplete = () => {
    saveState('Position changed');
  };
  
  // Handle size changes
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedObject || !canvas) return;
    
    const newSize = { ...size, [dimension]: value };
    setSize(newSize);
    
    // Scale the object instead of directly setting width/height
    if (dimension === 'width' && selectedObject.width) {
      selectedObject.scaleX = value / selectedObject.width;
    }
    
    if (dimension === 'height' && selectedObject.height) {
      selectedObject.scaleY = value / selectedObject.height;
    }
    
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  const handleSizeChangeComplete = () => {
    saveState('Size changed');
  };
  
  // Handle rotation changes
  const handleAngleChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    setAngle(value);
    selectedObject.set('angle', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  const handleAngleChangeComplete = () => {
    saveState('Rotation changed');
  };
  
  // Handle opacity changes
  const handleOpacityChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    setOpacity(value);
    selectedObject.set('opacity', value / 100);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  const handleOpacityChangeComplete = () => {
    saveState('Opacity changed');
  };
  
  // Handle fill color changes
  const handleFillChange = (value: string) => {
    if (!selectedObject || !canvas) return;
    
    setFill(value);
    selectedObject.set('fill', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
    saveState('Fill color changed');
  };
  
  // Handle stroke color changes
  const handleStrokeChange = (value: string) => {
    if (!selectedObject || !canvas) return;
    
    setStroke(value);
    selectedObject.set('stroke', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
    saveState('Stroke color changed');
  };
  
  // Handle stroke width changes
  const handleStrokeWidthChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    setStrokeWidth(value);
    selectedObject.set('strokeWidth', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  const handleStrokeWidthChangeComplete = () => {
    saveState('Stroke width changed');
  };
  
  // Handle lock/unlock
  const handleLockedChange = (locked: boolean) => {
    if (!selectedObject || !canvas) return;
    
    setLocked(locked);
    selectedObject.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockRotation: locked,
      lockScalingX: locked,
      lockScalingY: locked,
    });
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
    saveState(locked ? 'Object locked' : 'Object unlocked');
  };
  
  // Handle object deletion
  const handleDelete = () => {
    if (!selectedObject || !canvas) return;
    
    canvas.remove(selectedObject);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
    saveState('Object deleted');
  };
  
  // Handle moving object forward/backward
  const handleReorder = (direction: 'forward' | 'backward' | 'front' | 'back') => {
    if (!selectedObject || !canvas) return;
    
    switch (direction) {
      case 'forward':
        selectedObject.bringForward();
        break;
      case 'backward':
        selectedObject.sendBackwards();
        break;
      case 'front':
        selectedObject.bringToFront();
        break;
      case 'back':
        selectedObject.sendToBack();
        break;
    }
    
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
    saveState(`Moved object ${direction}`);
  };
  
  if (!selectedObject) {
    return (
      <div className={cn("p-4 bg-card border rounded-md shadow-sm", className)}>
        <p className="text-muted-foreground text-center py-6">No object selected</p>
        <p className="text-xs text-muted-foreground text-center">Select an object to edit its properties</p>
      </div>
    );
  }
  
  return (
    <div className={cn("p-4 bg-card border rounded-md shadow-sm", className)}>
      <h3 className="font-medium text-lg mb-4">Object Properties</h3>
      
      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="appearance">Style</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positionX">X Position</Label>
              <Input
                id="positionX"
                type="number"
                value={position.left}
                onChange={(e) => handlePositionChange('left', Number(e.target.value))}
                onBlur={() => handlePositionChangeComplete()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionY">Y Position</Label>
              <Input
                id="positionY"
                type="number"
                value={position.top}
                onChange={(e) => handlePositionChange('top', Number(e.target.value))}
                onBlur={() => handlePositionChangeComplete()}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={size.width}
                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                onBlur={() => handleSizeChangeComplete()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={size.height}
                onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                onBlur={() => handleSizeChangeComplete()}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="locked"
              checked={locked}
              onCheckedChange={handleLockedChange}
            />
            <Label htmlFor="locked">Lock position and size</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <div className="space-y-2">
            <Label>Fill Color</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-10 h-10 p-0 rounded border"
                  >
                    <div 
                      className="w-full h-full rounded-sm" 
                      style={{ backgroundColor: fill }}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-8 gap-1">
                      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'].map(color => (
                        <Button
                          key={color}
                          variant="outline"
                          className="w-8 h-8 p-0 rounded-md"
                          onClick={() => handleFillChange(color)}
                        >
                          <div 
                            className="w-full h-full rounded-sm" 
                            style={{ backgroundColor: color }}
                          />
                        </Button>
                      ))}
                    </div>
                    <Input
                      value={fill}
                      onChange={(e) => handleFillChange(e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                value={fill}
                onChange={(e) => handleFillChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Stroke Color</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-10 h-10 p-0 rounded border"
                  >
                    <div 
                      className="w-full h-full rounded-sm" 
                      style={{ backgroundColor: stroke }}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-8 gap-1">
                      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'].map(color => (
                        <Button
                          key={color}
                          variant="outline"
                          className="w-8 h-8 p-0 rounded-md"
                          onClick={() => handleStrokeChange(color)}
                        >
                          <div 
                            className="w-full h-full rounded-sm" 
                            style={{ backgroundColor: color }}
                          />
                        </Button>
                      ))}
                    </div>
                    <Input
                      value={stroke}
                      onChange={(e) => handleStrokeChange(e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                value={stroke}
                onChange={(e) => handleStrokeChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Stroke Width: {strokeWidth}px</Label>
            </div>
            <Slider
              min={0}
              max={20}
              step={1}
              value={[strokeWidth]}
              onValueChange={(value) => handleStrokeWidthChange(value[0])}
              onValueCommit={() => handleStrokeWidthChangeComplete()}
              className="py-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Opacity: {opacity}%</Label>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(value) => handleOpacityChange(value[0])}
              onValueCommit={() => handleOpacityChangeComplete()}
              className="py-2"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="transform" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Rotation: {angle}°</Label>
            </div>
            <Slider
              min={0}
              max={359}
              step={1}
              value={[angle]}
              onValueChange={(value) => handleAngleChange(value[0])}
              onValueCommit={() => handleAngleChangeComplete()}
              className="py-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleAngleChange((angle + 90) % 360);
                handleAngleChangeComplete();
              }}
            >
              Rotate +90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleAngleChange((angle - 90 + 360) % 360);
                handleAngleChangeComplete();
              }}
            >
              Rotate -90°
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReorder('forward')}
            >
              Bring Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReorder('backward')}
            >
              Send Backward
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReorder('front')}
            >
              Bring to Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReorder('back')}
            >
              Send to Back
            </Button>
          </div>
          
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Delete Object
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPropertyPanel;
