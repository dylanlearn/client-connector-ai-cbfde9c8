
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize,
  Eye,
  Grid3X3,
  SplitSquareVertical,
  Focus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusArea } from '@/hooks/wireframe/use-canvas-navigation';

export type ViewMode = 'single' | 'split' | 'grid';

export interface CanvasViewportControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onRotateClockwise?: () => void;
  onRotateCounterClockwise?: () => void;
  onRotateReset?: () => void;
  onPanReset?: () => void;
  zoom: number;
  rotation: number;
  className?: string;
  viewMode?: ViewMode;
  onViewModeToggle?: (mode: ViewMode) => void;
  onFocusReset?: () => void;
  focusArea?: FocusArea | null;
}

const CanvasViewportControls: React.FC<CanvasViewportControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotateClockwise,
  onRotateCounterClockwise,
  onRotateReset,
  onPanReset,
  zoom,
  rotation,
  className,
  viewMode = 'single',
  onViewModeToggle,
  onFocusReset,
  focusArea
}) => {
  return (
    <div className={cn("canvas-viewport-controls flex flex-col gap-2 p-2 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm", className)}>
      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-8 w-8"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="zoom-level text-xs font-mono bg-muted px-2 py-1 rounded">
          {(zoom * 100).toFixed(0)}%
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-8 w-8"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomReset}
          className="h-8 w-8 ml-1"
          title="Reset Zoom"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Rotation controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={onRotateCounterClockwise}
          className="h-8 w-8"
          title="Rotate Counter-clockwise"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="rotation-value text-xs font-mono bg-muted px-2 py-1 rounded">
          {rotation}°
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRotateClockwise}
          className="h-8 w-8"
          title="Rotate Clockwise"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        {rotation !== 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRotateReset}
            className="h-8 w-8 ml-1"
            title="Reset Rotation"
          >
            <RotateCw className="h-4 w-4" style={{ opacity: 0.5 }} />
          </Button>
        )}
      </div>

      <Separator className="my-1" />

      {/* View mode controls */}
      {onViewModeToggle && (
        <div className="flex items-center gap-1">
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => {
              if (value) onViewModeToggle(value as ViewMode)
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="single" size="sm" title="Single View">
              <Eye className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="split" size="sm" title="Split View">
              <SplitSquareVertical className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" size="sm" title="Grid View">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {/* Reset pan position */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPanReset}
        className="w-full h-8 text-xs mt-1"
      >
        Reset Position
      </Button>

      {/* Reset focus area if active */}
      {focusArea && onFocusReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onFocusReset}
          className="w-full h-8 text-xs flex items-center gap-1"
        >
          <Focus className="h-3 w-3" /> Clear Focus
        </Button>
      )}
    </div>
  );
};

export default CanvasViewportControls;
