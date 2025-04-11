
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Grid3X3, Grid, LayoutGrid, Move } from 'lucide-react';
import { GridConfiguration } from '@/components/wireframe/utils/grid-system';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface GridControlProps {
  gridConfig: GridConfiguration;
  onToggleVisibility: () => void;
  onToggleSnapToGrid: () => void;
  onSizeChange: (size: number) => void;
  onTypeChange: (type: 'lines' | 'dots' | 'columns') => void;
  onColumnSettingsChange: (columns: number, gutterWidth: number, marginWidth: number) => void;
  className?: string;
}

const GridControl: React.FC<GridControlProps> = ({
  gridConfig,
  onToggleVisibility,
  onToggleSnapToGrid,
  onSizeChange,
  onTypeChange,
  onColumnSettingsChange,
  className
}) => {
  const handleColumnCountChange = (value: string) => {
    onColumnSettingsChange(
      parseInt(value || '12', 10),
      gridConfig.gutterWidth,
      gridConfig.marginWidth
    );
  };

  const handleGutterWidthChange = (value: string) => {
    onColumnSettingsChange(
      gridConfig.columns,
      parseInt(value || '20', 10),
      gridConfig.marginWidth
    );
  };

  const handleMarginWidthChange = (value: string) => {
    onColumnSettingsChange(
      gridConfig.columns,
      gridConfig.gutterWidth,
      parseInt(value || '40', 10)
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Grid3X3 className="mr-2 h-5 w-5" />
          Grid System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <Label htmlFor="grid-visibility" className="flex items-center space-x-2">
              <Grid className="h-4 w-4" />
              <span>Show Grid</span>
            </Label>
            <Switch
              id="grid-visibility"
              checked={gridConfig.visible}
              onCheckedChange={onToggleVisibility}
            />
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <Label htmlFor="snap-to-grid" className="flex items-center space-x-2">
              <Move className="h-4 w-4" />
              <span>Snap to Grid</span>
            </Label>
            <Switch
              id="snap-to-grid"
              checked={gridConfig.snapToGrid}
              onCheckedChange={onToggleSnapToGrid}
            />
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-2">
            <Label htmlFor="grid-type">Grid Type</Label>
            <Select
              value={gridConfig.type}
              onValueChange={(value) => onTypeChange(value as 'lines' | 'dots' | 'columns')}
            >
              <SelectTrigger id="grid-type">
                <SelectValue placeholder="Select grid type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="columns">Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grid-size">Grid Size: {gridConfig.size}px</Label>
            <Slider
              id="grid-size"
              min={4}
              max={40}
              step={4}
              value={[gridConfig.size]}
              onValueChange={(value) => onSizeChange(value[0])}
            />
          </div>
          
          {gridConfig.type === 'columns' && (
            <div className="space-y-4 pt-2">
              <Separator />
              <h4 className="text-sm font-medium flex items-center">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Column Settings
              </h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="columns" className="text-xs">Columns</Label>
                  <Input
                    id="columns"
                    type="number"
                    min={1}
                    max={24}
                    value={gridConfig.columns}
                    onChange={(e) => handleColumnCountChange(e.target.value)}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="gutter" className="text-xs">Gutter (px)</Label>
                  <Input
                    id="gutter"
                    type="number"
                    min={0}
                    max={100}
                    value={gridConfig.gutterWidth}
                    onChange={(e) => handleGutterWidthChange(e.target.value)}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="margin" className="text-xs">Margin (px)</Label>
                  <Input
                    id="margin"
                    type="number"
                    min={0}
                    max={200}
                    value={gridConfig.marginWidth}
                    onChange={(e) => handleMarginWidthChange(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GridControl;
