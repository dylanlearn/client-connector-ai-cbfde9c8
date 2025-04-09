
import { DeviceType } from './responsive-utils';
import { fabric } from 'fabric';
import { GridGuideline } from './types';

export interface GridBreakpoint {
  name: string;
  width: number;
  color?: string;
}

export interface GridConfig {
  visible: boolean;
  snapToGrid: boolean;
  showBreakpoints: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutter: number;
  gutterSize: number;
  marginSize: number;
  breakpoints: GridBreakpoint[];
  columnLineColor?: string;
  guidelineColor?: string;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  snapToGrid: true,
  showBreakpoints: true,
  size: 8,
  type: 'lines',
  columns: 12,
  gutter: 16,
  gutterSize: 16,
  marginSize: 16,
  breakpoints: [
    { name: 'SM', width: 640, color: 'purple-500' },
    { name: 'MD', width: 768, color: 'blue-500' },
    { name: 'LG', width: 1024, color: 'green-500' },
    { name: 'XL', width: 1280, color: 'amber-500' },
    { name: '2XL', width: 1536, color: 'red-500' }
  ]
};

export const TAILWIND_BREAKPOINTS = [
  { name: 'SM', width: 640 },
  { name: 'MD', width: 768 },
  { name: 'LG', width: 1024 },
  { name: 'XL', width: 1280 },
  { name: '2XL', width: 1536 }
];

export function getResponsiveGridConfig(width: number, baseConfig: GridConfig): GridConfig {
  // Adjust grid configuration based on viewport width
  let responsive: Partial<GridConfig> = {};

  if (width < 640) {
    // Mobile
    responsive = {
      columns: 4,
      gutterSize: 8,
      marginSize: 8,
      size: 4
    };
  } else if (width < 1024) {
    // Tablet
    responsive = {
      columns: 8,
      gutterSize: 12,
      marginSize: 12,
      size: 6
    };
  }

  // Return merged configuration
  return {
    ...baseConfig,
    ...responsive
  };
}

export function getBreakpointFromWidth(width: number): string {
  if (width < 640) return 'XS';
  if (width < 768) return 'SM';
  if (width < 1024) return 'MD';
  if (width < 1280) return 'LG';
  if (width < 1536) return 'XL';
  return '2XL';
}

export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number
): { horizontal: number[]; vertical: number[] } {
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

export function calculateColumnPositions(
  width: number,
  columns: number,
  gutterSize: number,
  marginSize: number
): number[] {
  const positions: number[] = [];
  
  // Content width (excluding margins)
  const contentWidth = width - (marginSize * 2);
  
  // Calculate gutters total width
  const guttersWidth = (columns - 1) * gutterSize;
  
  // Single column width
  const columnWidth = (contentWidth - guttersWidth) / columns;
  
  // Calculate each column position
  for (let i = 0; i < columns; i++) {
    // Left edge of column
    const leftPosition = marginSize + (i * (columnWidth + gutterSize));
    positions.push(leftPosition);
    
    // Right edge of column
    const rightPosition = leftPosition + columnWidth;
    positions.push(rightPosition);
  }
  
  return positions;
}

// Add the missing function for generating snap guidelines
export function generateSnapGuidelines(
  allObjects: fabric.Object[],
  activeObject: fabric.Object,
  snapThreshold: number = 10
): GridGuideline[] {
  const guidelines: GridGuideline[] = [];

  // Get active object bounds
  const activeBounds = {
    left: activeObject.left || 0,
    top: activeObject.top || 0,
    right: (activeObject.left || 0) + (activeObject.getScaledWidth() || 0),
    bottom: (activeObject.top || 0) + (activeObject.getScaledHeight() || 0),
    centerX: (activeObject.left || 0) + (activeObject.getScaledWidth() || 0) / 2,
    centerY: (activeObject.top || 0) + (activeObject.getScaledHeight() || 0) / 2
  };

  // Check against each other object
  allObjects.forEach((obj) => {
    if (obj === activeObject) return;

    const objBounds = {
      left: obj.left || 0,
      top: obj.top || 0,
      right: (obj.left || 0) + (obj.getScaledWidth() || 0),
      bottom: (obj.top || 0) + (obj.getScaledHeight() || 0),
      centerX: (obj.left || 0) + (obj.getScaledWidth() || 0) / 2,
      centerY: (obj.top || 0) + (obj.getScaledHeight() || 0) / 2
    };

    // Horizontal alignments
    if (Math.abs(activeBounds.left - objBounds.left) < snapThreshold) {
      guidelines.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge'
      });
    }

    if (Math.abs(activeBounds.right - objBounds.right) < snapThreshold) {
      guidelines.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge'
      });
    }

    if (Math.abs(activeBounds.centerX - objBounds.centerX) < snapThreshold) {
      guidelines.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center'
      });
    }

    // Vertical alignments
    if (Math.abs(activeBounds.top - objBounds.top) < snapThreshold) {
      guidelines.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge'
      });
    }

    if (Math.abs(activeBounds.bottom - objBounds.bottom) < snapThreshold) {
      guidelines.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge'
      });
    }

    if (Math.abs(activeBounds.centerY - objBounds.centerY) < snapThreshold) {
      guidelines.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center'
      });
    }

    // Distribution guidelines (equal spacing)
    // This is a simplified version, you can extend it as needed
  });

  return guidelines;
}
