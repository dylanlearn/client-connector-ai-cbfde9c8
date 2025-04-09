
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { 
  renderSectionToFabric,
  objectToFabric,
  fabricToObject,
  componentToFabricObject
} from '../utils/fabric-converters';
import DragEnhancementHandler from './DragEnhancementHandler';
import useCanvasHistory from '@/hooks/wireframe/use-canvas-history';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EnhancedCanvasEngineProps {
  width?: number;
  height?: number;
  canvasConfig?: Partial<WireframeCanvasConfig>;
  sections?: any[];
  components?: any[];
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onObjectSelected?: (obj: fabric.Object | null) => void;
  onCanvasChanged?: (canvas: fabric.Canvas) => void;
  className?: string;
}

const EnhancedCanvasEngine: React.FC<EnhancedCanvasEngineProps> = ({
  width = 1200,
  height = 800,
  canvasConfig,
  sections = [],
  components = [],
  onCanvasReady,
  onObjectSelected,
  onCanvasChanged,
  className
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  // Merge default config with provided config
  const defaultConfig: WireframeCanvasConfig = useMemo(() => ({
    width,
    height,
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    gridType: 'lines',
    snapTolerance: 5,
    backgroundColor: '#ffffff',
    showSmartGuides: true,
    showRulers: true,
    rulerSize: 20,
    rulerColor: '#888888',
    rulerMarkings: true,
    historyEnabled: true,
    maxHistorySteps: 50
  }), [width, height]);
  
  const [config, setConfig] = useState<WireframeCanvasConfig>({
    ...defaultConfig,
    ...canvasConfig
  });
  
  // Initialize canvas history
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    saveHistoryState 
  } = useCanvasHistory({ 
    canvas, 
    maxHistorySteps: config.maxHistorySteps || 50,
    saveInitialState: true
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: config.width,
      height: config.height,
      backgroundColor: config.backgroundColor,
      selection: true,
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    
    // Set up event listeners
    fabricCanvas.on('selection:created', (e) => {
      const selectedObj = e.selected?.[0] || null;
      setSelectedObject(selectedObj);
      
      if (onObjectSelected) {
        onObjectSelected(selectedObj);
      }
    });
    
    fabricCanvas.on('selection:updated', (e) => {
      const selectedObj = e.selected?.[0] || null;
      setSelectedObject(selectedObj);
      
      if (onObjectSelected) {
        onObjectSelected(selectedObj);
      }
    });
    
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
      
      if (onObjectSelected) {
        onObjectSelected(null);
      }
    });
    
    fabricCanvas.on('object:modified', () => {
      saveHistoryState('Object modified');
      if (onCanvasChanged) {
        onCanvasChanged(fabricCanvas);
      }
    });
    
    // Add mouse event handlers for panning
    fabricCanvas.on('mouse:down', (e) => {
      if (e.e.altKey) {
        setIsPanning(true);
        fabricCanvas.defaultCursor = 'grabbing';
        fabricCanvas.selection = false;
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
      }
    });
    
    fabricCanvas.on('mouse:move', (e) => {
      if (isPanning && e.e.buttons === 1) {
        const delta = new fabric.Point(e.e.movementX, e.e.movementY);
        fabricCanvas.relativePan(delta);
        
        setConfig(prev => ({
          ...prev,
          panOffset: {
            x: (prev.panOffset.x || 0) + e.e.movementX,
            y: (prev.panOffset.y || 0) + e.e.movementY
          }
        }));
      }
    });
    
    fabricCanvas.on('mouse:up', () => {
      if (isPanning) {
        setIsPanning(false);
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.selection = true;
      }
    });
    
    // Mouse wheel for zoom
    fabricCanvas.on('mouse:wheel', (e) => {
      if (!e.e.ctrlKey) return;
      
      e.e.preventDefault();
      e.e.stopPropagation();
      
      const delta = e.e.deltaY;
      let zoom = fabricCanvas.getZoom();
      zoom = delta > 0 ? Math.max(0.1, zoom - 0.1) : Math.min(3, zoom + 0.1);
      
      fabricCanvas.zoomToPoint(
        new fabric.Point(e.e.offsetX, e.e.offsetY),
        zoom
      );
      
      setConfig(prev => ({
        ...prev,
        zoom
      }));
    });
    
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas);
    }
    
    // Save initial state for history
    saveHistoryState('Initial canvas state');
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [config.width, config.height, config.backgroundColor, onObjectSelected, onCanvasReady, saveHistoryState, onCanvasChanged]);
  
  // Render sections to canvas
  useEffect(() => {
    if (!canvas || !sections.length) return;
    
    try {
      // Clear existing sections
      const existingSections = canvas.getObjects().filter(obj => 
        (obj as any).data?.type === 'section'
      );
      
      existingSections.forEach(obj => canvas.remove(obj));
      
      // Add new sections
      sections.forEach((section) => {
        renderSectionToFabric(canvas, section, {
          darkMode: config.backgroundColor === '#333333',
          showGrid: config.showGrid,
          gridSize: config.gridSize,
          showBorders: true
        });
      });
      
      canvas.renderAll();
      saveHistoryState('Sections rendered');
    } catch (error) {
      console.error('Error rendering sections:', error);
      toast({
        title: "Error",
        description: "Failed to render sections",
        variant: "destructive"
      });
    }
  }, [canvas, sections, config.backgroundColor, config.showGrid, config.gridSize, saveHistoryState, toast]);
  
  // Render components to canvas
  useEffect(() => {
    if (!canvas || !components.length) return;
    
    try {
      // Clear existing components
      const existingComponents = canvas.getObjects().filter(obj => 
        (obj as any).data?.componentType
      );
      
      existingComponents.forEach(obj => canvas.remove(obj));
      
      // Add new components
      components.forEach((component) => {
        if (!component) return;
        const fabricObj = componentToFabricObject(component);
        canvas.add(fabricObj);
      });
      
      canvas.renderAll();
      saveHistoryState('Components rendered');
    } catch (error) {
      console.error('Error rendering components:', error);
      toast({
        title: "Error",
        description: "Failed to render components",
        variant: "destructive"
      });
    }
  }, [canvas, components, saveHistoryState, toast]);
  
  // Update canvas when config changes
  useEffect(() => {
    if (!canvas) return;
    
    // Update canvas background
    canvas.setBackgroundColor(config.backgroundColor, () => {
      canvas.renderAll();
    });
    
    // Update canvas dimensions if they changed
    if (canvas.getWidth() !== config.width || canvas.getHeight() !== config.height) {
      canvas.setDimensions({
        width: config.width,
        height: config.height
      });
    }
    
    // Update zoom level
    if (canvas.getZoom() !== config.zoom) {
      canvas.setZoom(config.zoom);
      canvas.renderAll();
    }
  }, [canvas, config.backgroundColor, config.width, config.height, config.zoom]);
  
  // Expose undo/redo methods to parent
  useEffect(() => {
    if (!canvas) return;
    
    (canvas as any).undo = undo;
    (canvas as any).redo = redo;
    (canvas as any).canUndo = canUndo;
    (canvas as any).canRedo = canRedo;
  }, [canvas, undo, redo, canUndo, canRedo]);
  
  return (
    <div className={cn("enhanced-canvas-engine relative", className)}>
      <canvas 
        ref={canvasRef} 
        className={cn(
          "border shadow-sm", 
          isPanning && "cursor-grabbing"
        )} 
      />
      
      {canvas && config.showSmartGuides && (
        <DragEnhancementHandler
          canvas={canvas}
          snapToGrid={config.snapToGrid}
          gridSize={config.gridSize}
          snapToObjects={true}
          snapTolerance={config.snapTolerance}
          showSmartGuides={config.showSmartGuides}
        />
      )}
    </div>
  );
};

export default EnhancedCanvasEngine;
