
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Grid2X2,
  LayoutGrid
} from 'lucide-react';

export interface CanvasControlsProps {
  canvas: fabric.Canvas | null;
  zoom: number;
  isDragging: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGrid: () => void;
  onSetZoom: (zoom: number) => void;
}

export function useEnhancedCanvasControls({
  canvas,
  zoom,
  isDragging,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGrid,
  onSetZoom
}: CanvasControlsProps) {
  const zoomPercentage = Math.round(zoom * 100);
  
  const controls = useMemo(() => (
    <div className="flex items-center gap-2 bg-background/95 rounded-md p-1.5 shadow-md border">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        disabled={!canvas}
        className="size-7"
        title="Zoom Out"
      >
        <Minus className="size-3" />
      </Button>
      
      <div className="text-xs font-mono w-12 text-center select-none" onClick={() => onResetZoom()}>
        {zoomPercentage}%
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        disabled={!canvas}
        className="size-7"
        title="Zoom In"
      >
        <Plus className="size-3" />
      </Button>
      
      <div className="w-px h-5 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onResetZoom}
        disabled={!canvas || (zoom === 1)}
        className="size-7"
        title="Reset Zoom"
      >
        <RotateCcw className="size-3" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleGrid}
        disabled={!canvas}
        className="size-7"
        title="Toggle Grid"
      >
        <LayoutGrid className="size-3" />
      </Button>
    </div>
  ), [canvas, zoom, zoomPercentage, onZoomIn, onZoomOut, onResetZoom, onToggleGrid]);
  
  return controls;
}
