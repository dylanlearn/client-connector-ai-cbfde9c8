
import { fabric } from 'fabric';
import { AlignmentGuide } from './types';

export interface GridConfig {
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  containerWidth: number;
  visible: boolean;
  snapToGrid: boolean;
  showBreakpoints: boolean;
  type: 'lines' | 'dots' | 'columns';
  size: number;
  gutterSize: number;
  marginSize: number;
  breakpoints: GridBreakpoint[];
}

export interface GridBreakpoint {
  name: string;
  minWidth: number;
  width: number;
  gridConfig: GridConfig;
  color?: string;
}

export const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 12,
  gutterWidth: 16,
  marginWidth: 24,
  containerWidth: 1200,
  visible: true,
  snapToGrid: true,
  showBreakpoints: false,
  type: 'lines',
  size: 10,
  gutterSize: 16,
  marginSize: 24,
  breakpoints: [
    { name: 'SM', minWidth: 640, width: 640, color: 'blue-500', gridConfig: { columns: 6, gutterWidth: 12, marginWidth: 16, containerWidth: 640, visible: true, snapToGrid: true, showBreakpoints: false, type: 'lines', size: 10, gutterSize: 12, marginSize: 16, breakpoints: [] } },
    { name: 'MD', minWidth: 768, width: 768, color: 'green-500', gridConfig: { columns: 8, gutterWidth: 16, marginWidth: 24, containerWidth: 768, visible: true, snapToGrid: true, showBreakpoints: false, type: 'lines', size: 10, gutterSize: 16, marginSize: 24, breakpoints: [] } },
    { name: 'LG', minWidth: 1024, width: 1024, color: 'yellow-500', gridConfig: { columns: 12, gutterWidth: 24, marginWidth: 32, containerWidth: 1024, visible: true, snapToGrid: true, showBreakpoints: false, type: 'lines', size: 10, gutterSize: 24, marginSize: 32, breakpoints: [] } }
  ]
};

/**
 * Generate guidelines for snapping objects to the grid
 */
export function generateSnapGuidelines(
  canvas: fabric.Canvas, 
  gridSize: number = 10
): number[] {
  const guidelines: number[] = [];
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Generate horizontal guidelines
  for (let i = 0; i <= height; i += gridSize) {
    guidelines.push(i);
  }
  
  // Generate vertical guidelines
  for (let i = 0; i <= width; i += gridSize) {
    guidelines.push(i);
  }
  
  return guidelines;
}

/**
 * Create grid lines for canvas background
 */
export function createCanvasGrid(
  canvas: fabric.Canvas, 
  gridSize: number = 10, 
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  gridColor: string = '#e0e0e0'
): fabric.Line[] {
  const gridLines: fabric.Line[] = [];
  
  if (!canvas) return gridLines;
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Default style for grid lines
  const gridStrokeWidth = 1;
  
  switch (gridType) {
    case 'dots':
      // Create dot pattern instead of lines
      for (let i = 0; i <= width; i += gridSize) {
        for (let j = 0; j <= height; j += gridSize) {
          const dot = new fabric.Circle({
            left: i,
            top: j,
            radius: 1,
            fill: gridColor,
            selectable: false,
            evented: false,
            data: { type: 'grid' }
          });
          gridLines.push(dot as unknown as fabric.Line);
        }
      }
      break;
      
    case 'columns':
      // Create column layout grid
      const config = DEFAULT_GRID_CONFIG;
      const columnWidth = (width - (config.marginWidth * 2) - (config.gutterWidth * (config.columns - 1))) / config.columns;
      
      // Add margin guides
      gridLines.push(
        new fabric.Line(
          [config.marginWidth, 0, config.marginWidth, height], 
          { stroke: gridColor, strokeWidth: gridStrokeWidth, selectable: false, evented: false, data: { type: 'grid' } }
        ),
        new fabric.Line(
          [width - config.marginWidth, 0, width - config.marginWidth, height], 
          { stroke: gridColor, strokeWidth: gridStrokeWidth, selectable: false, evented: false, data: { type: 'grid' } }
        )
      );
      
      // Add column guides
      let xPosition = config.marginWidth;
      for (let col = 0; col < config.columns; col++) {
        // Column right edge
        xPosition += columnWidth;
        gridLines.push(
          new fabric.Line(
            [xPosition, 0, xPosition, height], 
            { stroke: gridColor, strokeWidth: gridStrokeWidth, selectable: false, evented: false, data: { type: 'grid' } }
          )
        );
        
        // Gutter
        if (col < config.columns - 1) {
          xPosition += config.gutterWidth;
          gridLines.push(
            new fabric.Line(
              [xPosition, 0, xPosition, height], 
              { stroke: gridColor, strokeWidth: gridStrokeWidth, selectable: false, evented: false, data: { type: 'grid' } }
            )
          );
        }
      }
      break;
      
    case 'lines':
    default:
      // Horizontal grid lines
      for (let i = 0; i <= height; i += gridSize) {
        gridLines.push(
          new fabric.Line(
            [0, i, width, i], 
            { stroke: gridColor, strokeWidth: gridStrokeWidth, selectable: false, evented: false, data: { type: 'grid' } }
          )
        );
      }
      
      // Vertical grid lines
      for (let i = 0; i <= width; i += gridSize) {
        gridLines.push(
          new fabric.Line(
            [i, 0, i, height], 
            { stroke: gridColor, strokeWidth: gridStrokeWidth, selectable: false, evented: false, data: { type: 'grid' } }
          )
        );
      }
      break;
  }
  
  return gridLines;
}

