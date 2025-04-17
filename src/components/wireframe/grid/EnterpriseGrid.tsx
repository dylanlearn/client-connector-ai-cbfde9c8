
import React, { useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  EnterpriseGridConfig, 
  GridBreakpoint,
  GridGuideConfig 
} from '../types/canvas-types';

interface EnterpriseGridProps {
  canvas: fabric.Canvas | null;
  config: EnterpriseGridConfig;
  width: number;
  height: number;
  onChange: (config: Partial<EnterpriseGridConfig>) => void;
  className?: string;
  guideConfig?: GridGuideConfig;
  onGuideConfigChange?: (config: Partial<GridGuideConfig>) => void;
}

// Default configuration values
export const DEFAULT_GRID_CONFIG: EnterpriseGridConfig = {
  visible: true,
  type: 'lines',
  size: 20,
  snapToGrid: true,
  snapThreshold: 10,
  color: 'rgba(0, 0, 0, 0.1)',
  showGuides: true,
  showRulers: false,
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  responsive: true,
  breakpoints: [
    { name: 'xs', width: 0, columns: 4, gutterWidth: 16, marginWidth: 16 },
    { name: 'sm', width: 640, columns: 8, gutterWidth: 20, marginWidth: 24 },
    { name: 'md', width: 768, columns: 12, gutterWidth: 24, marginWidth: 32 },
    { name: 'lg', width: 1024, columns: 12, gutterWidth: 32, marginWidth: 40 },
    { name: 'xl', width: 1280, columns: 12, gutterWidth: 40, marginWidth: 48 },
    { name: '2xl', width: 1536, columns: 12, gutterWidth: 48, marginWidth: 56 }
  ],
  currentBreakpoint: 'lg'
};

export const DEFAULT_GUIDE_CONFIG: GridGuideConfig = {
  showVerticalGuides: true,
  showHorizontalGuides: true,
  guideColor: 'rgba(0, 120, 255, 0.8)',
  snapToGuides: true,
  guideThreshold: 8,
  showDistanceIndicators: true
};

