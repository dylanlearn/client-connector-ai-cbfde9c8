
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Maximize,
  Grid,
  Lock,
  Unlock,
  Layers,
  Eye,
  EyeOff,
  Save,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from './CanvasViewportControls';

export interface EnhancedCanvasControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onRotateClockwise?: () => void;
  onRotateCounterClockwise?: () => void;
  onRotateReset?: () => void;
  zoom: number;
  rotation: number;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  snapToGrid?: boolean;
  onToggleSnap?: () => void;
  gridSize?: number;
  onGridSizeChange?: (size: number) => void;
  showRulers?: boolean;
  onToggleRulers?: () => void;
  className?: string;
  viewMode?: ViewMode;
  onViewModeToggle?: (mode: ViewMode) => void;
  onSave?: () => void;
  showPanels?: boolean;
  onTogglePanels?: () => void;
}

const EnhancedCanvasControls: React.FC<EnhancedCanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onRotateClockwise,
  onRotateCounterClockwise,
  onRotateReset,
  zoom = 1,
  rotation = 0,
  showGrid = true,
  onToggleGrid,
  snapToGrid = true,
  onToggleSnap,
  gridSize = 10,
  onGridSizeChange,
  showRulers = true,
  onToggleRulers,
  className,
  viewMode = 'single',
  onViewModeToggle,
  onSave,
  showPanels = true,
  onTogglePanels
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <div className={cn("enhanced-canvas-controls p-3 rounded-md bg-background border shadow-sm space-y-3", className)}>
      {/* Basic Controls */}
      <div className="flex flex-wrap items-center gap-2">
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
            className="h-8 w-8"
            title="Reset Zoom"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-8" />
        
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
              className="h-8 w-8"
              title="Reset Rotation"
            >
              <RotateCw className="h-4 w-4" style={{ opacity: 0.5 }} />
            </Button>
          )}
        </div>
        
        {onViewModeToggle && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <div className="view-mode-controls">
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => {
                  if (value) onViewModeToggle(value as ViewMode)
                }}
              >
                <ToggleGroupItem value="single" title="Single View">
                  Single
                </ToggleGroupItem>
                <ToggleGroupItem value="split" title="Split View">
                  Split
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" title="Grid View">
                  Grid
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </>
        )}
        
        {onToggleGrid && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant={showGrid ? "secondary" : "outline"}
              size="sm"
              onClick={onToggleGrid}
              className="h-8"
              title="Toggle Grid"
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
          </>
        )}
        
        {onToggleSnap && showGrid && (
          <Button
            variant={snapToGrid ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleSnap}
            className="h-8"
            title="Toggle Snap to Grid"
          >
            {snapToGrid ? (
              <Lock className="h-4 w-4 mr-1" />
            ) : (
              <Unlock className="h-4 w-4 mr-1" />
            )}
            Snap
          </Button>
        )}
        
        {onTogglePanels && (
          <Button
            variant={showPanels ? "secondary" : "outline"}
            size="sm"
            onClick={onTogglePanels}
            className="h-8 ml-auto"
            title="Toggle Panels"
          >
            {showPanels ? (
              <PanelLeft className="h-4 w-4 mr-1" />
            ) : (
              <PanelRight className="h-4 w-4 mr-1" />
            )}
            Panels
          </Button>
        )}
        
        {onSave && (
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="h-8 ml-auto"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        )}
      </div>
      
      {/* Advanced Controls - Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs w-full h-6 py-0"
      >
        {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
      </Button>
      
      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="advanced-controls space-y-3 mt-2 pt-2 border-t">
          {onGridSizeChange && (
            <div className="grid-size-control">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium">Grid Size: {gridSize}px</label>
              </div>
              <Slider
                value={[gridSize]}
                min={2}
                max={50}
                step={2}
                onValueChange={(value) => onGridSizeChange(value[0])}
              />
            </div>
          )}
          
          {onToggleRulers && (
            <div className="rulers-control flex items-center justify-between">
              <span className="text-xs font-medium">Show Rulers</span>
              <Button
                variant={showRulers ? "secondary" : "outline"}
                size="sm"
                onClick={onToggleRulers}
                className="h-7"
              >
                {showRulers ? (
                  <Eye className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 mr-1" />
                )}
                {showRulers ? "Visible" : "Hidden"}
              </Button>
            </div>
          )}
          
          <div className="layers-control flex items-center justify-between">
            <span className="text-xs font-medium">Layer Management</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => console.log("Open layers panel")}
            >
              <Layers className="h-3.5 w-3.5 mr-1" />
              Manage Layers
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCanvasControls;
