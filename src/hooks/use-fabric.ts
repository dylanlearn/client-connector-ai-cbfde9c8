import { useRef, useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useWireframeStore } from '@/stores/wireframe-store';
import { WireframeCanvasConfig, BoundaryStyles, GuideVisualization } from '@/components/wireframe/utils/types';
import { UseFabricOptions } from '@/types/fabric-canvas';
import { useCanvasInitialization } from './fabric/use-canvas-initialization';
import { useCanvasActions } from './fabric/use-canvas-actions';
import { useGridActions } from './fabric/use-grid-actions';
import { 
  findAlignmentGuides, 
  snapObjectToGuides, 
  renderAlignmentGuides, 
  highlightObjectBoundary,
  getObjectBounds
} from '@/components/wireframe/utils/alignment-guides';

// Default boundary styles for components
const DEFAULT_BOUNDARY_STYLES: BoundaryStyles = {
  stroke: '#2196F3',
  strokeWidth: 1,
  strokeDashArray: [3, 3],
  cornerSize: 7,
  cornerStyle: 'circle',
  cornerColor: '#2196F3',
  transparentCorners: false,
  cornerStrokeColor: '#ffffff'
};

// Default guide visualization settings
const DEFAULT_GUIDE_VISUALIZATION: GuideVisualization = {
  strokeWidth: 1,
  color: {
    edge: '#00cc66',
    center: '#0066ff',
    distribution: '#cc00ff'
  },
  dashArray: [4, 4],
  snapIndicatorSize: 6,
  snapIndicatorColor: '#2196F3',
  showLabels: true
};