const EnterpriseGrid: React.FC<EnterpriseGridProps> = ({
  canvas,
  config,
  width,
  height,
  onChange,
  className,
  guideConfig = DEFAULT_GUIDE_CONFIG,
  onGuideConfigChange
}) => {
  // Merge with defaults
  const gridConfig = useMemo(() => ({
    ...DEFAULT_GRID_CONFIG,
    ...config
  }), [config]);

  const guides = useMemo(() => ({
    ...DEFAULT_GUIDE_CONFIG,
    ...guideConfig
  }), [guideConfig]);

  // Track current lines on canvas for cleanup
  const [gridObjects, setGridObjects] = useState<fabric.Object[]>([]);
  
  // Get the active breakpoint based on current width
  const activeBreakpoint = useMemo(() => {
    if (!gridConfig.responsive) return gridConfig.breakpoints.find(bp => bp.name === 'lg');
    
    const sorted = [...gridConfig.breakpoints].sort((a, b) => b.width - a.width);
    return sorted.find(bp => width >= bp.width) || sorted[sorted.length - 1];
  }, [width, gridConfig.responsive, gridConfig.breakpoints]);

  // Calculate column positions for a column-based grid
  const calculateColumnPositions = (
    totalWidth: number,
    columns: number,
    gutterWidth: number,
    marginWidth: number
  ): number[] => {
    const positions: number[] = [];
    
    // Content width without margins
    const contentWidth = totalWidth - (marginWidth * 2);
    
    // Column width calculation
    const columnWidth = (contentWidth - (gutterWidth * (columns - 1))) / columns;
    
    // Left margin
    positions.push(marginWidth);
    
    // Calculate column positions
    for (let i = 0; i < columns; i++) {
      const x = marginWidth + (i * (columnWidth + gutterWidth));
      positions.push(x);
      
      // Add right edge of column
      positions.push(x + columnWidth);
    }
    
    return [...new Set(positions)]; // Remove duplicates
  };

  // Calculate grid positions based on grid size
  const calculateGridLines = (
    canvasWidth: number,
    canvasHeight: number,
    gridSize: number
  ) => {
    const horizontalLines: number[] = [];
    const verticalLines: number[] = [];
    
    for (let i = 0; i <= Math.ceil(canvasWidth / gridSize); i++) {
      verticalLines.push(i * gridSize);
    }
    
    for (let i = 0; i <= Math.ceil(canvasHeight / gridSize); i++) {
      horizontalLines.push(i * gridSize);
    }
    
    return { horizontalLines, verticalLines };
  };

  // Update grid on the canvas
  useEffect(() => {
    if (!canvas) return;
    
    // Clear previous grid objects
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    if (!gridConfig.visible) {
      setGridObjects([]);
      return;
    }
    
    const newGridObjects: fabric.Object[] = [];
    const currentBreakpoint = activeBreakpoint;
    
    // Use responsive settings if applicable
    const activeColumns = currentBreakpoint ? currentBreakpoint.columns : gridConfig.columns;
    const activeGutterWidth = currentBreakpoint ? currentBreakpoint.gutterWidth : gridConfig.gutterWidth;
    const activeMarginWidth = currentBreakpoint ? currentBreakpoint.marginWidth : gridConfig.marginWidth;

    // Generate grid based on type
    if (gridConfig.type === 'columns') {
      // Generate column grid
      const positions = calculateColumnPositions(
        width,
        activeColumns,
        activeGutterWidth,
        activeMarginWidth
      );
      
      positions.forEach(x => {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: gridConfig.color,
          strokeDashArray: [4, 4],
          selectable: false,
          evented: false,
          excludeFromExport: true,
          data: { type: 'grid-column' }
        });
        
        canvas.add(line);
        newGridObjects.push(line);
      });
      
      // Add margin indicators
      const leftMargin = new fabric.Rect({
        left: 0,
        top: 0,
        width: activeMarginWidth,
        height: height,
        fill: 'rgba(0, 0, 255, 0.05)',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid-margin' }
      });
      
      const rightMargin = new fabric.Rect({
        left: width - activeMarginWidth,
        top: 0,
        width: activeMarginWidth,
        height: height,
        fill: 'rgba(0, 0, 255, 0.05)',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid-margin' }
      });
      
      canvas.add(leftMargin);
      canvas.add(rightMargin);
      newGridObjects.push(leftMargin, rightMargin);
      
    } else {
      // Generate lines or dots grid
      const { horizontalLines, verticalLines } = calculateGridLines(width, height, gridConfig.size);
      
      if (gridConfig.type === 'lines') {
        // Create horizontal lines
        horizontalLines.forEach(y => {
          const line = new fabric.Line([0, y, width, y], {
            stroke: gridConfig.color,
            strokeWidth: 1,
            selectable: false,
            evented: false,
            excludeFromExport: true,
            data: { type: 'grid-line' }
          });
          
          canvas.add(line);
          newGridObjects.push(line);
        });
        
        // Create vertical lines
        verticalLines.forEach(x => {
          const line = new fabric.Line([x, 0, x, height], {
            stroke: gridConfig.color,
            strokeWidth: 1,
            selectable: false,
            evented: false,
            excludeFromExport: true,
            data: { type: 'grid-line' }
          });
          
          canvas.add(line);
          newGridObjects.push(line);
        });
      } else if (gridConfig.type === 'dots') {
        // Create dot grid
        horizontalLines.forEach(y => {
          verticalLines.forEach(x => {
            const dot = new fabric.Circle({
              left: x,
              top: y,
              radius: 1,
              fill: gridConfig.color,
              selectable: false,
              evented: false,
              excludeFromExport: true,
              data: { type: 'grid-dot' }
            });
            
            canvas.add(dot);
            newGridObjects.push(dot);
          });
        });
      }
    }
    
    // Add breakpoint indicator if responsive is enabled
    if (gridConfig.responsive && currentBreakpoint) {
      const label = new fabric.Text(`Breakpoint: ${currentBreakpoint.name} (${currentBreakpoint.width}px)`, {
        left: 10,
        top: 10,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: 'rgba(0, 0, 0, 0.5)',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid-info' }
      });
      
      canvas.add(label);
      newGridObjects.push(label);
    }
    
    // Store grid objects for future cleanup
    setGridObjects(newGridObjects);
    
    // Ensure grid is at the back
    newGridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    canvas.renderAll();
  }, [canvas, gridConfig, width, height, activeBreakpoint]);

  // Set up object snapping
  useEffect(() => {
    if (!canvas || !gridConfig.snapToGrid) return;
    
    const handleObjectMoving = (e: any) => {
      const obj = e.target;
      if (!obj) return;
      
      const activeSnapping = gridConfig.snapToGrid;
      if (!activeSnapping) return;
      
      const threshold = gridConfig.snapThreshold;
      let gridSize = gridConfig.size;
      
      if (gridConfig.type === 'columns') {
        // Use column positions for snapping
        const currentBreakpoint = activeBreakpoint;
        const activeColumns = currentBreakpoint ? currentBreakpoint.columns : gridConfig.columns;
        const activeGutterWidth = currentBreakpoint ? currentBreakpoint.gutterWidth : gridConfig.gutterWidth;
        const activeMarginWidth = currentBreakpoint ? currentBreakpoint.marginWidth : gridConfig.marginWidth;
        
        const positions = calculateColumnPositions(
          width,
          activeColumns,
          activeGutterWidth,
          activeMarginWidth
        );
        
        // Find nearest column position for left edge
        let closestX = obj.left;
        let minDistance = threshold;
        
        positions.forEach(pos => {
          const distance = Math.abs(obj.left - pos);
          if (distance < minDistance) {
            minDistance = distance;
            closestX = pos;
          }
        });
        
        if (minDistance < threshold) {
          obj.set({ left: closestX });
        }
      } else {
        // Regular grid snapping
        if (Math.abs(obj.left % gridSize) < threshold) {
          obj.set({ left: Math.round(obj.left / gridSize) * gridSize });
        }
        
        if (Math.abs(obj.top % gridSize) < threshold) {
          obj.set({ top: Math.round(obj.top / gridSize) * gridSize });
        }
      }
    };
    
    canvas.on('object:moving', handleObjectMoving);
    
    return () => {
      canvas.off('object:moving', handleObjectMoving);
    };
  }, [canvas, gridConfig, activeBreakpoint, width]);

  return (
    <div className={cn("enterprise-grid-system", className)}>
      {/* Grid visualization is handled by the canvas effect */}
      {/* If you want additional UI controls for the grid, you can add them here */}
    </div>
  );
};

export default EnterpriseGrid;
