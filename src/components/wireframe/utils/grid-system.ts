
import { fabric } from 'fabric';

export type GridType = 'lines' | 'dots' | 'columns';

export interface GridConfiguration {
  visible: boolean;
  size: number;
  type: GridType;
  color: string;
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  snapToGrid: boolean;
  snapThreshold: number;
  showGuides: boolean;
  guideColor: string;
}

export const DEFAULT_GRID_CONFIG: GridConfiguration = {
  visible: true,
  size: 20,
  type: 'lines',
  color: 'rgba(200, 200, 200, 0.5)',
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  snapToGrid: true,
  snapThreshold: 10,
  showGuides: true,
  guideColor: 'rgba(0, 120, 255, 0.7)',
};

/**
 * Creates grid lines for canvas based on configuration
 */
export function createGridLines(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  canvasWidth: number,
  canvasHeight: number
): fabric.Line[] {
  const gridLines: fabric.Line[] = [];
  
  if (!config.visible) return gridLines;

  // Create horizontal and vertical grid lines
  if (config.type === 'lines' || config.type === 'dots') {
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += config.size) {
      if (config.type === 'dots') {
        // For dots, create small lines at intersections
        for (let j = 0; j <= canvasWidth; j += config.size) {
          const dot = new fabric.Circle({
            left: j,
            top: i,
            radius: 1,
            fill: config.color,
            stroke: config.color,
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            data: { type: 'grid' }
          });
          
          gridLines.push(dot as unknown as fabric.Line); // Cast to keep the return type consistent
        }
      } else {
        // For lines, create continuous horizontal lines
        const line = new fabric.Line([0, i, canvasWidth, i], {
          stroke: config.color,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          data: { type: 'grid' }
        });
        
        gridLines.push(line);
      }
    }

    // Create vertical lines (only for line type)
    if (config.type === 'lines') {
      for (let i = 0; i <= canvasWidth; i += config.size) {
        const line = new fabric.Line([i, 0, i, canvasHeight], {
          stroke: config.color,
          selectable: false,
          evented: false,
          strokeWidth: 1,
          data: { type: 'grid' }
        });
        
        gridLines.push(line);
      }
    }
  } else if (config.type === 'columns') {
    // Create column grid
    const totalColumns = config.columns;
    const gutterWidth = config.gutterWidth;
    const marginWidth = config.marginWidth;
    
    // Calculate column width based on canvas width, gutters, and margins
    const usableWidth = canvasWidth - (marginWidth * 2) - ((totalColumns - 1) * gutterWidth);
    const columnWidth = usableWidth / totalColumns;
    
    // Draw column guides (including margins)
    let currentPosition = marginWidth;
    
    // Draw left margin
    const leftMargin = new fabric.Line([marginWidth, 0, marginWidth, canvasHeight], {
      stroke: config.color,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      data: { type: 'grid', gridType: 'margin' }
    });
    gridLines.push(leftMargin);
    
    // Draw columns and gutters
    for (let i = 0; i < totalColumns; i++) {
      // Draw column start
      const columnStart = new fabric.Line([currentPosition, 0, currentPosition, canvasHeight], {
        stroke: config.color,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        data: { type: 'grid', gridType: 'column' }
      });
      gridLines.push(columnStart);
      
      // Move to end of column
      currentPosition += columnWidth;
      
      // Draw column end
      const columnEnd = new fabric.Line([currentPosition, 0, currentPosition, canvasHeight], {
        stroke: config.color,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        data: { type: 'grid', gridType: 'column' }
      });
      gridLines.push(columnEnd);
      
      // Add gutter (if not the last column)
      if (i < totalColumns - 1) {
        currentPosition += gutterWidth;
      }
    }
    
    // Draw right margin
    const rightMargin = new fabric.Line([canvasWidth - marginWidth, 0, canvasWidth - marginWidth, canvasHeight], {
      stroke: config.color,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      data: { type: 'grid', gridType: 'margin' }
    });
    gridLines.push(rightMargin);
  }
  
  return gridLines;
}

/**
 * Removes existing grid from canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => canvas.remove(obj));
}

/**
 * Updates grid on canvas based on configuration
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Remove existing grid
  removeGridFromCanvas(canvas);
  
  // If grid is not visible, stop here
  if (!config.visible) return;
  
  // Create new grid lines
  const gridLines = createGridLines(canvas, config, canvasWidth, canvasHeight);
  
  // Add grid lines to canvas
  gridLines.forEach(line => {
    canvas.add(line);
    canvas.sendToBack(line);
  });
  
  canvas.renderAll();
}

/**
 * Creates alignment guides for snapping
 */
