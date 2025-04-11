
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { 
  GridConfiguration, 
  DEFAULT_GRID_CONFIG, 
  updateGridOnCanvas,
  removeGridFromCanvas,
  calculateSnapPositions,
  findClosestSnapPosition,
  showAlignmentGuides,
  removeAlignmentGuides
} from '@/components/wireframe/utils/grid-system';

interface UseGridSystemProps {
  canvas: fabric.Canvas | null;
  canvasWidth?: number;
  canvasHeight?: number;
  initialConfig?: Partial<GridConfiguration>;
}

export function useGridSystem({
  canvas,
  canvasWidth = 1200,
  canvasHeight = 800,
  initialConfig = {}
}: UseGridSystemProps) {
  const { toast } = useToast();
  const [gridConfig, setGridConfig] = useState<GridConfiguration>({
    ...DEFAULT_GRID_CONFIG,
    ...initialConfig
  });

  // Toggle grid visibility
  const toggleGridVisibility = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, visible: !prev.visible };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, canvasWidth, canvasHeight);
      }
      
      toast({
        title: updated.visible ? 'Grid Enabled' : 'Grid Disabled',
        description: updated.visible 
          ? 'Grid is now visible.' 
          : 'Grid is now hidden.'
      });
      
      return updated;
    });
  }, [canvas, canvasWidth, canvasHeight, toast]);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, snapToGrid: !prev.snapToGrid };
      
      toast({
        title: updated.snapToGrid ? 'Snap to Grid Enabled' : 'Snap to Grid Disabled',
        description: updated.snapToGrid 
          ? 'Elements will snap to grid points.' 
          : 'Elements can be placed freely.'
      });
      
      return updated;
    });
  }, [toast]);
  
  // Update grid size
  const setGridSize = useCallback((size: number) => {
    setGridConfig(prev => {
      const updated = { ...prev, size };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, canvasWidth, canvasHeight);
      }
      
      toast({
        title: 'Grid Size Updated',
        description: `Grid size set to ${size}px.`
      });
      
      return updated;
    });
  }, [canvas, canvasWidth, canvasHeight, toast]);
  
  // Update grid type
  const setGridType = useCallback((type: 'lines' | 'dots' | 'columns') => {
    setGridConfig(prev => {
      const updated = { ...prev, type };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, canvasWidth, canvasHeight);
      }
      
      toast({
        title: 'Grid Type Changed',
        description: `Grid type set to ${type}.`
      });
      
      return updated;
    });
  }, [canvas, canvasWidth, canvasHeight, toast]);
  
  // Update column settings
  const updateColumnSettings = useCallback((columns: number, gutterWidth: number, marginWidth: number) => {
    setGridConfig(prev => {
      const updated = { ...prev, columns, gutterWidth, marginWidth };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, canvasWidth, canvasHeight);
      }
      
      toast({
        title: 'Column Settings Updated',
        description: `Grid now has ${columns} columns.`
      });
      
      return updated;
    });
  }, [canvas, canvasWidth, canvasHeight, toast]);
  
  // Setup object moving event listeners for snapping
  useEffect(() => {
    if (!canvas || !gridConfig.snapToGrid) return;
    
    const handleObjectMoving = (e: fabric.IEvent) => {
      const obj = e.target;
      if (!obj) return;
      
      // Don't snap grid or guide objects
      if (obj.data?.type === 'grid' || obj.data?.type === 'alignmentGuide') return;
      
      const allObjects = canvas.getObjects().filter(o => o !== obj && !o.data?.type?.includes('grid'));
      
      // Calculate snap positions
      const snapPositions = calculateSnapPositions(obj, allObjects, gridConfig, canvasWidth, canvasHeight);
      
      // Get object bounds
      const objBounds = {
        left: obj.left || 0,
        top: obj.top || 0,
        right: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1),
        bottom: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1),
        centerX: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1) / 2,
        centerY: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1) / 2
      };
      
      // Track which snap positions were used (to show guides)
      const activeSnaps = {
        horizontal: [] as number[],
        vertical: [] as number[]
      };
      
      // Check horizontal snapping (top, center, bottom)
      const snapTop = findClosestSnapPosition(objBounds.top, snapPositions.horizontal, gridConfig.snapThreshold);
      const snapCenterY = findClosestSnapPosition(objBounds.centerY, snapPositions.horizontal, gridConfig.snapThreshold);
      const snapBottom = findClosestSnapPosition(objBounds.bottom, snapPositions.horizontal, gridConfig.snapThreshold);
      
      // Check vertical snapping (left, center, right)
      const snapLeft = findClosestSnapPosition(objBounds.left, snapPositions.vertical, gridConfig.snapThreshold);
      const snapCenterX = findClosestSnapPosition(objBounds.centerX, snapPositions.vertical, gridConfig.snapThreshold);
      const snapRight = findClosestSnapPosition(objBounds.right, snapPositions.vertical, gridConfig.snapThreshold);
      
      // Apply horizontal snapping
      if (snapTop !== null) {
        obj.set('top', snapTop);
        activeSnaps.horizontal.push(snapTop);
      } else if (snapCenterY !== null) {
        obj.set('top', snapCenterY - (obj.height || 0) * (obj.scaleY || 1) / 2);
        activeSnaps.horizontal.push(snapCenterY);
      } else if (snapBottom !== null) {
        obj.set('top', snapBottom - (obj.height || 0) * (obj.scaleY || 1));
        activeSnaps.horizontal.push(snapBottom);
      }
      
      // Apply vertical snapping
      if (snapLeft !== null) {
        obj.set('left', snapLeft);
        activeSnaps.vertical.push(snapLeft);
      } else if (snapCenterX !== null) {
        obj.set('left', snapCenterX - (obj.width || 0) * (obj.scaleX || 1) / 2);
        activeSnaps.vertical.push(snapCenterX);
      } else if (snapRight !== null) {
        obj.set('left', snapRight - (obj.width || 0) * (obj.scaleX || 1));
        activeSnaps.vertical.push(snapRight);
      }
      
      // Show alignment guides if enabled
      if (gridConfig.showGuides && (activeSnaps.horizontal.length > 0 || activeSnaps.vertical.length > 0)) {
        showAlignmentGuides(canvas, activeSnaps, gridConfig.guideColor);
      } else {
        removeAlignmentGuides(canvas);
      }
      
      // Force update
      canvas.requestRenderAll();
    };
    
    const handleObjectMovingEnd = () => {
      if (gridConfig.showGuides) {
        removeAlignmentGuides(canvas);
      }
    };
    
    // Add event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectMovingEnd);
    
    // Cleanup
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectMovingEnd);
    };
  }, [canvas, gridConfig, canvasWidth, canvasHeight]);
  
  // Initialize grid
  useEffect(() => {
    if (!canvas) return;
    
    updateGridOnCanvas(canvas, gridConfig, canvasWidth, canvasHeight);
    
    return () => {
      removeGridFromCanvas(canvas);
    };
  }, [canvas, gridConfig.visible, canvasWidth, canvasHeight]);

  return {
    gridConfig,
    toggleGridVisibility,
    toggleSnapToGrid,
    setGridSize,
    setGridType,
    updateColumnSettings,
    updateConfig: setGridConfig
  };
}
