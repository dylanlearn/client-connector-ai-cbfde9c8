
import React from 'react';
import { Minus, Plus, RotateCcw, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UseEnhancedCanvasControlsParams {
  canvas: any;
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
}: UseEnhancedCanvasControlsParams) {
  
  if (!canvas) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-md shadow-sm border p-1.5">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={onZoomOut}
        disabled={zoom <= 0.1}
        title="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="text-xs font-mono w-12 text-center">
        {Math.round(zoom * 100)}%
      </span>
      
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={onZoomIn}
        disabled={zoom >= 5}
        title="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={onResetZoom}
        disabled={zoom === 1}
        title="Reset zoom"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <div className="h-6 w-px bg-border" />
      
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={onToggleGrid}
        title="Toggle grid"
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
}
