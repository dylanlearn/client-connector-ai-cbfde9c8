import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PropertyPanel from './PropertyPanel';
import HistoryControls from './HistoryControls';
import { useGridActions } from '@/hooks/fabric/use-grid-actions';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

interface FabricDesignCanvasProps {
  onSave?: (canvasJson: any) => void;
  initialJson?: string;
  showRulers?: boolean;
  showPropertyPanel?: boolean;
}

const FabricDesignCanvas: React.FC<FabricDesignCanvasProps> = ({
  onSave,
  initialJson,
  showRulers = false,
  showPropertyPanel = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const { toast } = useToast();

  // Canvas configuration
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: 1600,
    height: 900,
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
    showRulers,
    rulerSize: 20,
    rulerColor: '#e0e0e0',
    rulerMarkings: true,
    historyEnabled: true,
    maxHistorySteps: 50,
  });

  // History stack
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Use the custom hook for grid actions
  const gridActions = useGridActions(
    (config) => setCanvasConfig((prev) => ({ ...prev, ...config })),
    canvasConfig
  );

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasConfig.width,
      height: canvasConfig.height,
      backgroundColor: canvasConfig.backgroundColor,
      selection: true,
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    // Add event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(canvas.getActiveObject());
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(canvas.getActiveObject());
    });

    canvas.on('selection:cleared', (e) => {
      setSelectedObject(null);
    });

    canvas.on('object:modified', () => {
      if (canvasConfig.historyEnabled) {
        saveToHistory();
      }
    });

    // Draw the grid
    const drawGrid = () => {
      if (!canvas || !canvasConfig.showGrid) return;

      const gridSize = canvasConfig.gridSize;
      const width = canvasConfig.width;
      const height = canvasConfig.height;

      // Remove existing grid
      const existingGrid = canvas.getObjects().filter(obj => obj.data?.isGrid);
      existingGrid.forEach(obj => canvas.remove(obj));

      // Draw new grid based on gridType
      if (canvasConfig.gridType === 'lines') {
        // Draw vertical lines
        for (let i = 0; i <= width; i += gridSize) {
          const line = new fabric.Line([i, 0, i, height], {
            stroke: canvasConfig.gridColor,
            selectable: false,
            evented: false,
            strokeWidth: 1,
            strokeDashArray: [2, 2],
            data: { isGrid: true },
          });
          canvas.add(line);
          line.sendToBack();
        }

        // Draw horizontal lines
        for (let i = 0; i <= height; i += gridSize) {
          const line = new fabric.Line([0, i, width, i], {
            stroke: canvasConfig.gridColor,
            selectable: false,
            evented: false,
            strokeWidth: 1,
            strokeDashArray: [2, 2],
            data: { isGrid: true },
          });
          canvas.add(line);
          line.sendToBack();
        }
      } else if (canvasConfig.gridType === 'dots') {
        // Draw dots
        for (let i = 0; i <= width; i += gridSize) {
          for (let j = 0; j <= height; j += gridSize) {
            const dot = new fabric.Circle({
              left: i,
              top: j,
              radius: 1,
              fill: canvasConfig.gridColor,
              selectable: false,
              evented: false,
              originX: 'center',
              originY: 'center',
              data: { isGrid: true },
            });
            canvas.add(dot);
            dot.sendToBack();
          }
        }
      } else if (canvasConfig.gridType === 'columns') {
        // Draw column guides (12-column system)
        const columnWidth = width / 12;
        const gutter = 20;
        
        for (let i = 0; i < 12; i++) {
          const x = i * columnWidth;
          const rect = new fabric.Rect({
            left: x + gutter / 2,
            top: 0,
            width: columnWidth - gutter,
            height: height,
            fill: 'rgba(0, 0, 255, 0.05)',
            selectable: false,
            evented: false,
            data: { isGrid: true },
          });
          canvas.add(rect);
          rect.sendToBack();
        }
      }

      canvas.renderAll();
    };

    // Draw rulers if enabled
    const drawRulers = () => {
      if (!canvas || !canvasConfig.showRulers) return;

      const rulerSize = canvasConfig.rulerSize || 20;
      const width = canvasConfig.width;
      const height = canvasConfig.height;

      // Remove existing rulers
      const existingRulers = canvas.getObjects().filter(obj => obj.data?.isRuler);
      existingRulers.forEach(obj => canvas.remove(obj));

      // Draw horizontal ruler background
      const horizontalRulerBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: width,
        height: rulerSize,
        fill: '#f8f8f8',
        selectable: false,
        evented: false,
        data: { isRuler: true },
      });
      canvas.add(horizontalRulerBg);
      
      // Draw vertical ruler background
      const verticalRulerBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: rulerSize,
        height: height,
        fill: '#f8f8f8',
        selectable: false,
        evented: false,
        data: { isRuler: true },
      });
      canvas.add(verticalRulerBg);

      // Draw corner square
      const cornerSquare = new fabric.Rect({
        left: 0,
        top: 0,
        width: rulerSize,
        height: rulerSize,
        fill: '#e0e0e0',
        selectable: false,
        evented: false,
        data: { isRuler: true },
      });
      canvas.add(cornerSquare);

      // Draw horizontal ruler markings
      if (canvasConfig.rulerMarkings) {
        for (let i = rulerSize; i < width; i += 100) {
          const line = new fabric.Line([i, 0, i, rulerSize], {
            stroke: canvasConfig.rulerColor || '#888',
            selectable: false,
            evented: false,
            strokeWidth: 1,
            data: { isRuler: true },
          });
          canvas.add(line);
          
          const text = new fabric.Text(i.toString(), {
            left: i + 2,
            top: 2,
            fontSize: 9,
            selectable: false,
            evented: false,
            data: { isRuler: true },
          });
          canvas.add(text);
        }

        // Draw smaller ticks every 20px
        for (let i = rulerSize; i < width; i += 20) {
          if (i % 100 !== 0) { // Skip positions where we already have major ticks
            const tickHeight = i % 50 === 0 ? rulerSize / 2 : rulerSize / 4;
            const line = new fabric.Line([i, 0, i, tickHeight], {
              stroke: canvasConfig.rulerColor || '#888',
              selectable: false,
              evented: false,
              strokeWidth: 1,
              data: { isRuler: true },
            });
            canvas.add(line);
          }
        }

        // Draw vertical ruler markings
        for (let i = rulerSize; i < height; i += 100) {
          const line = new fabric.Line([0, i, rulerSize, i], {
            stroke: canvasConfig.rulerColor || '#888',
            selectable: false,
            evented: false,
            strokeWidth: 1,
            data: { isRuler: true },
          });
          canvas.add(line);
          
          const text = new fabric.Text(i.toString(), {
            left: 2,
            top: i + 2,
            fontSize: 9,
            selectable: false,
            evented: false,
            data: { isRuler: true },
          });
          canvas.add(text);
        }

        // Draw smaller ticks every 20px
        for (let i = rulerSize; i < height; i += 20) {
          if (i % 100 !== 0) { // Skip positions where we already have major ticks
            const tickWidth = i % 50 === 0 ? rulerSize / 2 : rulerSize / 4;
            const line = new fabric.Line([0, i, tickWidth, i], {
              stroke: canvasConfig.rulerColor || '#888',
              selectable: false,
              evented: false,
              strokeWidth: 1,
              data: { isRuler: true },
            });
            canvas.add(line);
          }
        }
      }

      canvas.renderAll();
    };

    // Load initial JSON if provided
    if (initialJson) {
      try {
        canvas.loadFromJSON(initialJson, () => {
          canvas.renderAll();
          saveToHistory();
        });
      } catch (error) {
        console.error('Error loading canvas from JSON:', error);
      }
    } else {
      // Initialize with an empty state
      saveToHistory();
    }

    // Initial drawing of grid and rulers
    drawGrid();
    drawRulers();

    // Cleanup on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  // Update the grid when the configuration changes
  useEffect(() => {
    if (!fabricCanvas) return;

    // Function to redraw the grid
    const redrawGrid = () => {
      // Remove existing grid
      const existingGrid = fabricCanvas.getObjects().filter(obj => obj.data?.isGrid);
      existingGrid.forEach(obj => fabricCanvas.remove(obj));

      if (!canvasConfig.showGrid) {
        fabricCanvas.renderAll();
        return;
      }

      const gridSize = canvasConfig.gridSize;
      const width = canvasConfig.width;
      const height = canvasConfig.height;

      // Draw based on gridType
      if (canvasConfig.gridType === 'lines') {
        // Draw vertical lines
        for (let i = 0; i <= width; i += gridSize) {
          const line = new fabric.Line([i, 0, i, height], {
            stroke: canvasConfig.gridColor,
            selectable: false,
            evented: false,
            strokeWidth: 1,
            strokeDashArray: [2, 2],
            data: { isGrid: true },
          });
          fabricCanvas.add(line);
          line.sendToBack();
        }

        // Draw horizontal lines
        for (let i = 0; i <= height; i += gridSize) {
          const line = new fabric.Line([0, i, width, i], {
            stroke: canvasConfig.gridColor,
            selectable: false,
            evented: false,
            strokeWidth: 1,
            strokeDashArray: [2, 2],
            data: { isGrid: true },
          });
          fabricCanvas.add(line);
          line.sendToBack();
        }
      } else if (canvasConfig.gridType === 'dots') {
        // Draw dots
        for (let i = 0; i <= width; i += gridSize) {
          for (let j = 0; j <= height; j += gridSize) {
            const dot = new fabric.Circle({
              left: i,
              top: j,
              radius: 1,
              fill: canvasConfig.gridColor,
              selectable: false,
              evented: false,
              originX: 'center',
              originY: 'center',
              data: { isGrid: true },
            });
            fabricCanvas.add(dot);
            dot.sendToBack();
          }
        }
      } else if (canvasConfig.gridType === 'columns') {
        // Draw column guides (12-column system)
        const columnWidth = width / 12;
        const gutter = 20;
        
        for (let i = 0; i < 12; i++) {
          const x = i * columnWidth;
          const rect = new fabric.Rect({
            left: x + gutter / 2,
            top: 0,
            width: columnWidth - gutter,
            height: height,
            fill: 'rgba(0, 0, 255, 0.05)',
            selectable: false,
            evented: false,
            data: { isGrid: true },
          });
          fabricCanvas.add(rect);
          rect.sendToBack();
        }
      }

      fabricCanvas.renderAll();
    };

    redrawGrid();
  }, [fabricCanvas, canvasConfig.showGrid, canvasConfig.gridSize, canvasConfig.gridType, canvasConfig.gridColor]);

  // Update rulers when configuration changes
  useEffect(() => {
    if (!fabricCanvas) return;

    const redrawRulers = () => {
      // Remove existing rulers
      const existingRulers = fabricCanvas.getObjects().filter(obj => obj.data?.isRuler);
      existingRulers.forEach(obj => fabricCanvas.remove(obj));

      if (!canvasConfig.showRulers) {
        fabricCanvas.renderAll();
        return;
      }

      const rulerSize = canvasConfig.rulerSize || 20;
      const width = canvasConfig.width;
      const height = canvasConfig.height;

      // Draw horizontal ruler background
      const horizontalRulerBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: width,
        height: rulerSize,
        fill: '#f8f8f8',
        selectable: false,
        evented: false,
        data: { isRuler: true },
      });
      fabricCanvas.add(horizontalRulerBg);
      
      // Draw vertical ruler background
      const verticalRulerBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: rulerSize,
        height: height,
        fill: '#f8f8f8',
        selectable: false,
        evented: false,
        data: { isRuler: true },
      });
      fabricCanvas.add(verticalRulerBg);

      // Draw corner square
      const cornerSquare = new fabric.Rect({
        left: 0,
        top: 0,
        width: rulerSize,
        height: rulerSize,
        fill: '#e0e0e0',
        selectable: false,
        evented: false,
        data: { isRuler: true },
      });
      fabricCanvas.add(cornerSquare);

      // Draw ruler markings if enabled
      if (canvasConfig.rulerMarkings) {
        // Horizontal markings
        for (let i = rulerSize; i < width; i += 100) {
          const line = new fabric.Line([i, 0, i, rulerSize], {
            stroke: canvasConfig.rulerColor || '#888',
            selectable: false,
            evented: false,
            strokeWidth: 1,
            data: { isRuler: true },
          });
          fabricCanvas.add(line);
          
          const text = new fabric.Text(i.toString(), {
            left: i + 2,
            top: 2,
            fontSize: 9,
            selectable: false,
            evented: false,
            data: { isRuler: true },
          });
          fabricCanvas.add(text);
        }

        // Smaller ticks
        for (let i = rulerSize; i < width; i += 20) {
          if (i % 100 !== 0) {
            const tickHeight = i % 50 === 0 ? rulerSize / 2 : rulerSize / 4;
            const line = new fabric.Line([i, 0, i, tickHeight], {
              stroke: canvasConfig.rulerColor || '#888',
              selectable: false,
              evented: false,
              strokeWidth: 1,
              data: { isRuler: true },
            });
            fabricCanvas.add(line);
          }
        }

        // Vertical markings
        for (let i = rulerSize; i < height; i += 100) {
          const line = new fabric.Line([0, i, rulerSize, i], {
            stroke: canvasConfig.rulerColor || '#888',
            selectable: false,
            evented: false,
            strokeWidth: 1,
            data: { isRuler: true },
          });
          fabricCanvas.add(line);
          
          const text = new fabric.Text(i.toString(), {
            left: 2,
            top: i + 2,
            fontSize: 9,
            selectable: false,
            evented: false,
            data: { isRuler: true },
          });
          fabricCanvas.add(text);
        }

        // Smaller ticks
        for (let i = rulerSize; i < height; i += 20) {
          if (i % 100 !== 0) {
            const tickWidth = i % 50 === 0 ? rulerSize / 2 : rulerSize / 4;
            const line = new fabric.Line([0, i, tickWidth, i], {
              stroke: canvasConfig.rulerColor || '#888',
              selectable: false,
              evented: false,
              strokeWidth: 1,
              data: { isRuler: true },
            });
            fabricCanvas.add(line);
          }
        }
      }

      fabricCanvas.renderAll();
    };

    redrawRulers();
  }, [fabricCanvas, canvasConfig.showRulers, canvasConfig.rulerSize, canvasConfig.rulerColor, canvasConfig.rulerMarkings]);

  // History management functions
  const saveToHistory = () => {
    if (!fabricCanvas || !canvasConfig.historyEnabled) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON(['data']));
    
    // If we're in the middle of the history stack, truncate
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    
    // Limit history size
    if (newHistory.length > canvasConfig.maxHistorySteps) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCanUndo(newHistory.length > 1);
    setCanRedo(false);
  };

  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    const json = history[newIndex];
    
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(newIndex);
      setCanUndo(newIndex > 0);
      setCanRedo(true);
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    const json = history[newIndex];
    
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(newIndex);
      setCanUndo(true);
      setCanRedo(newIndex < history.length - 1);
    });
  };

  const handleSave = () => {
    if (!fabricCanvas || !onSave) return;
    
    const json = fabricCanvas.toJSON(['data']);
    onSave(json);
    
    toast({
      title: 'Canvas Saved',
      description: 'Your design has been saved successfully.'
    });
  };

  const handleAddRectangle = () => {
    if (!fabricCanvas) return;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'rgba(0, 123, 255, 0.5)',
      stroke: '#0066cc',
      strokeWidth: 1,
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 8,
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
    saveToHistory();
  };

  const handleAddCircle = () => {
    if (!fabricCanvas) return;

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'rgba(40, 167, 69, 0.5)',
      stroke: '#28a745',
      strokeWidth: 1,
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 8,
    });

    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
    saveToHistory();
  };

  const handleAddText = () => {
    if (!fabricCanvas) return;

    const text = new fabric.Textbox('Edit this text', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fontFamily: 'Arial',
      fill: '#212529',
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 8,
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    saveToHistory();
  };

  const handleAddLine = () => {
    if (!fabricCanvas) return;

    const line = new fabric.Line([50, 50, 200, 200], {
      stroke: '#212529',
      strokeWidth: 2,
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerSize: 8,
    });

    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
    fabricCanvas.renderAll();
    saveToHistory();
  };

  const handleClear = () => {
    if (!fabricCanvas) return;

    // Keep only grid and ruler objects
    const objectsToKeep = fabricCanvas.getObjects().filter(
      obj => obj.data?.isGrid || obj.data?.isRuler
    );

    fabricCanvas.clear();

    // Re-add grid and ruler objects
    objectsToKeep.forEach(obj => {
      fabricCanvas.add(obj);
    });

    fabricCanvas.renderAll();
    saveToHistory();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col">
        <div className="border-b pb-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleAddRectangle}>Rectangle</Button>
            <Button size="sm" onClick={handleAddCircle}>Circle</Button>
            <Button size="sm" onClick={handleAddText}>Text</Button>
            <Button size="sm" onClick={handleAddLine}>Line</Button>
          </div>

          <HistoryControls
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleClear}>Clear</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto border rounded-lg mt-4">
          <canvas ref={canvasRef} />
        </div>

        <div className="border-t pt-2 mt-2 flex justify-between">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={canvasConfig.showGrid}
                onChange={() => gridActions.toggleGrid()}
              />
              Show Grid
            </label>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={canvasConfig.snapToGrid}
                onChange={() => gridActions.toggleSnapToGrid()}
              />
              Snap to Grid
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Grid Size:</span>
            <select
              value={canvasConfig.gridSize}
              onChange={(e) => gridActions.setGridSize(parseInt(e.target.value))}
              className="p-1 border rounded"
            >
              <option value="5">5px</option>
              <option value="10">10px</option>
              <option value="20">20px</option>
              <option value="50">50px</option>
            </select>
          </div>
        </div>
      </div>

      {showPropertyPanel && (
        <div className="w-full md:w-72 flex-shrink-0">
          <PropertyPanel 
            selectedObject={selectedObject}
            fabricCanvas={fabricCanvas}
          />
        </div>
      )}
    </div>
  );
};

export default FabricDesignCanvas;
