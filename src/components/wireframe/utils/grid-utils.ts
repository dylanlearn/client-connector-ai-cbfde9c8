
import { fabric } from 'fabric';

// Define Tailwind breakpoints for consistent use throughout the app
export const TAILWIND_BREAKPOINTS = {
  xs: 384,  // Added an extra small breakpoint
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

interface GridOptions {
  size?: number;
  color?: string;
  opacity?: number;
  showSubdivisions?: boolean;
  showAxes?: boolean;
  snapTolerance?: number;
  type?: 'lines' | 'dots' | 'columns';
}

/**
 * Creates a grid on the canvas for layout alignment
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 20,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  options: GridOptions = {}
): fabric.Line[] {
  const {
    color = '#e0e0e0',
    opacity = 0.3,
    showSubdivisions = true,
    showAxes = true,
    snapTolerance = 10,
  } = options;

  const canvasWidth = canvas.width || 1000;
  const canvasHeight = canvas.height || 800;
  
  const gridLines: fabric.Line[] = [];
  const isColumns = gridType === 'columns';
  
  // Create vertical grid lines
  if (gridType !== 'dots') {
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      if (!showSubdivisions && i % (gridSize * 4) !== 0) continue;
      
      const isDivisibleBy4 = i % (gridSize * 4) === 0;
      const isAxis = i === 0;
      
      const lineOpacity = isAxis && showAxes 
        ? opacity * 2 
        : isDivisibleBy4 
          ? opacity * 1.5 
          : opacity;
      
      const line = new fabric.Line([i, 0, i, canvasHeight], {
        stroke: isAxis && showAxes ? '#ff4040' : color,
        strokeWidth: isDivisibleBy4 ? 1 : 0.5,
        opacity: lineOpacity,
        selectable: false,
        evented: false,
        strokeDashArray: isColumns ? [4, 4] : undefined,
      });
      
      gridLines.push(line);
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      if (!showSubdivisions && i % (gridSize * 4) !== 0) continue;
      
      const isDivisibleBy4 = i % (gridSize * 4) === 0;
      const isAxis = i === 0;
      
      const lineOpacity = isAxis && showAxes 
        ? opacity * 2 
        : isDivisibleBy4 
          ? opacity * 1.5 
          : opacity;
      
      const line = new fabric.Line([0, i, canvasWidth, i], {
        stroke: isAxis && showAxes ? '#ff4040' : color,
        strokeWidth: isDivisibleBy4 ? 1 : 0.5,
        opacity: lineOpacity,
        selectable: false,
        evented: false,
        strokeDashArray: isColumns ? [4, 4] : undefined,
      });
      
      gridLines.push(line);
    }
  } else {
    // Create dots at intersections
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      for (let j = 0; j <= canvasHeight; j += gridSize) {
        if (!showSubdivisions && (i % (gridSize * 4) !== 0 || j % (gridSize * 4) !== 0)) continue;
        
        const isDivisibleBy4 = i % (gridSize * 4) === 0 && j % (gridSize * 4) === 0;
        const isAxis = i === 0 || j === 0;
        
        const dotOpacity = isAxis && showAxes 
          ? opacity * 2 
          : isDivisibleBy4 
            ? opacity * 1.5 
            : opacity;
        
        const dot = new fabric.Circle({
          left: i,
          top: j,
          radius: isDivisibleBy4 ? 2 : 1,
          fill: isAxis && showAxes ? '#ff4040' : color,
          opacity: dotOpacity,
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center'
        });
        
        gridLines.push(dot as unknown as fabric.Line); // Type casting for consistent return
      }
    }
  }
  
  return gridLines;
}

/**
 * Snaps a point to the nearest grid point
 */
export function snapToGrid(point: { x: number; y: number }, gridSize: number): { x: number; y: number } {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

/**
 * Creates a responsive grid for wireframing
 */
export function createResponsiveGrid(width: number, columns: number = 12, gutterSize: number = 16) {
  const columnWidth = (width - (gutterSize * (columns - 1))) / columns;
  
  const grid = {
    columns,
    gutterSize,
    columnWidth,
    totalWidth: width,
    getColumnPosition: (col: number) => (columnWidth + gutterSize) * col,
    getColumnSpanWidth: (colSpan: number) => (columnWidth * colSpan) + (gutterSize * (colSpan - 1)),
    getBreakpointColumns: (breakpoint: keyof typeof TAILWIND_BREAKPOINTS) => {
      switch(breakpoint) {
        case 'xs': return 4;
        case 'sm': return 8;
        case 'md': return 8;
        case 'lg': return 12;
        case 'xl': return 12;
        case '2xl': return 12;
        default: return 12;
      }
    },
    getBreakpointGutter: (breakpoint: keyof typeof TAILWIND_BREAKPOINTS) => {
      switch(breakpoint) {
        case 'xs': return 8;
        case 'sm': return 12;
        case 'md': return 16;
        case 'lg': return 24;
        case 'xl': return 24;
        case '2xl': return 32;
        default: return 16;
      }
    }
  };
  
  return grid;
}

/**
 * Creates a fluid grid that resizes with the container
 */
export function createFluidGrid(
  containerWidth: number,
  containerHeight: number,
  options: {
    columns?: number;
    rows?: number;
    marginX?: number;
    marginY?: number;
    gutterX?: number;
    gutterY?: number;
  } = {}
) {
  const {
    columns = 12,
    rows = 6,
    marginX = 16,
    marginY = 16,
    gutterX = 16,
    gutterY = 16,
  } = options;
  
  const contentWidth = containerWidth - (marginX * 2);
  const contentHeight = containerHeight - (marginY * 2);
  
  const columnWidth = (contentWidth - (gutterX * (columns - 1))) / columns;
  const rowHeight = (contentHeight - (gutterY * (rows - 1))) / rows;
  
  return {
    containerWidth,
    containerHeight,
    contentWidth,
    contentHeight,
    columns,
    rows,
    marginX,
    marginY,
    gutterX,
    gutterY,
    columnWidth,
    rowHeight,
    getColumnPosition: (col: number) => marginX + (columnWidth + gutterX) * col,
    getRowPosition: (row: number) => marginY + (rowHeight + gutterY) * row,
    getAreaWidth: (colSpan: number) => (columnWidth * colSpan) + (gutterX * (colSpan - 1)),
    getAreaHeight: (rowSpan: number) => (rowHeight * rowSpan) + (gutterY * (rowSpan - 1)),
  };
}
