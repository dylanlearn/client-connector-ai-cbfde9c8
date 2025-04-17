
import { fabric } from 'fabric';
import { EnterpriseGridConfig, GridBreakpoint } from '../types/canvas-types';

/**
 * Configuration for grid system
 */
export interface GridConfig {
  visible: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns' | 'custom';
  snapToGrid: boolean;
  color: string;
  showNumbers: boolean;
  opacity: number;
  responsive: boolean;
  breakpoints: GridBreakpoint[];
  currentBreakpoint: string;
}

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  size: 10,
  type: 'lines',
  snapToGrid: true,
  color: '#e0e0e0',
  showNumbers: false,
  opacity: 0.5,
  responsive: true,
  breakpoints: [
    { name: 'xs', width: 480, columns: 4, gutterWidth: 16, marginWidth: 16 },
    { name: 'sm', width: 640, columns: 6, gutterWidth: 16, marginWidth: 24 },
    { name: 'md', width: 768, columns: 8, gutterWidth: 24, marginWidth: 24 },
    { name: 'lg', width: 1024, columns: 12, gutterWidth: 24, marginWidth: 32 },
    { name: 'xl', width: 1280, columns: 12, gutterWidth: 32, marginWidth: 40 },
    { name: '2xl', width: 1536, columns: 12, gutterWidth: 32, marginWidth: 48 }
  ],
  currentBreakpoint: 'lg'
};

/**
 * Tailwind breakpoint definitions
 */
export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'xs', width: 480, columns: 4, gutterWidth: 16, marginWidth: 16 },
  { name: 'sm', width: 640, columns: 6, gutterWidth: 16, marginWidth: 24 },
  { name: 'md', width: 768, columns: 8, gutterWidth: 24, marginWidth: 24 },
  { name: 'lg', width: 1024, columns: 12, gutterWidth: 24, marginWidth: 32 },
  { name: 'xl', width: 1280, columns: 12, gutterWidth: 32, marginWidth: 40 },
  { name: '2xl', width: 1536, columns: 12, gutterWidth: 32, marginWidth: 48 }
];

/**
 * Create grid lines on the canvas
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: string = 'lines',
  gridColor: string = '#e0e0e0'
): fabric.Line[] {
  const gridLines: fabric.Line[] = [];
  const canvasWidth = canvas.width || 1200;
  const canvasHeight = canvas.height || 800;
  
  // For performance, limit grid lines to a reasonable number
  const maxGridLines = 500;
  const stepSize = Math.ceil(Math.max(
    canvasWidth / maxGridLines, 
    canvasHeight / maxGridLines, 
    gridSize
  ));
  
  if (gridType === 'lines' || gridType === 'columns') {
    // Create vertical grid lines
    for (let i = 0; i <= canvasWidth; i += stepSize) {
      gridLines.push(
        new fabric.Line([i, 0, i, canvasHeight], {
          stroke: gridColor,
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          name: 'grid-line'
        })
      );
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= canvasHeight; i += stepSize) {
      gridLines.push(
        new fabric.Line([0, i, canvasWidth, i], {
          stroke: gridColor,
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          name: 'grid-line'
        })
      );
    }
  }
  
  return gridLines;
}

/**
 * Remove grid from canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.name === 'grid-line');
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.renderAll();
}

/**
 * Update grid on canvas
 */
export function updateCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: string = 'lines',
  gridColor: string = '#e0e0e0'
): void {
  // Remove existing grid
  removeGridFromCanvas(canvas);
  
  // Create new grid
  const gridLines = createCanvasGrid(canvas, gridSize, gridType, gridColor);
  
  // Add grid lines to canvas
  gridLines.forEach(line => {
    canvas.add(line);
  });
  
  // Send grid to back and render
  gridLines.forEach(line => {
    line.sendToBack();
  });
  
  canvas.renderAll();
}

/**
 * Calculate positions for column-based grid
 */
export function calculateColumnPositions(
  containerWidth: number,
  columns: number = 12,
  gutterSize: number = 20,
  marginSize: number = 40
): number[] {
  const positions: number[] = [];
  
  // Calculate the column width
  const availableWidth = containerWidth - (marginSize * 2) - ((columns - 1) * gutterSize);
  const columnWidth = availableWidth / columns;
  
  // Left margin position
  positions.push(marginSize);
  
  // Calculate column positions
  let currentPosition = marginSize;
  
  for (let i = 0; i < columns; i++) {
    // Add column position
    positions.push(currentPosition);
    
    // Move to next column
    currentPosition += columnWidth;
    
    if (i < columns - 1) {
      // Add position after gutter
      positions.push(currentPosition + gutterSize);
      currentPosition += gutterSize;
    }
  }
  
  // Right margin position
  positions.push(containerWidth - marginSize);
  
  return positions;
}

