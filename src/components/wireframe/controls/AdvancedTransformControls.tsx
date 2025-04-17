
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  MoveHorizontal, 
  MoveVertical,
  Lock,
  Unlock,
  RefreshCw,
  ArrowRightLeft,
  ArrowUpDown,
  Minus,
  Plus
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TransformationValues {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  skewX: number;
  skewY: number;
  flipX: boolean;
  flipY: boolean;
}

interface AdvancedTransformControlsProps {
  values: TransformationValues;
  onValuesChange: (values: Partial<TransformationValues>) => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  maintainAspectRatio: boolean;
  onToggleAspectRatio: (maintain: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const AdvancedTransformControls: React.FC<AdvancedTransformControlsProps> = ({
  values,
  onValuesChange,
  onFlip,
  onReset,
  maintainAspectRatio,
  onToggleAspectRatio,
  className,
  disabled = false
}) => {
  const [localValues, setLocalValues] = useState<TransformationValues>(values);
  
  useEffect(() => {
    setLocalValues(values);
  }, [values]);
  
  const handleInputChange = (field: keyof TransformationValues, value: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return;
    
    const updatedValues: Partial<TransformationValues> = { [field]: numValue };
    
    // If maintaining aspect ratio and changing width/height
    if (maintainAspectRatio) {
      if (field === 'width') {
        const aspectRatio = values.width / values.height;
        updatedValues.height = numValue / aspectRatio;
      } else if (field === 'height') {
        const aspectRatio = values.width / values.height;
        updatedValues.width = numValue * aspectRatio;
      }
    }
    
    setLocalValues({ ...localValues, ...updatedValues });
  };
  
  const handleBlur = () => {
    onValuesChange(localValues);
  };
  
  const handleIncrement = (field: keyof TransformationValues, step: number = 1) => {
    const updatedValues: Partial<TransformationValues> = { 
      [field]: Math.round((values[field] + step) * 100) / 100 
    };
    
    // If maintaining aspect ratio and changing width/height
    if (maintainAspectRatio) {
      if (field === 'width') {
        const aspectRatio = values.width / values.height;
        updatedValues.height = Math.round((updatedValues.width as number) / aspectRatio * 100) / 100;
      } else if (field === 'height') {
        const aspectRatio = values.width / values.height;
        updatedValues.width = Math.round((updatedValues.height as number) * aspectRatio * 100) / 100;
      }
    }
    
    onValuesChange(updatedValues);
  };

  return (
    <div className={cn("bg-background border rounded-md p-3 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Transform</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onReset}
            disabled={disabled}
            className="h-7 w-7"
            title="Reset all transforms"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid grid-cols-3 h-8">
          <TabsTrigger value="position" className="text-xs">Position</TabsTrigger>
          <TabsTrigger value="size" className="text-xs">Size</TabsTrigger>
          <TabsTrigger value="rotation" className="text-xs">Rotation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">X</Label>
              <div className="flex">
                <Input
                  type="number"
                  value={localValues.x}
                  onChange={(e) => handleInputChange('x', e.target.value)}
                  onBlur={handleBlur}
                  className="h-8 text-xs"
                  disabled={disabled}
                />
                <div className="flex flex-col ml-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('x', 1)}
                    disabled={disabled}
                    className="h-4 w-4 mb-0.5 p-0"
                  >
                    <Plus className="h-2 w-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('x', -1)}
                    disabled={disabled}
                    className="h-4 w-4 p-0"
                  >
                    <Minus className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs">Y</Label>
              <div className="flex">
                <Input
                  type="number"
                  value={localValues.y}
                  onChange={(e) => handleInputChange('y', e.target.value)}
                  onBlur={handleBlur}
                  className="h-8 text-xs"
                  disabled={disabled}
                />
                <div className="flex flex-col ml-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('y', 1)}
                    disabled={disabled}
                    className="h-4 w-4 mb-0.5 p-0"
                  >
                    <Plus className="h-2 w-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('y', -1)}
                    disabled={disabled}
                    className="h-4 w-4 p-0"
                  >
                    <Minus className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 py-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onFlip('horizontal')}
              disabled={disabled}
              className="h-7 text-xs flex items-center"
            >
              <FlipHorizontal className="h-3 w-3 mr-1" />
              Flip X
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onFlip('vertical')}
              disabled={disabled}
              className="h-7 text-xs flex items-center"
            >
              <FlipVertical className="h-3 w-3 mr-1" />
              Flip Y
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="size" className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <div className="flex">
                <Input
                  type="number"
                  value={localValues.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  onBlur={handleBlur}
                  className="h-8 text-xs"
                  disabled={disabled}
                />
                <div className="flex flex-col ml-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('width', 1)}
                    disabled={disabled}
                    className="h-4 w-4 mb-0.5 p-0"
                  >
                    <Plus className="h-2 w-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('width', -1)}
                    disabled={disabled}
                    className="h-4 w-4 p-0"
                  >
                    <Minus className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <div className="flex">
                <Input
                  type="number"
                  value={localValues.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  onBlur={handleBlur}
                  className="h-8 text-xs"
                  disabled={disabled}
                />
                <div className="flex flex-col ml-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('height', 1)}
                    disabled={disabled}
                    className="h-4 w-4 mb-0.5 p-0"
                  >
                    <Plus className="h-2 w-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('height', -1)}
                    disabled={disabled}
                    className="h-4 w-4 p-0"
                  >
                    <Minus className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="maintain-ratio">
              Maintain aspect ratio
            </Label>
            <Switch
              id="maintain-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={onToggleAspectRatio}
              disabled={disabled}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="rotation" className="space-y-3 pt-2">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Rotation</Label>
              <div className="flex">
                <Input
                  type="number"
                  value={localValues.rotation}
                  onChange={(e) => handleInputChange('rotation', e.target.value)}
                  onBlur={handleBlur}
                  className="h-8 text-xs"
                  disabled={disabled}
                />
                <div className="flex flex-col ml-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('rotation', 15)}
                    disabled={disabled}
                    className="h-4 w-4 mb-0.5 p-0"
                  >
                    <Plus className="h-2 w-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrement('rotation', -15)}
                    disabled={disabled}
                    className="h-4 w-4 p-0"
                  >
                    <Minus className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Skew X</Label>
                <div className="flex">
                  <Input
                    type="number"
                    value={localValues.skewX}
                    onChange={(e) => handleInputChange('skewX', e.target.value)}
                    onBlur={handleBlur}
                    className="h-8 text-xs"
                    disabled={disabled}
                  />
                  <div className="flex flex-col ml-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement('skewX', 5)}
                      disabled={disabled}
                      className="h-4 w-4 mb-0.5 p-0"
                    >
                      <Plus className="h-2 w-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement('skewX', -5)}
                      disabled={disabled}
                      className="h-4 w-4 p-0"
                    >
                      <Minus className="h-2 w-2" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Skew Y</Label>
                <div className="flex">
                  <Input
                    type="number"
                    value={localValues.skewY}
                    onChange={(e) => handleInputChange('skewY', e.target.value)}
                    onBlur={handleBlur}
                    className="h-8 text-xs"
                    disabled={disabled}
                  />
                  <div className="flex flex-col ml-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement('skewY', 5)}
                      disabled={disabled}
                      className="h-4 w-4 mb-0.5 p-0"
                    >
                      <Plus className="h-2 w-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement('skewY', -5)}
                      disabled={disabled}
                      className="h-4 w-4 p-0"
                    >
                      <Minus className="h-2 w-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTransformControls;
