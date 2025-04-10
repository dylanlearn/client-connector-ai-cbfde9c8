
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, ZoomIn, ZoomOut, RotateCcw, Magnet } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface ExtendedCanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onToggleSnapToGrid: () => void;
  showGrid: boolean;
  snapToGrid: boolean;
  className?: string;
}

const CanvasControls: React.FC<ExtendedCanvasControlsProps> = ({
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
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center rounded-md border">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onZoomOut}
          className="rounded-r-none border-r"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onResetZoom}
          className="rounded-none px-2 border-r"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onZoomIn}
          className="rounded-l-none"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center rounded-md border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={showGrid}
              onPressedChange={onToggleGrid}
              aria-label="Toggle grid"
              className="rounded-r-none border-r"
            >
              <Grid className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            Show grid
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={snapToGrid}
              onPressedChange={onToggleSnapToGrid}
              aria-label="Toggle snap to grid"
              className="rounded-l-none"
            >
              <Magnet className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            Snap to grid
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default CanvasControls;
