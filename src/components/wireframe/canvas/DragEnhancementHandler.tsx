
import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { GridConfiguration } from '../utils/grid-system';

interface DragEnhancementHandlerProps {
  canvas: fabric.Canvas;
  enabled?: boolean;
  gridConfig: GridConfiguration;
  width: number;
  height: number;
  showDropIndicators?: boolean;
}

const DragEnhancementHandler: React.FC<DragEnhancementHandlerProps> = ({
  canvas,
  enabled = true,
  gridConfig,
  width,
  height,
  showDropIndicators = false
}) => {
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Variables for guides
    let guides: fabric.Line[] = [];
    let activeObject: fabric.Object | null = null;
    
    // Handle object moving
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!e.target) return;
      const target = e.target;
      
      // Remove existing guides
      hideGuides();
      
      // If snapToGrid is enabled, snap to grid
      if (gridConfig.snapToGrid) {
        const gridSize = gridConfig.size;
        
        // Snap to grid points
        if (target.left !== undefined) {
          target.left = Math.round(target.left / gridSize) * gridSize;
        }
        
        if (target.top !== undefined) {
          target.top = Math.round(target.top / gridSize) * gridSize;
        }
      }
      
      // Smart Guides are now handled by the SmartGuideSystem component
      // so we don't need to duplicate that logic here
    };
    
    // Hide all guides
    const hideGuides = () => {
      guides.forEach(guide => {
        canvas.remove(guide);
      });
      guides = [];
      canvas.renderAll();
    };
    
    // Handle object modified
    const handleObjectModified = () => {
      hideGuides();
    };
    
    // Handle selection cleared
    const handleSelectionCleared = () => {
      hideGuides();
      activeObject = null;
    };
    
    // Set up event handlers
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Clean up
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleSelectionCleared);
      hideGuides();
    };
  }, [canvas, enabled, gridConfig, width, height, showDropIndicators]);
  
  return null;
};

export default DragEnhancementHandler;
