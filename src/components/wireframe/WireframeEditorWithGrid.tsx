
import React, { useEffect, useRef, useState } from 'react';
import EnterpriseGrid, { DEFAULT_GRID_CONFIG } from './grid/EnterpriseGrid';
import EnterpriseGridControls from './grid/EnterpriseGridControls';
import { EnhancedCanvasEngine } from './canvas/EnhancedCanvasEngine';
import { useEnterpriseGrid } from '@/hooks/wireframe/use-enterprise-grid';
import { useFabric } from '@/hooks/fabric/use-fabric';
import EnhancedLayerManager from './EnhancedLayerManager';
import { fabric } from 'fabric';
import { useCanvasPerformance } from './hooks/useCanvasPerformance';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Grid, Layers, Monitor, Tablet, Smartphone } from 'lucide-react';

interface WireframeEditorWithGridProps {
  width?: number;
  height?: number;
  className?: string;
}

const WireframeEditorWithGrid: React.FC<WireframeEditorWithGridProps> = ({
  width = 1200,
  height = 800,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [viewportWidth, setViewportWidth] = useState(width);
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Initialize Fabric canvas
  const { 
    fabricCanvas, 
    canvasConfig, 
    updateConfig,
    zoomIn, 
    zoomOut, 
    resetZoom
  } = useFabric({
    persistConfig: true,
    initialConfig: {
      width,
      height,
      showGrid: true,
      snapToGrid: true
    }
  });
  
  // Set up canvas when fabricCanvas is available
  useEffect(() => {
    if (fabricCanvas) {
      setCanvas(fabricCanvas);
    }
  }, [fabricCanvas]);
  
  // Initialize grid system
  const {
    gridConfig,
    guideConfig,
    updateGridConfig,
    updateGuideConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridType,
    setGridSize,
    updateColumnSettings,
    toggleResponsiveGrid,
    getResponsiveGridConfig
  } = useEnterpriseGrid({
    canvas,
    width: viewportWidth,
    height,
    persistConfig: true,
    initialConfig: {
      visible: true,
      type: 'columns',
      columns: 12,
      gutterWidth: 20,
      marginWidth: 40,
      responsive: true
    }
  });
  
  // Monitor canvas performance
  const { renderStats, optimizeCanvas } = useCanvasPerformance(
    canvas, 
    { enableCaching: true, skipOffscreen: true }
  );
  
  // Update canvas size and grid when device type changes
  useEffect(() => {
    if (!canvas) return;
    
    let newWidth = width;
    
    switch (deviceType) {
      case 'mobile':
        newWidth = 375;
        break;
      case 'tablet':
        newWidth = 768;
        break;
      case 'desktop':
        newWidth = 1200;
        break;
    }
    
    setViewportWidth(newWidth);
    
    // Delay resize to allow smooth transitions
    const resizeTimer = setTimeout(() => {
      canvas.setWidth(newWidth);
      canvas.setHeight(height);
      
      // Get the appropriate grid config for this viewport width
      const responsiveGridConfig = getResponsiveGridConfig(newWidth);
      updateGridConfig(responsiveGridConfig);
      
      canvas.renderAll();
    }, 300);
    
    return () => clearTimeout(resizeTimer);
  }, [deviceType, canvas, height, width, getResponsiveGridConfig, updateGridConfig]);
  
  // Handle canvas ready event
  const handleCanvasReady = (fabricCanvas: fabric.Canvas) => {
    setCanvas(fabricCanvas);
    optimizeCanvas();
  };
  
  // Add a sample rectangle when the canvas is double-clicked
  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: e.nativeEvent.offsetX - 75,
      top: e.nativeEvent.offsetY - 50,
      width: 150,
      height: 100,
      fill: '#e0f2fe',
      stroke: '#0ea5e9',
      strokeWidth: 2,
      rx: 8,
      ry: 8
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };
  
  return (
    <div className={`wireframe-editor-with-grid ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Canvas & Grid Area */}
        <div className="lg:flex-grow">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={deviceType === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('desktop')}
              >
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={deviceType === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('tablet')}
              >
                <Tablet className="h-4 w-4 mr-1" />
                Tablet
              </Button>
              <Button
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut}>
                - Zoom
              </Button>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                + Zoom
              </Button>
              <Button variant="outline" size="sm" onClick={resetZoom}>
                Reset
              </Button>
            </div>
          </div>
          
          <div 
            className="border rounded-md overflow-hidden transition-all duration-300 bg-gray-50 relative" 
            style={{ 
              width: '100%',
              height: `${height}px`,
              maxHeight: '80vh'
            }}
            onDoubleClick={handleCanvasDoubleClick}
          >
            {/* Canvas */}
            <EnhancedCanvasEngine 
              width={viewportWidth}
              height={height}
              canvasConfig={{
                ...canvasConfig,
                backgroundColor: '#ffffff',
              }}
              onCanvasReady={handleCanvasReady}
              className="transition-width duration-300"
            />
            
            {/* Grid Overlay */}
            {canvas && (
              <EnterpriseGrid
                canvas={canvas}
                config={gridConfig}
                width={viewportWidth}
                height={height}
                onChange={updateGridConfig}
                guideConfig={guideConfig}
                onGuideConfigChange={updateGuideConfig}
              />
            )}
            
            {/* Performance stats */}
            {renderStats && (
              <div className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded pointer-events-none">
                {renderStats.frameRate} FPS | {renderStats.objectCount} objects
              </div>
            )}
          </div>
        </div>
        
        {/* Controls Sidebar */}
        <div className="lg:w-80">
          <Tabs defaultValue="grid">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="layers">
                <Layers className="h-4 w-4 mr-1" />
                Layers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-4">
              <EnterpriseGridControls
                config={gridConfig}
                onChange={updateGridConfig}
                guideConfig={guideConfig}
                onGuideConfigChange={updateGuideConfig}
                canvasWidth={viewportWidth}
              />
            </TabsContent>
            
            <TabsContent value="layers" className="mt-4">
              {canvas && <EnhancedLayerManager canvas={canvas} maxHeight={500} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WireframeEditorWithGrid;
