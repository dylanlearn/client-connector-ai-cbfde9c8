
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Grid, Magnet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CanvasControlsProps } from '../types';

const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid,
  showGrid,
  snapToGrid,
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
      </div>
    </TooltipProvider>
  );
};

export default CanvasControls;
