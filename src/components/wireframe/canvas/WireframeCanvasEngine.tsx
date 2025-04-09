
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig, SectionRenderingOptions } from '@/components/wireframe/utils/types';
import { WireframeData, WireframeSection } from '@/types/wireframe';
import { componentToFabricObject } from '@/components/wireframe/utils/fabric-converters';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, ZoomIn, ZoomOut, RotateCw, Grid, Ruler } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import WireframeFeedbackProcessor from '../feedback/WireframeFeedbackProcessor';
import CanvasRulers from './CanvasRulers';
import PropertyPanel from './PropertyPanel';
import HistoryControls from './HistoryControls';
import DragEnhancementHandler from './DragEnhancementHandler';
import { useCanvasHistory } from '@/hooks/wireframe/use-canvas-history';
import { cn } from '@/lib/utils';

interface WireframeCanvasEngineProps {
  wireframeData: WireframeData;
  editable?: boolean;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  canvasConfig?: Partial<WireframeCanvasConfig>;
  onCanvasConfigChange?: (config: Partial<WireframeCanvasConfig>) => void;
  onWireframeUpdate?: (wireframe: WireframeData) => void;
}

const WireframeCanvasEngine: React.FC<WireframeCanvasEngineProps> = ({
  wireframeData,
  editable = true,
  onCanvasReady,
  deviceType = 'desktop',
  canvasConfig,
  onCanvasConfigChange,
  onWireframeUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState<boolean>(false);
  const saveStateForUndo = useWireframeStore(state => state.saveStateForUndo);
  const { toast } = useToast();
  
  const defaultConfig: WireframeCanvasConfig = {
    width: 1200,
    height: 800,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 8,
    backgroundColor: '#ffffff',
    gridType: 'lines',
    snapTolerance: 5,
    showSmartGuides: true,
    showRulers: true,
    rulerColor: '#888888',
    rulerMarkings: 'pixels',
    historyEnabled: true,
    maxHistorySteps: 50
  };
  
  const config = { ...defaultConfig, ...canvasConfig };
  
  const {
    history,
    undo,
    redo,
    canUndo,
    canRedo,
    saveHistoryState
  } = useCanvasHistory({
    canvas,
    maxHistorySteps: config.maxHistorySteps,
    onChange: (canUndo, canRedo) => {
      // Update any UI that needs to know about undo/redo state
    }
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canvas || !config.historyEnabled) return;
    
    // Handle undo/redo keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    }
    
    // Handle delete key
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeObject = canvas.getActiveObject();
      if (activeObject && !activeObject.isGuide) {
        canvas.remove(activeObject);
        canvas.renderAll();
        saveHistoryState('Object deleted');
      }
    }
  }, [canvas, config.historyEnabled, undo, redo, saveHistoryState]);

  useEffect(() => {
    if (canvasRef.current && !isInitialized) {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: config.width,
          height: config.height,
          backgroundColor: config.showGrid ? '#f8f8f8' : config.backgroundColor,
          selection: editable,
          preserveObjectStacking: true
        });
        
        fabricCanvas.setZoom(config.zoom);
        fabricCanvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
        
        fabricCanvas.on('selection:created', (e) => {
          const selected = e.selected?.[0];
          setSelectedObject(selected || null);
          
          if (selected && selected.data) {
            const sectionId = selected.data.id;
            if (sectionId) {
              useWireframeStore.getState().setActiveSection(sectionId);
            }
          }
        });
        
        fabricCanvas.on('selection:updated', (e) => {
          const selected = e.selected?.[0];
          setSelectedObject(selected || null);
        });
        
        fabricCanvas.on('selection:cleared', () => {
          setSelectedObject(null);
        });
        
        fabricCanvas.on('object:modified', () => {
          saveStateForUndo();
          // Auto-show property panel when an object is modified
          if (!showPropertyPanel) {
            setShowPropertyPanel(true);
          }
        });
        
        if (config.showGrid) {
          renderGrid(fabricCanvas, config.gridSize);
        }
        
        setCanvas(fabricCanvas);
        setIsInitialized(true);
        
        if (onCanvasReady) {
          onCanvasReady(fabricCanvas);
        }
      } catch (error) {
        console.error("Error initializing fabric canvas:", error);
        toast({
          title: "Error",
          description: "Failed to initialize canvas",
          variant: "destructive"
        });
      }
    }
    
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvasRef, isInitialized, config.showGrid, config.zoom, config.backgroundColor,
      config.panOffset, config.gridSize, editable, onCanvasReady, toast, saveStateForUndo]);
  
  useEffect(() => {
    if (isInitialized && canvas && wireframeData) {
      renderWireframe();
    }
  }, [isInitialized, canvas, wireframeData, deviceType]);
  
  useEffect(() => {
    if (canvas && isInitialized) {
      canvas.clear();
      
      if (config.showGrid) {
        renderGrid(canvas, config.gridSize);
      }
      
      renderWireframe();
    }
  }, [config.showGrid, config.gridSize, isInitialized]);
  
  useEffect(() => {
    if (canvas && isInitialized) {
      canvas.setZoom(config.zoom);
      canvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
      canvas.renderAll();
    }
  }, [config.zoom, config.panOffset, isInitialized]);

  // Add event listener for keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const handleWireframeUpdate = (updatedWireframe: WireframeData) => {
    if (onWireframeUpdate) {
      onWireframeUpdate(updatedWireframe);
      setFeedbackOpen(false);
    }
  };
  
  const renderGrid = (canvas: fabric.Canvas, gridSize: number) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    for (let i = 0; i < width / gridSize; i++) {
      const lineX = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      canvas.add(lineX);
      lineX.sendToBack();
    }
    
    for (let i = 0; i < height / gridSize; i++) {
      const lineY = new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      canvas.add(lineY);
      lineY.sendToBack();
    }
    
    canvas.renderAll();
  };
  
  const renderWireframe = useCallback(() => {
    if (!canvas || !wireframeData || !wireframeData.sections) return;
    
    const objects = canvas.getObjects();
    const gridLines = objects.filter(obj => 
      obj instanceof fabric.Line && 
      obj.stroke === '#e0e0e0' && 
      !obj.selectable
    );
    
    canvas.clear();
    
    if (config.showGrid && gridLines.length > 0) {
      gridLines.forEach(line => canvas.add(line));
    }
    
    wireframeData.sections.forEach((section: WireframeSection) => {
      if (!section) return;
      
      const normalizedSection = {...section};
      
      if (typeof normalizedSection.layout === 'string') {
        normalizedSection.layout = {
          type: normalizedSection.layout,
          direction: 'column',
          alignment: 'center'
        };
      }
      
      const renderOptions: SectionRenderingOptions = {
        showBorders: true,
        showLabels: true,
        showComponentOutlines: true,
        highlightOnHover: true,
        deviceType,
        interactive: editable
      };
      
      const fabricObject = componentToFabricObject(normalizedSection, renderOptions);
      
      if (fabricObject) {
        canvas.add(fabricObject as unknown as fabric.Object);
        
        if (normalizedSection.components && Array.isArray(normalizedSection.components)) {
          normalizedSection.components.forEach(component => {
            if (!component) return;
            
            const componentObj = fabric.util.object.clone(component);
            
            if (componentObj) {
              canvas.add(componentObj as unknown as fabric.Object);
            }
          });
        }
      }
    });
    
    canvas.renderAll();
  }, [canvas, wireframeData, deviceType, editable, config.showGrid]);
  
  useEffect(() => {
    const handleResize = () => {
      if (!canvas || !canvasRef.current) return;
      
      const parentElement = canvasRef.current.parentElement;
      if (!parentElement) return;
      
      const width = parentElement.clientWidth;
      const height = 800;
      
      canvas.setDimensions({ width, height });
      
      if (config.showGrid) {
        canvas.clear();
        renderGrid(canvas, config.gridSize);
        renderWireframe();
      } else {
        renderWireframe();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, renderWireframe, config.showGrid, config.gridSize]);
  
  useEffect(() => {
    if (canvas && config.snapToGrid) {
      canvas.on('object:moving', function(options) {
        if (options.target) {
          const target = options.target;
          const gridSize = config.gridSize;
          
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    }
  }, [canvas, config.snapToGrid, config.gridSize]);

  const handleZoomIn = () => {
    if (!canvas) return;
    const newZoom = Math.min(5, config.zoom + 0.1);
    canvas.setZoom(newZoom);
    
    if (onCanvasConfigChange) {
      onCanvasConfigChange({ zoom: newZoom });
    }
  };

  const handleZoomOut = () => {
    if (!canvas) return;
    const newZoom = Math.max(0.1, config.zoom - 0.1);
    canvas.setZoom(newZoom);
    
    if (onCanvasConfigChange) {
      onCanvasConfigChange({ zoom: newZoom });
    }
  };

  const handleResetZoom = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.absolutePan(new fabric.Point(0, 0));
    
    if (onCanvasConfigChange) {
      onCanvasConfigChange({ zoom: 1, panOffset: { x: 0, y: 0 } });
    }
  };

  const toggleGrid = () => {
    if (onCanvasConfigChange) {
      onCanvasConfigChange({ showGrid: !config.showGrid });
    }
  };

  const toggleRulers = () => {
    if (onCanvasConfigChange) {
      onCanvasConfigChange({ showRulers: !config.showRulers });
    }
  };
  
  const rulerSize = 20;
  
  return (
    <div className="wireframe-canvas-fabric-container w-full relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 w-8 p-0"
            title="Reset View"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground px-2">
            {Math.round(config.zoom * 100)}%
          </div>
          <Button
            variant={config.showGrid ? "secondary" : "outline"}
            size="sm"
            onClick={toggleGrid}
            className="h-8 w-8 p-0"
            title={config.showGrid ? "Hide Grid" : "Show Grid"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={config.showRulers ? "secondary" : "outline"}
            size="sm"
            onClick={toggleRulers}
            className="h-8 w-8 p-0"
            title={config.showRulers ? "Hide Rulers" : "Show Rulers"}
          >
            <Ruler className="h-4 w-4" />
          </Button>
        </div>
        
        <HistoryControls 
          canUndo={canUndo} 
          canRedo={canRedo} 
          onUndo={undo} 
          onRedo={redo} 
        />
      </div>

      {/* Canvas container with rulers */}
      <div className="relative" style={{ 
        paddingTop: config.showRulers ? rulerSize : 0, 
        paddingLeft: config.showRulers ? rulerSize : 0 
      }}>
        {config.showRulers && canvas && (
          <CanvasRulers 
            width={canvas.width || 1200} 
            height={canvas.height || 800} 
            zoom={config.zoom} 
            panOffset={config.panOffset} 
            rulerSize={rulerSize}
            rulerColor={config.rulerColor}
            markingType={config.rulerMarkings}
          />
        )}

        <canvas ref={canvasRef} className="border border-gray-200 shadow-sm" />

        {/* Smart guides and drag enhancement */}
        {canvas && config.showSmartGuides && (
          <DragEnhancementHandler
            canvas={canvas}
            snapTolerance={config.snapTolerance}
            showSmartGuides={config.showSmartGuides}
            showDropZones={true}
            showHoverOutlines={true}
          />
        )}
      </div>
      
      {/* Property panel for selected object */}
      {selectedObject && showPropertyPanel && (
        <div className="mt-4">
          <PropertyPanel
            selectedObject={selectedObject}
            canvas={canvas}
            onUpdate={() => saveHistoryState('Properties updated')}
          />
        </div>
      )}
      
      {editable && wireframeData?.id && (
        <div className="absolute bottom-4 right-4">
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 shadow-md"
                variant="default"
                size="sm"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Add Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <WireframeFeedbackProcessor
                wireframeId={wireframeData.id}
                onWireframeUpdate={handleWireframeUpdate}
                createNewVersion={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default WireframeCanvasEngine;