/**
 * Snap an object to the nearest grid guidelines
 */
export function snapObjectToGuidelines(
  object: fabric.Object, 
  guidelines: number[], 
  tolerance: number = 10
): { left?: number; top?: number } {
  if (!object) return {};
  
  const objectBounds = getObjectBounds(object);
  const updates: { left?: number; top?: number } = {};
  
  // Horizontal snapping
  const horizontalEdges = [
    objectBounds.top,
    objectBounds.top + objectBounds.height / 2,
    objectBounds.top + objectBounds.height
  ];
  
  // Vertical snapping
  const verticalEdges = [
    objectBounds.left,
    objectBounds.left + objectBounds.width / 2,
    objectBounds.left + objectBounds.width
  ];
  
  // Find the closest guidelines
  let minHorizontalDistance = tolerance + 1;
  let minVerticalDistance = tolerance + 1;
  
  for (let i = 0; i < horizontalEdges.length; i++) {
    const edge = horizontalEdges[i];
    
    for (let j = 0; j < guidelines.length; j++) {
      const guideline = guidelines[j];
      const distance = Math.abs(edge - guideline);
      
      if (distance < tolerance && distance < minHorizontalDistance) {
        minHorizontalDistance = distance;
        
        // Calculate the new top based on which edge is snapping
        if (i === 0) { // top edge
          updates.top = guideline;
        } else if (i === 1) { // middle
          updates.top = guideline - objectBounds.height / 2;
        } else { // bottom edge
          updates.top = guideline - objectBounds.height;
        }
      }
    }
  }
  
  for (let i = 0; i < verticalEdges.length; i++) {
    const edge = verticalEdges[i];
    
    for (let j = 0; j < guidelines.length; j++) {
      const guideline = guidelines[j];
      const distance = Math.abs(edge - guideline);
      
      if (distance < tolerance && distance < minVerticalDistance) {
        minVerticalDistance = distance;
        
        // Calculate the new left based on which edge is snapping
        if (i === 0) { // left edge
          updates.left = guideline;
        } else if (i === 1) { // middle
          updates.left = guideline - objectBounds.width / 2;
        } else { // right edge
          updates.left = guideline - objectBounds.width;
        }
      }
    }
  }
  
  return updates;
}

/**
 * Get the bounds of an object
 */
export function getObjectBounds(object: fabric.Object): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const { left = 0, top = 0, width = 0, height = 0 } = object;
  return { left, top, width, height };
}

/**
 * Calculate positions for column-based grid
 */
export function calculateColumnPositions(
  width: number,
  columns: number,
  gutterSize: number,
  marginSize: number
): number[] {
  const positions: number[] = [];
  
  // Left margin
  positions.push(marginSize);
  
  let position = marginSize;
  const availableWidth = width - (marginSize * 2);
  const totalGutterWidth = gutterSize * (columns - 1);
  const columnWidth = (availableWidth - totalGutterWidth) / columns;
  
  for (let i = 0; i < columns; i++) {
    position += columnWidth;
    positions.push(position); // Column end
    
    if (i < columns - 1) {
      position += gutterSize;
      positions.push(position); // Next column start
    }
  }
  
  return positions;
}

/**
 * Calculate positions for regular grid
 */
export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number = 10
): { horizontal: number[], vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  // Calculate horizontal grid positions
  for (let i = 0; i <= height; i += gridSize) {
    horizontal.push(i);
  }
  
  // Calculate vertical grid positions
  for (let i = 0; i <= width; i += gridSize) {
    vertical.push(i);
  }
  
  return { horizontal, vertical };
}

/**
 * Get the responsive grid configuration based on screen width
 */
export function getResponsiveGridConfig(
  width: number,
  breakpoints: GridBreakpoint[] = []
): GridConfig {
  // Sort breakpoints by minWidth in descending order
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth);
  
  // Find the first breakpoint that matches
  for (const breakpoint of sortedBreakpoints) {
    if (width >= breakpoint.minWidth) {
      return breakpoint.gridConfig;
    }
  }
  
  // Return default if no matching breakpoint found
  return DEFAULT_GRID_CONFIG;
}

/**
 * Get the breakpoint name based on width
 */
export function getBreakpointFromWidth(width: number): string {
  if (width >= TAILWIND_BREAKPOINTS['2xl']) return '2xl';
  if (width >= TAILWIND_BREAKPOINTS.xl) return 'xl';
  if (width >= TAILWIND_BREAKPOINTS.lg) return 'lg';
  if (width >= TAILWIND_BREAKPOINTS.md) return 'md';
  if (width >= TAILWIND_BREAKPOINTS.sm) return 'sm';
  return 'xs';
}
