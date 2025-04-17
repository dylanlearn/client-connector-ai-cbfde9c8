
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AdvancedWireframeEditor from './AdvancedWireframeEditor';
import CanvasViewportControls from './controls/CanvasViewportControls';
import { useCanvasNavigation } from '@/hooks/wireframe/use-canvas-navigation';
import { Card } from '@/components/ui/card';
import AdvancedHistoryControls from './canvas/AdvancedHistoryControls';
import useCanvasHistory from '@/hooks/wireframe/use-canvas-history';
import { fabric } from 'fabric';
import SmartGuideSystem from './canvas/SmartGuideSystem';
import { 
  AdvancedTransformControls, 
  AlignmentDistributionControls,
  GuideManagement 
} from './controls';
import { useCustomGuides } from '@/hooks/wireframe/use-custom-guides';
import { useAdvancedTransform } from '@/hooks/wireframe/use-advanced-transform';
import { useAlignmentDistribution } from '@/hooks/wireframe/use-alignment-distribution';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, AlignLeft, Ruler } from 'lucide-react';

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
  const [showTransformPanel, setShowTransformPanel] = useState<boolean>(false);
  const [showGuidesPanel, setShowGuidesPanel] = useState<boolean>(false);
  
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
  
  // Use custom guides hook
  const {
    guides,
    guidesVisible,
    presets,
    addGuide,
    removeGuide,
    updateGuide,
    toggleGuidesVisibility,
    addPreset,
    removePreset,
    applyPreset
  } = useCustomGuides({
    canvas: fabricCanvas,
    canvasWidth: width,
    canvasHeight: height
  });
  
  // Use advanced transform hook
  const {
    selectedObjects,
    transformValues,
    maintainAspectRatio,
    applyTransformation,
    flipObjects,
    resetTransformations,
    toggleAspectRatio
  } = useAdvancedTransform({
    canvas: fabricCanvas
  });
  
  // Use alignment and distribution hook
  const {
    alignLeft,
    alignCenterH,
    alignRight,
    alignTop,
    alignMiddle,
    alignBottom,
    distributeHorizontally,
    distributeVertically,
    spaceEvenlyHorizontal,
    spaceEvenlyVertical,
    setupDynamicGuides,
    hasMultipleObjectsSelected
  } = useAlignmentDistribution(fabricCanvas);
  
  // Set up dynamic alignment guides
  useEffect(() => {
    if (fabricCanvas) {
      const cleanupGuides = setupDynamicGuides();
      return cleanupGuides;
    }
  }, [fabricCanvas, setupDynamicGuides]);

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
  
  // Check if we have an active selection
  const hasActiveSelection = selectedObjects.length > 0;

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
          
          <div className="flex items-center gap-2">
            <Popover open={showGuidesPanel} onOpenChange={setShowGuidesPanel}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5"
                  onClick={() => setShowGuidesPanel(prev => !prev)}
                >
                  <Ruler className="h-4 w-4" />
                  Guides
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
                <GuideManagement
                  guides={guides}
                  onAddGuide={addGuide}
                  onRemoveGuide={removeGuide}
                  onUpdateGuide={updateGuide}
                  onToggleGuidesVisibility={toggleGuidesVisibility}
                  guidesVisible={guidesVisible}
                  presets={presets}
                  onAddPreset={addPreset}
                  onRemovePreset={removePreset}
                  onApplyPreset={applyPreset}
                  canvasWidth={width}
                  canvasHeight={height}
                />
              </PopoverContent>
            </Popover>
            
            <Popover open={showTransformPanel} onOpenChange={setShowTransformPanel}>
              <PopoverTrigger asChild>
                <Button 
                  variant={hasActiveSelection ? "default" : "outline"} 
                  size="sm" 
                  className="h-8 gap-1.5"
                  disabled={!hasActiveSelection}
                  onClick={() => setShowTransformPanel(prev => !prev)}
                >
                  <Settings className="h-4 w-4" />
                  Transform
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
                <AdvancedTransformControls
                  values={transformValues}
                  onValuesChange={applyTransformation}
                  onFlip={flipObjects}
                  onReset={resetTransformations}
                  maintainAspectRatio={maintainAspectRatio}
                  onToggleAspectRatio={toggleAspectRatio}
                  disabled={!hasActiveSelection}
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5"
                  disabled={!hasMultipleObjectsSelected()}
                >
                  <AlignLeft className="h-4 w-4" />
                  Align
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end" sideOffset={5}>
                <AlignmentDistributionControls
                  onAlignLeft={alignLeft}
                  onAlignCenterH={alignCenterH}
                  onAlignRight={alignRight}
                  onAlignTop={alignTop}
                  onAlignMiddle={alignMiddle}
                  onAlignBottom={alignBottom}
                  onDistributeHorizontally={distributeHorizontally}
                  onDistributeVertically={distributeVertically}
                  onSpaceEvenlyHorizontal={spaceEvenlyHorizontal}
                  onSpaceEvenlyVertical={spaceEvenlyVertical}
                  multipleSelected={hasMultipleObjectsSelected()}
                />
              </PopoverContent>
            </Popover>
            
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
