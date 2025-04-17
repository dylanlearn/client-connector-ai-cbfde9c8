
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import AdvancedWireframeEditor from './AdvancedWireframeEditor';
import CanvasViewportControls from './controls/CanvasViewportControls';
import { useCanvasNavigation } from '@/hooks/wireframe/use-canvas-navigation';
import { Card } from '@/components/ui/card';

interface WireframeEditorWithGridProps {
  width?: number;
  height?: number;
  className?: string;
}

const WireframeEditorWithGrid: React.FC<WireframeEditorWithGridProps> = ({
  width = 1200,
  height = 800,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    zoom,
    rotation,
    pan,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotateClockwise,
    handleRotateCounterClockwise,
    handleRotateReset,
    handlePanReset,
    canvasTransform,
    viewMode,
    toggleViewMode,
    focusArea,
    applyFocusArea,
    resetFocusArea
  } = useCanvasNavigation();

  return (
    <div className={cn("wireframe-editor-container relative", className)} ref={containerRef}>
      <Card className="wireframe-editor-card relative overflow-hidden">
        <CanvasViewportControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onRotateClockwise={handleRotateClockwise}
          onRotateCounterClockwise={handleRotateCounterClockwise}
          onRotateReset={handleRotateReset}
          onPanReset={handlePanReset}
          zoom={zoom}
          rotation={rotation}
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          className="absolute top-3 right-3 z-10"
          onFocusReset={resetFocusArea}
        />
        
        <div 
          className="canvas-transform-container transition-transform duration-200 ease-out"
          style={{
            transform: canvasTransform,
            transformOrigin: 'center center',
          }}
        >
          <AdvancedWireframeEditor 
            width={width}
            height={height}
            pan={pan}
            zoom={zoom}
            rotation={rotation}
            viewMode={viewMode}
            onAreaFocus={applyFocusArea}
            focusArea={focusArea}
          />
        </div>
      </Card>
    </div>
  );
};

export default WireframeEditorWithGrid;
