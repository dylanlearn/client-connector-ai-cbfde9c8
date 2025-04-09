
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Type, Paintbrush, Layers, Move, Trash2
} from 'lucide-react';
import { fabric } from 'fabric';
import ColorPicker from '@/components/ui/colorpicker';

interface PropertyPanelProps {
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  className?: string;
  onSaveHistoryState?: (description: string) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedObject,
  canvas,
  className,
  onSaveHistoryState = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  
  if (!canvas) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Canvas not initialized
      </div>
    );
  }
  
  if (!selectedObject) {
    return (
      <div className={cn("p-4", className)}>
        <div className="text-center text-muted-foreground py-8">
          Select an object to edit its properties
        </div>
        <Separator />
        <div className="mt-4">
          <h3 className="font-medium mb-2">Canvas Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="canvas-background">Background</Label>
              <ColorPicker
                id="canvas-background"
                color={canvas.backgroundColor?.toString() || '#ffffff'}
                onChange={(color) => {
                  canvas.setBackgroundColor(color, () => {
                    canvas.renderAll();
                    onSaveHistoryState('Changed canvas background color');
                  });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="canvas-width">Width</Label>
              <Input
                id="canvas-width"
                type="number"
                value={canvas.getWidth()}
                className="w-20"
                onChange={(e) => {
                  const width = parseInt(e.target.value, 10);
                  if (!isNaN(width) && width > 0) {
                    canvas.setWidth(width);
                    canvas.renderAll();
                    onSaveHistoryState('Changed canvas width');
                  }
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="canvas-height">Height</Label>
              <Input
                id="canvas-height"
                type="number"
                value={canvas.getHeight()}
                className="w-20"
                onChange={(e) => {
                  const height = parseInt(e.target.value, 10);
                  if (!isNaN(height) && height > 0) {
                    canvas.setHeight(height);
                    canvas.renderAll();
                    onSaveHistoryState('Changed canvas height');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedObject) return;
    
    // Don't update if the value hasn't changed
    if (selectedObject[property] === value) return;
    
    // Handle special cases
    if (property === 'text' && selectedObject.type === 'textbox') {
      const textObj = selectedObject as fabric.Textbox;
      textObj.set({ text: value });
    } else {
      selectedObject.set({ [property]: value });
    }
    
    canvas.renderAll();
    onSaveHistoryState(`Changed ${property}`);
  };
  
  const handlePositionChange = (property: 'left' | 'top', value: number) => {
    if (!selectedObject) return;
    
    selectedObject.set({ [property]: value });
    canvas.renderAll();
    onSaveHistoryState(`Changed position`);
  };
  
  const handleSizeChange = (property: 'width' | 'height', value: number) => {
    if (!selectedObject || value <= 0) return;
    
    if (property === 'width') {
      selectedObject.set({ width: value });
      selectedObject.scaleX = 1;
    } else {
      selectedObject.set({ height: value });
      selectedObject.scaleY = 1;
    }
    
    canvas.renderAll();
    onSaveHistoryState(`Changed size`);
  };
  
  const handleTextStyleChange = (property: string, value: any) => {
    if (!selectedObject || selectedObject.type !== 'textbox') return;
    
    const textObj = selectedObject as fabric.Textbox;
    textObj.set({ [property]: value });
    
    canvas.renderAll();
    onSaveHistoryState(`Changed text style`);
  };
  
  const handleDelete = () => {
    if (!selectedObject || !canvas) return;
    
    canvas.remove(selectedObject);
    canvas.renderAll();
    onSaveHistoryState('Deleted object');
  };
  
  const handleDuplicate = () => {
    if (!selectedObject || !canvas) return;
    
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: selectedObject.left! + 20,
        top: selectedObject.top! + 20,
        evented: true,
      });
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      onSaveHistoryState('Duplicated object');
    });
  };
  
  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedObject || selectedObject.type !== 'textbox') return;
    
    const textObj = selectedObject as fabric.Textbox;
    textObj.set({ textAlign: align });
    
    canvas.renderAll();
    onSaveHistoryState(`Changed text alignment to ${align}`);
  };
  
  const getObjectType = () => {
    if (!selectedObject) return 'Unknown';
    
    const typeMap: Record<string, string> = {
      rect: 'Rectangle',
      circle: 'Circle',
      triangle: 'Triangle',
      textbox: 'Text',
      image: 'Image',
      path: 'Path',
      group: 'Group',
      line: 'Line'
    };
    
    return typeMap[selectedObject.type!] || selectedObject.type || 'Shape';
  };
  
  const getCommonProperties = () => {
    if (!selectedObject) return null;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Dimensions</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="object-left">X Position</Label>
              <Input
                id="object-left"
                type="number"
                value={Math.round(selectedObject.left || 0)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    handlePositionChange('left', value);
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="object-top">Y Position</Label>
              <Input
                id="object-top"
                type="number"
                value={Math.round(selectedObject.top || 0)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    handlePositionChange('top', value);
                  }
                }}
              />
            </div>
            
            {(selectedObject.width !== undefined || selectedObject.type === 'rect' || selectedObject.type === 'textbox') && (
              <div>
                <Label htmlFor="object-width">Width</Label>
                <Input
                  id="object-width"
                  type="number"
                  value={Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      handleSizeChange('width', value);
                    }
                  }}
                />
              </div>
            )}
            
            {(selectedObject.height !== undefined || selectedObject.type === 'rect' || selectedObject.type === 'textbox') && (
              <div>
                <Label htmlFor="object-height">Height</Label>
                <Input
                  id="object-height"
                  type="number"
                  value={Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      handleSizeChange('height', value);
                    }
                  }}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="object-angle">Rotation</Label>
              <Input
                id="object-angle"
                type="number"
                value={Math.round(selectedObject.angle || 0)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    handlePropertyChange('angle', value);
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">Appearance</h3>
          
          {selectedObject.fill !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="object-fill">Fill Color</Label>
              <ColorPicker
                id="object-fill"
                color={selectedObject.fill?.toString() || '#000000'}
                onChange={(color) => handlePropertyChange('fill', color)}
              />
            </div>
          )}
          
          {selectedObject.stroke !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="object-stroke">Stroke Color</Label>
              <ColorPicker
                id="object-stroke"
                color={selectedObject.stroke?.toString() || '#000000'}
                onChange={(color) => handlePropertyChange('stroke', color)}
              />
            </div>
          )}
          
          {selectedObject.strokeWidth !== undefined && (
            <div className="space-y-2 mb-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="object-stroke-width">Stroke Width</Label>
                <span className="text-sm">{selectedObject.strokeWidth}px</span>
              </div>
              <Slider
                id="object-stroke-width"
                value={[selectedObject.strokeWidth]}
                min={0}
                max={20}
                step={1}
                onValueChange={(value) => handlePropertyChange('strokeWidth', value[0])}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="object-opacity">Opacity</Label>
            <Slider
              id="object-opacity"
              className="flex-1 mx-2"
              value={[selectedObject.opacity || 1]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => handlePropertyChange('opacity', value[0])}
            />
            <span className="text-sm w-8 text-right">
              {Math.round((selectedObject.opacity || 1) * 100)}%
            </span>
          </div>
        </div>
        
        <Separator />
      </div>
    );
  };
  
  const getTextProperties = () => {
    if (!selectedObject || selectedObject.type !== 'textbox') return null;
    
    const textObj = selectedObject as fabric.Textbox;
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium mb-2">Text Properties</h3>
        <div>
          <Label htmlFor="text-content">Content</Label>
          <Input
            id="text-content"
            value={textObj.text || ''}
            onChange={(e) => handlePropertyChange('text', e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="text-font-family">Font</Label>
          <select
            id="text-font-family"
            className="w-36 p-1 border rounded"
            value={textObj.fontFamily || 'Arial'}
            onChange={(e) => handleTextStyleChange('fontFamily', e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="text-font-size">Size</Label>
          <Input
            id="text-font-size"
            type="number"
            className="w-20"
            value={textObj.fontSize || 20}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value > 0) {
                handleTextStyleChange('fontSize', value);
              }
            }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            size="sm"
            variant={textObj.textAlign === 'left' ? 'default' : 'outline'}
            onClick={() => handleTextAlign('left')}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={textObj.textAlign === 'center' ? 'default' : 'outline'}
            onClick={() => handleTextAlign('center')}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={textObj.textAlign === 'right' ? 'default' : 'outline'}
            onClick={() => handleTextAlign('right')}
          >
            <AlignRight size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={textObj.fontWeight === 'bold' ? 'default' : 'outline'}
            onClick={() => handleTextStyleChange('fontWeight', textObj.fontWeight === 'bold' ? 'normal' : 'bold')}
          >
            <Bold size={16} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={textObj.fontStyle === 'italic' ? 'default' : 'outline'}
            onClick={() => handleTextStyleChange('fontStyle', textObj.fontStyle === 'italic' ? 'normal' : 'italic')}
          >
            <Italic size={16} />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="text-line-height">Line Height</Label>
          <Input
            id="text-line-height"
            type="number"
            className="w-20"
            value={textObj.lineHeight || 1.16}
            min={0.5}
            max={3}
            step={0.1}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value > 0) {
                handleTextStyleChange('lineHeight', value);
              }
            }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="text-char-spacing">Letter Spacing</Label>
          <Input
            id="text-char-spacing"
            type="number"
            className="w-20"
            value={textObj.charSpacing || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                handleTextStyleChange('charSpacing', value);
              }
            }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className={cn("h-full overflow-auto", className)}>
      <div className="p-4 border-b sticky top-0 bg-card z-10">
        <h3 className="font-medium flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-primary"></span>
          {getObjectType()} Selected
        </h3>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="appearance" onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="appearance" className="flex-1">
              <Paintbrush className="h-4 w-4 mr-1" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="position" className="flex-1">
              <Move className="h-4 w-4 mr-1" /> Position
            </TabsTrigger>
            <TabsTrigger 
              value="text" 
              className="flex-1" 
              disabled={selectedObject?.type !== 'textbox'}
            >
              <Type className="h-4 w-4 mr-1" /> Text
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="pt-4">
            {getCommonProperties()}
          </TabsContent>
          
          <TabsContent value="position" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Position & Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="object-left-pos">X</Label>
                    <Input
                      id="object-left-pos"
                      type="number"
                      value={Math.round(selectedObject.left || 0)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          handlePositionChange('left', value);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="object-top-pos">Y</Label>
                    <Input
                      id="object-top-pos"
                      type="number"
                      value={Math.round(selectedObject.top || 0)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          handlePositionChange('top', value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Rotation</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="object-angle-slider">Angle</Label>
                    <span className="text-sm">{Math.round(selectedObject.angle || 0)}°</span>
                  </div>
                  <Slider
                    id="object-angle-slider"
                    value={[selectedObject.angle || 0]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(value) => handlePropertyChange('angle', value[0])}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Layer Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="object-locked">Lock Object</Label>
                    <Switch
                      id="object-locked"
                      checked={selectedObject.lockMovementX && selectedObject.lockMovementY}
                      onCheckedChange={(checked) => {
                        handlePropertyChange('lockMovementX', checked);
                        handlePropertyChange('lockMovementY', checked);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="object-visible">Visible</Label>
                    <Switch
                      id="object-visible"
                      checked={selectedObject.visible !== false}
                      onCheckedChange={(checked) => {
                        handlePropertyChange('visible', checked);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (!canvas) return;
                    selectedObject.bringToFront();
                    canvas.renderAll();
                    onSaveHistoryState('Brought object to front');
                  }}
                >
                  <Layers className="h-4 w-4 mr-1" /> Bring to Front
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (!canvas) return;
                    selectedObject.sendToBack();
                    canvas.renderAll();
                    onSaveHistoryState('Sent object to back');
                  }}
                >
                  <Layers className="h-4 w-4 mr-1" /> Send to Back
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="pt-4">
            {getTextProperties()}
          </TabsContent>
        </Tabs>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleDuplicate}
          >
            Duplicate
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
