
import { fabric } from 'fabric';
import { GridGuideline } from '@/components/wireframe/utils/types';

// Define the necessary types for grid system
export interface GridConfig {
  visible: boolean;
  snapToGrid: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutterSize: number;
  marginSize: number;
  showBreakpoints: boolean;
  breakpoints: GridBreakpoint[];
}

export interface GridBreakpoint {
  name: string;
  width: number;
  color?: string;
  description?: string;
}

// Default breakpoints following Tailwind CSS conventions
export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 640, color: 'blue-500', description: 'Small devices' },
  { name: 'md', width: 768, color: 'green-500', description: 'Medium devices' },
  { name: 'lg', width: 1024, color: 'yellow-500', description: 'Large devices' },
  { name: 'xl', width: 1280, color: 'red-500', description: 'Extra-large devices' },
  { name: '2xl', width: 1536, color: 'purple-500', description: '2X Extra-large devices' }
];

// Default grid configuration
export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  snapToGrid: true,
  size: 8,
  type: 'lines',
  columns: 12,
  gutterSize: 24,
  marginSize: 16,
  showBreakpoints: false,
  breakpoints: TAILWIND_BREAKPOINTS
};

/**
 * Get a responsive grid config based on current width
 * @param width Current viewport width
 * @param baseConfig Base grid config
 * @returns Adjusted grid config for the current width
 */
export function getResponsiveGridConfig(
  width: number,
  baseConfig: GridConfig = DEFAULT_GRID_CONFIG
): GridConfig {
  // Create a responsive configuration based on width
  let responsiveConfig = { ...baseConfig };
  
  // Adjust grid size based on viewport width
  if (width < 640) { // Mobile
    responsiveConfig.size = Math.max(4, Math.floor(baseConfig.size * 0.75));
    responsiveConfig.columns = 4;
    responsiveConfig.gutterSize = 16;
  } else if (width < 1024) { // Tablet
    responsiveConfig.size = Math.max(6, Math.floor(baseConfig.size * 0.9));
    responsiveConfig.columns = 8;
    responsiveConfig.gutterSize = 20;
  }
  
  return responsiveConfig;
}

/**
 * Get the current breakpoint based on width
 * @param width Current viewport width
 * @param breakpoints List of breakpoints to check against
 * @returns The matching breakpoint or null if no match
 */
export function getBreakpointFromWidth(
  width: number,
  breakpoints: GridBreakpoint[] = TAILWIND_BREAKPOINTS
): GridBreakpoint | null {
  // Sort breakpoints from largest to smallest
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width);
  
  // Find the first breakpoint that's smaller than or equal to the current width
  for (const bp of sortedBreakpoints) {
    if (width >= bp.width) {
      return bp;
    }
  }
  
  // If no match found, return the smallest breakpoint
  return sortedBreakpoints[sortedBreakpoints.length - 1] || null;
}

/**
 * Calculate column positions for a grid layout
 * @param totalWidth Total width of the canvas
 * @param columnCount Number of columns
 * @param gutterSize Size of gutters between columns
 * @param marginSize Size of margins on left and right
 * @returns Array of x positions for column guidelines
 */
export function calculateColumnPositions(
  totalWidth: number,
  columnCount: number = 12,
  gutterSize: number = 24,
  marginSize: number = 16
): number[] {
  const positions: number[] = [];
  
  // Calculate the effective width (total width minus margins)
  const effectiveWidth = totalWidth - (marginSize * 2);
  
  // Calculate the width of each column
  // (effectiveWidth - gutters) / columnCount
  const gutters = gutterSize * (columnCount - 1);
  const columnWidth = (effectiveWidth - gutters) / columnCount;
  
  // Calculate the position of each column
  for (let i = 0; i <= columnCount; i++) {
    const x = marginSize + (i * (columnWidth + gutterSize));
    positions.push(x);
  }
  
  return positions;
}

/**
 * Calculate grid positions for standard grid layout
 * @param width Width of the canvas
 * @param height Height of the canvas
 * @param gridSize Size of grid cells
 * @returns Object with horizontal and vertical grid positions
 */
export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number = 8
): { horizontal: number[], vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  // Calculate horizontal grid positions
  for (let y = 0; y <= height; y += gridSize) {
    horizontal.push(y);
  }
  
  // Calculate vertical grid positions
  for (let x = 0; x <= width; x += gridSize) {
    vertical.push(x);
  }
  
  return { horizontal, vertical };
}

/**
 * Generates a set of guidelines for an object to snap to when dragged near other objects
 * @param objects - The objects to compare against
 * @param activeObject - The object being dragged
 * @param threshold - The distance threshold for snapping
 * @returns Array of guidelines for snapping
 */
