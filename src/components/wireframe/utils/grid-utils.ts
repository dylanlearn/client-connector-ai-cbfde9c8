
import { fabric } from 'fabric';

// Define the types needed by other components
export interface GridBreakpoint {
  name: string;
  width: number;
  color?: string;
}

export interface GridConfig {
  visible: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  color: string;
  snapToGrid: boolean;
  snapTolerance: number;
  columns: number;
  gutterSize: number;
  marginSize: number;
  showBreakpoints: boolean;
  breakpoints: GridBreakpoint[];
}

export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 640, color: 'blue-500' },
  { name: 'md', width: 768, color: 'green-500' },
  { name: 'lg', width: 1024, color: 'orange-500' },
  { name: 'xl', width: 1280, color: 'red-500' },
  { name: '2xl', width: 1536, color: 'purple-500' }
];

export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  size: 8,
  type: 'lines',
  color: '#e0e0e0',
  snapToGrid: true,
  snapTolerance: 10,
  columns: 12,
  gutterSize: 16,
  marginSize: 24,
  showBreakpoints: true,
  breakpoints: TAILWIND_BREAKPOINTS
};

interface GridOptions {
  color?: string;
  opacity?: number;
  excludeFromExport?: boolean;
}

/**
 * Creates a grid pattern on the canvas
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  gridColor: string = '#e0e0e0',
  options: GridOptions = {}
): fabric.Object[] {
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridObjects: fabric.Object[] = [];
  
  const { 
    opacity = 0.5,
    excludeFromExport = true
  } = options;
  
  const commonProps = {
    stroke: gridColor,
    strokeWidth: 1,
    selectable: false,
    evented: false,
    excludeFromExport,
    opacity,
    data: { type: 'grid' }
  };
  
  if (gridType === 'dots') {
    // Create dot grid
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        const circle = new fabric.Circle({
          left: x,
          top: y,
          radius: 1,
          fill: gridColor,
          originX: 'center',
          originY: 'center',
          ...commonProps
        });
        
        gridObjects.push(circle);
      }
    }
  } else if (gridType === 'columns') {
    // Create column grid (vertical lines only)
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], commonProps);
      gridObjects.push(line);
    }
  } else {
    // Create standard line grid
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], commonProps);
      gridObjects.push(line);
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new fabric.Line([0, y, width, y], commonProps);
      gridObjects.push(line);
    }
  }
  
  return gridObjects;
}

/**
 * Removes any grid lines from the canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
}

/**
 * Updates the grid on an existing canvas 
 */
export function updateCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  showGrid: boolean = true,
  gridColor: string = '#e0e0e0'
): void {
  // First remove existing grid
  removeGridFromCanvas(canvas);
  
  // Then add new grid if enabled
  if (showGrid) {
    const gridObjects = createCanvasGrid(canvas, gridSize, gridType, gridColor);
    gridObjects.forEach(obj => canvas.add(obj));
    
    // Move grid objects to bottom
    gridObjects.forEach(obj => canvas.sendToBack(obj));
  }
  
  canvas.renderAll();
}

/**
 * Calculate positions for column grid
 */
export function calculateColumnPositions(
  width: number,
  columns: number,
  gutterSize: number,
  marginSize: number
): number[] {
  const positions: number[] = [];
  const columnWidth = (width - marginSize * 2 - gutterSize * (columns - 1)) / columns;
  
  // Add left margin
  positions.push(marginSize);
  
  // Add column positions
  for (let i = 0; i < columns; i++) {
    const position = marginSize + i * (columnWidth + gutterSize);
    positions.push(position);
    // Add right edge of column
    positions.push(position + columnWidth);
  }
  
  return positions;
}

/**
 * Calculate grid positions for lines or dots
 */
export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number
): { horizontal: number[], vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  for (let x = 0; x <= width; x += gridSize) {
    vertical.push(x);
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    horizontal.push(y);
  }
  
  return { horizontal, vertical };
}

/**
 * Get responsive grid configuration based on viewport width
 */
export function getResponsiveGridConfig(
  baseConfig: GridConfig,
  viewportWidth: number
): GridConfig {
  // Default to base config
  const config = { ...baseConfig };
  
  // Adjust based on viewport width
  if (viewportWidth < 640) {
    // Mobile
    config.columns = 4;
    config.gutterSize = 8;
    config.marginSize = 16;
  } else if (viewportWidth < 1024) {
    // Tablet
    config.columns = 8;
    config.gutterSize = 12;
    config.marginSize = 20;
  } else {
    // Desktop
    config.columns = 12;
    config.gutterSize = 16;
    config.marginSize = 24;
  }
  
  return config;
}

