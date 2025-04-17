
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { RotateCw, ArrowLeftRight, ArrowUpDown, FlipHorizontal, FlipVertical, RefreshCw, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface TransformationValues {
  opacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
  scale: number;  // Added scale property to match the expected interface
}

export interface AdvancedTransformControlsProps {
  values: TransformationValues;
  onValuesChange: (values: Partial<TransformationValues>) => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  maintainAspectRatio: boolean;
  onToggleAspectRatio: (maintain: boolean) => void;
  disabled?: boolean; // Added disabled property to match the usage
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
  const [isPositionOpen, setIsPositionOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isRotationOpen, setIsRotationOpen] = useState(true);
  const [isSkewOpen, setIsSkewOpen] = useState(false);
  const [isOpacityOpen, setIsOpacityOpen] = useState(true);
  
  const handleChange = <K extends keyof TransformationValues>(key: K, value: TransformationValues[K]) => {
    if (disabled) return;
    onValuesChange({ [key]: value } as Partial<TransformationValues>);
  };
  
  // Handle numeric input changes, converting strings to numbers
  const handleNumberChange = <K extends keyof TransformationValues>(
    key: K, 
    value: string, 
    min?: number,
    max?: number
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    let finalValue = numValue;
    if (min !== undefined) finalValue = Math.max(min, finalValue);
    if (max !== undefined) finalValue = Math.min(max, finalValue);
    
    handleChange(key, finalValue as TransformationValues[K]);
  };
  
  return (
    <div className="p-4 space-y-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Transform</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={disabled}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
      
      <Separator />
      
      {/* Position Controls */}
      <Collapsible open={isPositionOpen} onOpenChange={setIsPositionOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer py-1">
            <h4 className="text-sm font-medium flex items-center">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Position
            </h4>
            {isPositionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>X Position</Label>
              <Input 
                type="number"
                value={values.x}
                onChange={(e) => handleNumberChange('x', e.target.value)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Y Position</Label>
              <Input 
                type="number"
                value={values.y}
                onChange={(e) => handleNumberChange('y', e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Size Controls */}
      <Collapsible open={isSizeOpen} onOpenChange={setIsSizeOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer py-1">
            <h4 className="text-sm font-medium flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Size
            </h4>
            {isSizeOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="flex items-center mb-2">
            <Switch 
              checked={maintainAspectRatio}
              onCheckedChange={onToggleAspectRatio}
              disabled={disabled}
            />
            <Label className="ml-2">Maintain aspect ratio</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Width</Label>
              <Input 
                type="number"
                value={values.width}
                onChange={(e) => handleNumberChange('width', e.target.value, 1)}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Height</Label>
              <Input 
                type="number"
                value={values.height}
                onChange={(e) => handleNumberChange('height', e.target.value, 1)}
                disabled={disabled}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="flex justify-between">
              <span>Scale ({values.scale.toFixed(2)})</span>
            </Label>
            <Slider 
              value={[values.scale]}
              min={0.1}
              max={3}
              step={0.05}
              onValueChange={([value]) => handleChange('scale', value)}
              disabled={disabled}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Rotation Controls */}
      <Collapsible open={isRotationOpen} onOpenChange={setIsRotationOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer py-1">
            <h4 className="text-sm font-medium flex items-center">
              <RotateCw className="h-4 w-4 mr-2" />
              Rotation
            </h4>
            {isRotationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="space-y-1">
            <Label className="flex justify-between">
              <span>Angle ({values.rotation.toFixed(0)}°)</span>
            </Label>
            <Slider 
              value={[values.rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={([value]) => handleChange('rotation', value)}
              disabled={disabled}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1"
              onClick={() => onFlip('horizontal')}
              disabled={disabled}
            >
              <FlipHorizontal className="h-4 w-4 mr-1" />
              Flip X
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1"
              onClick={() => onFlip('vertical')}
              disabled={disabled}
            >
              <FlipVertical className="h-4 w-4 mr-1" />
              Flip Y
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Skew Controls */}
      <Collapsible open={isSkewOpen} onOpenChange={setIsSkewOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer py-1">
            <h4 className="text-sm font-medium flex items-center">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Skew
            </h4>
            {isSkewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4 space-y-3">
          <div className="space-y-1">
            <Label className="flex justify-between">
              <span>Skew X ({values.skewX.toFixed(0)}°)</span>
            </Label>
            <Slider 
              value={[values.skewX]}
              min={-60}
              max={60}
              step={1}
              onValueChange={([value]) => handleChange('skewX', value)}
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-1">
            <Label className="flex justify-between">
              <span>Skew Y ({values.skewY.toFixed(0)}°)</span>
            </Label>
            <Slider 
              value={[values.skewY]}
              min={-60}
              max={60}
              step={1}
              onValueChange={([value]) => handleChange('skewY', value)}
              disabled={disabled}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator />
      
      {/* Opacity Controls */}
      <Collapsible open={isOpacityOpen} onOpenChange={setIsOpacityOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer py-1">
            <h4 className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Opacity
            </h4>
            {isOpacityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-1">
            <Label className="flex justify-between">
              <span>Opacity ({(values.opacity * 100).toFixed(0)}%)</span>
            </Label>
            <Slider 
              value={[values.opacity]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={([value]) => handleChange('opacity', value)}
              disabled={disabled}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AdvancedTransformControls;