export function createAlignmentGuide(
  position: number,
  orientation: 'horizontal' | 'vertical',
  canvasWidth: number,
  canvasHeight: number,
  color: string = 'rgba(0, 120, 255, 0.7)'
): fabric.Line {
  const line = orientation === 'horizontal'
    ? new fabric.Line([0, position, canvasWidth, position], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        data: { type: 'alignmentGuide' }
      })
    : new fabric.Line([position, 0, position, canvasHeight], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        data: { type: 'alignmentGuide' }
      });
      
  return line;
}

/**
 * Calculates snap positions for an object based on grid configuration
 */
export function calculateSnapPositions(
  obj: fabric.Object,
  allObjects: fabric.Object[],
  config: GridConfiguration,
  canvasWidth: number,
  canvasHeight: number
): { horizontal: number[]; vertical: number[] } {
  const snapPositions = {
    horizontal: [],
    vertical: []
  };
  
  // Get object bounds
  const objBounds = {
    left: obj.left || 0,
    top: obj.top || 0,
    right: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1),
    bottom: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1),
    centerX: (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1) / 2,
    centerY: (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1) / 2
  };
  
  // Add grid snap positions
  if (config.snapToGrid) {
    for (let i = 0; i <= canvasWidth; i += config.size) {
      snapPositions.vertical.push(i);
    }
    
    for (let i = 0; i <= canvasHeight; i += config.size) {
      snapPositions.horizontal.push(i);
    }
  }
  
  // Add snapping positions from other objects
  allObjects
    .filter(other => other !== obj && !other.data?.type?.includes('grid'))
    .forEach(other => {
      const otherBounds = {
        left: other.left || 0,
        top: other.top || 0,
        right: (other.left || 0) + (other.width || 0) * (other.scaleX || 1),
        bottom: (other.top || 0) + (other.height || 0) * (other.scaleY || 1),
        centerX: (other.left || 0) + (other.width || 0) * (other.scaleX || 1) / 2,
        centerY: (other.top || 0) + (other.height || 0) * (other.scaleY || 1) / 2
      };
      
      // Vertical positions (left, center, right)
      snapPositions.vertical.push(otherBounds.left);
      snapPositions.vertical.push(otherBounds.right);
      snapPositions.vertical.push(otherBounds.centerX);
      
      // Horizontal positions (top, center, bottom)
      snapPositions.horizontal.push(otherBounds.top);
      snapPositions.horizontal.push(otherBounds.bottom);
      snapPositions.horizontal.push(otherBounds.centerY);
    });
    
  return snapPositions;
}

/**
 * Finds the closest snap position for an object
 */
export function findClosestSnapPosition(
  value: number,
  snapPositions: number[],
  threshold: number
): number | null {
  let closest = null;
  let closestDistance = threshold + 1;
  
  snapPositions.forEach(position => {
    const distance = Math.abs(position - value);
    if (distance < threshold && distance < closestDistance) {
      closest = position;
      closestDistance = distance;
    }
  });
  
  return closest;
}

/**
 * Shows alignment guides on canvas
 */
export function showAlignmentGuides(
  canvas: fabric.Canvas,
  positions: { horizontal: number[]; vertical: number[] },
  color: string = 'rgba(0, 120, 255, 0.7)'
): void {
  // Remove existing guides
  removeAlignmentGuides(canvas);
  
  // Create horizontal guides
  positions.horizontal.forEach(pos => {
    const guide = createAlignmentGuide(pos, 'horizontal', canvas.width || 1200, canvas.height || 800, color);
    canvas.add(guide);
  });
  
  // Create vertical guides
  positions.vertical.forEach(pos => {
    const guide = createAlignmentGuide(pos, 'vertical', canvas.width || 1200, canvas.height || 800, color);
    canvas.add(guide);
  });
  
  canvas.renderAll();
}

/**
 * Removes alignment guides from canvas
 */
export function removeAlignmentGuides(canvas: fabric.Canvas): void {
  const guides = canvas.getObjects().filter(obj => obj.data?.type === 'alignmentGuide');
  guides.forEach(guide => canvas.remove(guide));
  canvas.renderAll();
}
