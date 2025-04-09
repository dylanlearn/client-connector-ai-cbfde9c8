
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  ZoomIn, 
  ZoomOut, 
  Home, 
  Grid, 
  Move, 
  Magnet,
  Ruler,
  LucideIcon,
  LayoutGrid,
  CircleDot,
  Columns
} from 'lucide-react';
import { GridType } from './GridSystem';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  gridSize: number;
  onChangeGridSize: (size: number) => void;
  gridType: GridType;
  onChangeGridType: (type: GridType) => void;
  showSmartGuides: boolean;
  onToggleSmartGuides: () => void;
  snapTolerance: number;
  onChangeSnapTolerance: (tolerance: number) => void;
}

// Grid type options with icons
const gridTypeOptions: {value: GridType; label: string; icon: LucideIcon}[] = [
  { value: 'lines', label: 'Lines', icon: Grid },
  { value: 'dots', label: 'Dots', icon: CircleDot },
  { value: 'columns', label: 'Columns', icon: Columns }
];

const CanvasController: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnapToGrid,
  gridSize,
  onChangeGridSize,
  gridType,
  onChangeGridType,
  showSmartGuides,
  onToggleSmartGuides,
  snapTolerance,
  onChangeSnapTolerance
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleGridSizeChange = useCallback((value: number[]) => {
    onChangeGridSize(value[0]);
  }, [onChangeGridSize]);
  
  const handleSnapToleranceChange = useCallback((value: number[]) => {
    onChangeSnapTolerance(value[0]);
  }, [onChangeSnapTolerance]);

  return (
    <div className="canvas-controls flex flex-col gap-4 p-4 bg-card rounded-lg border shadow-sm">
      {/* Basic Controls */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onZoomIn} 
          title="Zoom In (Ctrl/Cmd +)"
        >
          <ZoomIn className="h-4 w-4 mr-1" /> 
          <span className="hidden sm:inline">Zoom In</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onZoomOut}
          title="Zoom Out (Ctrl/Cmd -)"
        >
          <ZoomOut className="h-4 w-4 mr-1" /> 
          <span className="hidden sm:inline">Zoom Out</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResetView}
          title="Reset View (Ctrl/Cmd 0)"
        >
          <Home className="h-4 w-4 mr-1" /> 
          <span className="hidden sm:inline">Reset</span>
        </Button>
        
        <div className="px-2 py-1 bg-muted rounded text-xs flex items-center mx-auto">
          {Math.round(zoom * 100)}%
        </div>
      </div>
      
      {/* Grid Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-grid" 
            checked={showGrid} 
            onCheckedChange={onToggleGrid} 
          />
          <Label htmlFor="show-grid" className="flex items-center cursor-pointer">
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="snap-to-grid" 
            checked={snapToGrid} 
            onCheckedChange={onToggleSnapToGrid}
            disabled={!showGrid}
          />
          <Label htmlFor="snap-to-grid" className="flex items-center cursor-pointer">
            <Magnet className="h-4 w-4 mr-1" /> Snap
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="smart-guides" 
            checked={showSmartGuides} 
            onCheckedChange={onToggleSmartGuides} 
          />
          <Label htmlFor="smart-guides" className="flex items-center cursor-pointer">
            <Ruler className="h-4 w-4 mr-1" /> Guides
          </Label>
        </div>
        
        <Select 
          value={gridType} 
          onValueChange={(v) => onChangeGridType(v as GridType)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Grid Type" />
          </SelectTrigger>
          <SelectContent>
            {gridTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <option.icon className="h-4 w-4 mr-1" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Toggle Advanced Options */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="self-start"
      >
        {showAdvanced ? "Hide Advanced" : "Show Advanced"}
      </Button>
      
      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="grid-size">Grid Size: {gridSize}px</Label>
            </div>
            <Slider 
              id="grid-size"
              min={5} 
              max={50} 
              step={1} 
              value={[gridSize]} 
              onValueChange={handleGridSizeChange}
              disabled={!showGrid}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="snap-tolerance">Snap Tolerance: {snapTolerance}px</Label>
            </div>
            <Slider 
              id="snap-tolerance"
              min={1} 
              max={20} 
              step={1} 
              value={[snapTolerance]} 
              onValueChange={handleSnapToleranceChange}
              disabled={!showSmartGuides}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasController;
