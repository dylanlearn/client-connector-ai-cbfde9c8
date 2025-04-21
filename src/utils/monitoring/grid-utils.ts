
import { fabric } from 'fabric';

export interface GridConfig {
  visible: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  snapToGrid: boolean;
  snapTolerance: number;
  color: string;
  opacity?: number;
  showGridNumbers?: boolean;
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

export const DEFAULT_GRID_CONFIG: GridConfig = {
  visible: true,
  size: 10,
  type: 'lines',
  snapToGrid: true,
  snapTolerance: 5,
  color: '#e0e0e0',
  opacity: 0.5,
  showGridNumbers: false,
  breakpoints: [
    {
      name: 'sm',
      width: 640,
      columns: 4,
      gutterWidth: 10,
      marginWidth: 16
    },
    {
      name: 'md',
      width: 768,
      columns: 6,
      gutterWidth: 16,
      marginWidth: 24
    },
    {
      name: 'lg',
      width: 1024,
      columns: 12,
      gutterWidth: 20,
      marginWidth: 40
    }
  ],
  currentBreakpoint: 'lg'
};

export const TAILWIND_BREAKPOINTS = {
  xs: 384,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Creates a grid on a Fabric.js canvas
 */
export function createCanvasGrid(canvas: fabric.Canvas, gridSize: number, gridType: 'lines' | 'dots' | 'columns' = 'lines') {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const gridLines = [];

  if (gridType === 'lines' || gridType === 'dots') {
    // Create horizontal grid lines
    for (let i = 0; i <= canvasHeight / gridSize; i++) {
      const y = i * gridSize;
      const line = new fabric.Line([0, y, canvasWidth, y], {
        stroke: DEFAULT_GRID_CONFIG.color,
        selectable: false,
        evented: false,
        strokeWidth: gridType === 'dots' ? 0.5 : 1,
        strokeDashArray: gridType === 'dots' ? [1, gridSize - 1] : undefined,
        opacity: DEFAULT_GRID_CONFIG.opacity || 0.3
      });
      gridLines.push(line);
    }

    // Create vertical grid lines
    for (let i = 0; i <= canvasWidth / gridSize; i++) {
      const x = i * gridSize;
      const line = new fabric.Line([x, 0, x, canvasHeight], {
        stroke: DEFAULT_GRID_CONFIG.color,
        selectable: false,
        evented: false,
        strokeWidth: gridType === 'dots' ? 0.5 : 1,
        strokeDashArray: gridType === 'dots' ? [1, gridSize - 1] : undefined,
        opacity: DEFAULT_GRID_CONFIG.opacity || 0.3
      });
      gridLines.push(line);
    }
  } else if (gridType === 'columns') {
    // Create column-based grid for design systems
    const columns = 12; // Default number of columns
    const gutter = gridSize; // Gutter width between columns
    const margin = gridSize * 2; // Margin on the sides
    const contentWidth = canvasWidth - (margin * 2); // Width of content area
    const columnWidth = (contentWidth - (gutter * (columns - 1))) / columns; // Width of each column

    // Create margin lines (left and right)
    const leftMarginLine = new fabric.Line([margin, 0, margin, canvasHeight], {
      stroke: '#2563eb',
      selectable: false,
      evented: false,
      strokeWidth: 1,
      opacity: 0.5
    });
    gridLines.push(leftMarginLine);

    const rightMarginLine = new fabric.Line([canvasWidth - margin, 0, canvasWidth - margin, canvasHeight], {
      stroke: '#2563eb',
      selectable: false,
      evented: false,
      strokeWidth: 1,
      opacity: 0.5
    });
    gridLines.push(rightMarginLine);

    // Create column lines
    for (let i = 0; i <= columns; i++) {
      const x = margin + (i * columnWidth) + (i > 0 ? (i - 1) * gutter : 0);
      if (i > 0 && i < columns) {
        const line = new fabric.Line([x, 0, x, canvasHeight], {
          stroke: DEFAULT_GRID_CONFIG.color,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          opacity: 0.3
        });
        gridLines.push(line);

        // Add gutter end line
        const gutterEnd = x + gutter;
        const gutterLine = new fabric.Line([gutterEnd, 0, gutterEnd, canvasHeight], {
          stroke: DEFAULT_GRID_CONFIG.color,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          opacity: 0.3
        });
        gridLines.push(gutterLine);
      }
    }
  }

  return { gridLines, config: DEFAULT_GRID_CONFIG };
}

export function removeGridFromCanvas(canvas: fabric.Canvas) {
  // Remove all grid lines
  const objects = canvas.getObjects();
  const gridObjects = objects.filter(obj => {
    return obj.data && obj.data.isGridLine;
  });

  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });

  canvas.renderAll();
}

export function updateCanvasGrid(canvas: fabric.Canvas, gridSize: number, gridType: 'lines' | 'dots' | 'columns' = 'lines') {
  // Remove existing grid
  removeGridFromCanvas(canvas);
  
  // Create new grid
  const gridResult = createCanvasGrid(canvas, gridSize, gridType);
  
  gridResult.gridLines.forEach(line => {
    canvas.add(line);
    canvas.sendToBack(line);
  });
  
  canvas.renderAll();
  return gridResult;
}

// Additional grid utility functions
export function calculateColumnPositions(width: number, columnCount: number, gutterWidth: number, marginWidth: number) {
  const positions: number[] = [];
  const contentWidth = width - (marginWidth * 2);
  const columnWidth = (contentWidth - (gutterWidth * (columnCount - 1))) / columnCount;

  // Add left margin position
  positions.push(marginWidth);

  // Add column positions
  for (let i = 1; i <= columnCount; i++) {
    const position = marginWidth + (i * columnWidth) + ((i - 1) * gutterWidth);
    positions.push(position);
  }

  return positions;
}

