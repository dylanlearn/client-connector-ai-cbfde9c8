import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Undo, Redo, Square, Circle, Type, Image as ImageIcon,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Grid, Home,
  Move, MousePointer, Hand, PenTool, Download, Upload, 
  Trash2, RotateCcw, Copy, DownloadCloud
} from 'lucide-react';
import PropertyPanel from './PropertyPanel';
import { ColorPicker } from '@/components/ui/colorpicker';
import { useFabric } from '@/hooks/use-fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface FabricDesignCanvasProps {
  showToolbar?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  projectId?: string;
  onSave?: (canvasData: any) => void;
  className?: string;
}

const FabricDesignCanvas: React.FC<FabricDesignCanvasProps> = ({
  showToolbar = true,
  readOnly = false,
  fullWidth = false,
  projectId,
  onSave,
  className
}) => {
  const { toast } = useToast();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [fillColor, setFillColor] = useState('#333333');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [canvasSettings, setCanvasSettings] = useState<WireframeCanvasConfig>({
    width: 1200,
    height: 800,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
    gridType: 'lines',
    snapTolerance: 10,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    gridColor: '#e0e0e0',
    showRulers: true,
    rulerSize: 20,
    rulerColor: '#bbbbbb',
    rulerMarkings: true
  });

  const {
    fabricCanvas,
    canvasConfig,
    updateConfig,
    toggleGrid,
    toggleSnapToGrid,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    initializeCanvas
  } = useFabric({
    initialConfig: canvasSettings
  });
  
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvasInstance = new fabric.Canvas(canvasRef.current, {
        width: canvasSettings.width,
        height: canvasSettings.height,
        backgroundColor: canvasSettings.backgroundColor,
        selection: true
      });
      
      setCanvas(canvasInstance);
      initializeCanvas(canvasRef.current);
    }
  }, [canvasRef, fabricCanvas, canvasSettings, initializeCanvas]);

  // Fix functions to use gridColor correctly
  const drawGrid = () => {
    if (!canvas) return;
    
    // Clear any existing grid
    const existingGrid = canvas.getObjects().filter((obj: any) => 
      obj.data && obj.data.type === 'grid'
    );
    existingGrid.forEach((obj: any) => canvas.remove(obj));
    
    if (!canvasSettings.showGrid) return;
    
    const { width, height } = canvas;
    
    // Draw vertical lines
    for (let i = 0; i <= width; i += canvasSettings.gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: canvasSettings.gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= height; i += canvasSettings.gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: canvasSettings.gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    }
    
    canvas.renderAll();
  };

  useEffect(() => {
    if (canvas) {
      drawGrid();
    }
  }, [canvas, canvasSettings.showGrid, canvasSettings.gridSize, canvasSettings.gridColor]);

  const handleAddShape = (shapeType: string) => {
    if (!canvas) return;
    
    let shape: fabric.Object;
    
    switch (shapeType) {
      case 'square':
        shape = new fabric.Rect({
          left: 50,
          top: 50,
          width: 50,
          height: 50,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: 50,
          top: 50,
          radius: 25,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth
        });
        break;
      default:
        return;
    }
    
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  };

  const handleAddText = () => {
    if (!canvas) return;
    
    const text = new fabric.Textbox('New Text', {
      left: 50,
      top: 50,
      width: 150,
      fontSize: fontSize,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  useEffect(() => {
    if (!canvas) return;
    
    const handleSelectionCreated = (e: any) => {
      setSelectedObject(e.target);
    };
    
    const handleSelectionUpdated = (e: any) => {
      setSelectedObject(e.target);
    };
    
    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };
    
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas]);

  const handleZoom = (zoomType: string) => {
    switch (zoomType) {
      case 'in':
        zoomIn();
        break;
      case 'out':
        zoomOut();
        break;
      case 'reset':
        resetZoom();
        break;
      default:
        break;
    }
  };

  const handlePan = (direction: string) => {
    if (!canvas) return;
    
    let panX = 0;
    let panY = 0;
    const panValue = 50;
    
    switch (direction) {
      case 'left':
        panX = -panValue;
        break;
      case 'right':
        panX = panValue;
        break;
      case 'up':
        panY = -panValue;
        break;
      case 'down':
        panY = panValue;
        break;
      default:
        return;
    }
    
    canvas.relativePan(new fabric.Point(panX, panY));
    canvas.requestRenderAll();
  };

  const handleClearCanvas = () => {
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = canvasSettings.backgroundColor;
    drawGrid();
    canvas.renderAll();
  };

  const handleSave = () => {
    if (!canvas || !projectId) return;
    
    const canvasJson = canvas.toJSON(['id', 'name', 'data']);
    
    if (onSave) {
      onSave(canvasJson);
    } else {
      try {
        localStorage.setItem(`design-canvas-${projectId}`, JSON.stringify(canvasJson));
        toast({
          title: "Saved",
          description: "Your design has been saved",
        });
      } catch (err) {
        console.error('Error saving project:', err);
        toast({
          title: "Error",
          description: "Could not save your design",
          variant: "destructive",
        });
      }
    }
  };

  const handleLoad = () => {
    if (!canvas || !projectId) return;
    
    try {
      const savedJson = localStorage.getItem(`design-canvas-${projectId}`);
      if (savedJson) {
        canvas.loadFromJSON(savedJson, () => {
          canvas.renderAll();
          toast({
            title: "Loaded",
            description: "Your design has been loaded",
          });
        });
      } else {
        toast({
          title: "No saved design",
          description: "No design found for this project",
        });
      }
    } catch (err) {
      console.error('Error loading project:', err);
      toast({
        title: "Error",
        description: "Could not load your design",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!canvas) return;
    
    const canvasDataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.href = canvasDataUrl;
    link.download = 'design-canvas.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (f: any) => {
      const img = new Image();
      img.onload = () => {
        const fabricImage = new fabric.Image(img, {
          left: 50,
          top: 50
        });
        canvas.add(fabricImage);
        canvas.renderAll();
      };
      img.src = f.target.result;
    };
    
    reader.readAsDataURL(file);
  };

  const handleToolChange = (tool: string) => {
    setCurrentTool(tool);
    
    if (!canvas) return;
    
    switch (tool) {
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case 'pan':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'grab';
        break;
      case 'line':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = fillColor;
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.selection = false;
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
    }
  };

  const handleColorChange = (color: string, type: string) => {
    switch (type) {
      case 'fill':
        setFillColor(color);
        if (selectedObject) {
          selectedObject.set('fill', color);
          canvas?.renderAll();
        }
        break;
      case 'stroke':
        setStrokeColor(color);
        if (selectedObject) {
          selectedObject.set('stroke', color);
          canvas?.renderAll();
        }
        break;
      default:
        break;
    }
  };

  const handleStrokeChange = (width: number) => {
    setStrokeWidth(width);
    if (selectedObject) {
      selectedObject.set('strokeWidth', width);
      canvas?.renderAll();
    }
  };

  const handleFontChange = (size: number) => {
    setFontSize(size);
    if (selectedObject && selectedObject.type === 'textbox') {
      selectedObject.set('fontSize', size);
      canvas?.renderAll();
    }
  };

  return (
    <div className={cn("fabric-design-canvas relative", className)}>
      {showToolbar && (
        <ScrollArea className="absolute top-2 left-2 right-2 z-10 bg-secondary/80 backdrop-blur-sm rounded-md">
          <div className="flex items-center space-x-2 p-2">
            <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleZoom('reset')}>
              <Home className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="outline" size="icon" onClick={toggleGrid}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleSnapToGrid}>
              <Magnet className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <ToggleGroup type="single" defaultValue="select" value={currentTool} onValueChange={handleToolChange}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="select" aria-label="Select">
                      <MousePointer className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="pan" aria-label="Pan">
                      <Hand className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pan</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="line" aria-label="Line">
                      <PenTool className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Line</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </ToggleGroup>
            <Separator orientation="vertical" className="h-5" />
            <ColorPicker value={fillColor} onChange={(color) => handleColorChange(color, 'fill')} />
            <ColorPicker value={strokeColor} onChange={(color) => handleColorChange(color, 'stroke')} />
            <Slider
              defaultValue={[strokeWidth]}
              max={20}
              step={1}
              onValueChange={(value) => handleStrokeChange(value[0])}
              className="w-[100px]"
            />
            <Slider
              defaultValue={[fontSize]}
              max={100}
              step={1}
              onValueChange={(value) => handleFontChange(value[0])}
              className="w-[100px]"
            />
            <Separator orientation="vertical" className="h-5" />
            <Button variant="outline" size="icon" onClick={handleClearCanvas}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSave}>
              <DownloadCloud className="h-4 w-4" />
            </Button>
            {!readOnly && (
              <>
                <Separator orientation="vertical" className="h-5" />
                <input
                  type="file"
                  id="upload-image"
                  className="hidden"
                  onChange={handleUpload}
                />
                <Label htmlFor="upload-image" className="cursor-pointer">
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </Label>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      )}
      <div 
        ref={canvasContainerRef}
        className={cn(
          "canvas-container border rounded-md overflow-hidden touch-none",
          fullWidth ? "w-full" : "w-[1200px]",
          "h-[800px]",
          "relative",
          !showToolbar && "mt-0"
        )}
      >
        <canvas 
          ref={canvasRef} 
          id="fabric-canvas"
          className="absolute top-0 left-0"
        />
      </div>
      {selectedObject && (
        <div className="absolute bottom-2 left-2 right-2 z-10 bg-secondary/80 backdrop-blur-sm rounded-md p-2">
          <PropertyPanel selectedObject={selectedObject} fabricCanvas={canvas} />
        </div>
      )}
    </div>
  );
};

export default FabricDesignCanvas;

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Magnet } from "lucide-react"
