
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  X, 
  Grid, 
  Columns, 
  Maximize, 
  Layout 
} from 'lucide-react';
import { 
  useEnhancedCanvasNavigation,
  ViewMode,
  FocusArea
} from '@/hooks/wireframe/use-enhanced-canvas-navigation';
import { EnhancedWireframeCanvas } from '@/components/wireframe/utils';

interface MultiViewportCanvasProps {
  width?: number;
  height?: number;
  initialViewMode?: ViewMode;
  className?: string;
  onSectionFocus?: (viewportIndex: number, sectionId: string) => void;
  wireframeData?: any;
}

const MultiViewportCanvas: React.FC<MultiViewportCanvasProps> = ({
  width = 1200,
  height = 800,
  initialViewMode = 'single',
  className,
  onSectionFocus,
  wireframeData
}) => {
  const navigation = useEnhancedCanvasNavigation({
    maxHistorySize: 100,
    animationDuration: 300,
    enableSnapToGrid: true,
    gridSize: 20,
    showMinimap: true
  });
  
  const { 
    viewports, 
    viewMode,
    activeViewport, 
    setActiveViewport, 
    handleViewModeToggle, 
    addViewport, 
    removeViewport 
  } = navigation;

  // Set initial view mode
  useEffect(() => {
    if (initialViewMode !== viewMode) {
      handleViewModeToggle(initialViewMode);
    }
  }, [initialViewMode, handleViewModeToggle, viewMode]);

  // Handle section focus events
  const handleAreaFocus = (viewportIndex: number, sectionId: string) => {
    setActiveViewport(viewportIndex);
    // Set focus area based on section ID
    const sectionBounds: FocusArea = {
      x: 100, // Example values - in a real app you'd calculate these
      y: 100, 
      width: 400,
      height: 300
    };
    navigation.handleApplyFocusArea(sectionBounds);
    
    if (onSectionFocus) {
      onSectionFocus(viewportIndex, sectionId);
    }
  };

  // Render layouts based on view mode
  const renderSingleView = () => {
    const viewport = viewports[0];
    if (!viewport) return null;

    return (
      <div
        className="viewport-container w-full h-full relative"
      >
        <div 
          className={cn(
            "viewport-transform-container transition-transform duration-300 ease-out",
            navigation.isAnimating && "transition-all"
          )}
          style={{
            transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%'
          }}
        >
          <EnhancedWireframeCanvas
            wireframe={wireframeData}
            darkMode={false}
            deviceType="desktop"
            onSectionClick={(sectionId) => handleAreaFocus(0, sectionId)}
            interactive={true}
            canvasConfig={{
              width: width,
              height: height,
              zoom: viewport.zoom,
              showGrid: true,
              gridSize: 20,
              backgroundColor: '#ffffff',
              gridColor: '#e0e0e0'
            }}
          />
        </div>
        <div className="viewport-index absolute top-2 left-2 bg-primary/80 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          1
        </div>
      </div>
    );
  };

  const renderSplitView = () => {
    return (
      <div className="split-view grid grid-cols-2 gap-2 w-full h-full">
        {viewports.slice(0, 2).map((viewport, index) => (
          <div
            key={viewport.id}
            className={cn(
              "viewport-container relative border rounded",
              activeViewport === index && "ring-2 ring-primary"
            )}
            onClick={() => setActiveViewport(index)}
          >
            <div 
              className="viewport-transform-container transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
                transformOrigin: 'center center',
                width: '100%',
                height: '100%'
              }}
            >
              <EnhancedWireframeCanvas
                wireframe={wireframeData}
                darkMode={false}
                deviceType="desktop"
                onSectionClick={(sectionId) => handleAreaFocus(index, sectionId)}
                interactive={activeViewport === index}
                canvasConfig={{
                  width: width / 2 - 20,
                  height: height - 20,
                  zoom: viewport.zoom,
                  showGrid: index === activeViewport,
                  gridSize: 20,
                  backgroundColor: '#ffffff',
                  gridColor: '#e0e0e0'
                }}
              />
            </div>
            <div className="viewport-index absolute top-2 left-2 bg-primary/80 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            {index > 0 && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeViewport(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuadView = () => {
    return (
      <div className="quad-view grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
        {viewports.slice(0, 4).map((viewport, index) => (
          <div
            key={viewport.id}
            className={cn(
              "viewport-container relative border rounded",
              activeViewport === index && "ring-2 ring-primary"
            )}
            onClick={() => setActiveViewport(index)}
          >
            <div 
              className="viewport-transform-container transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
                transformOrigin: 'center center',
                width: '100%',
                height: '100%'
              }}
            >
              <EnhancedWireframeCanvas
                wireframe={wireframeData}
                darkMode={false}
                deviceType="desktop"
                onSectionClick={(sectionId) => handleAreaFocus(index, sectionId)}
                interactive={activeViewport === index}
                canvasConfig={{
                  width: width / 2 - 20,
                  height: height / 2 - 20,
                  zoom: viewport.zoom,
                  showGrid: index === activeViewport,
                  gridSize: 20,
                  backgroundColor: '#ffffff',
                  gridColor: '#e0e0e0'
                }}
              />
            </div>
            <div className="viewport-index absolute top-2 left-2 bg-primary/80 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            {index > 0 && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeViewport(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderGridView = () => {
    // Grid view has a main large viewport and smaller ones
    return (
      <div className="grid-view flex flex-col gap-2 w-full h-full">
        {/* Main viewport */}
        <div 
          className={cn(
            "main-viewport h-2/3 relative border rounded",
            activeViewport === 0 && "ring-2 ring-primary"
          )}
          onClick={() => setActiveViewport(0)}
        >
          <div 
            className="viewport-transform-container transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${viewports[0]?.pan.x || 0}px, ${viewports[0]?.pan.y || 0}px) scale(${viewports[0]?.zoom || 1}) rotate(${viewports[0]?.rotation || 0}deg)`,
              transformOrigin: 'center center',
              width: '100%',
              height: '100%'
            }}
          >
            <EnhancedWireframeCanvas
              wireframe={wireframeData}
              darkMode={false}
              deviceType="desktop"
              onSectionClick={(sectionId) => handleAreaFocus(0, sectionId)}
              interactive={activeViewport === 0}
              canvasConfig={{
                width: width,
                height: (height * 2/3) - 20,
                zoom: viewports[0]?.zoom || 1,
                showGrid: activeViewport === 0,
                gridSize: 20,
                backgroundColor: '#ffffff',
                gridColor: '#e0e0e0'
              }}
            />
          </div>
          <div className="viewport-index absolute top-2 left-2 bg-primary/80 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            1
          </div>
        </div>
        
        {/* Smaller viewports */}
        <div className="grid grid-cols-5 gap-2 h-1/3">
          {viewports.slice(1, 6).map((viewport, index) => (
            <div
              key={viewport.id}
              className={cn(
                "viewport-container relative border rounded",
                activeViewport === index + 1 && "ring-2 ring-primary"
              )}
              onClick={() => setActiveViewport(index + 1)}
            >
              <div 
                className="viewport-transform-container transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom}) rotate(${viewport.rotation}deg)`,
                  transformOrigin: 'center center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <EnhancedWireframeCanvas
                  wireframe={wireframeData}
                  darkMode={false}
                  deviceType="desktop"
                  onSectionClick={(sectionId) => handleAreaFocus(index + 1, sectionId)}
                  interactive={activeViewport === index + 1}
                  canvasConfig={{
                    width: (width / 5) - 10,
                    height: (height / 3) - 10,
                    zoom: viewport.zoom,
                    showGrid: false,
                    gridSize: 20,
                    backgroundColor: '#ffffff',
                    gridColor: '#e0e0e0'
                  }}
                />
              </div>
              <div className="viewport-index absolute top-2 left-2 bg-primary/80 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {index + 2}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeViewport(index + 1);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Add viewport button */}
          {viewports.length < 6 && (
            <Button
              variant="outline"
              className="h-full border-dashed flex flex-col items-center justify-center"
              onClick={addViewport}
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-xs">Add View</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Render the canvas based on current view mode
  const renderCanvasByViewMode = () => {
    switch (viewMode) {
      case 'single':
        return renderSingleView();
      case 'split':
        return renderSplitView();
      case 'quad':
        return renderQuadView();
      case 'grid':
        return renderGridView();
      default:
        return renderSingleView();
    }
  };

  return (
    <div className={cn("multi-viewport-canvas flex flex-col", className)}>
      <div className="view-mode-controls flex gap-2 mb-4">
        <Button 
          variant={viewMode === 'single' ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewModeToggle('single')}
        >
          <Maximize className="h-4 w-4 mr-2" />
          Single
        </Button>
        <Button 
          variant={viewMode === 'split' ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewModeToggle('split')}
        >
          <Columns className="h-4 w-4 mr-2" />
          Split
        </Button>
        <Button 
          variant={viewMode === 'quad' ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewModeToggle('quad')}
        >
          <Grid className="h-4 w-4 mr-2" />
          Quad
        </Button>
        <Button 
          variant={viewMode === 'grid' ? "default" : "outline"}
          size="sm"
          onClick={() => handleViewModeToggle('grid')}
        >
          <Layout className="h-4 w-4 mr-2" />
          Grid
        </Button>
      </div>

      <div className="canvas-container relative border rounded-md bg-muted/30 w-full" style={{ height: height }}>
        {renderCanvasByViewMode()}
      </div>
    </div>
  );
};

export default MultiViewportCanvas;
