
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/components/ui/colorpicker';
import { Slider } from '@/components/ui/slider';

export interface PropertyPanelProps {
  selectedObject: any;
  onChange?: (property: string, value: any) => void;
  fabricCanvas?: any;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ 
  selectedObject, 
  onChange, 
  fabricCanvas 
}) => {
  const [properties, setProperties] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 1,
    opacity: 1,
    angle: 0,
  });
  
  // Update properties when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setProperties({
        width: Math.round(selectedObject.width || 0),
        height: Math.round(selectedObject.height || 0),
        left: Math.round(selectedObject.left || 0),
        top: Math.round(selectedObject.top || 0),
        fill: selectedObject.fill || '#000000',
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 1,
        opacity: selectedObject.opacity || 1,
        angle: selectedObject.angle || 0,
      });
    }
  }, [selectedObject]);

  const handleChange = (property: string, value: any) => {
    if (!selectedObject) return;
    
    setProperties(prev => ({ ...prev, [property]: value }));
    
    if (onChange) {
      onChange(property, value);
    } else if (fabricCanvas && selectedObject) {
      selectedObject.set(property, value);
      fabricCanvas.renderAll();
    }
  };

  const handleReset = () => {
    if (!selectedObject) return;
    selectedObject.set({
      angle: 0
    });
    setProperties(prev => ({ ...prev, angle: 0 }));
    fabricCanvas.renderAll();
  };

  const handleDelete = () => {
    if (!selectedObject || !fabricCanvas) return;
    fabricCanvas.remove(selectedObject);
    fabricCanvas.renderAll();
    fabricCanvas.trigger('selection:cleared');
  };

  if (!selectedObject) {
    return (
      <div className="p-4 border rounded-lg bg-background">
        <p className="text-center text-muted-foreground">No object selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-background max-h-[500px] overflow-y-auto">
      <h3 className="font-medium mb-4">Properties</h3>
      
      <Tabs defaultValue="position">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="position" className="flex-1">Position</TabsTrigger>
          <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={properties.width}
                onChange={(e) => handleChange('width', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={properties.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="left">X Position</Label>
              <Input
                id="left"
                type="number"
                value={properties.left}
                onChange={(e) => handleChange('left', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="top">Y Position</Label>
              <Input
                id="top"
                type="number"
                value={properties.top}
                onChange={(e) => handleChange('top', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="angle">Rotation ({properties.angle}°)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="angle"
                min={0}
                max={360}
                step={1}
                value={[properties.angle]}
                onValueChange={(values) => handleChange('angle', values[0])}
                className="flex-1"
              />
              <Button size="sm" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <div>
            <Label htmlFor="fill">Fill Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <ColorPicker
                color={properties.fill}
                onChange={(color) => handleChange('fill', color)}
              />
              <Input
                id="fill"
                value={properties.fill}
                onChange={(e) => handleChange('fill', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="stroke">Stroke Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <ColorPicker
                color={properties.stroke}
                onChange={(color) => handleChange('stroke', color)}
              />
              <Input
                id="stroke"
                value={properties.stroke}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="strokeWidth">Stroke Width ({properties.strokeWidth}px)</Label>
            <Slider
              id="strokeWidth"
              min={0}
              max={20}
              step={1}
              value={[properties.strokeWidth]}
              onValueChange={(values) => handleChange('strokeWidth', values[0])}
            />
          </div>
          
          <div>
            <Label htmlFor="opacity">Opacity ({Math.round(properties.opacity * 100)}%)</Label>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.01}
              value={[properties.opacity]}
              onValueChange={(values) => handleChange('opacity', values[0])}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 flex justify-end">
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PropertyPanel;