export function generateSnapGuidelines(
  objects: fabric.Object[],
  activeObject: fabric.Object,
  threshold: number = 10
): GridGuideline[] {
  if (!activeObject) return [];

  const guidelines: GridGuideline[] = [];
  
  // Calculate bounds for active object
  const activeObjectBounds = getObjectBounds(activeObject);
  
  objects.forEach(obj => {
    if (obj === activeObject) return;
    
    const objBounds = getObjectBounds(obj);
    
    // Check for horizontal alignments (tops, centers, bottoms)
    // Top edge alignment
    if (Math.abs(objBounds.top - activeObjectBounds.top) < threshold) {
      guidelines.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Center alignment
    if (Math.abs(objBounds.centerY - activeObjectBounds.centerY) < threshold) {
      guidelines.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center'
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(objBounds.bottom - activeObjectBounds.bottom) < threshold) {
      guidelines.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Check for vertical alignments (lefts, centers, rights)
    // Left edge alignment
    if (Math.abs(objBounds.left - activeObjectBounds.left) < threshold) {
      guidelines.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    // Center alignment
    if (Math.abs(objBounds.centerX - activeObjectBounds.centerX) < threshold) {
      guidelines.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center'
      });
    }
    
    // Right edge alignment
    if (Math.abs(objBounds.right - activeObjectBounds.right) < threshold) {
      guidelines.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    // Equal spacing/distribution between objects (simplified version)
    // This would be more complex in a full implementation
  });
  
  return guidelines;
}

/**
 * Calculate and get the bounding box coordinates of an object
 * @param obj The fabric object to calculate bounds for
 * @returns Object containing bounds coordinates
 */
export function getObjectBounds(obj: fabric.Object) {
  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();
  const left = obj.left || 0;
  const top = obj.top || 0;
  
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    width,
    height
  };
}

/**
 * Creates a grid of lines for the canvas background
 * @param canvas The fabric canvas
 * @param gridSize Size of the grid cells
 * @param gridType Type of grid to create ('lines', 'dots', 'columns')
 * @returns Array of fabric objects representing the grid
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines'
): fabric.Object[] {
  if (!canvas) return [];
  
  const gridObjects: fabric.Object[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  switch (gridType) {
    case 'dots':
      // Create dots at grid intersections
      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          const dot = new fabric.Circle({
            left: x,
            top: y,
            radius: 1,
            fill: '#ccc',
            stroke: '',
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            hoverCursor: 'default'
          });
          gridObjects.push(dot);
        }
      }
      break;
      
    case 'columns':
      // Create a column-based grid (vertical lines only, with different spacing)
      const columnCount = 12; // Standard 12-column grid
      const columnWidth = width / columnCount;
      
      for (let i = 0; i <= columnCount; i++) {
        const x = i * columnWidth;
        const isMainColumn = i % 3 === 0;
        
        const line = new fabric.Line([x, 0, x, height], {
          stroke: isMainColumn ? '#aaa' : '#ddd',
          strokeWidth: isMainColumn ? 0.5 : 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      
      // Add some horizontal lines for reference
      for (let y = 0; y <= height; y += gridSize * 5) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#ddd',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      break;
      
    case 'lines':
    default:
      // Create standard grid lines
      for (let x = 0; x <= width; x += gridSize) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: '#e0e0e0',
          strokeWidth: x % (gridSize * 5) === 0 ? 0.7 : 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      
      for (let y = 0; y <= height; y += gridSize) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#e0e0e0',
          strokeWidth: y % (gridSize * 5) === 0 ? 0.7 : 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      break;
  }
  
  return gridObjects;
}

/**
 * Applies snap logic to move an object to specified guidelines
 * @param object The fabric object to snap
 * @param guidelines The guidelines to snap to
 * @param canvas The fabric canvas
 */
export function snapObjectToGuidelines(
  object: fabric.Object, 
  guidelines: GridGuideline[],
  canvas: fabric.Canvas
): void {
  if (!object || !guidelines.length) return;
  
  const objectBounds = getObjectBounds(object);
  
  let horizontalSnap = false;
  let verticalSnap = false;
  
  // Process horizontal guidelines
  const horizontalGuidelines = guidelines.filter(g => g.orientation === 'horizontal');
  if (horizontalGuidelines.length) {
    // Sort by type importance (edge > center > distribution)
    const sortedH = [...horizontalGuidelines].sort((a, b) => {
      // Priority: edge, center, distribution
      const typePriority = { 'edge': 0, 'center': 1, 'distribution': 2 };
      return typePriority[a.type] - typePriority[b.type];
    });
    
    const guide = sortedH[0]; // Use most important guide
    
    // Apply snap based on type
    switch (guide.type) {
      case 'edge':
        // Check if this is a top or bottom edge snap
        if (Math.abs(guide.position - objectBounds.top) <= Math.abs(guide.position - objectBounds.bottom)) {
          object.set('top', guide.position);
        } else {
          object.set('top', guide.position - objectBounds.height);
        }
        horizontalSnap = true;
        break;
      case 'center':
        object.set('top', guide.position - objectBounds.height / 2);
        horizontalSnap = true;
        break;
      case 'distribution':
        // More complex distribution logic would go here
        break;
    }
  }
  
  // Process vertical guidelines
  const verticalGuidelines = guidelines.filter(g => g.orientation === 'vertical');
  if (verticalGuidelines.length) {
    // Sort by type importance (edge > center > distribution)
    const sortedV = [...verticalGuidelines].sort((a, b) => {
      // Priority: edge, center, distribution
      const typePriority = { 'edge': 0, 'center': 1, 'distribution': 2 };
      return typePriority[a.type] - typePriority[b.type];
    });
    
    const guide = sortedV[0]; // Use most important guide
    
    // Apply snap based on type
    switch (guide.type) {
      case 'edge':
        // Check if this is a left or right edge snap
        if (Math.abs(guide.position - objectBounds.left) <= Math.abs(guide.position - objectBounds.right)) {
          object.set('left', guide.position);
        } else {
          object.set('left', guide.position - objectBounds.width);
        }
        verticalSnap = true;
        break;
      case 'center':
        object.set('left', guide.position - objectBounds.width / 2);
        verticalSnap = true;
        break;
      case 'distribution':
        // More complex distribution logic would go here
        break;
    }
  }
  
  if (horizontalSnap || verticalSnap) {
    canvas.renderAll();
  }
}
