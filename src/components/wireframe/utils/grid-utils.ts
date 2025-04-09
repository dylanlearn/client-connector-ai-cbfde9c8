
import { fabric } from 'fabric';
import { AlignmentGuide } from './types';

export interface GridConfig {
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  containerWidth: number;
}

export interface GridBreakpoint {
  name: string;
  minWidth: number;
  gridConfig: GridConfig;
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
  containerWidth: 1200
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
  gridType: 'lines' | 'dots' | 'columns' = 'lines'
): fabric.Line[] {
  const gridLines: fabric.Line[] = [];
  
  if (!canvas) return gridLines;
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Default style for grid lines
  const gridColor = '#e0e0e0';
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
  gridConfig: GridConfig = DEFAULT_GRID_CONFIG,
  canvasWidth: number
): number[] {
  const positions: number[] = [];
  const { columns, gutterWidth, marginWidth } = gridConfig;
  const columnWidth = (canvasWidth - (marginWidth * 2) - (gutterWidth * (columns - 1))) / columns;
  
  // Left margin
  positions.push(marginWidth);
  
  let position = marginWidth;
  for (let i = 0; i < columns; i++) {
    position += columnWidth;
    positions.push(position); // Column end
    
    if (i < columns - 1) {
      position += gutterWidth;
      positions.push(position); // Next column start
    }
  }
  
  return positions;
}

/**
 * Calculate positions for regular grid
 */
export function calculateGridPositions(
  gridSize: number = 10,
  canvasSize: number = 1000
): number[] {
  const positions: number[] = [];
  
  for (let i = 0; i <= canvasSize; i += gridSize) {
    positions.push(i);
  }
  
  return positions;
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
