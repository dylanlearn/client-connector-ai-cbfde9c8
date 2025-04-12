import { fabric } from 'fabric';

/**
 * Configuration for the grid system
 */
export interface GridConfiguration {
  visible: boolean;
  size: number;
  snapToGrid: boolean;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  snapThreshold: number;
  showGuides: boolean;
  guideColor: string;
  showRulers: boolean;
  rulerSize: number;
}

// Default grid configuration - only define this once
export const DEFAULT_GRID_CONFIG: GridConfiguration = {
  visible: true,
  size: 20,
  snapToGrid: true,
  type: 'lines',
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  snapThreshold: 8,
  showGuides: true,
  guideColor: 'rgba(0, 120, 255, 0.75)',
  showRulers: false,
  rulerSize: 20
};

/**
 * Updates the grid on the canvas
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas,
  gridConfig: GridConfiguration,
  width: number,
  height: number
) {
  // Remove existing grid
  removeGridFromCanvas(canvas);
  
  // If grid is not visible, don't add new grid
  if (!gridConfig.visible) return;
  
  // Create new grid based on grid type
  switch (gridConfig.type) {
    case 'columns':
      createColumnGrid(canvas, gridConfig, width, height);
      break;
    case 'dots':
      createDotGrid(canvas, gridConfig, width, height);
      break;
    case 'lines':
    default:
      createLineGrid(canvas, gridConfig, width, height);
      break;
  }
  
  // Render canvas
  canvas.renderAll();
}

/**
 * Removes the grid from the canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas) {
  const gridLines = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridLines.forEach(line => canvas.remove(line));
}

/**
 * Creates a line grid on the canvas
 */
function createLineGrid(
  canvas: fabric.Canvas,
  gridConfig: GridConfiguration,
  width: number,
  height: number
) {
  const gridSize = gridConfig.size;
  const gridColor = gridConfig.guideColor || 'rgba(224, 224, 224, 0.75)';
  
  for (let i = gridSize; i < width; i += gridSize) {
    const line = new fabric.Line([i, 0, i, height], {
      stroke: gridColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid' }
    });
    canvas.add(line);
  }
  
  for (let j = gridSize; j < height; j += gridSize) {
    const line = new fabric.Line([0, j, width, j], {
      stroke: gridColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid' }
    });
    canvas.add(line);
  }
}

/**
 * Creates a dot grid on the canvas
 */
function createDotGrid(
  canvas: fabric.Canvas,
  gridConfig: GridConfiguration,
  width: number,
  height: number
) {
  const gridSize = gridConfig.size;
  const gridColor = gridConfig.guideColor || 'rgba(224, 224, 224, 0.75)';
  const dotSize = 2;
  
  for (let i = gridSize; i < width; i += gridSize) {
    for (let j = gridSize; j < height; j += gridSize) {
      const circle = new fabric.Circle({
        radius: dotSize,
        fill: gridColor,
        left: i - dotSize,
        top: j - dotSize,
        selectable: false,
        evented: false,
        originX: 'left',
        originY: 'top',
        data: { type: 'grid' }
      });
      canvas.add(circle);
    }
  }
}

/**
 * Creates a column grid on the canvas
 */
function createColumnGrid(
  canvas: fabric.Canvas,
  gridConfig: GridConfiguration,
  width: number,
  height: number
) {
  const { columns, gutterWidth, marginWidth } = gridConfig;
  const columnWidth = (width - 2 * marginWidth - (columns - 1) * gutterWidth) / columns;
  const gridColor = gridConfig.guideColor || 'rgba(224, 224, 224, 0.75)';
  
  let x = marginWidth;
  for (let i = 0; i < columns; i++) {
    const line = new fabric.Line([x, 0, x, height], {
      stroke: gridColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid' }
    });
    canvas.add(line);
    
    x += columnWidth + gutterWidth;
  }
  
  // Add right margin line
  const rightMarginLine = new fabric.Line([width - marginWidth, 0, width - marginWidth, height], {
    stroke: gridColor,
    strokeWidth: 1,
    selectable: false,
    evented: false,
    data: { type: 'grid' }
  });
  canvas.add(rightMarginLine);
}

/**
 * Calculates the positions of columns based on the grid configuration
 */
export function calculateColumnPositions(
  width: number,
  columns: number,
  gutterWidth: number,
  marginWidth: number
): number[] {
  const columnWidth = (width - 2 * marginWidth - (columns - 1) * gutterWidth) / columns;
  const positions: number[] = [];
  
  let x = marginWidth;
  for (let i = 0; i < columns; i++) {
    positions.push(x);
    x += columnWidth + gutterWidth;
  }
  
  positions.push(width - marginWidth); // Add right margin
  
  return positions;
}

/**
 * Calculates the positions for a regular grid (lines or dots)
 */
export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number
): { horizontal: number[]; vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  for (let i = gridSize; i < width; i += gridSize) {
    vertical.push(i);
  }
  
  for (let j = gridSize; j < height; j += gridSize) {
    horizontal.push(j);
  }
  
  return { horizontal, vertical };
}

/**
 * Type definition for grid breakpoints
 */
export interface GridBreakpoint {
  name: string;
  width: number;
  columns: number;
  gutterSize: number;
  marginSize: number;
  color?: string;
}

/**
 * Default breakpoints for responsive design
 */
export const DEFAULT_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'xs', width: 320, columns: 4, gutterSize: 16, marginSize: 16, color: 'gray-500' },
  { name: 'sm', width: 640, columns: 6, gutterSize: 24, marginSize: 24, color: 'blue-500' },
  { name: 'md', width: 768, columns: 8, gutterSize: 24, marginSize: 24, color: 'green-500' },
  { name: 'lg', width: 1024, columns: 12, gutterSize: 32, marginSize: 32, color: 'yellow-500' },
  { name: 'xl', width: 1280, columns: 12, gutterSize: 32, marginSize: 32, color: 'orange-500' },
  { name: '2xl', width: 1536, columns: 12, gutterSize: 32, marginSize: 32, color: 'red-500' }
];

/**
 * Gets the responsive grid configuration based on the current width
 */
export function getResponsiveGridConfig(
  gridConfig: GridConfiguration,
  width: number
): GridConfiguration {
  let responsiveConfig = { ...gridConfig };
  
  for (const breakpoint of DEFAULT_BREAKPOINTS) {
    if (width >= breakpoint.width) {
      responsiveConfig = {
        ...responsiveConfig,
        columns: breakpoint.columns,
        gutterWidth: breakpoint.gutterSize,
        marginWidth: breakpoint.marginSize
      };
    }
  }
  
  return responsiveConfig;
}
