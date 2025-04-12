
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import EnhancedCanvasEngine from './canvas/EnhancedCanvasEngine';
import GridControl from './grid/GridControl';
import LayerManager from './layers/LayerManager';
import { useWireframeEditor } from '@/hooks/wireframe/use-wireframe-editor';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { GridConfiguration } from './utils/grid-system';
import { cn } from '@/lib/utils';

interface WireframeEditorWithGridProps {
  width?: number;
  height?: number;
  className?: string;
  onSave?: (data: any) => void;
  initialData?: any;
}

const WireframeEditorWithGrid: React.FC<WireframeEditorWithGridProps> = ({
  width = 1200,
  height = 800,
  className,
  onSave,
  initialData
}) => {
  // Use the wireframe editor hook
  const {
    canvasRef,
    canvas,
    initializeCanvas,
    isInitializing,
    selectedObjects,
    layers,
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    updateColumnSettings,
    updateGridConfig
  } = useWireframeEditor({
    width,
    height,
    initialGridConfig: {
      visible: true,
      size: 20,
      snapToGrid: true,
      type: 'lines'
    }
  });
  
  // State for sections
  const [sections, setSections] = useState<any[]>([]);
  
  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      initializeCanvas();
    }
  }, [canvasRef, canvas, initializeCanvas]);
  
  // Add a section to the canvas
  const addSection = (sectionType: string) => {
    if (!canvas) return;
    
    const section = {
      id: uuidv4(),
      name: `${sectionType} Section`,
      sectionType,
      position: { x: 50, y: 50 },
      dimensions: { width: 400, height: 300 },
      backgroundColor: '#f5f5f5',
      components: []
    };
    
    setSections(prev => [...prev, section]);
  };
  
  // Handle object selection
  const handleObjectsSelected = (objects: fabric.Object[]) => {
    console.log('Selected objects:', objects);
  };
  
  // Handle object modification
  const handleObjectModified = (object: fabric.Object) => {
    console.log('Modified object:', object);
    
    // Update section data if the modified object is a section
    if (object.data?.type === 'section') {
      const sectionId = object.data.id;
      
      setSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            position: { x: object.left || 0, y: object.top || 0 },
            dimensions: { 
              width: (object.width || 0) * (object.scaleX || 1), 
              height: (object.height || 0) * (object.scaleY || 1)
            }
          };
        }
        return section;
      }));
    }
  };
  
  return (
    <div className={cn("wireframe-editor-with-grid", className)}>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-3/4 space-y-4">
          <Card>
            <CardContent className="p-2">
              {canvas ? (
                <EnhancedCanvasEngine
                  width={width}
                  height={height}
                  canvasConfig={{
                    width,
                    height,
                    showGrid: gridConfig.visible,
                    snapToGrid: gridConfig.snapToGrid,
                    gridSize: gridConfig.size,
                    gridType: gridConfig.type as 'lines' | 'dots' | 'columns'
                  }}
                  sections={sections}
                  className="border rounded-md overflow-hidden"
                  onObjectsSelected={handleObjectsSelected}
                  onObjectModified={handleObjectModified}
                />
              ) : (
                <div className="flex items-center justify-center border rounded-md min-h-[600px] bg-muted/20">
                  {isInitializing ? 'Initializing canvas...' : 'Canvas not available'}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => addSection('header')}
            >
              Add Header
            </button>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => addSection('content')}
            >
              Add Content
            </button>
            <button 
              className="px-4 py-2 bg-amber-500 text-white rounded"
              onClick={() => addSection('gallery')}
            >
              Add Gallery
            </button>
            <button 
              className="px-4 py-2 bg-purple-500 text-white rounded"
              onClick={() => addSection('footer')}
            >
              Add Footer
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/4 space-y-4">
          <GridControl 
            gridConfig={gridConfig as GridConfiguration}
            onToggleVisibility={toggleGridVisibility}
            onToggleSnapToGrid={toggleSnapToGrid}
            onSizeChange={setGridSize}
            onTypeChange={setGridType}
            onColumnSettingsChange={updateColumnSettings}
          />
          
          <LayerManager 
            canvas={canvas}
            selectedObjects={selectedObjects}
          />
        </div>
      </div>
    </div>
  );
};

export default WireframeEditorWithGrid;
