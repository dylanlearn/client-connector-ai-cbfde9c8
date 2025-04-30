
import { fabric } from 'fabric';

export interface GridConfig {
  size: number;
  type: 'lines' | 'dots' | 'columns';
  color?: string;
  opacity?: number;
  visible: boolean;
  snapToGrid?: boolean;
  breakpoints?: GridBreakpoint[];
  currentBreakpoint?: string;
}

export interface GridBreakpoint {
  name: string;
  width: number;
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  color?: string;
}

export const TAILWIND_BREAKPOINTS = [
  { name: 'sm', width: 640 },
  { name: 'md', width: 768 },
  { name: 'lg', width: 1024 },
  { name: 'xl', width: 1280 },
  { name: '2xl', width: 1536 }
];

export const DEFAULT_GRID_CONFIG: GridConfig = {
  size: 10,
  type: 'lines',
  color: '#e0e0e0',
  opacity: 0.5,
  visible: true,
  snapToGrid: true,
  breakpoints: [
    {
      name: 'sm',
      width: 640,
      columns: 4,
      gutterWidth: 10,
      marginWidth: 16,
      color: '#e0e0e0'
    },
    {
      name: 'md',
      width: 768,
      columns: 6,
      gutterWidth: 16,
      marginWidth: 24,
      color: '#e0e0e0'
    },
    {
      name: 'lg',
      width: 1024,
      columns: 12,
      gutterWidth: 20,
      marginWidth: 40,
      color: '#e0e0e0'
    }
  ],
  currentBreakpoint: 'lg'
};

interface GridCreationResult {
  gridLines: fabric.Line[];
  columnLines?: fabric.Line[];
}

export const createCanvasGrid = (
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines'
): GridCreationResult => {
  // Remove any existing grid lines
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    if (obj.data && obj.data.isGridLine) {
      canvas.remove(obj);
    }
  });

  const width = canvas.width || 1200;
  const height = canvas.height || 800;
  const gridLines: fabric.Line[] = [];

  // Create grid lines
  if (gridType === 'lines') {
    // Create vertical lines
    for (let x = gridSize; x < width!; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height!], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        data: { isGridLine: true }
      });
      gridLines.push(line);
    }

    // Create horizontal lines
    for (let y = gridSize; y < height!; y += gridSize) {
      const line = new fabric.Line([0, y, width!, y], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        data: { isGridLine: true }
      });
      gridLines.push(line);
    }
  }

  return { gridLines };
};

export const updateCanvasGrid = (
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines'
): GridCreationResult => {
  return createCanvasGrid(canvas, gridSize, gridType);
};

export const removeGridFromCanvas = (canvas: fabric.Canvas): void => {
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    if (obj.data && obj.data.isGridLine) {
      canvas.remove(obj);
    }
  });
};

export const calculateColumnPositions = (
  width: number, 
  breakpoint: GridBreakpoint
): number[] => {
  const positions: number[] = [];
  const { columns, gutterWidth, marginWidth } = breakpoint;
  
  const contentWidth = width - (marginWidth * 2);
  const columnWidth = (contentWidth - (gutterWidth * (columns - 1))) / columns;
  
  for (let i = 0; i < columns; i++) {
    const x = marginWidth + (i * (columnWidth + gutterWidth));
    positions.push(x);
  }
  
  return positions;
};

export const calculateGridPositions = (
  width: number,
  height: number,
  gridSize: number
): { x: number[]; y: number[] } => {
  const xPositions: number[] = [];
  const yPositions: number[] = [];
  
  for (let x = 0; x <= width; x += gridSize) {
    xPositions.push(x);
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    yPositions.push(y);
  }
  
  return { x: xPositions, y: yPositions };
};

export const getBreakpointFromWidth = (
  width: number, 
  breakpoints: GridBreakpoint[]
): GridBreakpoint => {
  // Sort breakpoints by width, descending
  const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width);
  
  // Find the largest breakpoint that is smaller than the width
  for (const breakpoint of sortedBreakpoints) {
    if (width >= breakpoint.width) {
      return breakpoint;
    }
  }
  
  // If no breakpoint matches, return the smallest
  return sortedBreakpoints[sortedBreakpoints.length - 1];
};

export const generateSnapGuidelines = (
  obj: fabric.Object,
  objects: fabric.Object[],
  threshold: number = 10
): { horizontal: number[]; vertical: number[] } => {
  const guidelines = {
    horizontal: [],
    vertical: []
  } as { horizontal: number[]; vertical: number[] };
  
  // Implementation of snap guidelines would go here
  
  return guidelines;
};

export const snapObjectToGuidelines = (
  obj: fabric.Object,
  guidelines: { horizontal: number[]; vertical: number[] },
  threshold: number = 10
): void => {
  // Implementation of snapping objects to guidelines would go here
};

export const getObjectBounds = (obj: fabric.Object): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} => {
  const bounds = {
    left: obj.left || 0,
    top: obj.top || 0,
    right: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1),
    bottom: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1)
  };
  
  return bounds;
};

export const getResponsiveGridConfig = (
  width: number,
  config: GridConfig
): GridConfig => {
  if (!config.breakpoints || config.breakpoints.length === 0) {
    return config;
  }
  
  const activeBreakpoint = getBreakpointFromWidth(width, config.breakpoints);
  
  return {
    ...config,
    currentBreakpoint: activeBreakpoint.name
  };
};
