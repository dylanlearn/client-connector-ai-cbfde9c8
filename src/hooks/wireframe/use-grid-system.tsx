
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
import { GuideHandler } from '@/components/wireframe/utils/alignment-guides';

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
  const [guideHandler, setGuideHandler] = useState<GuideHandler | null>(null);

  // Initialize guide handler when canvas is available
  useEffect(() => {
    if (!canvas) return;
    
    const handler = new GuideHandler(canvas, {
      enabled: true,
      threshold: gridConfig.snapThreshold,
      showEdgeGuides: true,
      showCenterGuides: true,
      showDistributionGuides: false,
      guideColor: gridConfig.guideColor
    });
    
    setGuideHandler(handler);
    
    return () => {
      handler.dispose();
    };
  }, [canvas, gridConfig.snapThreshold, gridConfig.guideColor]);

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
      
      // Update guide handler if available
      if (guideHandler) {
        guideHandler.setEnabled(updated.snapToGrid);
      }
      
      toast({
        title: updated.snapToGrid ? 'Snap to Grid Enabled' : 'Snap to Grid Disabled',
        description: updated.snapToGrid 
          ? 'Elements will snap to grid points.' 
          : 'Elements can be placed freely.'
      });
      
      return updated;
    });
  }, [guideHandler, toast]);
  
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
  
  // Update snap threshold
  const setSnapThreshold = useCallback((threshold: number) => {
    setGridConfig(prev => {
      const updated = { ...prev, snapThreshold: threshold };
      
      // Update guide handler if available
      if (guideHandler) {
        guideHandler.setThreshold(threshold);
      }
      
      toast({
        title: 'Snap Threshold Updated',
        description: `Snap threshold set to ${threshold}px.`
      });
      
      return updated;
    });
  }, [guideHandler, toast]);
  
  // Toggle smart guides
  const toggleSmartGuides = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, showGuides: !prev.showGuides };
      
      // Update guide handler if available
      if (guideHandler) {
        guideHandler.setOptions({
          enabled: updated.showGuides && updated.snapToGrid
        });
      }
      
      toast({
        title: updated.showGuides ? 'Smart Guides Enabled' : 'Smart Guides Disabled',
        description: updated.showGuides 
          ? 'Alignment guides will appear when moving elements.' 
          : 'Alignment guides are now hidden.'
      });
      
      return updated;
    });
  }, [guideHandler, toast]);
  
  // Toggle rulers
  const toggleRulers = useCallback(() => {
    setGridConfig(prev => {
      const updated = { ...prev, showRulers: !prev.showRulers };
      
      if (canvas) {
        updateGridOnCanvas(canvas, updated, canvasWidth, canvasHeight);
      }
      
      toast({
        title: updated.showRulers ? 'Rulers Enabled' : 'Rulers Disabled',
        description: updated.showRulers 
          ? 'Rulers are now visible.' 
          : 'Rulers are now hidden.'
      });
      
      return updated;
    });
  }, [canvas, canvasWidth, canvasHeight, toast]);
  
  // Update guide color
  const setGuideColor = useCallback((color: string) => {
    setGridConfig(prev => {
      const updated = { ...prev, guideColor: color };
      
      // Update guide handler if available
      if (guideHandler) {
        guideHandler.setOptions({ guideColor: color });
      }
      
      return updated;
    });
  }, [guideHandler]);
  
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
    setSnapThreshold,
    toggleSmartGuides,
    toggleRulers,
    setGuideColor,
    updateConfig: setGridConfig
  };
}
