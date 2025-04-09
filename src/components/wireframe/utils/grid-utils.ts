
// Define types for grid system
import { fabric } from 'fabric';

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
  gutter?: number;
}

export interface GridBreakpoint {
  name: string;
  width: number;
  columns: number;
  color?: string;
}

// Define Tailwind CSS breakpoints
export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 640, columns: 12 },
  { name: 'md', width: 768, columns: 12 },
  { name: 'lg', width: 1024, columns: 12 },
  { name: 'xl', width: 1280, columns: 12 },
  { name: '2xl', width: 1536, columns: 12 }
];

// Default grid configuration
export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  snapToGrid: true,
  size: 8,
  type: 'lines',
  columns: 12,
  gutterSize: 16,
  marginSize: 16,
  showBreakpoints: true,
  breakpoints: TAILWIND_BREAKPOINTS
};

// Function to get responsive grid config based on width
export function getResponsiveGridConfig(width: number, baseConfig: GridConfig): GridConfig {
  // Find the appropriate breakpoint based on width
  const breakpoint = getBreakpointFromWidth(width, baseConfig.breakpoints);
  
  if (!breakpoint) {
    return baseConfig;
  }
  
  // Return modified config based on breakpoint
  return {
    ...baseConfig,
    columns: breakpoint.columns || baseConfig.columns
  };
}

// Function to get breakpoint from width
export function getBreakpointFromWidth(width: number, breakpoints: GridBreakpoint[]): GridBreakpoint | null {
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width);
  return sortedBreakpoints.find(bp => width >= bp.width) || null;
}

// Function to calculate positions for a grid of lines
export function calculateGridPositions(width: number, height: number, gridSize: number) {
  const horizontal = [];
  const vertical = [];
  
  // Calculate horizontal grid lines
  for (let i = 0; i <= height; i += gridSize) {
    horizontal.push(i);
  }
  
  // Calculate vertical grid lines
  for (let i = 0; i <= width; i += gridSize) {
    vertical.push(i);
  }
  
  return { horizontal, vertical };
}

// Function to calculate column positions for a grid
export function calculateColumnPositions(
  width: number,
  columns: number,
  gutterSize: number,
  marginSize: number
) {
  const positions = [];
  const contentWidth = width - (marginSize * 2);
  const columnWidth = (contentWidth - ((columns - 1) * gutterSize)) / columns;
  
  // Add left margin
  positions.push(marginSize);
  
  let currentPosition = marginSize;
  
  // Add column edges
  for (let i = 0; i < columns; i++) {
    currentPosition += columnWidth;
    positions.push(currentPosition);
    
    if (i < columns - 1) {
      currentPosition += gutterSize;
      positions.push(currentPosition);
    }
  }
  
  return positions;
}

// Function to get object bounds
export function getObjectBounds(obj: any) {
  const width = obj.width * obj.scaleX;
  const height = obj.height * obj.scaleY;
  
  return {
    left: obj.left,
    top: obj.top,
    right: obj.left + width,
    bottom: obj.top + height,
    centerX: obj.left + width / 2,
    centerY: obj.top + height / 2,
    width,
    height
  };
}

// Function to generate snap guidelines for grid
export function generateSnapGuidelines(width: number, height: number, gridSize: number) {
  const guidelines = [];
  
  // Generate horizontal guidelines
  for (let i = 0; i <= height; i += gridSize) {
    guidelines.push({
      position: i,
      orientation: 'horizontal',
      type: 'grid'
    });
  }
  
  // Generate vertical guidelines
  for (let i = 0; i <= width; i += gridSize) {
    guidelines.push({
      position: i,
      orientation: 'vertical',
      type: 'grid'
    });
  }
  
  return guidelines;
}

// Function to create a canvas grid
export function createCanvasGrid(canvas: fabric.Canvas, gridSize: number, gridType: string) {
  const width = canvas.width || 0;
  const height = canvas.height || 0;
  const gridLines = [];
  
  if (gridType === 'lines' || gridType === 'columns') {
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 0.5
      });
      gridLines.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 0.5
      });
      gridLines.push(line);
    }
  }
  
  return gridLines;
}

// Function to snap object to guidelines
export function snapObjectToGuidelines(obj: fabric.Object, guidelines: any[], tolerance: number = 10) {
  const objBounds = getObjectBounds(obj);
  
  for (const guideline of guidelines) {
    if (guideline.orientation === 'horizontal') {
      // Check for horizontal snap
      if (Math.abs(objBounds.top - guideline.position) < tolerance) {
        obj.set('top', guideline.position);
      } else if (Math.abs(objBounds.centerY - guideline.position) < tolerance) {
        obj.set('top', guideline.position - objBounds.height / 2);
      } else if (Math.abs(objBounds.bottom - guideline.position) < tolerance) {
        obj.set('top', guideline.position - objBounds.height);
      }
    } else if (guideline.orientation === 'vertical') {
      // Check for vertical snap
      if (Math.abs(objBounds.left - guideline.position) < tolerance) {
        obj.set('left', guideline.position);
      } else if (Math.abs(objBounds.centerX - guideline.position) < tolerance) {
        obj.set('left', guideline.position - objBounds.width / 2);
      } else if (Math.abs(objBounds.right - guideline.position) < tolerance) {
        obj.set('left', guideline.position - objBounds.width);
      }
    }
  }
  
  return obj;
}
