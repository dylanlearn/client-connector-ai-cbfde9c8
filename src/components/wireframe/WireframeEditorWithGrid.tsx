
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AdvancedWireframeEditor from './AdvancedWireframeEditor';
import CanvasViewportControls from './controls/CanvasViewportControls';
import { useCanvasNavigation } from '@/hooks/wireframe/use-canvas-navigation';
import { Card } from '@/components/ui/card';
import AdvancedHistoryControls from './canvas/AdvancedHistoryControls';
import useCanvasHistory from '@/hooks/wireframe/use-canvas-history';
import { fabric } from 'fabric'; // Import fabric correctly as a module
import SmartGuideSystem from './canvas/SmartGuideSystem';

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
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [smartGuidesEnabled, setSmartGuidesEnabled] = useState<boolean>(true);
  
  // Use canvas navigation hook for viewport controls
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

  // Use canvas history hook for undo/redo/branching
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    jumpToState,
    history,
    createNamedState,
    currentIndex,
    // Branching features
    branches,
    currentBranch,
    createBranch,
    switchBranch,
    mergeBranch,
    deleteBranch
  } = useCanvasHistory({ 
    canvas: fabricCanvas,
    saveInitialState: true,
    maxHistorySteps: 50,
    enableBranching: true
  });

  // Callback for when the Canvas is initialized
  const handleCanvasInitialized = (canvas: fabric.Canvas) => {
    setFabricCanvas(canvas);
  };

  // Adapter function to convert section ID to a focus area
  const handleSectionFocus = (sectionId: string) => {
    // This is a simplified example - in a real app, you'd calculate actual area coordinates
    // based on the section's position and size in the DOM
    const mockFocusAreas: Record<string, { x: number; y: number; width: number; height: number }> = {
      header: { x: 0, y: 0, width: 400, height: 100 },
      content: { x: 0, y: 100, width: 400, height: 300 },
      footer: { x: 0, y: 400, width: 400, height: 100 }
    };
    
    const area = mockFocusAreas[sectionId];
    if (area) {
      applyFocusArea(area);
    }
  };

  // Toggle smart guides
  const toggleSmartGuides = () => {
    setSmartGuidesEnabled(prev => !prev);
  };

  return (
    <div className={cn("wireframe-editor-container relative", className)} ref={containerRef}>
      <Card className="wireframe-editor-card relative overflow-hidden">
        {/* Top controls bar with viewport and history management */}
        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center">
          <AdvancedHistoryControls
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onJumpToState={jumpToState}
            onCreateNamedState={createNamedState}
            history={history}
            // Branching props
            enableBranching={true}
            branches={branches}
            currentBranch={currentBranch}
            onCreateBranch={createBranch}
            onSwitchBranch={switchBranch}
            onMergeBranch={mergeBranch}
            onDeleteBranch={deleteBranch}
          />
          
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
            onFocusReset={resetFocusArea}
            focusArea={focusArea}
          />
        </div>
        
        {/* Smart Guide system renders alignment guides */}
        {fabricCanvas && (
          <SmartGuideSystem
            canvas={fabricCanvas}
            enabled={smartGuidesEnabled}
            threshold={10}
            snapThreshold={5}
            showLabels={true}
          />
        )}
        
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
            onAreaFocus={handleSectionFocus}
            focusArea={focusArea}
            onCanvasInitialized={handleCanvasInitialized}
          />
        </div>
      </Card>
    </div>
  );
};

export default WireframeEditorWithGrid;
