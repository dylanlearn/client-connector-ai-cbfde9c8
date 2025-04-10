
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useCanvasEngine } from '@/hooks/useCanvasEngine';
import EnhancedPropertyPanel from './EnhancedPropertyPanel';
import EnhancedCanvasRulers from './EnhancedCanvasRulers';
import HistoryControls from './HistoryControls';
import CanvasControls from '../controls/CanvasControls';
import { Button } from '@/components/ui/button';
import { PlusCircle, Square, Circle as CircleIcon, Type } from 'lucide-react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

interface EnhancedWireframeCanvasProps {
  projectId?: string;
  className?: string;
  readOnly?: boolean;
  onSave?: (canvasData: any) => void;
  initialData?: any;
}

const EnhancedWireframeCanvas: React.FC<EnhancedWireframeCanvasProps> = ({
  projectId,
  className,
  readOnly = false,
  onSave,
  initialData
}) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  const {
    canvas,
    canvasRef,
    config,
    selectedObject,
    isInitialized,
    initializeCanvas,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    toggleSnapToGrid,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCanvasEngine({
    width: 1200,
    height: 800
  });
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current && !isInitialized) {
      const canvas = initializeCanvas();
      
      // Load initial data if available
      if (canvas && initialData) {
        try {
          // If initialData is a wireframe structure (not a canvas JSON)
          if (initialData.sections && Array.isArray(initialData.sections)) {
            renderWireframeToCanvas(canvas, initialData);
          } else {
            // If initialData is a canvas JSON
            canvas.loadFromJSON(initialData, () => {
              canvas.renderAll();
            });
          }
        } catch (error) {
          console.error('Error loading canvas data:', error);
          toast({
            title: "Error",
            description: "Failed to load canvas data",
            variant: "destructive"
          });
        }
      }
    }
  }, [canvasRef, isInitialized, initializeCanvas, initialData, toast]);
  
  // Update canvas when initialData changes
  useEffect(() => {
    if (canvas && initialData && initialData.sections) {
      renderWireframeToCanvas(canvas, initialData);
    }
  }, [canvas, initialData]);
  
  // Function to render wireframe data to canvas
  const renderWireframeToCanvas = (canvas: fabric.Canvas, wireframeData: any) => {
    // Clear canvas
    canvas.clear();
    
    // Skip if no sections
    if (!wireframeData.sections || !Array.isArray(wireframeData.sections)) {
      return;
    }
    
    // Render each section
    wireframeData.sections.forEach((section: any) => {
      if (!section) return;
      
      const { position, dimensions, name, sectionType } = section;
      const left = position?.x || 0;
      const top = position?.y || 0;
      const width = dimensions?.width || 200;
      const height = dimensions?.height || 100;
      
      // Create a rectangle for the section
      const rect = new fabric.Rect({
        left,
        top,
        width,
        height,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        cornerSize: 10,
        transparentCorners: false,
        data: { 
          id: section.id, 
          type: 'section',
          sectionType 
        }
      });
      
      // Create a text label for the section name
      const text = new fabric.Text(name || `${sectionType || 'Section'}`, {
        left: left + 10,
        top: top + 10,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#333333'
      });
      
      // Create a group for the section
      const sectionGroup = new fabric.Group([rect, text], {
        data: { 
          id: section.id, 
          type: 'section',
          sectionType 
        }
      });
      
      // Add the section to canvas
      canvas.add(sectionGroup);
      
      // If section has components, render them
      if (section.components && Array.isArray(section.components)) {
        section.components.forEach((component: any) => {
          if (!component) return;
          
          // Render component based on type
          // This is where you'd add logic for different component types
        });
      }
    });
    
    canvas.renderAll();
  };
  
  // Update container dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);
  
  // Handle tool selection and object creation
  const handleToolClick = (tool: string) => {
    if (readOnly || !canvas) return;
    
    setSelectedTool(tool);
    
    const center = {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    };
    
    switch (tool) {
      case 'rectangle':
        const rect = new fabric.Rect({
          left: center.x - 50,
          top: center.y - 50,
          width: 100,
          height: 100,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          cornerSize: 10,
          transparentCorners: false
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        break;
        
      case 'circle':
        const circle = new fabric.Circle({
          left: center.x - 50,
          top: center.y - 50,
          radius: 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          cornerSize: 10,
          transparentCorners: false
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        break;
        
      case 'text':
        const text = new fabric.Text('Text', {
          left: center.x - 50,
          top: center.y - 25,
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#333333'
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        break;
    }
    
    canvas.requestRenderAll();
    setSelectedTool(null);
  };
  
  // Handle canvas save
  const handleSave = () => {
    if (!canvas || !onSave) return;
    
    try {
      const canvasData = canvas.toJSON(['id', 'name', 'data']);
      onSave(canvasData);
      toast({
        title: "Success",
        description: "Canvas saved successfully",
      });
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast({
        title: "Error",
        description: "Failed to save canvas",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 flex justify-between">
        <div className="flex items-center space-x-2">
          <HistoryControls
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
          {!readOnly && (
            <>
              <div className="h-6 border-l mx-2" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToolClick('rectangle')}
                className={cn(selectedTool === 'rectangle' ? 'bg-accent' : '')}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToolClick('circle')}
                className={cn(selectedTool === 'circle' ? 'bg-accent' : '')}
              >
                <CircleIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToolClick('text')}
                className={cn(selectedTool === 'text' ? 'bg-accent' : '')}
              >
                <Type className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <CanvasControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetZoom={resetZoom}
            onToggleGrid={toggleGrid}
            onToggleSnapToGrid={toggleSnapToGrid}
            showGrid={config.showGrid}
            snapToGrid={config.snapToGrid}
            className=""
          />
          {!readOnly && onSave && (
            <Button variant="outline" size="sm" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative overflow-hidden" ref={containerRef}>
          {canvas && (
            <EnhancedCanvasRulers
              width={Math.max(containerSize.width - 20, 0)}
              height={Math.max(containerSize.height - 20, 0)}
              zoom={config.zoom}
              panOffset={config.panOffset}
              showRulers={config.showRulers}
              rulerSize={config.rulerSize}
            />
          )}
          
          <div 
            className={cn(
              "absolute overflow-auto bg-slate-50 border",
              config.showRulers ? "top-[20px] left-[20px] right-0 bottom-0" : "inset-0"
            )}
          >
            <canvas ref={canvasRef} className="canvas shadow-sm" />
          </div>
          
          {!canvas && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Loading canvas...
            </div>
          )}
        </div>
        
        {!readOnly && (
          <div className="w-80 border-l">
            <EnhancedPropertyPanel
              selectedObject={selectedObject}
              canvas={canvas}
              className="h-full"
              onSaveHistoryState={(description) => {
                console.log('Save state:', description);
                // History state is automatically saved via canvas events
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWireframeCanvas;
