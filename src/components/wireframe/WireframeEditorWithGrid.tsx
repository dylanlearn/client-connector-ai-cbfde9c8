
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Layers, Grid, ZoomIn, ZoomOut, Move, Undo, Redo } from 'lucide-react';
import EnhancedLayerManager from './EnhancedLayerManager';
import { useToast } from '@/hooks/use-toast';
import { useFabric } from '@/hooks/fabric/use-fabric';
import { useCanvasPerformance } from './hooks/useCanvasPerformance';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [activeMode, setActiveMode] = useState<string>('select');

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
      stopContextMenu: true
    });

    // Set up basic grid
    const gridSize = 20;
    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: i % 100 === 0 ? 1 : 0.5,
        data: { isGridLine: true }
      });
      canvas.add(line);
    }

    for (let i = 0; i < height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: i % 100 === 0 ? 1 : 0.5,
        data: { isGridLine: true }
      });
      canvas.add(line);
    }

    // Add example shapes
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: '#add8e6',
      data: { id: 'rect-1', name: 'Header Box', type: 'rectangle' }
    });

    const text = new fabric.Textbox('Sample Header', {
      left: 120,
      top: 120,
      width: 160,
      fontSize: 18,
      fontFamily: 'Arial',
      data: { id: 'text-1', name: 'Header Text', type: 'text' }
    });

    const circle = new fabric.Circle({
      left: 400,
      top: 150,
      radius: 50,
      fill: '#90ee90',
      data: { id: 'circle-1', name: 'Feature Icon', type: 'circle' }
    });

    canvas.add(rect, text, circle);
    
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Use the performance hook to monitor and optimize canvas
  const { renderStats, optimizeCanvas } = useCanvasPerformance(fabricCanvas);

  // Setup panning and zooming
  useEffect(() => {
    if (!fabricCanvas || !containerRef.current) return;

    const canvas = fabricCanvas;
    
    // Pan handling
    const handleMouseDown = (e: fabric.IEvent) => {
      if (!isPanning || !e.e) return;
      e.e.preventDefault();
      const evt = e.e as MouseEvent;

      let lastX = evt.clientX;
      let lastY = evt.clientY;

      const handleMouseMove = (moveEvt: MouseEvent) => {
        const deltaX = moveEvt.clientX - lastX;
        const deltaY = moveEvt.clientY - lastY;
        
        lastX = moveEvt.clientX;
        lastY = moveEvt.clientY;

        const viewportTransform = canvas.viewportTransform;
        if (viewportTransform) {
          viewportTransform[4] += deltaX;
          viewportTransform[5] += deltaY;
          canvas.requestRenderAll();
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    // Zoom handling
    const handleMouseWheel = (e: fabric.IEvent) => {
      const evt = e.e as WheelEvent;
      evt.preventDefault();

      const delta = evt.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      zoom = Math.min(Math.max(0.5, zoom), 5); // Limit zoom

      const point = { x: evt.offsetX, y: evt.offsetY };
      canvas.zoomToPoint(point, zoom);
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:wheel', handleMouseWheel);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:wheel', handleMouseWheel);
    };
  }, [fabricCanvas, isPanning]);

  // Set up mode handlers
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Reset to default mode state
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    
    // Apply mode-specific settings
    switch(activeMode) {
      case 'draw':
        fabricCanvas.isDrawingMode = true;
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.width = 2;
          fabricCanvas.freeDrawingBrush.color = '#000000';
        }
        break;
      case 'pan':
        setIsPanning(true);
        fabricCanvas.selection = false;
        fabricCanvas.forEachObject(obj => {
          if (!obj.data?.isGridLine) {
            obj.selectable = false;
            obj.evented = false;
          }
        });
        break;
      case 'select':
      default:
        setIsPanning(false);
        fabricCanvas.selection = true;
        fabricCanvas.forEachObject(obj => {
          if (!obj.data?.isGridLine) {
            obj.selectable = true;
            obj.evented = true;
          }
        });
        break;
    }
    
    fabricCanvas.requestRenderAll();
  }, [fabricCanvas, activeMode]);

  // Zoom controls
  const zoomIn = () => {
    if (!fabricCanvas) return;
    let zoom = fabricCanvas.getZoom();
    zoom *= 1.1;
    zoom = Math.min(zoom, 5);
    fabricCanvas.setZoom(zoom);
    fabricCanvas.requestRenderAll();
    toast({ title: `Zoom: ${Math.round(zoom * 100)}%` });
  };

  const zoomOut = () => {
    if (!fabricCanvas) return;
    let zoom = fabricCanvas.getZoom();
    zoom *= 0.9;
    zoom = Math.max(zoom, 0.5);
    fabricCanvas.setZoom(zoom);
    fabricCanvas.requestRenderAll();
    toast({ title: `Zoom: ${Math.round(zoom * 100)}%` });
  };

  const resetZoom = () => {
    if (!fabricCanvas) return;
    fabricCanvas.setZoom(1);
    fabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    fabricCanvas.requestRenderAll();
    toast({ title: "Zoom reset to 100%" });
  };

  return (
    <div className={`wireframe-editor ${className || ''}`} ref={containerRef}>
      <div className="wireframe-toolbar flex items-center gap-2 mb-4">
        <ToggleGroup type="single" value={activeMode} onValueChange={(val) => val && setActiveMode(val)}>
          <ToggleGroupItem value="select" aria-label="Select mode">
            <svg 
              viewBox="0 0 15 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path 
                d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13C3.77614 13 4 12.7761 4 12.5V2.5C4 2.22386 3.77614 2 3.5 2ZM7 5H11.5C11.7761 5 12 4.77614 12 4.5C12 4.22386 11.7761 4 11.5 4H7C6.72386 4 6.5 4.22386 6.5 4.5C6.5 4.77614 6.72386 5 7 5ZM11.5 8H7C6.72386 8 6.5 7.77614 6.5 7.5C6.5 7.22386 6.72386 7 7 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8ZM11.5 11H7C6.72386 11 6.5 10.7761 6.5 10.5C6.5 10.2239 6.72386 10 7 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </ToggleGroupItem>
          <ToggleGroupItem value="pan" aria-label="Pan mode">
            <Move className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="draw" aria-label="Draw mode">
            <svg 
              viewBox="0 0 15 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button size="sm" variant="outline" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={resetZoom} title="Reset Zoom">
          100%
        </Button>
        <Button size="sm" variant="outline" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button size="sm" variant="outline" onClick={() => setShowLayerPanel(!showLayerPanel)}>
          <Layers className="h-4 w-4 mr-1" />
          {showLayerPanel ? 'Hide Layers' : 'Show Layers'}
        </Button>
        
        <div className="flex-grow"></div>
        
        <Button size="sm" variant="outline" disabled>
          <Undo className="h-4 w-4 mr-1" />
          Undo
        </Button>
        <Button size="sm" variant="outline" disabled>
          <Redo className="h-4 w-4 mr-1" />
          Redo
        </Button>
      </div>

      <div className="wireframe-workspace flex gap-4">
        {/* Canvas area */}
        <div className="wireframe-canvas-container flex-grow relative">
          <Card className="overflow-hidden">
            <div className="canvas-wrapper relative bg-gray-50">
              <canvas ref={canvasRef} />
            </div>
          </Card>
        </div>

        {/* Layer panel */}
        {showLayerPanel && (
          <div className="layer-panel-container w-80">
            <EnhancedLayerManager 
              canvas={fabricCanvas}
              maxHeight={height - 100} 
            />
          </div>
        )}
      </div>

      {/* Performance stats (can be hidden in production) */}
      <div className="text-xs text-muted-foreground mt-2">
        Render Time: {renderStats.renderTime}ms | Objects: {renderStats.objectCount} | FPS: {renderStats.frameRate}
      </div>
    </div>
  );
};

export default WireframeEditorWithGrid;