/**
 * Calculate grid positions for both axes
 */
export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number = 10
): { horizontal: number[]; vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  // Create positions
  for (let x = 0; x <= width; x += gridSize) {
    vertical.push(x);
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    horizontal.push(y);
  }
  
  return { horizontal, vertical };
}

/**
 * Get responsive grid config based on current width
 */
export function getResponsiveGridConfig(
  config: GridConfig | EnterpriseGridConfig,
  currentWidth: number
): GridConfig | EnterpriseGridConfig {
  if (!config.responsive) {
    return config;
  }
  
  // Find the appropriate breakpoint
  const sortedBreakpoints = [...config.breakpoints].sort((a, b) => b.width - a.width);
  const activeBreakpoint = sortedBreakpoints.find(bp => currentWidth >= bp.width) || 
    sortedBreakpoints[sortedBreakpoints.length - 1];
  
  if (activeBreakpoint) {
    return {
      ...config,
      currentBreakpoint: activeBreakpoint.name,
      columns: activeBreakpoint.columns,
      gutterWidth: activeBreakpoint.gutterWidth,
      marginWidth: activeBreakpoint.marginWidth
    };
  }
  
  return config;
}

/**
 * Get breakpoint from width
 */
export function getBreakpointFromWidth(
  width: number,
  breakpoints: GridBreakpoint[] = TAILWIND_BREAKPOINTS
): GridBreakpoint | undefined {
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width);
  return sortedBreakpoints.find(bp => width >= bp.width);
}

/**
 * Get object bounds with rotation
 */
export function getObjectBounds(obj: fabric.Object): {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
} {
  const bounds = obj.getBoundingRect();
  
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.left + bounds.width,
    bottom: bounds.top + bounds.height,
    width: bounds.width,
    height: bounds.height,
    centerX: bounds.left + bounds.width / 2,
    centerY: bounds.top + bounds.height / 2
  };
}

/**
 * Generate snap guidelines for object
 */
export function generateSnapGuidelines(obj: fabric.Object): {
  vertical: number[];
  horizontal: number[];
} {
  const bounds = getObjectBounds(obj);
  
  return {
    vertical: [
      bounds.left,            // Left edge
      bounds.centerX,         // Center
      bounds.right            // Right edge
    ],
    horizontal: [
      bounds.top,             // Top edge
      bounds.centerY,         // Center
      bounds.bottom           // Bottom edge
    ]
  };
}

/**
 * Snap object to guidelines
 */
export function snapObjectToGuidelines(
  obj: fabric.Object,
  guidelines: { vertical: number[]; horizontal: number[] },
  threshold: number = 5
): { snappedX: boolean; snappedY: boolean } {
  const objGuidelines = generateSnapGuidelines(obj);
  let snappedX = false;
  let snappedY = false;
  
  // Check vertical guidelines
  for (const objGuide of objGuidelines.vertical) {
    for (const guidelinePosition of guidelines.vertical) {
      if (Math.abs(objGuide - guidelinePosition) <= threshold) {
        const offset = guidelinePosition - objGuide;
        
        // Apply offset based on which edge we're snapping
        if (objGuide === objGuidelines.vertical[0]) { // Left edge
          obj.set('left', obj.left! + offset);
        } else if (objGuide === objGuidelines.vertical[1]) { // Center
          obj.set('left', obj.left! + offset);
        } else if (objGuide === objGuidelines.vertical[2]) { // Right edge
          obj.set('left', obj.left! + offset);
        }
        
        snappedX = true;
        break;
      }
    }
    
    if (snappedX) break;
  }
  
  // Check horizontal guidelines
  for (const objGuide of objGuidelines.horizontal) {
    for (const guidelinePosition of guidelines.horizontal) {
      if (Math.abs(objGuide - guidelinePosition) <= threshold) {
        const offset = guidelinePosition - objGuide;
        
        // Apply offset based on which edge we're snapping
        if (objGuide === objGuidelines.horizontal[0]) { // Top edge
          obj.set('top', obj.top! + offset);
        } else if (objGuide === objGuidelines.horizontal[1]) { // Center
          obj.set('top', obj.top! + offset);
        } else if (objGuide === objGuidelines.horizontal[2]) { // Bottom edge
          obj.set('top', obj.top! + offset);
        }
        
        snappedY = true;
        break;
      }
    }
    
    if (snappedY) break;
  }
  
  if (snappedX || snappedY) {
    obj.setCoords();
  }
  
  return { snappedX, snappedY };
}
