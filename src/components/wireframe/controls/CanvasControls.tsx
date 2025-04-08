
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3, ZoomIn, ZoomOut, RotateCcw, PanelLeft, Ruler } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CanvasControlsProps } from '../types';

const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid,
  showGrid = true,
  snapToGrid = false,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onResetZoom}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Zoom</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={showGrid ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8" 
              onClick={onToggleGrid}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>

        {onToggleSnapToGrid && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={snapToGrid ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8" 
                onClick={onToggleSnapToGrid}
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default CanvasControls;
