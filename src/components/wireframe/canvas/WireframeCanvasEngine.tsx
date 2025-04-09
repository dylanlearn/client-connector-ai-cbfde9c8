import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { WireframeData, WireframeSection, WireframeCanvasConfig } from '@/services/ai/wireframe/wireframe-types';
import { componentToFabricObject } from '@/components/wireframe/utils/fabric-converters';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import WireframeFeedbackProcessor from '../feedback/WireframeFeedbackProcessor';

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
  const saveStateForUndo = useWireframeStore(state => state.saveStateForUndo);
  const { toast } = useToast();
  
  // Default canvas settings merged with provided config
  const defaultConfig: WireframeCanvasConfig = {
    width: 1200,
    height: 800,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 8,
    backgroundColor: '#ffffff'
  };
  
  const config = { ...defaultConfig, ...canvasConfig };

  // Initialize the canvas
  useEffect(() => {
    if (canvasRef.current && !isInitialized) {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: 1200,
          height: 800,
          backgroundColor: config.showGrid ? '#f8f8f8' : '#ffffff',
          selection: editable,
          preserveObjectStacking: true
        });
        
        // Apply zoom and pan from config
        fabricCanvas.setZoom(config.zoom);
        fabricCanvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
        
        // Handle selection events
        fabricCanvas.on('selection:created', (e) => {
          const selected = e.selected?.[0];
          if (selected && selected.data) {
            // Handle section selection
            const sectionId = selected.data.id;
            if (sectionId) {
              useWireframeStore.getState().setActiveSection(sectionId);
            }
          }
        });
        
        fabricCanvas.on('object:modified', () => {
          // Save state for undo when objects are modified
          saveStateForUndo();
        });
        
        // Add grid if enabled
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
  }, [canvasRef, isInitialized, config.showGrid, config.zoom, 
      config.panOffset, config.gridSize, editable, onCanvasReady, toast, saveStateForUndo]);
  
  // Update canvas when wireframeData changes
  useEffect(() => {
    if (isInitialized && canvas && wireframeData) {
      renderWireframe();
    }
  }, [isInitialized, canvas, wireframeData, deviceType]);
  
  // Update grid when grid settings change
  useEffect(() => {
    if (canvas && isInitialized) {
      canvas.clear();
      
      if (config.showGrid) {
        renderGrid(canvas, config.gridSize);
      }
      
      renderWireframe();
    }
  }, [config.showGrid, config.gridSize, isInitialized]);
  
  // Update zoom and pan when config changes
  useEffect(() => {
    if (canvas && isInitialized) {
      canvas.setZoom(config.zoom);
      canvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
      canvas.renderAll();
    }
  }, [config.zoom, config.panOffset, isInitialized]);
  
  // Handle wireframe update from feedback
  const handleWireframeUpdate = (updatedWireframe: WireframeData) => {
    if (onWireframeUpdate) {
      onWireframeUpdate(updatedWireframe);
      setFeedbackOpen(false);
    }
  };
  
  // Render grid on canvas
  const renderGrid = (canvas: fabric.Canvas, gridSize: number) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Create grid lines
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
  
  // Render wireframe sections
  const renderWireframe = useCallback(() => {
    if (!canvas || !wireframeData || !wireframeData.sections) return;
    
    // Clear existing content but keep grid
    const objects = canvas.getObjects();
    const gridLines = objects.filter(obj => 
      obj instanceof fabric.Line && 
      obj.stroke === '#e0e0e0' && 
      !obj.selectable
    );
    
    canvas.clear();
    
    // Re-add grid lines if needed
    if (config.showGrid && gridLines.length > 0) {
      gridLines.forEach(line => canvas.add(line));
    }
    
    // Add sections
    wireframeData.sections.forEach((section: WireframeSection) => {
      if (!section) return;
      
      // Create a copy with the layout in the correct format
      const normalizedSection = {...section};
      
      // Handle the case where section.layout might be a string
      if (typeof normalizedSection.layout === 'string') {
        // Convert string layout to object format
        normalizedSection.layout = {
          type: normalizedSection.layout,
          direction: 'column',
          alignment: 'center'
        };
      }
      
      // Convert section to fabric object
      const fabricObject = componentToFabricObject(normalizedSection, {
        deviceType,
        interactive: editable
      });
      
      // Add to canvas
      if (fabricObject) {
        canvas.add(fabricObject as unknown as fabric.Object);
        
        // Add components if they exist
        if (normalizedSection.components && Array.isArray(normalizedSection.components)) {
          normalizedSection.components.forEach(component => {
            if (!component) return;
            
            // Use the wireframeComponentToFabric from fabric-converters.ts
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
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvas || !canvasRef.current) return;
      
      const parentElement = canvasRef.current.parentElement;
      if (!parentElement) return;
      
      const width = parentElement.clientWidth;
      const height = 800; // Fixed height or make responsive
      
      canvas.setDimensions({ width, height });
      
      // Re-render grid and wireframe
      if (config.showGrid) {
        canvas.clear();
        renderGrid(canvas, config.gridSize);
        renderWireframe();
      } else {
        renderWireframe();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, renderWireframe, config.showGrid, config.gridSize]);

  // Set up snap to grid if enabled
  useEffect(() => {
    if (canvas && config.snapToGrid) {
      canvas.on('object:moving', function(options) {
        if (options.target) {
          const target = options.target;
          const gridSize = config.gridSize;
          
          // Round position to nearest grid
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    }
  }, [canvas, config.snapToGrid, config.gridSize]);
  
  return (
    <div className="wireframe-canvas-fabric-container w-full relative">
      <canvas ref={canvasRef} />
      
      {/* Feedback button overlay */}
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