/**
 * Get breakpoint from width
 */
export function getBreakpointFromWidth(
  width: number,
  breakpoints: GridBreakpoint[] = TAILWIND_BREAKPOINTS
): GridBreakpoint | null {
  // Find the largest breakpoint that is smaller than or equal to the width
  const matchingBreakpoint = [...breakpoints]
    .sort((a, b) => b.width - a.width)
    .find(bp => width >= bp.width);
  
  return matchingBreakpoint || null;
}

/**
 * Get bounding box for an object
 */
export function getObjectBounds(obj: fabric.Object): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  const { left = 0, top = 0, width = 0, height = 0 } = obj;
  
  return {
    left,
    top,
    right: left + (width * (obj.scaleX || 1)),
    bottom: top + (height * (obj.scaleY || 1))
  };
}

/**
 * Generate snap guidelines for an object
 */
export function generateSnapGuidelines(
  canvas: fabric.Canvas,
  activeObject: fabric.Object,
  gridSize: number
): { horizontal: number[], vertical: number[] } {
  const objects = canvas.getObjects().filter(obj => 
    obj !== activeObject && 
    obj.data?.type !== 'grid' && 
    obj.visible !== false
  );
  
  const horizontal: Set<number> = new Set();
  const vertical: Set<number> = new Set();
  
  // Add grid lines
  for (let x = 0; x <= (canvas.width || 0); x += gridSize) {
    vertical.add(x);
  }
  
  for (let y = 0; y <= (canvas.height || 0); y += gridSize) {
    horizontal.add(y);
  }
  
  // Add guidelines from other objects
  objects.forEach(obj => {
    const bounds = getObjectBounds(obj);
    
    // Add top, center, bottom lines
    horizontal.add(bounds.top);
    horizontal.add(bounds.top + (bounds.bottom - bounds.top) / 2);
    horizontal.add(bounds.bottom);
    
    // Add left, center, right lines
    vertical.add(bounds.left);
    vertical.add(bounds.left + (bounds.right - bounds.left) / 2);
    vertical.add(bounds.right);
  });
  
  return {
    horizontal: Array.from(horizontal),
    vertical: Array.from(vertical)
  };
}

/**
 * Snap object to guidelines
 */
export function snapObjectToGuidelines(
  obj: fabric.Object,
  guidelines: { horizontal: number[], vertical: number[] },
  snapTolerance: number
): { snapX: number | null; snapY: number | null } {
  const bounds = getObjectBounds(obj);
  
  // Find closest horizontal guideline
  const closestY = guidelines.horizontal.reduce(
    (closest, guide) => {
      const distances = [
        Math.abs(guide - bounds.top),    // Snap top
        Math.abs(guide - (bounds.top + (bounds.bottom - bounds.top) / 2)),  // Snap center
        Math.abs(guide - bounds.bottom)  // Snap bottom
      ];
      
      const minDistance = Math.min(...distances);
      
      if (minDistance < snapTolerance && minDistance < closest.distance) {
        const edge = distances.indexOf(minDistance);
        let snapY;
        
        if (edge === 0) {
          // Snap top edge
          snapY = guide;
        } else if (edge === 1) {
          // Snap center 
          snapY = guide - (bounds.bottom - bounds.top) / 2;
        } else {
          // Snap bottom edge
          snapY = guide - (bounds.bottom - bounds.top);
        }
        
        return { distance: minDistance, value: snapY };
      }
      
      return closest;
    },
    { distance: snapTolerance, value: null }
  );
  
  // Find closest vertical guideline
  const closestX = guidelines.vertical.reduce(
    (closest, guide) => {
      const distances = [
        Math.abs(guide - bounds.left),   // Snap left
        Math.abs(guide - (bounds.left + (bounds.right - bounds.left) / 2)), // Snap center
        Math.abs(guide - bounds.right)   // Snap right
      ];
      
      const minDistance = Math.min(...distances);
      
      if (minDistance < snapTolerance && minDistance < closest.distance) {
        const edge = distances.indexOf(minDistance);
        let snapX;
        
        if (edge === 0) {
          // Snap left edge
          snapX = guide;
        } else if (edge === 1) {
          // Snap center 
          snapX = guide - (bounds.right - bounds.left) / 2;
        } else {
          // Snap right edge
          snapX = guide - (bounds.right - bounds.left);
        }
        
        return { distance: minDistance, value: snapX };
      }
      
      return closest;
    },
    { distance: snapTolerance, value: null }
  );
  
  return {
    snapX: closestX.value,
    snapY: closestY.value
  };
}
