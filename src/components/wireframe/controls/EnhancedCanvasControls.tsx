
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Grid, ZoomIn, ZoomOut, Home, 
  GridIcon, ArrowUpDown, Columns, Rows,
  LucideIcon, Magnet, Ruler
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Grid type icons
const gridTypeIcons: Record<string, LucideIcon> = {
  lines: Grid,
  dots: GridIcon,
  columns: Columns
};

interface EnhancedCanvasControlsProps {
  zoom: number;
  gridEnabled: boolean;
  snapToGridEnabled: boolean;
  guidesEnabled?: boolean;
  gridType: 'lines' | 'dots' | 'columns';
  gridSize: number;
  columns?: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onToggleSnapToGrid: () => void;
  onToggleGuides?: () => void;
  onChangeGridType: (type: 'lines' | 'dots' | 'columns') => void;
  onChangeGridSize: (size: number) => void;
  onChangeColumns?: (columns: number) => void;
  className?: string;
}

const EnhancedCanvasControls: React.FC<EnhancedCanvasControlsProps> = ({
  zoom,
  gridEnabled,
  snapToGridEnabled,
  guidesEnabled = true,
  gridType,
  gridSize,
  columns = 12,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid,
  onToggleGuides,
  onChangeGridType,
  onChangeGridSize,
  onChangeColumns,
  className
}) => {
  const [isGridPopoverOpen, setIsGridPopoverOpen] = useState(false);
  
  const GridTypeIcon = gridTypeIcons[gridType] || Grid;
  
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Zoom controls */}
      <div className="bg-background border rounded-md flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={onZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
        
        <div className="px-2 border-l border-r min-w-16 text-center text-sm">
          {Math.round(zoom * 100)}%
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={onZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>
      </div>
      
      {/* Reset zoom button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onResetZoom}
          >
            <Home className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset view</TooltipContent>
      </Tooltip>
      
      {/* Grid controls */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={gridEnabled ? "secondary" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={onToggleGrid}
            >
              <GridTypeIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle grid</TooltipContent>
        </Tooltip>
        
        <Popover open={isGridPopoverOpen} onOpenChange={setIsGridPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Grid Settings</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Grid Type</label>
                  <ToggleGroup type="single" value={gridType} onValueChange={(value) => {
                    if (value) onChangeGridType(value as any);
                  }}>
                    <ToggleGroupItem value="lines" size="sm">Lines</ToggleGroupItem>
                    <ToggleGroupItem value="dots" size="sm">Dots</ToggleGroupItem>
                    <ToggleGroupItem value="columns" size="sm">Columns</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Grid Size</label>
                    <span className="text-sm text-muted-foreground">{gridSize}px</span>
                  </div>
                  <Slider
                    value={[gridSize]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(values) => onChangeGridSize(values[0])}
                  />
                </div>
                
                {gridType === 'columns' && onChangeColumns && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Columns</label>
                    <Select
                      value={columns.toString()}
                      onValueChange={(value) => onChangeColumns(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 6, 8, 12, 16, 24].map((cols) => (
                          <SelectItem key={cols} value={cols.toString()}>
                            {cols}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Snap to grid toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={snapToGridEnabled ? "secondary" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={onToggleSnapToGrid}
          >
            <Magnet className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Snap to grid</TooltipContent>
      </Tooltip>
      
      {/* Smart guides toggle */}
      {onToggleGuides && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={guidesEnabled ? "secondary" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={onToggleGuides}
            >
              <Ruler className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Smart guides</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default EnhancedCanvasControls;
