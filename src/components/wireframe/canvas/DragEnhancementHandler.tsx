
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
      
      // If showGuides is enabled, show alignment guides
      if (gridConfig.showGuides) {
        showAlignmentGuides(target);
      }
    };
    
    // Show alignment guides
    const showAlignmentGuides = (target: fabric.Object) => {
      if (!target.left || !target.top) return;
      
      const allObjects = canvas.getObjects().filter(obj => obj !== target && obj.type !== 'line');
      
      // Find objects to align with
      allObjects.forEach(obj => {
        // Skip if no dimensions
        if (!obj.left || !obj.top || !obj.width || !obj.height || !target.width || !target.height) return;
        
        const threshold = gridConfig.snapThreshold || 8;
        
        // Check for vertical alignment (left, center, right)
        checkAlignment(target, obj, 'vertical', threshold);
        
        // Check for horizontal alignment (top, middle, bottom)
        checkAlignment(target, obj, 'horizontal', threshold);
      });
    };
    
    // Check alignment between two objects
    const checkAlignment = (target: fabric.Object, obj: fabric.Object, orientation: 'horizontal' | 'vertical', threshold: number) => {
      if (!target.left || !target.top || !obj.left || !obj.top) return;
      
      const targetLeft = target.left;
      const targetRight = targetLeft + (target.width || 0) * (target.scaleX || 1);
      const targetTop = target.top;
      const targetBottom = targetTop + (target.height || 0) * (target.scaleY || 1);
      
      const objLeft = obj.left;
      const objRight = objLeft + (obj.width || 0) * (obj.scaleX || 1);
      const objTop = obj.top;
      const objBottom = objTop + (obj.height || 0) * (obj.scaleY || 1);
      
      // This is the fixed version - using proper comparison
      if (orientation === 'vertical') {
        // Left edges
        if (Math.abs(targetLeft - objLeft) < threshold) {
          createGuide('vertical', objLeft, 0, height);
          // Snap to the guideline
          target.set({ left: objLeft });
        }
        
        // Right edges
        if (Math.abs(targetRight - objRight) < threshold) {
          createGuide('vertical', objRight, 0, height);
          // Snap to the guideline adjusted for width
          target.set({ left: objRight - (target.width || 0) * (target.scaleX || 1) });
        }
        
        // Centers (horizontal alignment)
        const targetCenterX = targetLeft + (target.width || 0) * (target.scaleX || 1) / 2;
        const objCenterX = objLeft + (obj.width || 0) * (obj.scaleX || 1) / 2;
        
        if (Math.abs(targetCenterX - objCenterX) < threshold) {
          createGuide('vertical', objCenterX, 0, height);
          // Snap to center
          target.set({ left: objCenterX - (target.width || 0) * (target.scaleX || 1) / 2 });
        }
      } else { // horizontal
        // Top edges
        if (Math.abs(targetTop - objTop) < threshold) {
          createGuide('horizontal', objTop, 0, width);
          // Snap to the guideline
          target.set({ top: objTop });
        }
        
        // Bottom edges
        if (Math.abs(targetBottom - objBottom) < threshold) {
          createGuide('horizontal', objBottom, 0, width);
          // Snap to the guideline adjusted for height
          target.set({ top: objBottom - (target.height || 0) * (target.scaleY || 1) });
        }
        
        // Centers (vertical alignment)
        const targetCenterY = targetTop + (target.height || 0) * (target.scaleY || 1) / 2;
        const objCenterY = objTop + (obj.height || 0) * (obj.scaleY || 1) / 2;
        
        if (Math.abs(targetCenterY - objCenterY) < threshold) {
          createGuide('horizontal', objCenterY, 0, width);
          // Snap to center
          target.set({ top: objCenterY - (target.height || 0) * (target.scaleY || 1) / 2 });
        }
      }
    };
    
    // Create a guide line
    const createGuide = (orientation: 'horizontal' | 'vertical', position: number, start: number, end: number) => {
      const line = new fabric.Line(
        orientation === 'horizontal' 
          ? [start, position, end, position] 
          : [position, start, position, end],
        {
          stroke: gridConfig.guideColor || 'rgba(0, 120, 255, 0.75)',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          strokeLineCap: 'round',
          data: { type: 'guide' }
        }
      );
      
      canvas.add(line);
      guides.push(line);
      canvas.renderAll();
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
