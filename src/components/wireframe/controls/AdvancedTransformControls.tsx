
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, ArrowLeftRight, ArrowUpDown } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface TransformationValues {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
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
  const handleNumberChange = (key: keyof TransformationValues, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onValuesChange({ [key]: numValue });
    }
  };

  // Handle the linked scale changes when maintaining aspect ratio
  const handleScaleChange = (key: 'scale', value: number) => {
    onValuesChange({ [key]: value });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Transform Controls</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          disabled={disabled}
        >
          Reset
        </Button>
      </div>
      
      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="size">Size</TabsTrigger>
          <TabsTrigger value="rotate">Rotate & Skew</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="x-position">X Position</Label>
              <Input
                id="x-position"
                type="number"
                value={values.x}
                onChange={(e) => handleNumberChange('x', e.target.value)}
                disabled={disabled}
                className="col-span-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="y-position">Y Position</Label>
              <Input
                id="y-position"
                type="number"
                value={values.y}
                onChange={(e) => handleNumberChange('y', e.target.value)}
                disabled={disabled}
                className="col-span-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="opacity">Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="opacity"
                defaultValue={[values.opacity * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => onValuesChange({ opacity: value[0] / 100 })}
                disabled={disabled}
                className="flex-1"
              />
              <span className="text-sm w-8 text-right">{Math.round(values.opacity * 100)}%</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="size" className="space-y-3 pt-3">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="maintain-ratio">Maintain Aspect Ratio</Label>
            <Switch
              id="maintain-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={onToggleAspectRatio}
              disabled={disabled}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={values.width}
                onChange={(e) => handleNumberChange('width', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={values.height}
                onChange={(e) => handleNumberChange('height', e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="scale">Scale</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="scale"
                defaultValue={[values.scale * 100]}
                min={10}
                max={200}
                step={1}
                onValueChange={(value) => handleScaleChange('scale', value[0] / 100)}
                disabled={disabled}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{Math.round(values.scale * 100)}%</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onFlip('horizontal')}
              disabled={disabled}
            >
              <FlipHorizontal className="h-4 w-4 mr-1" /> Flip H
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onFlip('vertical')}
              disabled={disabled}
            >
              <FlipVertical className="h-4 w-4 mr-1" /> Flip V
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="rotate" className="space-y-3 pt-3">
          <div className="space-y-1">
            <Label htmlFor="rotation">Rotation (degrees)</Label>
            <div className="flex gap-2">
              <Input
                id="rotation"
                type="number"
                value={values.rotation}
                onChange={(e) => handleNumberChange('rotation', e.target.value)}
                disabled={disabled}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onValuesChange({ rotation: (values.rotation - 90) % 360 })}
                disabled={disabled}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onValuesChange({ rotation: (values.rotation + 90) % 360 })}
                disabled={disabled}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            <Label htmlFor="skew-x">Skew X (degrees)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="skew-x"
                defaultValue={[values.skewX]}
                min={-45}
                max={45}
                step={1}
                onValueChange={(value) => onValuesChange({ skewX: value[0] })}
                disabled={disabled}
                className="flex-1"
              />
              <Input
                type="number"
                value={values.skewX}
                onChange={(e) => handleNumberChange('skewX', e.target.value)}
                disabled={disabled}
                className="w-16"
              />
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="skew-y">Skew Y (degrees)</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="skew-y"
                defaultValue={[values.skewY]}
                min={-45}
                max={45}
                step={1}
                onValueChange={(value) => onValuesChange({ skewY: value[0] })}
                disabled={disabled}
                className="flex-1"
              />
              <Input
                type="number"
                value={values.skewY}
                onChange={(e) => handleNumberChange('skewY', e.target.value)}
                disabled={disabled}
                className="w-16"
              />
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTransformControls;
