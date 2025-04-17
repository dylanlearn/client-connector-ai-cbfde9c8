
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  Crosshair, 
  RefreshCw, 
  Maximize2,
  Minimize2, 
  LayoutGrid,
  SplitSquareVertical
} from 'lucide-react';
import { 
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';

export type ViewMode = 'single' | 'split' | 'grid';

export interface CanvasViewportControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
  onRotateReset: () => void;
  onPanReset: () => void;
  onFocusReset: () => void;
  zoom: number;
  rotation: number;
  viewMode: ViewMode;
  onViewModeToggle: (mode: ViewMode) => void;
  className?: string;
}

const CanvasViewportControls: React.FC<CanvasViewportControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotateClockwise,
  onRotateCounterClockwise,
  onRotateReset,
  onPanReset,
  onFocusReset,
  zoom,
  rotation,
  viewMode,
  onViewModeToggle,
  className
}) => {
  return (
    <div className={cn('canvas-viewport-controls flex flex-col gap-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg border shadow', className)}>
      <TooltipProvider delayDuration={300}>
        <div className="controls-group zoom-controls flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onZoomIn}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Zoom In</TooltipContent>
          </Tooltip>
          
          <div className="zoom-indicator h-8 px-2 text-sm flex items-center justify-center bg-muted rounded border min-w-[60px]">
            {Math.round(zoom * 100)}%
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onZoomOut}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Zoom Out</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onZoomReset}
                className="h-8 w-8"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Reset Zoom</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="controls-group rotation-controls flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRotateCounterClockwise}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Rotate Counter-clockwise</TooltipContent>
          </Tooltip>
          
          <div className="rotation-indicator h-8 px-2 text-sm flex items-center justify-center bg-muted rounded border min-w-[60px]">
            {Math.round(rotation)}°
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRotateClockwise}
                className="h-8 w-8"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Rotate Clockwise</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRotateReset}
                className="h-8 w-8"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Reset Rotation</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="controls-group position-controls flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onPanReset}
                className="h-8 w-8"
              >
                <Crosshair className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Center Canvas</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onFocusReset}
                className="h-8 w-8"
              >
                {focusArea ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {focusArea ? "Exit Focus Area" : "Focus Selected"}
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="controls-group view-controls">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value: string) => onViewModeToggle(value as ViewMode)} className="flex gap-1">
            <ToggleGroupItem value="single" asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </ToggleGroupItem>
            
            <ToggleGroupItem value="split" asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <SplitSquareVertical className="h-4 w-4" />
              </Button>
            </ToggleGroupItem>
            
            <ToggleGroupItem value="grid" asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default CanvasViewportControls;
