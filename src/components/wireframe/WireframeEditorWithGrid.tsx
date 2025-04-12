
import React, { useEffect, useRef } from 'react';
import { useWireframeEditor } from '@/hooks/wireframe/use-wireframe-editor.tsx';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, Square, Circle, Image, Type, MousePointer } from 'lucide-react';
import GridControl from '@/components/wireframe/grid/GridControl';
import LayerManager from '@/components/wireframe/layers/LayerManager';
import { cn } from '@/lib/utils';
import { createAlignmentGuides, removeAlignmentGuides, snapObjectToGrid } from './utils/grid-system';
import { fabric } from 'fabric';

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
  const {
    canvasRef,
    canvas,
    initializeCanvas,
    isInitializing,
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    updateColumnSettings,
  } = useWireframeEditor({
    width,
    height
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      initializeCanvas();
    }
  }, [canvasRef, canvas, initializeCanvas]);
  
  // Set up snapping and guides when canvas is ready
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectMoving = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target) return;
      
      // Show alignment guides
      createAlignmentGuides(canvas, target);
      
      // Snap to grid if enabled
      if (gridConfig.snapToGrid) {
        snapObjectToGrid(target, gridConfig);
      }
    };
    
    const handleObjectModified = () => {
      // Remove alignment guides when done moving
      removeAlignmentGuides(canvas);
    };
    
    const handleSelectionCleared = () => {
      // Remove alignment guides when selection cleared
      removeAlignmentGuides(canvas);
    };
    
    // Add event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    return () => {
      // Remove event listeners
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, gridConfig]);
  
  // Add element to canvas
  const addElement = (type: 'rectangle' | 'circle' | 'text' | 'image') => {
    if (!canvas) return;
    
    let object: fabric.Object;
    
    switch (type) {
      case 'rectangle':
        object = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: '#e0e0e0',
          stroke: '#cccccc',
          strokeWidth: 1
        });
        break;
        
      case 'circle':
        object = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: '#e0e0e0',
          stroke: '#cccccc',
          strokeWidth: 1
        });
        break;
        
      case 'text':
        object = new fabric.IText('Text', {
          left: 100,
          top: 100,
          fontFamily: 'Arial',
          fontSize: 20,
          fill: '#333333'
        });
        break;
        
      case 'image':
        // Just create a placeholder rect for now
        object = new fabric.Rect({
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: '#f0f0f0',
          stroke: '#cccccc',
          strokeWidth: 1
        });
        
        // Add image icon to differentiate it
        const imgIcon = new fabric.Text('🖼️', {
          fontSize: 30,
          left: 85,
          top: 60,
          selectable: false
        });
        
        const group = new fabric.Group([object, imgIcon], {
          left: 100,
          top: 100
        });
        
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        return;
        
      default:
        return;
    }
    
    // Add element data for layer management
    object.data = {
      id: `${type}-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Element`,
      type: type
    };
    
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.renderAll();
  };
  
  return (
    <div className={cn("wireframe-editor-container flex flex-col lg:flex-row gap-4", className)}>
      {/* Main canvas area */}
      <div className="wireframe-canvas-wrapper flex-1 h-full min-h-[600px]">
        <Card className="w-full h-full overflow-hidden">
          <div className="p-2 border-b flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addElement('rectangle')}
              disabled={!canvas}
              className="flex-1 sm:flex-none"
            >
              <Square className="h-4 w-4 mr-1" />
              Rectangle
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addElement('circle')}
              disabled={!canvas}
              className="flex-1 sm:flex-none"
            >
              <Circle className="h-4 w-4 mr-1" />
              Circle
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addElement('text')}
              disabled={!canvas}
              className="flex-1 sm:flex-none"
            >
              <Type className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addElement('image')}
              disabled={!canvas}
              className="flex-1 sm:flex-none"
            >
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
            
            <div className="ml-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (canvas) {
                    canvas.discardActiveObject();
                    canvas.renderAll();
                  }
                }}
                disabled={!canvas}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isInitializing ? (
            <div className="w-full h-full min-h-[600px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Initializing canvas...</span>
            </div>
          ) : (
            <div className="relative w-full h-full" ref={containerRef}>
              <canvas
                ref={canvasRef}
                id="wireframe-canvas"
                className="wireframe-canvas"
              />
            </div>
          )}
        </Card>
      </div>
      
      {/* Controls panel */}
      <div className="wireframe-controls-panel w-full lg:w-80">
        <div className="space-y-4">
          {/* Grid control */}
          <GridControl
            gridConfig={gridConfig}
            onToggleVisibility={toggleGridVisibility}
            onToggleSnapToGrid={toggleSnapToGrid}
            onSizeChange={setGridSize}
            onTypeChange={setGridType}
            onColumnSettingsChange={updateColumnSettings}
          />
          
          <Separator className="my-4" />
          
          {/* Layer manager */}
          <LayerManager canvas={canvas} />
        </div>
      </div>
    </div>
  );
};

export default WireframeEditorWithGrid;
