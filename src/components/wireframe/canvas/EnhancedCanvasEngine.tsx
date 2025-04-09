
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { useWireframeStore } from '@/stores/wireframe-store';
import { useToast } from '@/hooks/use-toast';
import GridSystem, { GridType } from './GridSystem';
import { componentToFabricObject } from '../utils/fabric-converters';

interface GuidelinePosition {
  position: number;
  orientation: 'horizontal' | 'vertical';
}

interface CanvasConfig {
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  gridType: GridType;
  showSmartGuides: boolean;
  snapTolerance: number;
}

interface EnhancedCanvasEngineProps {
  width?: number;
  height?: number;
  editable?: boolean;
  darkMode?: boolean;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onObjectSelected?: (obj: fabric.Object | null) => void;
  initialConfig?: Partial<CanvasConfig>;
  onConfigChange?: (config: CanvasConfig) => void;
}

const EnhancedCanvasEngine: React.FC<EnhancedCanvasEngineProps> = ({
  width = 1200,
  height = 800,
  editable = true,
  darkMode = false,
  onCanvasReady,
  onObjectSelected,
  initialConfig,
  onConfigChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [guidelines, setGuidelines] = useState<GuidelinePosition[]>([]);
  const { toast } = useToast();
  
  // Default configuration
  const [config, setConfig] = useState<CanvasConfig>({
    zoom: initialConfig?.zoom || 1,
    panOffset: initialConfig?.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig?.showGrid !== undefined ? initialConfig.showGrid : true,
    snapToGrid: initialConfig?.snapToGrid !== undefined ? initialConfig.snapToGrid : true,
    gridSize: initialConfig?.gridSize || 10,
    gridType: initialConfig?.gridType || 'lines',
    showSmartGuides: initialConfig?.showSmartGuides !== undefined ? initialConfig.showSmartGuides : true,
    snapTolerance: initialConfig?.snapTolerance || 5
  });
  
  // Update config and notify parent
  const updateConfig = useCallback((updates: Partial<CanvasConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      if (onConfigChange) {
        onConfigChange(newConfig);
      }
      return newConfig;
    });
  }, [onConfigChange]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        selection: editable,
        preserveObjectStacking: true
      });
      
      // Apply initial zoom and pan
      fabricCanvas.setZoom(config.zoom);
      fabricCanvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
      
      // Object selection event
      fabricCanvas.on('selection:created', (e) => {
        if (onObjectSelected && e.selected) {
          onObjectSelected(e.selected[0]);
        }
      });
      
      fabricCanvas.on('selection:updated', (e) => {
        if (onObjectSelected && e.selected) {
          onObjectSelected(e.selected[0]);
        }
      });
      
      fabricCanvas.on('selection:cleared', () => {
        if (onObjectSelected) {
          onObjectSelected(null);
        }
      });
      
      // Set up smart guides
      fabricCanvas.on('object:moving', (e) => {
        if (!config.showSmartGuides || !e.target) return;
        
        const activeObject = e.target;
        const objectCenter = activeObject.getCenterPoint();
        const allObjects = fabricCanvas.getObjects().filter(obj => obj !== activeObject);
        
        // Calculate guidelines based on other objects
        const newGuidelines: GuidelinePosition[] = [];
        
        allObjects.forEach(obj => {
          const center = obj.getCenterPoint();
          
          // Horizontal center alignment
          if (Math.abs(center.y - objectCenter.y) <= config.snapTolerance) {
            newGuidelines.push({
              position: center.y,
              orientation: 'horizontal'
            });
            
            if (config.snapToGrid) {
              activeObject.set({ top: obj.top });
              fabricCanvas.renderAll();
            }
          }
          
          // Vertical center alignment
          if (Math.abs(center.x - objectCenter.x) <= config.snapTolerance) {
            newGuidelines.push({
              position: center.x,
              orientation: 'vertical'
            });
            
            if (config.snapToGrid) {
              activeObject.set({ left: obj.left });
              fabricCanvas.renderAll();
            }
          }
        });
        
        setGuidelines(newGuidelines);
      });
      
      // Clear guidelines when done moving
      fabricCanvas.on('object:modified', () => {
        setGuidelines([]);
      });
      
      // Apply grid snap if enabled
      if (config.snapToGrid) {
        fabricCanvas.on('object:moving', (options) => {
          if (options.target) {
            const target = options.target;
            const gridSize = config.gridSize;
            
            target.set({
              left: Math.round(target.left! / gridSize) * gridSize,
              top: Math.round(target.top! / gridSize) * gridSize
            });
          }
        });
      }
      
      setCanvas(fabricCanvas);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      // Clean up
      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
      toast({
        title: "Canvas Error",
        description: "Failed to initialize the design canvas",
        variant: "destructive"
      });
    }
  }, [width, height, darkMode, editable, onCanvasReady, onObjectSelected, 
      config.zoom, config.panOffset.x, config.panOffset.y, config.snapToGrid, 
      config.gridSize, config.showSmartGuides, config.snapTolerance, toast]);
  
  // Update canvas config when props change
  useEffect(() => {
    if (!canvas) return;
    
    // Update zoom level
    canvas.setZoom(config.zoom);
    
    // Update pan position
    canvas.absolutePan(new fabric.Point(config.panOffset.x, config.panOffset.y));
    
    // Update snap-to-grid behavior
    if (config.snapToGrid) {
      canvas.off('object:moving');
      canvas.on('object:moving', (options) => {
        if (options.target) {
          const target = options.target;
          const gridSize = config.gridSize;
          
          target.set({
            left: Math.round(target.left! / gridSize) * gridSize,
            top: Math.round(target.top! / gridSize) * gridSize
          });
        }
      });
    } else {
      canvas.off('object:moving');
      
      // Re-add smart guides behavior
      if (config.showSmartGuides) {
        canvas.on('object:moving', (e) => {
          if (!e.target) return;
          
          const activeObject = e.target;
          const objectCenter = activeObject.getCenterPoint();
          const allObjects = canvas.getObjects().filter(obj => obj !== activeObject);
          
          // Calculate guidelines
          const newGuidelines: GuidelinePosition[] = [];
          
          allObjects.forEach(obj => {
            const center = obj.getCenterPoint();
            
            // Horizontal center alignment
            if (Math.abs(center.y - objectCenter.y) <= config.snapTolerance) {
              newGuidelines.push({
                position: center.y,
                orientation: 'horizontal'
              });
            }
            
            // Vertical center alignment
            if (Math.abs(center.x - objectCenter.x) <= config.snapTolerance) {
              newGuidelines.push({
                position: center.x,
                orientation: 'vertical'
              });
            }
          });
          
          setGuidelines(newGuidelines);
        });
      }
    }
    
    canvas.renderAll();
  }, [canvas, config]);
  
  // Keyboard event handlers for shortcuts
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom in: Ctrl/Cmd + Plus
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        updateConfig({ zoom: Math.min(config.zoom + 0.1, 5) });
      }
      
      // Zoom out: Ctrl/Cmd + Minus
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        updateConfig({ zoom: Math.max(config.zoom - 0.1, 0.1) });
      }
      
      // Reset zoom: Ctrl/Cmd + 0
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        updateConfig({ 
          zoom: 1,
          panOffset: { x: 0, y: 0 }
        });
      }
      
      // Delete selected object: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvas.getActiveObject()) {
        e.preventDefault();
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          if (onObjectSelected) {
            onObjectSelected(null);
          }
        }
      }
      
      // Toggle grid: Ctrl/Cmd + G
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        updateConfig({ showGrid: !config.showGrid });
      }
      
      // Toggle snap to grid: Ctrl/Cmd + Shift + G
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        updateConfig({ snapToGrid: !config.snapToGrid });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, config, updateConfig, onObjectSelected]);

  return (
    <div 
      ref={containerRef}
      className="enhanced-canvas-container relative"
      style={{ width: '100%', height: '100%' }}
    >
      <canvas ref={canvasRef} />
      
      {/* Grid System */}
      <GridSystem
        canvasWidth={width}
        canvasHeight={height}
        gridSize={config.gridSize}
        gridType={config.gridType}
        guidelines={guidelines}
        darkMode={darkMode}
        visible={config.showGrid}
      />
      
      {/* Canvas Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-md">
        <button 
          onClick={() => updateConfig({ zoom: Math.min(config.zoom + 0.1, 5) })}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button 
          onClick={() => updateConfig({ zoom: Math.max(config.zoom - 0.1, 0.1) })}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button 
          onClick={() => updateConfig({ zoom: 1, panOffset: { x: 0, y: 0 } })}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Reset View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <button 
          onClick={() => updateConfig({ showGrid: !config.showGrid })}
          className={`p-2 rounded ${config.showGrid ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          title="Toggle Grid"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>
      
      {/* Zoom Indicator */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
        {Math.round(config.zoom * 100)}%
      </div>
    </div>
  );
};

export default EnhancedCanvasEngine;