export function calculateGridPositions(width: number, height: number, gridSize: number) {
  const horizontal: number[] = [];
  const vertical: number[] = [];

  for (let i = 0; i <= width; i += gridSize) {
    vertical.push(i);
  }

  for (let i = 0; i <= height; i += gridSize) {
    horizontal.push(i);
  }

  return { horizontal, vertical };
}

export function getResponsiveGridConfig(width: number, defaultConfig: GridConfig) {
  const { breakpoints } = defaultConfig;
  
  if (!breakpoints || breakpoints.length === 0) {
    return defaultConfig;
  }
  
  // Find the appropriate breakpoint for the current width
  let currentBreakpoint = breakpoints[0];
  
  for (let i = 1; i < breakpoints.length; i++) {
    if (width >= breakpoints[i].width) {
      currentBreakpoint = breakpoints[i];
    } else {
      break;
    }
  }
  
  return {
    ...defaultConfig,
    currentBreakpoint: currentBreakpoint.name
  };
}

export function getBreakpointFromWidth(width: number) {
  if (width < TAILWIND_BREAKPOINTS.xs) return 'xxs';
  if (width < TAILWIND_BREAKPOINTS.sm) return 'xs';
  if (width < TAILWIND_BREAKPOINTS.md) return 'sm';
  if (width < TAILWIND_BREAKPOINTS.lg) return 'md';
  if (width < TAILWIND_BREAKPOINTS.xl) return 'lg';
  if (width < TAILWIND_BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

export function getObjectBounds(obj: fabric.Object) {
  const { left = 0, top = 0, width = 0, height = 0 } = obj;
  return {
    left,
    top,
    right: left + (width * (obj.scaleX || 1)),
    bottom: top + (height * (obj.scaleY || 1)),
    width: width * (obj.scaleX || 1),
    height: height * (obj.scaleY || 1)
  };
}

export function generateSnapGuidelines(canvas: fabric.Canvas) {
  const guidelines: { x: number[], y: number[] } = { x: [], y: [] };
  
  // Get all objects except the active one
  const activeObject = canvas.getActiveObject();
  const objects = canvas.getObjects().filter(obj => obj !== activeObject);
  
  // Add canvas edges
  guidelines.x.push(0);
  guidelines.x.push(canvas.getWidth() / 2);
  guidelines.x.push(canvas.getWidth());
  
  guidelines.y.push(0);
  guidelines.y.push(canvas.getHeight() / 2);
  guidelines.y.push(canvas.getHeight());
  
  // Add guidelines from other objects
  objects.forEach(obj => {
    if (!obj.selectable) return; // Skip grid lines and other non-selectable objects
    
    const bounds = getObjectBounds(obj);
    
    // Add edge guidelines
    guidelines.x.push(bounds.left);
    guidelines.x.push(bounds.left + bounds.width / 2);
    guidelines.x.push(bounds.left + bounds.width);
    
    guidelines.y.push(bounds.top);
    guidelines.y.push(bounds.top + bounds.height / 2);
    guidelines.y.push(bounds.top + bounds.height);
  });
  
  return guidelines;
}

export function snapObjectToGuidelines(obj: fabric.Object, guidelines: { x: number[], y: number[] }, threshold: number = 10) {
  if (!obj) return;
  
  const bounds = getObjectBounds(obj);
  const objCenter = {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2
  };
  
  // Find closest x guidelines
  let closestX = null;
  let closestXDist = threshold + 1;
  
  guidelines.x.forEach(guideX => {
    // Check left edge
    let dist = Math.abs(bounds.left - guideX);
    if (dist < closestXDist) {
      closestXDist = dist;
      closestX = { guide: guideX, edge: 'left' };
    }
    
    // Check center
    dist = Math.abs(objCenter.x - guideX);
    if (dist < closestXDist) {
      closestXDist = dist;
      closestX = { guide: guideX, edge: 'center' };
    }
    
    // Check right edge
    dist = Math.abs((bounds.left + bounds.width) - guideX);
    if (dist < closestXDist) {
      closestXDist = dist;
      closestX = { guide: guideX, edge: 'right' };
    }
  });
  
  // Similar for y
  let closestY = null;
  let closestYDist = threshold + 1;
  
  guidelines.y.forEach(guideY => {
    // Check top edge
    let dist = Math.abs(bounds.top - guideY);
    if (dist < closestYDist) {
      closestYDist = dist;
      closestY = { guide: guideY, edge: 'top' };
    }
    
    // Check middle
    dist = Math.abs(objCenter.y - guideY);
    if (dist < closestYDist) {
      closestYDist = dist;
      closestY = { guide: guideY, edge: 'middle' };
    }
    
    // Check bottom edge
    dist = Math.abs((bounds.top + bounds.height) - guideY);
    if (dist < closestYDist) {
      closestYDist = dist;
      closestY = { guide: guideY, edge: 'bottom' };
    }
  });
  
  // Apply snapping
  if (closestX) {
    if (closestX.edge === 'left') {
      obj.set('left', closestX.guide);
    } else if (closestX.edge === 'center') {
      obj.set('left', closestX.guide - bounds.width / 2);
    } else if (closestX.edge === 'right') {
      obj.set('left', closestX.guide - bounds.width);
    }
  }
  
  if (closestY) {
    if (closestY.edge === 'top') {
      obj.set('top', closestY.guide);
    } else if (closestY.edge === 'middle') {
      obj.set('top', closestY.guide - bounds.height / 2);
    } else if (closestY.edge === 'bottom') {
      obj.set('top', closestY.guide - bounds.height);
    }
  }
  
  return { closestX, closestY };
}
