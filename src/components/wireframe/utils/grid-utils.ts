
import { fabric } from 'fabric';
import { GridGuideline } from './types';

export interface GridConfig {
  columns: number;
  gutterSize: number;
  marginSize: number;
  breakpoints: GridBreakpoint[];
  type: 'bootstrap' | 'tailwind' | 'custom';
}

export interface GridBreakpoint {
  name: string;
  minWidth: number;
  columns?: number;
  gutterSize?: number;
  marginSize?: number;
}

export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', minWidth: 640 },
  { name: 'md', minWidth: 768 },
  { name: 'lg', minWidth: 1024 },
  { name: 'xl', minWidth: 1280 },
  { name: '2xl', minWidth: 1536 }
];

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 12,
  gutterSize: 16,
  marginSize: 24,
  breakpoints: TAILWIND_BREAKPOINTS,
  type: 'tailwind'
};

// Create grid positions for columns
export function calculateColumnPositions(
  width: number, 
  columns: number, 
  gutterSize: number, 
  marginSize: number
): number[] {
  const positions: number[] = [];
  const columnWidth = (width - (marginSize * 2) - ((columns - 1) * gutterSize)) / columns;
  
  // Add left margin position
  positions.push(marginSize);
  
  // Add column positions
  for (let i = 0; i < columns; i++) {
    const position = marginSize + (i * (columnWidth + gutterSize));
    positions.push(position);
    // Add position for end of column
    positions.push(position + columnWidth);
  }
  
  // Add right margin position
  positions.push(width - marginSize);
  
  return positions;
}

// Calculate grid positions for snapping
export function calculateGridPositions(
  width: number, 
  height: number, 
  gridSize: number
): { horizontal: number[], vertical: number[] } {
  const horizontal = [];
  const vertical = [];
  
  for (let x = 0; x <= width; x += gridSize) {
    vertical.push(x);
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    horizontal.push(y);
  }
  
  return { horizontal, vertical };
}

// Get appropriate grid config based on width
export function getResponsiveGridConfig(
  width: number, 
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridConfig {
  // Find the appropriate breakpoint
  const breakpoint = getBreakpointFromWidth(width, config.breakpoints);
  
  if (!breakpoint) {
    return config;
  }
  
  return {
    ...config,
    columns: breakpoint.columns || config.columns,
    gutterSize: breakpoint.gutterSize || config.gutterSize,
    marginSize: breakpoint.marginSize || config.marginSize
  };
}

// Get breakpoint from width
export function getBreakpointFromWidth(
  width: number, 
  breakpoints: GridBreakpoint[]
): GridBreakpoint | undefined {
  // Sort breakpoints by minWidth in descending order
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  
  // Find the first breakpoint that fits
  return sortedBreakpoints.find(bp => width >= bp.minWidth);
}

// Generate snap guidelines for an object
export function generateSnapGuidelines(
  allObjects: fabric.Object[],
  target: fabric.Object,
  threshold: number = 10
): GridGuideline[] {
  const guidelines: GridGuideline[] = [];
  
  if (!target) return guidelines;
  
  const targetBounds = {
    left: target.left || 0,
    top: target.top || 0,
    right: (target.left || 0) + (target.getScaledWidth() || 0),
    bottom: (target.top || 0) + (target.getScaledHeight() || 0),
    centerX: (target.left || 0) + (target.getScaledWidth() || 0) / 2,
    centerY: (target.top || 0) + (target.getScaledHeight() || 0) / 2,
  };
  
  // Check each object for potential alignment
  allObjects.forEach(obj => {
    if (obj === target || !obj.visible) return;
    
    const objBounds = {
      left: obj.left || 0,
      top: obj.top || 0,
      right: (obj.left || 0) + (obj.getScaledWidth() || 0),
      bottom: (obj.top || 0) + (obj.getScaledHeight() || 0),
      centerX: (obj.left || 0) + (obj.getScaledWidth() || 0) / 2,
      centerY: (obj.top || 0) + (obj.getScaledHeight() || 0) / 2,
    };
    
    // Check horizontal alignments
    
    // Left edge alignment
    if (Math.abs(targetBounds.left - objBounds.left) < threshold) {
      guidelines.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    // Right edge alignment
    if (Math.abs(targetBounds.right - objBounds.right) < threshold) {
      guidelines.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    // Center alignment
    if (Math.abs(targetBounds.centerX - objBounds.centerX) < threshold) {
      guidelines.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center'
      });
    }
    
    // Check vertical alignments
    
    // Top edge alignment
    if (Math.abs(targetBounds.top - objBounds.top) < threshold) {
      guidelines.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(targetBounds.bottom - objBounds.bottom) < threshold) {
      guidelines.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Middle alignment
    if (Math.abs(targetBounds.centerY - objBounds.centerY) < threshold) {
      guidelines.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center'
      });
    }
  });
  
  return guidelines;
}