export function useFabric(options: UseFabricOptions = {}) {
  const { persistConfig = true, initialConfig = {} } = options;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  const [boundaryStyles, setBoundaryStyles] = useState<BoundaryStyles>(DEFAULT_BOUNDARY_STYLES);
  const [guideVisualization, setGuideVisualization] = useState<GuideVisualization>(DEFAULT_GUIDE_VISUALIZATION);
  
  const storeCanvasSettings = useWireframeStore(state => state.canvasSettings);
  const updateCanvasSettings = useWireframeStore(state => state.updateCanvasSettings);
  
  // Define the canvas configuration with all required properties
  const [canvasConfig, setCanvasConfig] = useState<WireframeCanvasConfig>({
    width: initialConfig.width || storeCanvasSettings.width || 1200,
    height: initialConfig.height || storeCanvasSettings.height || 800,
    zoom: initialConfig.zoom || storeCanvasSettings.zoom || 1,
    panOffset: initialConfig.panOffset || storeCanvasSettings.panOffset || { x: 0, y: 0 },
    showGrid: initialConfig.showGrid !== undefined ? initialConfig.showGrid : storeCanvasSettings.showGrid !== undefined ? storeCanvasSettings.showGrid : true,
    snapToGrid: initialConfig.snapToGrid !== undefined ? initialConfig.snapToGrid : storeCanvasSettings.snapToGrid !== undefined ? storeCanvasSettings.snapToGrid : true,
    gridSize: initialConfig.gridSize || storeCanvasSettings.gridSize || 8,
    backgroundColor: initialConfig.backgroundColor || storeCanvasSettings.backgroundColor || '#ffffff',
    gridType: initialConfig.gridType || storeCanvasSettings.gridType || 'lines',
    snapTolerance: initialConfig.snapTolerance || storeCanvasSettings.snapTolerance || 5,
    showSmartGuides: initialConfig.showSmartGuides !== undefined ? initialConfig.showSmartGuides : storeCanvasSettings.showSmartGuides !== undefined ? storeCanvasSettings.showSmartGuides : false
  });

  // Update canvas config and persist if needed
  const updateConfig = useCallback((config: Partial<WireframeCanvasConfig>) => {
    setCanvasConfig(prev => {
      const newConfig = { ...prev, ...config };
      
      // Persist to store if enabled
      if (persistConfig) {
        updateCanvasSettings(newConfig);
      }
      
      return newConfig;
    });
  }, [persistConfig, updateCanvasSettings]);

  // Update boundary styles for better visual feedback
  const updateBoundaryStyles = useCallback((styles: Partial<BoundaryStyles>) => {
    setBoundaryStyles(prev => ({ ...prev, ...styles }));
    
    // Apply to any currently selected objects
    if (fabricCanvas && selectedObject) {
      selectedObject.set({
        borderColor: styles.stroke || boundaryStyles.stroke,
        borderDashArray: styles.strokeDashArray || boundaryStyles.strokeDashArray,
        borderScaleFactor: styles.strokeWidth || boundaryStyles.strokeWidth,
        cornerColor: styles.cornerColor || boundaryStyles.cornerColor,
        cornerSize: styles.cornerSize || boundaryStyles.cornerSize,
        transparentCorners: styles.transparentCorners !== undefined ? 
          styles.transparentCorners : boundaryStyles.transparentCorners,
        cornerStyle: styles.cornerStyle || boundaryStyles.cornerStyle,
        cornerStrokeColor: styles.cornerStrokeColor || boundaryStyles.cornerStrokeColor
      });
      
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas, selectedObject, boundaryStyles]);

  // Use the extracted canvas initialization
  const { initializeFabric } = useCanvasInitialization(
    canvasConfig, 
    setSelectedObject, 
    setIsDrawing, 
    isDrawing
  );

  // Use the extracted canvas actions
  const {
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    zoomIn,
    zoomOut,
    resetZoom,
    pan
  } = useCanvasActions(fabricCanvas, updateConfig, canvasConfig);

  // Use the extracted grid actions
  const {
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    changeGridType,
    setSnapTolerance
  } = useGridActions(updateConfig, canvasConfig);

  // Apply visual styles to selected object
  const applySelectionStyles = useCallback((object: fabric.Object) => {
    if (!object) return;
    
    object.set({
      borderColor: boundaryStyles.stroke,
      borderDashArray: boundaryStyles.strokeDashArray,
      cornerColor: boundaryStyles.cornerColor,
      cornerSize: boundaryStyles.cornerSize,
      transparentCorners: boundaryStyles.transparentCorners,
      cornerStyle: boundaryStyles.cornerStyle,
      cornerStrokeColor: boundaryStyles.cornerStrokeColor,
      padding: 5, // Add padding for easier selection
      borderScaleFactor: boundaryStyles.strokeWidth
    });
  }, [boundaryStyles]);
  
  // Enhanced drag and drop functionality
  const setupDragDrop = useCallback((canvas: fabric.Canvas) => {
    if (!canvas) return;
    
    canvas.on('object:moving', (e) => {
      setIsDragging(true);
      if (!e.target) return;
      
      const activeObject = e.target;
      
      // Apply grid snapping if enabled
      if (canvasConfig.snapToGrid) {
        const gridSize = canvasConfig.gridSize;
        activeObject.set({
          left: Math.round(activeObject.left! / gridSize) * gridSize,
          top: Math.round(activeObject.top! / gridSize) * gridSize
        });
      }
      
      // Apply alignment guides if enabled
      if (canvasConfig.showSmartGuides) {
        const allObjects = canvas.getObjects().filter(obj => obj !== activeObject);
        const newGuides = findAlignmentGuides(activeObject, allObjects, canvasConfig.snapTolerance);
        
        // Set guides for rendering
        setGuides(newGuides);
        
        // Apply snapping
        if (newGuides.length > 0) {
          snapObjectToGuides(activeObject, newGuides, canvas);
          
          // Visual feedback for snap
          const bounds = getObjectBounds(activeObject);
          
          // Flash indicator at snap points
          newGuides.forEach(guide => {
            const indicator = new fabric.Circle({
              left: guide.orientation === 'vertical' ? guide.position - guideVisualization.snapIndicatorSize/2 : bounds.centerX - guideVisualization.snapIndicatorSize/2,
              top: guide.orientation === 'horizontal' ? guide.position - guideVisualization.snapIndicatorSize/2 : bounds.centerY - guideVisualization.snapIndicatorSize/2,
              radius: guideVisualization.snapIndicatorSize,
              fill: guideVisualization.snapIndicatorColor,
              opacity: 0.7,
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false
            });
            
            canvas.add(indicator);
            
            // Remove after a short delay
            setTimeout(() => {
              canvas.remove(indicator);
              canvas.renderAll();
            }, 300);
          });
        }
        
        // Highlight the object being moved for better visibility
        highlightObjectBoundary(activeObject, canvas);
      }
    });
    
    canvas.on('object:modified', () => {
      setIsDragging(false);
      setGuides([]);
      // Remove all highlights
      const highlights = canvas.getObjects().filter(obj => (obj as any).isHighlight);
      highlights.forEach(h => canvas.remove(h));
    });
    
    canvas.on('selection:created', (e) => {
      const selected = e.selected?.[0];
      if (selected) {
        applySelectionStyles(selected);
      }
    });
    
    canvas.on('selection:updated', (e) => {
      const selected = e.selected?.[0];
      if (selected) {
        applySelectionStyles(selected);
      }
    });
    
    // Add custom rendering of guides
    canvas.on('after:render', () => {
      if (guides.length > 0 && canvas.contextTop) {
        renderAlignmentGuides(
          canvas.contextTop, 
          canvas.width || 1200, 
          canvas.height || 800, 
          guides,
          guideVisualization
        );
      }
    });
  }, [canvasConfig, applySelectionStyles, guideVisualization]);

  // Initialize Fabric canvas
  const initCanvas = useCallback(() => {
    const canvas = initializeFabric(canvasRef.current);
    if (canvas) {
      setFabricCanvas(canvas);
      
      // Setup enhanced drag and drop
      setupDragDrop(canvas);
      
      // Set canvas background
      canvas.setBackgroundColor(canvasConfig.backgroundColor, canvas.renderAll.bind(canvas));
    }
    return canvas;
  }, [initializeFabric, canvasConfig.backgroundColor, setupDragDrop]);

  // Initialize on mount and cleanup on unmount
  useEffect(() => {
    const canvas = initCanvas();
    
    // Cleanup on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [initCanvas, fabricCanvas]);

  // Toggle smart guides
  const toggleSmartGuides = useCallback(() => {
    updateConfig({ showSmartGuides: !canvasConfig.showSmartGuides });
  }, [updateConfig, canvasConfig.showSmartGuides]);
  
  // Update guide visualization settings
  const updateGuideVisualization = useCallback((config: Partial<GuideVisualization>) => {
    setGuideVisualization(prev => ({ ...prev, ...config }));
  }, []);

  return {
    canvasRef,
    fabricCanvas,
    selectedObject,
    canvasConfig,
    isDrawing,
    isDragging,
    guides,
    boundaryStyles,
    guideVisualization,
    // Basic fabric operations
    addObject,
    removeObject,
    clearCanvas,
    saveCanvasAsJSON,
    loadCanvasFromJSON,
    // Extended canvas control
    zoomIn,
    zoomOut,
    resetZoom,
    pan,
    toggleGrid,
    toggleSnapToGrid,
    toggleSmartGuides,
    setGridSize,
    changeGridType,
    updateConfig,
    // Selection and boundary styles
    updateBoundaryStyles,
    applySelectionStyles,
    // Guide visualization
    updateGuideVisualization,
    setSnapTolerance,
    // Also expose the original initialize method
    initializeFabric,
    // Fabric canvas alias for backward compatibility
    canvas: fabricCanvas,
  };
}

export default useFabric;
