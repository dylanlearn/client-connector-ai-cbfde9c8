
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3x3, 
  MagnetIcon, 
  Undo, 
  Redo 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWireframeStore } from '@/stores/wireframe-store';
import { cn } from '@/lib/utils';

interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onToggleSnapToGrid: () => void;
  className?: string;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onToggleSnapToGrid,
  className
}) => {
  const canvasSettings = useWireframeStore(state => state.canvasSettings);
  const undo = useWireframeStore(state => state.undo);
  const redo = useWireframeStore(state => state.redo);
  const undoStack = useWireframeStore(state => state.undoStack);
  const redoStack = useWireframeStore(state => state.redoStack);
  
  return (
    <div className={cn(
      "canvas-controls flex items-center gap-2 p-2 bg-background border rounded-lg shadow-sm",
      className
    )}>
      <div className="zoom-controls flex items-center gap-1">
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
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <div className="zoom-level px-2 min-w-[60px] text-center text-sm">
          {Math.round(canvasSettings.zoom * 100)}%
        </div>

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
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onResetZoom} 
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Zoom</TooltipContent>
        </Tooltip>
      </div>

      <div className="grid-controls flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={canvasSettings.showGrid ? "secondary" : "outline"} 
              size="icon" 
              onClick={onToggleGrid} 
              className="h-8 w-8"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Grid</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={canvasSettings.snapToGrid ? "secondary" : "outline"} 
              size="icon" 
              onClick={onToggleSnapToGrid} 
              className="h-8 w-8"
            >
              <MagnetIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Snap to Grid</TooltipContent>
        </Tooltip>
      </div>

      <div className="history-controls flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={undo} 
              disabled={undoStack.length === 0}
              className="h-8 w-8"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={redo} 
              disabled={redoStack.length === 0}
              className="h-8 w-8"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default CanvasControls;
