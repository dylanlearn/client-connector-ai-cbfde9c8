
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PropertyPanelProps {
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  onUpdate?: () => void;
  className?: string;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedObject,
  canvas,
  onUpdate,
  className,
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
    
    setSize({
      width: Math.round(selectedObject.width || 0),
      height: Math.round(selectedObject.height || 0),
    });
    
    setAngle(selectedObject.angle || 0);
    setOpacity(Math.round((selectedObject.opacity || 1) * 100));
    setFill(selectedObject.fill?.toString() || '#ffffff');
    setStroke(selectedObject.stroke?.toString() || '#000000');
    setStrokeWidth(selectedObject.strokeWidth || 1);
    setLocked(!!selectedObject.lockMovementX && !!selectedObject.lockMovementY);
    
  }, [selectedObject]);
  
  // Handle position changes
  const handlePositionChange = (axis: 'left' | 'top', value: number) => {
    if (!selectedObject || !canvas) return;
    
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    
    selectedObject.set(axis, value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  // Handle size changes
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedObject || !canvas) return;
    
    const newSize = { ...size, [dimension]: value };
    setSize(newSize);
    
    selectedObject.set(dimension, value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  // Handle rotation changes
  const handleAngleChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    setAngle(value);
    selectedObject.set('angle', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  // Handle opacity changes
  const handleOpacityChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    setOpacity(value);
    selectedObject.set('opacity', value / 100);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  // Handle fill color changes
  const handleFillChange = (value: string) => {
    if (!selectedObject || !canvas) return;
    
    setFill(value);
    selectedObject.set('fill', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  // Handle stroke color changes
  const handleStrokeChange = (value: string) => {
    if (!selectedObject || !canvas) return;
    
    setStroke(value);
    selectedObject.set('stroke', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
  };
  
  // Handle stroke width changes
  const handleStrokeWidthChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    setStrokeWidth(value);
    selectedObject.set('strokeWidth', value);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
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
  };
  
  // Handle object deletion
  const handleDelete = () => {
    if (!selectedObject || !canvas) return;
    
    canvas.remove(selectedObject);
    canvas.requestRenderAll();
    if (onUpdate) onUpdate();
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
  };
  
  if (!selectedObject) {
    return (
      <div className={cn("p-4 bg-card border rounded-md shadow-sm", className)}>
        <p className="text-muted-foreground text-center">No object selected</p>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionY">Y Position</Label>
              <Input
                id="positionY"
                type="number"
                value={position.top}
                onChange={(e) => handlePositionChange('top', Number(e.target.value))}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={size.height}
                onChange={(e) => handleSizeChange('height', Number(e.target.value))}
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
              <div 
                className="w-6 h-6 border rounded"
                style={{ backgroundColor: fill }}
              />
              <Input
                value={fill}
                onChange={(e) => handleFillChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Stroke Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 border rounded"
                style={{ backgroundColor: stroke }}
              />
              <Input
                value={stroke}
                onChange={(e) => handleStrokeChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Stroke Width: {strokeWidth}px</Label>
            <Slider
              min={0}
              max={20}
              step={1}
              value={[strokeWidth]}
              onValueChange={(value) => handleStrokeWidthChange(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Opacity: {opacity}%</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(value) => handleOpacityChange(value[0])}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="transform" className="space-y-4">
          <div className="space-y-2">
            <Label>Rotation: {angle}°</Label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[angle]}
              onValueChange={(value) => handleAngleChange(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAngleChange(angle + 90)}
            >
              Rotate +90°
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAngleChange(angle - 90)}
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

export default PropertyPanel;
