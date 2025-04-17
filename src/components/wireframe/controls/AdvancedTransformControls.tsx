
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  RotateCw, 
  RotateCcw,
  ArrowLeftRight,
  ArrowUpDown,
  FlipHorizontal,
  FlipVertical,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Define the transformation values type
export interface TransformationValues {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX?: number;
  scaleY?: number;
  skewX: number;
  skewY: number;
  opacity: number;
}

export interface AdvancedTransformControlsProps {
  values: TransformationValues;
  onValuesChange: (values: Partial<TransformationValues>) => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  maintainAspectRatio: boolean;
  onToggleAspectRatio: (maintain: boolean) => void;
  disabled?: boolean;
}

const AdvancedTransformControls: React.FC<AdvancedTransformControlsProps> = ({
  values,
  onValuesChange,
  onFlip,
  onReset,
  maintainAspectRatio,
  onToggleAspectRatio,
  disabled = false
}) => {
  const [activeTab, setActiveTab] = useState('position');
  
  const handleRotateChange = (value: number) => {
    onValuesChange({ rotation: value });
  };
  
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onValuesChange({ [axis]: value });
  };
  
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (maintainAspectRatio) {
      const aspectRatio = values.width / values.height;
      
      if (dimension === 'width') {
        onValuesChange({
          width: value,
          height: value / aspectRatio
        });
      } else {
        onValuesChange({
          width: value * aspectRatio,
          height: value
        });
      }
    } else {
      onValuesChange({ [dimension]: value });
    }
  };
  
  const handleSkewChange = (axis: 'skewX' | 'skewY', value: number) => {
    onValuesChange({ [axis]: value });
  };
  
  const handleOpacityChange = (value: number) => {
    onValuesChange({ opacity: value });
  };
  
  const handleInputChange = (property: keyof TransformationValues, value: string) => {
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      switch(property) {
        case 'x':
        case 'y':
          handlePositionChange(property, numValue);
          break;
        case 'width':
        case 'height':
          handleSizeChange(property, numValue);
          break;
        case 'rotation':
          handleRotateChange(numValue);
          break;
        case 'skewX':
        case 'skewY':
          handleSkewChange(property, numValue);
          break;
        case 'opacity':
          handleOpacityChange(numValue);
          break;
        default:
          onValuesChange({ [property]: numValue });
      }
    }
  };
  
  return (
    <div className={cn("p-4", disabled && "opacity-50 pointer-events-none")}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold">Transform</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Lock Aspect</span>
          <Switch 
            checked={maintainAspectRatio} 
            onCheckedChange={onToggleAspectRatio} 
            disabled={disabled}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="position">Position & Size</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-4">
          {/* Position Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="x-position">X Position</Label>
              <Input 
                id="x-position"
                type="number" 
                value={Math.round(values.x)} 
                onChange={(e) => handleInputChange('x', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.x]}
              min={-1000}
              max={1000}
              step={1}
              onValueChange={([value]) => handlePositionChange('x', value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="y-position">Y Position</Label>
              <Input 
                id="y-position"
                type="number" 
                value={Math.round(values.y)} 
                onChange={(e) => handleInputChange('y', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.y]}
              min={-1000}
              max={1000}
              step={1}
              onValueChange={([value]) => handlePositionChange('y', value)}
              disabled={disabled}
            />
          </div>
          
          {/* Size Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="width">Width</Label>
              <Input 
                id="width"
                type="number" 
                value={Math.round(values.width)} 
                onChange={(e) => handleInputChange('width', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.width]}
              min={10}
              max={1000}
              step={1}
              onValueChange={([value]) => handleSizeChange('width', value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="height">Height</Label>
              <Input 
                id="height"
                type="number" 
                value={Math.round(values.height)} 
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.height]}
              min={10}
              max={1000}
              step={1}
              onValueChange={([value]) => handleSizeChange('height', value)}
              disabled={disabled}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="transform" className="space-y-4">
          {/* Rotation Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rotation">Rotation (°)</Label>
              <Input 
                id="rotation"
                type="number" 
                value={Math.round(values.rotation)} 
                onChange={(e) => handleInputChange('rotation', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={([value]) => handleRotateChange(value)}
              disabled={disabled}
            />
            <div className="flex justify-center space-x-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleRotateChange(values.rotation - 45)}
                disabled={disabled}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="ml-1">-45°</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleRotateChange(values.rotation + 45)}
                disabled={disabled}
              >
                <RotateCw className="h-4 w-4" />
                <span className="ml-1">+45°</span>
              </Button>
            </div>
          </div>
          
          {/* Scale Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scale-x">Scale X</Label>
              <Input 
                id="scale-x"
                type="number" 
                value={(values.scaleX !== undefined ? values.scaleX : 1).toFixed(2)} 
                onChange={(e) => handleInputChange('scaleX', e.target.value)}
                step={0.1}
                className="w-20" 
                disabled={disabled}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="scale-y">Scale Y</Label>
              <Input 
                id="scale-y"
                type="number" 
                value={(values.scaleY !== undefined ? values.scaleY : 1).toFixed(2)} 
                onChange={(e) => handleInputChange('scaleY', e.target.value)}
                step={0.1}
                className="w-20" 
                disabled={disabled}
              />
            </div>
          </div>
          
          {/* Skew Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="skew-x">Skew X (°)</Label>
              <Input 
                id="skew-x"
                type="number" 
                value={Math.round(values.skewX)} 
                onChange={(e) => handleInputChange('skewX', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.skewX]}
              min={-60}
              max={60}
              step={1}
              onValueChange={([value]) => handleSkewChange('skewX', value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="skew-y">Skew Y (°)</Label>
              <Input 
                id="skew-y"
                type="number" 
                value={Math.round(values.skewY)} 
                onChange={(e) => handleInputChange('skewY', e.target.value)}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.skewY]}
              min={-60}
              max={60}
              step={1}
              onValueChange={([value]) => handleSkewChange('skewY', value)}
              disabled={disabled}
            />
          </div>
          
          {/* Opacity Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opacity">Opacity</Label>
              <Input 
                id="opacity"
                type="number" 
                value={(values.opacity * 100).toFixed(0)} 
                onChange={(e) => handleInputChange('opacity', (parseInt(e.target.value) / 100).toString())}
                min={0}
                max={100}
                className="w-20" 
                disabled={disabled}
              />
            </div>
            <Slider
              value={[values.opacity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handleOpacityChange(value / 100)}
              disabled={disabled}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFlip('horizontal')}
            title="Flip Horizontally"
            disabled={disabled}
          >
            <FlipHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFlip('vertical')}
            title="Flip Vertically"
            disabled={disabled}
          >
            <FlipVertical className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          title="Reset Transformations"
          disabled={disabled}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default AdvancedTransformControls;
