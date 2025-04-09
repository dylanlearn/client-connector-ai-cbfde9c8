
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/components/ui/colorpicker';

export interface PropertyPanelProps {
  selectedObject: any;
  fabricCanvas: any;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedObject, fabricCanvas }) => {
  const [objectProperties, setObjectProperties] = useState(getObjectProperties(selectedObject));
  
  // Get properties from the selected object
  function getObjectProperties(obj: any) {
    if (!obj) return {};
    
    const props: any = {};
    
    if (obj.width !== undefined) props.width = obj.width;
    if (obj.height !== undefined) props.height = obj.height;
    if (obj.left !== undefined) props.left = obj.left;
    if (obj.top !== undefined) props.top = obj.top;
    if (obj.fill !== undefined) props.fill = obj.fill;
    if (obj.stroke !== undefined) props.stroke = obj.stroke;
    if (obj.strokeWidth !== undefined) props.strokeWidth = obj.strokeWidth;
    if (obj.angle !== undefined) props.angle = obj.angle;
    if (obj.radius !== undefined) props.radius = obj.radius;
    if (obj.text !== undefined) props.text = obj.text;
    if (obj.fontSize !== undefined) props.fontSize = obj.fontSize;
    
    return props;
  }
  
  // Update object when property changes
  const handlePropertyChange = useCallback((property: string, value: any) => {
    if (!selectedObject || !fabricCanvas) return;
    
    // Update local state
    setObjectProperties((prevProps) => ({
      ...prevProps,
      [property]: value
    }));
    
    // Update fabric object
    const updateObj: any = {};
    updateObj[property] = value;
    selectedObject.set(updateObj);
    fabricCanvas.requestRenderAll();
  }, [selectedObject, fabricCanvas]);
  
  if (!selectedObject || !fabricCanvas) {
    return <div className="p-4 text-center text-muted-foreground">No object selected</div>;
  }
  
  return (
    <div className="property-panel border rounded-lg p-4 bg-background">
      <h3 className="text-lg font-medium mb-4">Properties</h3>
      
      <Tabs defaultValue="position">
        <TabsList className="mb-4">
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          {selectedObject.type === 'textbox' && (
            <TabsTrigger value="text">Text</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="position" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="left">Left</Label>
              <Input 
                id="left" 
                type="number" 
                value={Math.round(objectProperties.left || 0)} 
                onChange={(e) => handlePropertyChange('left', Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="top">Top</Label>
              <Input 
                id="top" 
                type="number" 
                value={Math.round(objectProperties.top || 0)} 
                onChange={(e) => handlePropertyChange('top', Number(e.target.value))}
              />
            </div>
          </div>
          
          {objectProperties.width !== undefined && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="width">Width</Label>
                <Input 
                  id="width" 
                  type="number" 
                  value={Math.round(objectProperties.width || 0)} 
                  onChange={(e) => handlePropertyChange('width', Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="height">Height</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={Math.round(objectProperties.height || 0)} 
                  onChange={(e) => handlePropertyChange('height', Number(e.target.value))}
                />
              </div>
            </div>
          )}
          
          {objectProperties.angle !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="angle">Angle</Label>
                <span className="text-sm text-muted-foreground">{Math.round(objectProperties.angle)}°</span>
              </div>
              <Slider
                id="angle"
                min={0}
                max={360}
                step={1}
                value={[objectProperties.angle || 0]}
                onValueChange={(value) => handlePropertyChange('angle', value[0])}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          {objectProperties.fill !== undefined && (
            <div className="space-y-1">
              <Label>Fill Color</Label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  value={objectProperties.fill}
                  onChange={(color) => handlePropertyChange('fill', color)}
                />
                <span className="text-sm">{objectProperties.fill}</span>
              </div>
            </div>
          )}
          
          {objectProperties.stroke !== undefined && (
            <div className="space-y-1">
              <Label>Stroke Color</Label>
              <div className="flex items-center gap-2">
                <ColorPicker
                  value={objectProperties.stroke}
                  onChange={(color) => handlePropertyChange('stroke', color)}
                />
                <span className="text-sm">{objectProperties.stroke}</span>
              </div>
            </div>
          )}
          
          {objectProperties.strokeWidth !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="strokeWidth">Stroke Width</Label>
                <span className="text-sm text-muted-foreground">{objectProperties.strokeWidth}px</span>
              </div>
              <Slider
                id="strokeWidth"
                min={0}
                max={20}
                step={1}
                value={[objectProperties.strokeWidth || 0]}
                onValueChange={(value) => handlePropertyChange('strokeWidth', value[0])}
              />
            </div>
          )}
          
          {objectProperties.radius !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="radius">Radius</Label>
                <span className="text-sm text-muted-foreground">{objectProperties.radius}px</span>
              </div>
              <Slider
                id="radius"
                min={1}
                max={200}
                step={1}
                value={[objectProperties.radius || 0]}
                onValueChange={(value) => handlePropertyChange('radius', value[0])}
              />
            </div>
          )}
        </TabsContent>
        
        {selectedObject.type === 'textbox' && (
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="text">Text</Label>
              <Input 
                id="text" 
                value={objectProperties.text || ''} 
                onChange={(e) => handlePropertyChange('text', e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="fontSize">Font Size</Label>
                <span className="text-sm text-muted-foreground">{objectProperties.fontSize}px</span>
              </div>
              <Slider
                id="fontSize"
                min={8}
                max={72}
                step={1}
                value={[objectProperties.fontSize || 16]}
                onValueChange={(value) => handlePropertyChange('fontSize', value[0])}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PropertyPanel;
