
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Move, ZoomIn, ZoomOut, Grid3X3, PinOff, 
  MousePointer, Square, Type, Image as ImageIcon
} from 'lucide-react';
import { useEnhancedCanvas } from '@/hooks/wireframe/use-enhanced-canvas';
import { Loader2 } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeComponent } from '@/types/wireframe-component';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedCanvasProps {
  initialWireframe?: WireframeData;
  className?: string;
  darkMode?: boolean;
}

/**
 * Enhanced wireframe canvas component with drag-drop and component registry
 */
const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  initialWireframe,
  className,
  darkMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTool, setActiveTool] = useState<string>('select');
  
  // Initialize the enhanced canvas hook
  const {
    canvasRef,
    canvas,
    canvasConfig,
    updateConfig,
    initializeCanvas,
    renderWireframe,
    componentTypes,
    createComponent,
    startDrag,
    endDrag
  } = useEnhancedCanvas({
    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
    gridColor: darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0'
  });
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = initializeCanvas(canvasRef.current);
    
    if (fabricCanvas && initialWireframe) {
      renderWireframe(initialWireframe);
    }
    
    setIsLoading(false);
  }, [initializeCanvas, initialWireframe, renderWireframe]);
  
  // Handle tool selection
  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    
    if (tool === 'select' && canvas) {
      canvas.selection = true;
      canvas.hoverCursor = 'move';
      canvas.defaultCursor = 'default';
    }
  };
  
  // Handle component drag from toolbar
  const handleComponentDrag = (componentType: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    // Create the component
    const component = createComponent(componentType);
    if (!component) return;
    
    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: componentType,
      component
    }));
    
    // Set drag appearance
    e.dataTransfer.effectAllowed = 'move';
  };
  
  // Handle component drop on canvas
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get drop position relative to canvas
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvas) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get component data
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (!jsonData) return;
      
      const data = JSON.parse(jsonData);
      
      if (data.component) {
        // Place component at drop position
        startDrag(data.component, { x, y });
        endDrag({ x, y });
      }
    } catch (error) {
      console.error("Error processing drop:", error);
    }
  };
  
  // Canvas drag-over handler
  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Toggle grid visibility
  const toggleGrid = () => {
    updateConfig({ showGrid: !canvasConfig.showGrid });
  };
  
  // Toggle snap to grid
  const toggleSnapToGrid = () => {
    updateConfig({ snapToGrid: !canvasConfig.snapToGrid });
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    updateConfig({ zoom: Math.min(3, canvasConfig.zoom + 0.1) });
  };
  
  const handleZoomOut = () => {
    updateConfig({ zoom: Math.max(0.1, canvasConfig.zoom - 0.1) });
  };
  
  // Render component palette items
  const renderComponentPalette = () => {
    return (
      <div className={cn(
        "component-palette p-3 border rounded-md",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-sm font-medium mb-2",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}>Components</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {componentTypes.map((compType) => (
            <div
              key={compType.type}
              className={cn(
                "component-item p-2 border rounded text-center cursor-move flex flex-col items-center justify-center",
                darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
              )}
              draggable
              onDragStart={handleComponentDrag(compType.type)}
            >
              {compType.type === 'box' && <Square className="w-4 h-4 mb-1" />}
              {compType.type === 'text' && <Type className="w-4 h-4 mb-1" />}
              {compType.type === 'image' && <ImageIcon className="w-4 h-4 mb-1" />}
              {compType.type === 'button' && <MousePointer className="w-4 h-4 mb-1" />}
              
              <span className={cn(
                "text-xs",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>
                {compType.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className={cn("enhanced-canvas-container", className)}>
      <div className="toolbar flex flex-wrap gap-2 mb-4">
        <div className="tool-group flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant={activeTool === 'select' ? "secondary" : "outline"} 
                onClick={() => handleToolClick('select')}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant={activeTool === 'move' ? "secondary" : "outline"}
                onClick={() => handleToolClick('move')}
              >
                <Move className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="zoom-group flex gap-1 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="grid-group flex gap-1 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant={canvasConfig.showGrid ? "secondary" : "outline"} 
                onClick={toggleGrid}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant={canvasConfig.snapToGrid ? "secondary" : "outline"} 
                onClick={toggleSnapToGrid}
              >
                <PinOff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Snap to Grid</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center ml-2">
          <span className={cn(
            "text-xs",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Zoom: {Math.round(canvasConfig.zoom * 100)}%
          </span>
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* Component palette */}
        <div className="w-48">
          {renderComponentPalette()}
        </div>
        
        {/* Canvas container */}
        <div 
          ref={containerRef}
          className={cn(
            "canvas-container flex-1 border rounded-md overflow-auto relative",
            darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
          )}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <canvas ref={canvasRef} className="min-w-full" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCanvas;
