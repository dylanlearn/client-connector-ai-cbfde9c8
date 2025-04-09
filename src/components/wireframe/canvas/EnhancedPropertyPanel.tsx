
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Bold, 
  Copy, 
  Italic, 
  Layers, 
  Lock, 
  Palette, 
  Trash, 
  Underline 
} from 'lucide-react';

interface EnhancedPropertyPanelProps {
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  className?: string;
  onSaveHistoryState?: (description: string) => void;
}

const EnhancedPropertyPanel: React.FC<EnhancedPropertyPanelProps> = ({
  selectedObject,
  canvas,
  className,
  onSaveHistoryState
}) => {
  const [objectType, setObjectType] = useState<string>('');
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);
  const [fill, setFill] = useState('#000000');
  const [stroke, setStroke] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [textProps, setTextProps] = useState({
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: 1.16,
    underline: false
  });

  // Update panel state when selected object changes
  useEffect(() => {
    if (!selectedObject) {
      return;
    }

    // Determine object type
    if (selectedObject instanceof fabric.Text) {
      setObjectType('text');
    } else if (selectedObject instanceof fabric.Image) {
      setObjectType('image');
    } else if (selectedObject instanceof fabric.Rect) {
      setObjectType('rectangle');
    } else if (selectedObject instanceof fabric.Circle) {
      setObjectType('circle');
    } else if (selectedObject instanceof fabric.Path) {
      setObjectType('path');
    } else if (selectedObject instanceof fabric.Group) {
      setObjectType('group');
    } else {
      setObjectType('unknown');
    }

    // Set position and size
    setPosition({
      left: Math.round(selectedObject.left || 0),
      top: Math.round(selectedObject.top || 0)
    });

    setSize({
      width: Math.round(selectedObject.width || 0) * (selectedObject.scaleX || 1),
      height: Math.round(selectedObject.height || 0) * (selectedObject.scaleY || 1)
    });

    // Set style properties
    setRotation(selectedObject.angle || 0);
    setFill(selectedObject.fill?.toString() || '#000000');
    setStroke(selectedObject.stroke?.toString() || '#000000');
    setStrokeWidth(selectedObject.strokeWidth || 0);
    setOpacity(selectedObject.opacity || 1);

    // Set text-specific properties
    if (selectedObject instanceof fabric.Text) {
      setTextProps({
        text: selectedObject.text || '',
        fontSize: selectedObject.fontSize || 16,
        fontFamily: selectedObject.fontFamily || 'Arial',
        fontWeight: selectedObject.fontWeight || 'normal',
        fontStyle: selectedObject.fontStyle || 'normal',
        textAlign: selectedObject.textAlign || 'left',
        lineHeight: selectedObject.lineHeight || 1.16,
        underline: selectedObject.underline || false
      });
    }
  }, [selectedObject]);

  // Handle property changes
  const handlePositionChange = (property: 'left' | 'top', value: number) => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.set(property, value);
    canvas.renderAll();
    
    setPosition(prev => ({ ...prev, [property]: value }));
    if (onSaveHistoryState) {
      onSaveHistoryState(`Changed ${property} to ${value}`);
    }
  };

  const handleSizeChange = (property: 'width' | 'height', value: number) => {
    if (!selectedObject || !canvas) return;
    
    if (property === 'width') {
      selectedObject.set('scaleX', value / (selectedObject.width || 1));
    } else {
      selectedObject.set('scaleY', value / (selectedObject.height || 1));
    }
    
    canvas.renderAll();
    setSize(prev => ({ ...prev, [property]: value }));
    
    if (onSaveHistoryState) {
      onSaveHistoryState(`Changed ${property} to ${value}`);
    }
  };

  const handleRotationChange = (value: number) => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.set('angle', value);
    canvas.renderAll();
    setRotation(value);
    
    if (onSaveHistoryState) {
      onSaveHistoryState(`Changed rotation to ${value}`);
    }
  };

  const handleStyleChange = (property: 'fill' | 'stroke' | 'strokeWidth' | 'opacity', value: any) => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.set(property, value);
    canvas.renderAll();
    
    if (property === 'fill') setFill(value);
    if (property === 'stroke') setStroke(value);
    if (property === 'strokeWidth') setStrokeWidth(value);
    if (property === 'opacity') setOpacity(value);
    
    if (onSaveHistoryState) {
      onSaveHistoryState(`Changed ${property} to ${value}`);
    }
  };

  const handleTextChange = (property: keyof typeof textProps, value: any) => {
    if (!selectedObject || !canvas || !(selectedObject instanceof fabric.Text)) return;
    
    selectedObject.set(property, value);
    canvas.renderAll();
    
    setTextProps(prev => ({ ...prev, [property]: value }));
    
    if (onSaveHistoryState) {
      onSaveHistoryState(`Changed text ${property} to ${value}`);
    }
  };

  const handleDuplicateObject = () => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      });
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      
      if (onSaveHistoryState) {
        onSaveHistoryState('Duplicated object');
      }
    });
  };

  const handleDeleteObject = () => {
    if (!selectedObject || !canvas) return;
    
    canvas.remove(selectedObject);
    canvas.renderAll();
    
    if (onSaveHistoryState) {
      onSaveHistoryState('Deleted object');
    }
  };

  if (!selectedObject) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        <Layers className="w-12 h-12 mx-auto opacity-20 mb-2" />
        <p>Select an object to edit its properties</p>
      </div>
    );
  }

  return (
    <div className={cn("p-4 overflow-auto h-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">
          {objectType.charAt(0).toUpperCase() + objectType.slice(1)} Properties
        </h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={handleDuplicateObject} title="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDeleteObject} title="Delete">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="position">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="position" className="flex-1">Position</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
          {objectType === 'text' && (
            <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="position" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position-x">X Position</Label>
              <Input
                id="position-x"
                type="number"
                value={position.left}
                onChange={(e) => handlePositionChange('left', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-y">Y Position</Label>
              <Input
                id="position-y"
                type="number"
                value={position.top}
                onChange={(e) => handlePositionChange('top', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size-width">Width</Label>
              <Input
                id="size-width"
                type="number"
                value={size.width}
                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size-height">Height</Label>
              <Input
                id="size-height"
                type="number"
                value={size.height}
                onChange={(e) => handleSizeChange('height', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rotation">Rotation ({rotation}°)</Label>
            </div>
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={(values) => handleRotationChange(values[0])}
            />
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fill-color">Fill Color</Label>
              <div className="flex">
                <Input
                  id="fill-color"
                  type="color"
                  value={fill}
                  onChange={(e) => handleStyleChange('fill', e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={fill}
                  onChange={(e) => handleStyleChange('fill', e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stroke-color">Stroke Color</Label>
              <div className="flex">
                <Input
                  id="stroke-color"
                  type="color"
                  value={stroke}
                  onChange={(e) => handleStyleChange('stroke', e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input
                  type="text"
                  value={stroke}
                  onChange={(e) => handleStyleChange('stroke', e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
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
              onValueChange={(values) => handleStyleChange('strokeWidth', values[0])}
            />
            <div className="text-xs text-right text-muted-foreground">
              {strokeWidth}px
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="opacity">Opacity</Label>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.01}
              value={[opacity]}
              onValueChange={(values) => handleStyleChange('opacity', values[0])}
            />
            <div className="text-xs text-right text-muted-foreground">
              {Math.round(opacity * 100)}%
            </div>
          </div>
        </TabsContent>

        {objectType === 'text' && (
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <Input
                id="text-content"
                value={textProps.text}
                onChange={(e) => handleTextChange('text', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Input
                  id="font-size"
                  type="number"
                  value={textProps.fontSize}
                  onChange={(e) => handleTextChange('fontSize', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <select
                  id="font-family"
                  className="w-full border border-input rounded-md h-10 px-3"
                  value={textProps.fontFamily}
                  onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2 justify-between">
              <Button
                variant={textProps.fontWeight === 'bold' ? 'secondary' : 'outline'} 
                size="icon" 
                onClick={() => handleTextChange('fontWeight', textProps.fontWeight === 'bold' ? 'normal' : 'bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={textProps.fontStyle === 'italic' ? 'secondary' : 'outline'} 
                size="icon" 
                onClick={() => handleTextChange('fontStyle', textProps.fontStyle === 'italic' ? 'normal' : 'italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={textProps.underline ? 'secondary' : 'outline'} 
                size="icon" 
                onClick={() => handleTextChange('underline', !textProps.underline)}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                variant={textProps.textAlign === 'left' ? 'secondary' : 'outline'} 
                size="icon" 
                onClick={() => handleTextChange('textAlign', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={textProps.textAlign === 'center' ? 'secondary' : 'outline'} 
                size="icon" 
                onClick={() => handleTextChange('textAlign', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={textProps.textAlign === 'right' ? 'secondary' : 'outline'} 
                size="icon" 
                onClick={() => handleTextChange('textAlign', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EnhancedPropertyPanel;
