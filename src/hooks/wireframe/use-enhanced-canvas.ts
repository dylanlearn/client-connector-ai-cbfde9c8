import { useState, useRef, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useToast } from '@/hooks/use-toast';
import { useDragDrop } from './use-drag-drop';
import { useSelection } from './use-selection';
import { useComponentRegistry } from './use-component-registry';
import { createCanvasGrid } from '@/components/wireframe/utils/grid-utils';

/**
 * Enhanced hook for managing the wireframe canvas with drag-drop and selection
 */
export function useEnhancedCanvas(config: Partial<WireframeCanvasConfig> = {}) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  
  // Default configuration with all required properties
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: config.width || 1200,
    height: config.height || 800,
    zoom: config.zoom || 1,
    panOffset: config.panOffset || { x: 0, y: 0 },
    showGrid: config.showGrid !== undefined ? config.showGrid : true,
    snapToGrid: config.snapToGrid !== undefined ? config.snapToGrid : true,
    gridSize: config.gridSize || 10,
    gridType: config.gridType || 'lines',
    snapTolerance: config.snapTolerance || 5,
    backgroundColor: config.backgroundColor || '#ffffff',
    showSmartGuides: config.showSmartGuides !== undefined ? config.showSmartGuides : true,
    gridColor: config.gridColor || '#e0e0e0',
    showRulers: config.showRulers !== undefined ? config.showRulers : true,
    rulerSize: config.rulerSize || 20,
    rulerColor: config.rulerColor || '#bbbbbb',
    rulerMarkings: config.rulerMarkings !== undefined ? config.rulerMarkings : true
  });
  
  // Initialize canvas
  const initializeCanvas = useCallback((canvasElement?: HTMLCanvasElement) => {
    const element = canvasElement || canvasRef.current;
    if (!element) return null;
    
    const fabricCanvas = new fabric.Canvas(element, {
      width: canvasConfig.width,
      height: canvasConfig.height,
      backgroundColor: canvasConfig.backgroundColor,
      selection: true,  // Enable multi-selection
      preserveObjectStacking: true
    });
    
    setCanvas(fabricCanvas);
    
    // Apply zoom and pan
    if (canvasConfig.zoom !== 1) {
      fabricCanvas.setZoom(canvasConfig.zoom);
    }
    
    if (canvasConfig.panOffset.x !== 0 || canvasConfig.panOffset.y !== 0) {
      fabricCanvas.absolutePan(new fabric.Point(canvasConfig.panOffset.x, canvasConfig.panOffset.y));
    }
    
    // Add grid if enabled
    if (canvasConfig.showGrid) {
      const gridLines = createCanvasGrid(
        fabricCanvas, 
        canvasConfig.gridSize, 
        canvasConfig.gridType,
        canvasConfig.gridColor
      );
      gridLines.forEach(line => fabricCanvas.add(line));
    }
    
    // Apply snap to grid if enabled
    if (canvasConfig.snapToGrid) {
      fabricCanvas.on('object:moving', (options) => {
        if (options.target) {
          const gridSize = canvasConfig.gridSize;
          const target = options.target;
          
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    }
    
    return fabricCanvas;
  }, [canvasConfig]);
  
  // Handle canvas updates when configuration changes
  useEffect(() => {
    if (!canvas) return;
    
    // Update canvas properties based on config
    canvas.backgroundColor = canvasConfig.backgroundColor;
    
    // Update zoom
    canvas.setZoom(canvasConfig.zoom);
    
    // Update grid
    const existingGridLines = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
    existingGridLines.forEach(line => canvas.remove(line));
    
    if (canvasConfig.showGrid) {
      const gridLines = createCanvasGrid(
        canvas, 
        canvasConfig.gridSize, 
        canvasConfig.gridType,
        canvasConfig.gridColor
      );
      gridLines.forEach(line => canvas.add(line));
    }
    
    // Update snap to grid behavior
    canvas.off('object:moving');
    if (canvasConfig.snapToGrid) {
      canvas.on('object:moving', (options) => {
        if (options.target) {
          const gridSize = canvasConfig.gridSize;
          const target = options.target;
          
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    }
    
    canvas.renderAll();
  }, [canvas, canvasConfig]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas]);
  
  // Initialize our hooks
  const dragDrop = useDragDrop(canvas);
  const selection = useSelection(canvas);
  const componentRegistry = useComponentRegistry();
  
  // Update canvas configuration
  const updateConfig = useCallback((newConfig: Partial<WireframeCanvasConfig>) => {
    setCanvasConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  // Render wireframe data to canvas
  const renderWireframe = useCallback((wireframe: WireframeData) => {
    if (!canvas || !wireframe.sections) return false;
    
    try {
      // Clear canvas (but keep grid if enabled)
      const nonGridObjects = canvas.getObjects().filter(obj => obj.data?.type !== 'grid');
      nonGridObjects.forEach(obj => canvas.remove(obj));
      
      // Render each section as a rectangle
      wireframe.sections.forEach(section => {
        // Default position and dimensions
        const x = section.position?.x || section.x || 0;
        const y = section.position?.y || section.y || 0;
        const width = section.dimensions?.width || section.width || 200;
        const height = section.dimensions?.height || section.height || 150;
        
        // Create section rectangle
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width,
          height,
          fill: section.backgroundColor || section.style?.backgroundColor || 'rgba(240, 240, 240, 0.5)',
          stroke: '#ccc',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
          data: {
            type: 'section',
            id: section.id,
            name: section.name,
            sectionType: section.sectionType
          }
        });
        
        // Create section label
        const label = new fabric.Text(section.name || 'Section', {
          left: x + 10,
          top: y + 10,
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#333'
        });
        
        // Group the section with its label
        const group = new fabric.Group([rect, label], {
          left: x,
          top: y
        });
        
        // Add to canvas
        canvas.add(group);
      });
      
      canvas.renderAll();
      
      toast({
        title: "Wireframe Rendered",
        description: "Wireframe loaded successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Error rendering wireframe:", error);
      
      toast({
        title: "Error",
        description: "Failed to render wireframe",
        variant: "destructive"
      });
      
      return false;
    }
  }, [canvas, toast]);
  
  // Export canvas data
  const exportCanvasData = useCallback(() => {
    if (!canvas) return null;
    
    // Export canvas as JSON
    const canvasData = canvas.toJSON(['data', 'id', 'name', 'sectionType']);
    
    // Extract wireframe structure from canvas objects
    const sections = canvas.getObjects()
      .filter(obj => obj.data?.type === 'section')
      .map(obj => ({
        id: obj.data?.id || '',
        name: obj.data?.name || 'Section',
        sectionType: obj.data?.sectionType || 'generic',
        position: { x: obj.left || 0, y: obj.top || 0 },
        dimensions: { width: obj.width || 200, height: obj.height || 150 }
      }));
    
    return {
      canvasData,
      wireframeData: {
        sections
      }
    };
  }, [canvas]);
  
  return {
    canvasRef,
    canvas,
    canvasConfig,
    updateConfig,
    initializeCanvas,
    renderWireframe,
    exportCanvasData,
    ...dragDrop,
    ...selection,
    ...componentRegistry
  };
}
