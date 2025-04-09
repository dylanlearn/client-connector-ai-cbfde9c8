
import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { useFabric } from '@/hooks/use-fabric';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyPanel from './PropertyPanel';

interface FabricDesignCanvasProps {
  projectId?: string;
  onSave?: (data: any) => void;
  readOnly?: boolean;
  showToolbar?: boolean;
  fullWidth?: boolean;
}

const FabricDesignCanvas: React.FC<FabricDesignCanvasProps> = ({
  projectId,
  onSave,
  readOnly = false,
  showToolbar = true,
  fullWidth = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const { toast } = useToast();

  // Use our hooks
  const {
    canvasConfig,
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    toggleRulers,
    setBackgroundColor,
    setZoom,
    setPanOffset,
    setGridColor
  } = useFabric({
    initialConfig: {
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
    }
  });

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || readOnly) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasConfig.width,
      height: canvasConfig.height,
      backgroundColor: canvasConfig.backgroundColor,
      selection: true,
      preserveObjectStacking: true
    });

    // Add event handlers
    canvas.on('object:selected', (e) => {
      setSelectedObject(e.target);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasConfig.width, canvasConfig.height, canvasConfig.backgroundColor, readOnly]);

  // Draw grid lines
  useEffect(() => {
    if (!fabricCanvas || !canvasConfig.showGrid) return;

    // Clear existing grid
    const existingGrid = fabricCanvas.getObjects().filter(obj => obj.data?.isGrid);
    existingGrid.forEach(obj => fabricCanvas.remove(obj));

    if (canvasConfig.gridType === 'lines') {
      // Vertical lines
      for (let i = 0; i <= canvasConfig.width; i += canvasConfig.gridSize) {
        const line = new fabric.Line([i, 0, i, canvasConfig.height], {
          stroke: canvasConfig.gridColor,
          selectable: false,
          evented: false,
          strokeWidth: i % (canvasConfig.gridSize * 5) === 0 ? 1 : 0.5,
          data: { isGrid: true }
        });
        fabricCanvas.add(line);
        line.sendToBack();
      }

      // Horizontal lines
      for (let i = 0; i <= canvasConfig.height; i += canvasConfig.gridSize) {
        const line = new fabric.Line([0, i, canvasConfig.width, i], {
          stroke: canvasConfig.gridColor,
          selectable: false,
          evented: false,
          strokeWidth: i % (canvasConfig.gridSize * 5) === 0 ? 1 : 0.5,
          data: { isGrid: true }
        });
        fabricCanvas.add(line);
        line.sendToBack();
      }
    } else if (canvasConfig.gridType === 'dots') {
      for (let i = 0; i <= canvasConfig.width; i += canvasConfig.gridSize) {
        for (let j = 0; j <= canvasConfig.height; j += canvasConfig.gridSize) {
          const isMajor = i % (canvasConfig.gridSize * 5) === 0 && j % (canvasConfig.gridSize * 5) === 0;
          const circle = new fabric.Circle({
            left: i - 1,
            top: j - 1,
            radius: isMajor ? 2 : 1,
            fill: canvasConfig.gridColor,
            selectable: false,
            evented: false,
            data: { isGrid: true }
          });
          fabricCanvas.add(circle);
          circle.sendToBack();
        }
      }
    } else if (canvasConfig.gridType === 'columns') {
      const columnWidth = canvasConfig.gridSize * 6;
      const gutterWidth = canvasConfig.gridSize * 2;
      const numColumns = Math.floor(canvasConfig.width / (columnWidth + gutterWidth));
      
      for (let i = 0; i < numColumns; i++) {
        const left = i * (columnWidth + gutterWidth) + gutterWidth;
        const rect = new fabric.Rect({
          left: left,
          top: 0,
          width: columnWidth,
          height: canvasConfig.height,
          fill: canvasConfig.gridColor,
          opacity: 0.1,
          selectable: false,
          evented: false,
          data: { isGrid: true }
        });
        fabricCanvas.add(rect);
        rect.sendToBack();
      }
    }

    fabricCanvas.renderAll();
  }, [fabricCanvas, canvasConfig.showGrid, canvasConfig.gridSize, canvasConfig.gridType, canvasConfig.width, canvasConfig.height, canvasConfig.gridColor]);

  // Draw rulers
  useEffect(() => {
    if (!fabricCanvas || !canvasConfig.showRulers) return;

    // Clear existing rulers
    const existingRulers = fabricCanvas.getObjects().filter(obj => obj.data?.isRuler);
    existingRulers.forEach(obj => fabricCanvas.remove(obj));

    const rulerSize = canvasConfig.rulerSize || 20;
    const rulerColor = canvasConfig.rulerColor || '#bbbbbb';

    // Horizontal ruler background
    const hRulerBg = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvasConfig.width,
      height: rulerSize,
      fill: '#f5f5f5',
      selectable: false,
      evented: false,
      data: { isRuler: true }
    });
    
    // Vertical ruler background
    const vRulerBg = new fabric.Rect({
      left: 0,
      top: 0,
      width: rulerSize,
      height: canvasConfig.height,
      fill: '#f5f5f5',
      selectable: false,
      evented: false,
      data: { isRuler: true }
    });

    fabricCanvas.add(hRulerBg, vRulerBg);

    if (canvasConfig.rulerMarkings) {
      // Add markings to horizontal ruler
      for (let i = 0; i <= canvasConfig.width; i += 10) {
        if (i === 0) continue;
        const isMajor = i % 50 === 0;
        const line = new fabric.Line([
          i, 
          isMajor ? 0 : rulerSize / 2, 
          i, 
          rulerSize
        ], {
          stroke: rulerColor,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          data: { isRuler: true }
        });
        
        fabricCanvas.add(line);
        
        if (isMajor) {
          const text = new fabric.Text(String(i), {
            left: i - 10,
            top: 2,
            fontSize: 8,
            selectable: false,
            evented: false,
            fill: rulerColor,
            data: { isRuler: true }
          });
          fabricCanvas.add(text);
        }
      }
      
      // Add markings to vertical ruler
      for (let i = 0; i <= canvasConfig.height; i += 10) {
        if (i === 0) continue;
        const isMajor = i % 50 === 0;
        const line = new fabric.Line([
          isMajor ? 0 : rulerSize / 2, 
          i, 
          rulerSize, 
          i
        ], {
          stroke: rulerColor,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          data: { isRuler: true }
        });
        
        fabricCanvas.add(line);
        
        if (isMajor) {
          const text = new fabric.Text(String(i), {
            left: 2,
            top: i - 10,
            fontSize: 8,
            selectable: false,
            evented: false,
            fill: rulerColor,
            angle: 0,
            data: { isRuler: true }
          });
          fabricCanvas.add(text);
        }
      }
    }

    fabricCanvas.renderAll();
  }, [fabricCanvas, canvasConfig.showRulers, canvasConfig.rulerSize, canvasConfig.rulerColor, canvasConfig.rulerMarkings, canvasConfig.width, canvasConfig.height]);

  // Add basic shapes
  const addRect = () => {
    if (!fabricCanvas) return;
    
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3498db',
      stroke: '#2980b9',
      strokeWidth: 1,
      rx: 0,
      ry: 0,
      originX: 'left',
      originY: 'top'
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
  };
  
  const addCircle = () => {
    if (!fabricCanvas) return;
    
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#e74c3c',
      stroke: '#c0392b',
      strokeWidth: 1,
      originX: 'center',
      originY: 'center'
    });
    
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
  };
  
  const addTriangle = () => {
    if (!fabricCanvas) return;
    
    const triangle = new fabric.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#2ecc71',
      stroke: '#27ae60',
      strokeWidth: 1
    });
    
    fabricCanvas.add(triangle);
    fabricCanvas.setActiveObject(triangle);
    fabricCanvas.renderAll();
  };
  
  const addText = () => {
    if (!fabricCanvas) return;
    
    const text = new fabric.Textbox('Edit this text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#333333',
      width: 200
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };
  
  const addLine = () => {
    if (!fabricCanvas) return;
    
    const line = new fabric.Line([50, 100, 200, 100], {
      stroke: '#333333',
      strokeWidth: 2
    });
    
    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
    fabricCanvas.renderAll();
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    // Remove all objects except grid and rulers
    const objectsToRemove = fabricCanvas.getObjects().filter(
      obj => !obj.data?.isGrid && !obj.data?.isRuler
    );
    
    objectsToRemove.forEach(obj => {
      fabricCanvas.remove(obj);
    });
    
    fabricCanvas.renderAll();
    
    toast({
      title: "Canvas Cleared",
      description: "All design elements have been removed."
    });
  };

  const handleSave = () => {
    if (!fabricCanvas || !onSave) return;
    
    // Save only non-grid and non-ruler objects
    const objectsToSave = fabricCanvas.getObjects().filter(
      obj => !obj.data?.isGrid && !obj.data?.isRuler
    );
    
    const saveData = {
      objects: objectsToSave.map(obj => obj.toJSON(['data'])),
      canvasConfig
    };
    
    onSave(saveData);
  };

  const deleteSelectedObject = () => {
    if (!fabricCanvas || !selectedObject) return;
    
    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    fabricCanvas.renderAll();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!fabricCanvas || readOnly) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedObject) {
        deleteSelectedObject();
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvas, selectedObject, readOnly]);

  return (
    <div className={`fabric-design-canvas ${fullWidth ? 'w-full' : ''}`}>
      {showToolbar && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={addRect}>Rectangle</Button>
          <Button variant="outline" size="sm" onClick={addCircle}>Circle</Button>
          <Button variant="outline" size="sm" onClick={addTriangle}>Triangle</Button>
          <Button variant="outline" size="sm" onClick={addText}>Text</Button>
          <Button variant="outline" size="sm" onClick={addLine}>Line</Button>
          <Button variant="outline" size="sm" onClick={toggleGrid}>
            {canvasConfig.showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleSnapToGrid}>
            {canvasConfig.snapToGrid ? 'Disable Snap' : 'Enable Snap'}
          </Button>
          <Button variant="outline" size="sm" onClick={clearCanvas}>Clear</Button>
          {onSave && (
            <Button className="ml-auto" size="sm" onClick={handleSave}>Save</Button>
          )}
        </div>
      )}
      
      <div className="flex" style={{ height: '600px' }}>
        <div ref={containerRef} className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
          <div className="relative">
            <canvas ref={canvasRef} />
          </div>
        </div>
        
        {!readOnly && selectedObject && (
          <div className="w-72 border-l bg-background">
            <PropertyPanel selectedObject={selectedObject} fabricCanvas={fabricCanvas} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricDesignCanvas;
