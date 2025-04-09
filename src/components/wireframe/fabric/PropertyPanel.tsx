
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Colorpicker } from '@/components/ui/colorpicker';
import { Trash2, Copy, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyPanelProps {
  selectedObject: fabric.Object | null;
  fabricCanvas: fabric.Canvas | null;
  className?: string;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  selectedObject, 
  fabricCanvas,
  className 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [visible, setVisible] = useState(true);
  const [locked, setLocked] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [fontSize, setFontSize] = useState(16);

  // Update panel when selected object changes
  useEffect(() => {
    if (!selectedObject) return;
    
    // Set position
    setPosition({
      x: Math.round(selectedObject.left || 0),
      y: Math.round(selectedObject.top || 0)
    });
    
    // Set dimensions
    if (selectedObject.width && selectedObject.height) {
      setDimensions({
        width: Math.round(selectedObject.width * (selectedObject.scaleX || 1)),
        height: Math.round(selectedObject.height * (selectedObject.scaleY || 1))
      });
    }
    
    // Set angle
    setAngle(selectedObject.angle || 0);
    
    // Set opacity
    setOpacity(Math.round((selectedObject.opacity || 1) * 100));
    
    // Set fill color
    if (typeof selectedObject.fill === 'string') {
      setFillColor(selectedObject.fill || '#ffffff');
    }
    
    // Set stroke color and width
    if (typeof selectedObject.stroke === 'string') {
      setStrokeColor(selectedObject.stroke || '#000000');
    }
    setStrokeWidth(selectedObject.strokeWidth || 1);
    
    // Set visibility and locked status
    setVisible(selectedObject.visible !== false);
    setLocked(selectedObject.selectable === false);
    
    // Set text properties if it's a text object
    if (selectedObject.type === 'text') {
      const textObj = selectedObject as fabric.Text;
      setTextValue(textObj.text || '');
      setFontSize(textObj.fontSize || 16);
    }
  }, [selectedObject]);

  // Apply position changes
  const handlePositionChange = (
    axis: 'x' | 'y',
    value: string
  ) => {
    if (!selectedObject || !fabricCanvas) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    if (axis === 'x') {
      selectedObject.set('left', numValue);
      setPosition(prev => ({ ...prev, x: numValue }));
    } else {
      selectedObject.set('top', numValue);
      setPosition(prev => ({ ...prev, y: numValue }));
    }
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Apply dimension changes
  const handleDimensionChange = (
    dimension: 'width' | 'height',
    value: string
  ) => {
    if (!selectedObject || !fabricCanvas) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    // Calculate scale based on original dimensions
    const originalWidth = selectedObject.width || 0;
    const originalHeight = selectedObject.height || 0;
    
    if (dimension === 'width' && originalWidth) {
      selectedObject.set('scaleX', numValue / originalWidth);
      setDimensions(prev => ({ ...prev, width: numValue }));
    } else if (dimension === 'height' && originalHeight) {
      selectedObject.set('scaleY', numValue / originalHeight);
      setDimensions(prev => ({ ...prev, height: numValue }));
    }
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Apply angle changes
  const handleAngleChange = (value: string) => {
    if (!selectedObject || !fabricCanvas) return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    selectedObject.set('angle', numValue);
    setAngle(numValue);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Apply opacity changes
  const handleOpacityChange = (value: number[]) => {
    if (!selectedObject || !fabricCanvas) return;
    
    const opacityValue = value[0] / 100;
    selectedObject.set('opacity', opacityValue);
    setOpacity(value[0]);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Apply fill color changes
  const handleFillColorChange = (color: string) => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.set('fill', color);
    setFillColor(color);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Apply stroke color changes
  const handleStrokeColorChange = (color: string) => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.set('stroke', color);
    setStrokeColor(color);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Apply stroke width changes
  const handleStrokeWidthChange = (value: number[]) => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.set('strokeWidth', value[0]);
    setStrokeWidth(value[0]);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Toggle visibility
  const handleVisibilityToggle = () => {
    if (!selectedObject || !fabricCanvas) return;
    
    const newVisibility = !visible;
    selectedObject.set('visible', newVisibility);
    setVisible(newVisibility);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Toggle locked status
  const handleLockToggle = () => {
    if (!selectedObject || !fabricCanvas) return;
    
    const newLocked = !locked;
    selectedObject.set('selectable', !newLocked);
    selectedObject.set('evented', !newLocked);
    setLocked(newLocked);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Delete object
  const handleDelete = () => {
    if (!selectedObject || !fabricCanvas) return;
    fabricCanvas.remove(selectedObject);
    fabricCanvas.renderAll();
    fabricCanvas.fire('selection:cleared');
  };

  // Duplicate object
  const handleDuplicate = () => {
    if (!selectedObject || !fabricCanvas) return;
    
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
        evented: true,
      });
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.renderAll();
    });
  };

  // Update text value
  const handleTextChange = (value: string) => {
    if (!selectedObject || !fabricCanvas || selectedObject.type !== 'text') return;
    
    const textObj = selectedObject as fabric.Text;
    textObj.set('text', value);
    setTextValue(value);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  // Update font size
  const handleFontSizeChange = (value: string) => {
    if (!selectedObject || !fabricCanvas || selectedObject.type !== 'text') return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    const textObj = selectedObject as fabric.Text;
    textObj.set('fontSize', numValue);
    setFontSize(numValue);
    
    fabricCanvas.renderAll();
    fabricCanvas.fire('object:modified', { target: selectedObject });
  };

  if (!selectedObject) {
    return (
      <div className={cn("w-80 border-l p-4", className)}>
        <div className="text-center text-muted-foreground py-8">
          Select an object to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-80 border-l", className)}>
      <div className="p-3 border-b bg-muted/20">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Properties</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVisibilityToggle}
              title={visible ? "Hide" : "Show"}
            >
              {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLockToggle}
              title={locked ? "Unlock" : "Lock"}
            >
              {locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-4">
          <Tabs defaultValue="position" className="mb-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              {selectedObject.type === 'text' && (
                <TabsTrigger value="text">Text</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="position" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position-x">X Position</Label>
                  <Input
                    id="position-x"
                    value={position.x}
                    onChange={(e) => handlePositionChange('x', e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position-y">Y Position</Label>
                  <Input
                    id="position-y"
                    value={position.y}
                    onChange={(e) => handlePositionChange('y', e.target.value)}
                    type="number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={dimensions.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    type="number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rotation">Rotation (degrees)</Label>
                <Input
                  id="rotation"
                  value={angle}
                  onChange={(e) => handleAngleChange(e.target.value)}
                  type="number"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="opacity">Opacity</Label>
                <Slider
                  id="opacity"
                  min={0}
                  max={100}
                  step={1}
                  value={[opacity]}
                  onValueChange={handleOpacityChange}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {opacity}%
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fill-color">Fill Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: fillColor }}
                  />
                  <Input
                    id="fill-color"
                    value={fillColor}
                    onChange={(e) => handleFillColorChange(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stroke-color">Stroke Color</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: strokeColor }}
                  />
                  <Input
                    id="stroke-color"
                    value={strokeColor}
                    onChange={(e) => handleStrokeColorChange(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stroke-width">Stroke Width</Label>
                <Slider
                  id="stroke-width"
                  min={0}
                  max={20}
                  step={1}
                  value={[strokeWidth]}
                  onValueChange={handleStrokeWidthChange}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {strokeWidth}px
                </div>
              </div>
            </TabsContent>
            
            {selectedObject.type === 'text' && (
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="text-value">Text Content</Label>
                  <Input
                    id="text-value"
                    value={textValue}
                    onChange={(e) => handleTextChange(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Input
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            )}
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PropertyPanel;
