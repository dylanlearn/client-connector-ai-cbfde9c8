
import React from 'react';
import { 
  RotateClockwise, 
  RotateCounterClockwise, 
  FlipHorizontal, 
  FlipVertical, 
  RefreshCw, 
  Ruler, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { TransformationValues } from '@/hooks/wireframe/use-advanced-transform';

interface AdvancedTransformControlsProps {
  values: TransformationValues;
  onValuesChange: (values: Partial<TransformationValues>) => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  className?: string;
  maintainAspectRatio: boolean;
  onToggleAspectRatio: (maintain: boolean) => void;
}

const AdvancedTransformControls: React.FC<AdvancedTransformControlsProps> = ({
  values,
  onValuesChange,
  onFlip,
  onReset,
  className,
  maintainAspectRatio,
  onToggleAspectRatio
}) => {
  const handleChange = (field: keyof TransformationValues, value: number) => {
    onValuesChange({ [field]: value });
  };
  
  const handleRotateBy = (degrees: number) => {
    // Ensure rotation is a number before adding
    const currentRotation = typeof values.rotation === 'number' ? values.rotation : 0;
    onValuesChange({ rotation: currentRotation + degrees });
  };
  
  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Transform Object</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="h-7 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
      
      <div className="space-y-3">
        {/* Position controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pos-x" className="text-xs">X Position</Label>
            <Input
              id="pos-x"
              type="number"
              value={values.x}
              onChange={(e) => handleChange('x', Number(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="pos-y" className="text-xs">Y Position</Label>
            <Input
              id="pos-y"
              type="number"
              value={values.y}
              onChange={(e) => handleChange('y', Number(e.target.value))}
              className="h-8"
            />
          </div>
        </div>

        {/* Size controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="width" className="text-xs">Width</Label>
            <Input
              id="width"
              type="number"
              value={values.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-xs">Height</Label>
            <Input
              id="height"
              type="number"
              value={values.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="h-8"
            />
          </div>
        </div>
        
        {/* Maintain aspect ratio toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="aspect-ratio" className="text-xs cursor-pointer">
            Maintain aspect ratio
          </Label>
          <Switch 
            id="aspect-ratio" 
            checked={maintainAspectRatio} 
            onCheckedChange={onToggleAspectRatio} 
            className="data-[state=checked]:bg-blue-500"
          />
        </div>

        <Separator />
        
        {/* Rotation control */}
        <div>
          <Label htmlFor="rotation" className="text-xs">Rotation (degrees)</Label>
          <div className="flex gap-2 mt-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => handleRotateBy(-15)}
            >
              <RotateCounterClockwise className="h-4 w-4" />
            </Button>
            <Input
              id="rotation"
              type="number"
              value={typeof values.rotation === 'number' ? values.rotation : 0}
              onChange={(e) => handleChange('rotation', Number(e.target.value))}
              className="h-8"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => handleRotateBy(15)}
            >
              <RotateClockwise className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Skew controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="skew-x" className="text-xs">Skew X (degrees)</Label>
            <Input
              id="skew-x"
              type="number"
              value={typeof values.skewX === 'number' ? values.skewX : 0}
              onChange={(e) => handleChange('skewX', Number(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="skew-y" className="text-xs">Skew Y (degrees)</Label>
            <Input
              id="skew-y"
              type="number"
              value={typeof values.skewY === 'number' ? values.skewY : 0}
              onChange={(e) => handleChange('skewY', Number(e.target.value))}
              className="h-8"
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Flip controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onFlip('horizontal')}
          >
            <FlipHorizontal className="h-4 w-4 mr-1" /> Flip H
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onFlip('vertical')}
          >
            <FlipVertical className="h-4 w-4 mr-1" /> Flip V
          </Button>
        </div>
        
        {/* Scale controls */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="scale-x" className="text-xs">Scale X (%)</Label>
            <Input
              id="scale-x"
              type="number"
              value={typeof values.scaleX === 'number' ? values.scaleX * 100 : 100}
              onChange={(e) => handleChange('scaleX', Number(e.target.value) / 100)}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor="scale-y" className="text-xs">Scale Y (%)</Label>
            <Input
              id="scale-y"
              type="number"
              value={typeof values.scaleY === 'number' ? values.scaleY * 100 : 100}
              onChange={(e) => handleChange('scaleY', Number(e.target.value) / 100)}
              className="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTransformControls;
