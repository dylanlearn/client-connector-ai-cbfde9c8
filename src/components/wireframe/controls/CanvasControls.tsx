
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Grid, Magnet, Ruler, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { CanvasControlsProps } from '../types';

interface ExtendedCanvasControlsProps extends CanvasControlsProps {
  onChangeGridType?: (type: 'lines' | 'dots' | 'columns') => void;
  onChangeGridSize?: (size: number) => void;
  onChangeSnapTolerance?: (tolerance: number) => void;
  onToggleSmartGuides?: () => void;
  gridType?: 'lines' | 'dots' | 'columns';
  gridSize?: number;
  snapTolerance?: number;
  showSmartGuides?: boolean;
}

const CanvasControls: React.FC<ExtendedCanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid,
  onToggleSmartGuides,
  onChangeGridType,
  onChangeGridSize,
  onChangeSnapTolerance,
  showGrid = false,
  snapToGrid = false,
  showSmartGuides = true,
  gridType = 'lines',
  gridSize = 8,
  snapTolerance = 5,
  className
}) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1 bg-background border rounded-md p-1", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onZoomIn}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onZoomOut}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onResetZoom}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset zoom</TooltipContent>
        </Tooltip>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={showGrid ? "secondary" : "ghost"}
              size="icon" 
              onClick={onToggleGrid}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle grid</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={snapToGrid ? "secondary" : "ghost"}
              size="icon" 
              onClick={onToggleSnapToGrid}
              className="h-8 w-8"
            >
              <Magnet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Snap to grid</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={showSmartGuides ? "secondary" : "ghost"}
              size="icon" 
              onClick={onToggleSmartGuides}
              className="h-8 w-8"
            >
              <Ruler className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Smart guides</TooltipContent>
        </Tooltip>
        
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Grid settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Grid Settings</h4>
              
              <div className="space-y-2">
                <Label>Grid Type</Label>
                <Select 
                  value={gridType} 
                  onValueChange={(value: any) => onChangeGridType?.(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Grid Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="columns">Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Grid Size: {gridSize}px</Label>
                </div>
                <Slider 
                  min={4} 
                  max={32}
                  step={4}
                  value={[gridSize]} 
                  onValueChange={([value]) => onChangeGridSize?.(value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Snap Tolerance: {snapTolerance}px</Label>
                </div>
                <Slider 
                  min={1} 
                  max={10} 
                  value={[snapTolerance]} 
                  onValueChange={([value]) => onChangeSnapTolerance?.(value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="smartGuides">Smart Guides</Label>
                <Switch 
                  id="smartGuides" 
                  checked={showSmartGuides}
                  onCheckedChange={onToggleSmartGuides}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="snapToGrid">Snap to Grid</Label>
                <Switch 
                  id="snapToGrid" 
                  checked={snapToGrid}
                  onCheckedChange={onToggleSnapToGrid}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
};

export default CanvasControls;
