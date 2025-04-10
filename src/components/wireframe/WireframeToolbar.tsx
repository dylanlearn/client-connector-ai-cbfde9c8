import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider"
import { useWireframe } from '@/contexts/WireframeContext';
import { useWireframeStore } from '@/stores/wireframe-store';
import { Toggle } from "@/components/ui/toggle"

interface WireframeToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const WireframeToolbar: React.FC<WireframeToolbarProps> = ({ onZoomIn, onZoomOut, onResetZoom }) => {
  const { zoomLevel, setZoomLevel, gridSize, setGridSize, toggleGrid, toggleSnapToGrid, showGrid, snapToGrid } = useWireframe();
  const { darkMode, showGrid: showGridStore, highlightSections, toggleDarkMode, toggleShowGrid, toggleHighlightSections } = useWireframeStore();

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0] / 100);
  };

  const handleGridSizeChange = (value: number[]) => {
    setGridSize(value[0]);
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-4 bg-secondary text-secondary-foreground">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          Zoom In
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          Zoom Out
        </Button>
        <Button variant="outline" size="sm" onClick={onResetZoom}>
          Reset Zoom
        </Button>
        <div>
          Zoom: {(zoomLevel * 100).toFixed(0)}%
          <Slider
            defaultValue={[zoomLevel * 100]}
            max={200}
            min={25}
            step={5}
            onValueChange={handleZoomChange}
            className="w-[100px] ml-2 inline-block"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div>
          Grid Size: {gridSize}px
          <Slider
            defaultValue={[gridSize]}
            max={100}
            min={2}
            step={2}
            onValueChange={handleGridSizeChange}
            className="w-[100px] ml-2 inline-block"
          />
        </div>
        <Toggle pressed={showGridStore} onPressedChange={toggleShowGrid}>
          Show Grid
        </Toggle>
        <Toggle pressed={snapToGrid} onPressedChange={toggleSnapToGrid}>
          Snap to Grid
        </Toggle>
        <Toggle pressed={darkMode} onPressedChange={toggleDarkMode}>
          Dark Mode
        </Toggle>
        <Toggle pressed={highlightSections} onPressedChange={toggleHighlightSections}>
          Highlight Sections
        </Toggle>
      </div>
    </div>
  );
};

export default WireframeToolbar;
