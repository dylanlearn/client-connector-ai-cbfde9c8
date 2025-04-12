
import { fabric } from 'fabric';

export interface GridConfiguration {
  visible: boolean;
  snapToGrid: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  color?: string;
}

export const DEFAULT_GRID_CONFIG: GridConfiguration = {
  visible: true,
  snapToGrid: true,
  size: 20,
  type: 'lines',
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  color: '#e0e0e0',
};

/**
 * Creates and adds grid lines to the canvas
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Remove any existing grid
  removeGridFromCanvas(canvas);
  
  if (!config.visible) return;
  
  const gridObjects: fabric.Line[] = [];
  
  // Create grid based on type
  if (config.type === 'columns') {
    // Calculate column width
    const usableWidth = canvasWidth - 2 * config.marginWidth;
    const totalGutterWidth = (config.columns - 1) * config.gutterWidth;
    const totalColumnWidth = usableWidth - totalGutterWidth;
    const columnWidth = totalColumnWidth / config.columns;
    
    // Create margin lines
    const leftMarginLine = createGridLine(config.marginWidth, 0, config.marginWidth, canvasHeight, '#0066ff');
    const rightMarginLine = createGridLine(canvasWidth - config.marginWidth, 0, canvasWidth - config.marginWidth, canvasHeight, '#0066ff');
    gridObjects.push(leftMarginLine, rightMarginLine);
    
    // Create column lines
    for (let i = 0; i <= config.columns; i++) {
      const x = config.marginWidth + i * (columnWidth + config.gutterWidth);
      const lineColor = i === 0 || i === config.columns ? '#0066ff' : config.color || '#e0e0e0';
      const line = createGridLine(x, 0, x, canvasHeight, lineColor);
      
      // Add column data
      line.data = { type: 'grid', gridType: 'column', columnIndex: i };
      
      gridObjects.push(line);
    }
  } else {
    // Create standard grid
    const gridSize = config.size;
    const strokeColor = config.color || '#e0e0e0';
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = createGridLine(i, 0, i, canvasHeight, strokeColor);
      line.data = { type: 'grid' };
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = createGridLine(0, i, canvasWidth, i, strokeColor);
      line.data = { type: 'grid' };
      gridObjects.push(line);
    }
  }
  
  // Add all grid lines to canvas
  gridObjects.forEach(line => {
    // Ensure grid lines are always at the bottom
    line.selectable = false;
    line.evented = false;
    line.hoverCursor = 'default';
    
    canvas.add(line);
    canvas.sendToBack(line);
  });
  
  canvas.renderAll();
}

/**
 * Create a grid line on the canvas
 */
function createGridLine(x1: number, y1: number, x2: number, y2: number, stroke = '#e0e0e0'): fabric.Line {
  return new fabric.Line([x1, y1, x2, y2], {
    stroke,
    strokeWidth: 1,
    strokeDashArray: [1, 1],
    selectable: false,
    evented: false,
    data: { type: 'grid' },
  });
}

/**
 * Removes all grid lines from the canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => canvas.remove(obj));
}

/**
 * Snaps a coordinate to the nearest grid point
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snaps fabric object coordinates to the grid
 */
export function snapObjectToGrid(obj: fabric.Object, gridConfig: GridConfiguration): void {
  if (!gridConfig.snapToGrid) return;
  
  if (gridConfig.type === 'columns') {
    // Snap to column grid
    const marginWidth = gridConfig.marginWidth;
    const usableWidth = obj.canvas?.getWidth() ? obj.canvas.getWidth() - 2 * marginWidth : 1000;
    const totalGutterWidth = (gridConfig.columns - 1) * gridConfig.gutterWidth;
    const totalColumnWidth = usableWidth - totalGutterWidth;
    const columnWidth = totalColumnWidth / gridConfig.columns;
    
    // Calculate column positions
    const columnPositions = [];
    for (let i = 0; i <= gridConfig.columns; i++) {
      columnPositions.push(marginWidth + i * (columnWidth + gridConfig.gutterWidth));
    }
    
    // Find closest column position for left edge
    const left = obj.left || 0;
    let closestColumnPosition = columnPositions[0];
    let minDistance = Math.abs(left - columnPositions[0]);
    
    columnPositions.forEach(position => {
      const distance = Math.abs(left - position);
      if (distance < minDistance) {
        minDistance = distance;
        closestColumnPosition = position;
      }
    });
    
    // Only snap if within threshold distance
    if (minDistance <= 10) {
      obj.set({ left: closestColumnPosition });
    }
    
    // Snap vertical position to grid
    if (obj.top) {
      obj.set({ top: snapToGrid(obj.top, gridConfig.size) });
    }
  } else {
    // Standard grid snapping
    const gridSize = gridConfig.size;
    
    if (obj.left) {
      obj.set({ left: snapToGrid(obj.left, gridSize) });
    }
    
    if (obj.top) {
      obj.set({ top: snapToGrid(obj.top, gridSize) });
    }
  }
}

/**
 * Creates visual guides during object movement
 */
export function createAlignmentGuides(
  canvas: fabric.Canvas,
  activeObject: fabric.Object,
  threshold = 10
): void {
  // Remove any existing guides
  removeAlignmentGuides(canvas);
  
  if (!activeObject || !canvas) return;
  
  const alignmentGuides: fabric.Line[] = [];
  const activeObjectCenter = activeObject.getCenterPoint();
  const activeObjectBounds = getObjectBounds(activeObject);
  
  // Check all other objects for alignment
  canvas.getObjects().forEach(obj => {
    if (obj === activeObject || obj.data?.type === 'grid' || obj.data?.type === 'guide') return;
    
    const objCenter = obj.getCenterPoint();
    const objBounds = getObjectBounds(obj);
    
    // Horizontal center alignment
    if (Math.abs(activeObjectCenter.x - objCenter.x) < threshold) {
      const guide = new fabric.Line(
        [objCenter.x, 0, objCenter.x, canvas.getHeight() as number],
        {
          stroke: '#ff4081',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      alignmentGuides.push(guide);
      
      // Snap to center alignment
      activeObject.set({
        left: activeObjectCenter.x - activeObject.getScaledWidth() / 2
      });
    }
    
    // Vertical center alignment
    if (Math.abs(activeObjectCenter.y - objCenter.y) < threshold) {
      const guide = new fabric.Line(
        [0, objCenter.y, canvas.getWidth() as number, objCenter.y],
        {
          stroke: '#ff4081',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      alignmentGuides.push(guide);
      
      // Snap to center alignment
      activeObject.set({
        top: objCenter.y - activeObject.getScaledHeight() / 2
      });
    }
    
    // Left edge alignment
    if (Math.abs(activeObjectBounds.left - objBounds.left) < threshold) {
      const guide = new fabric.Line(
        [objBounds.left, 0, objBounds.left, canvas.getHeight() as number],
        {
          stroke: '#ff4081',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      alignmentGuides.push(guide);
      
      // Snap to edge alignment
      activeObject.set({ left: objBounds.left });
    }
    
    // Right edge alignment
    if (Math.abs(activeObjectBounds.right - objBounds.right) < threshold) {
      const guide = new fabric.Line(
        [objBounds.right, 0, objBounds.right, canvas.getHeight() as number],
        {
          stroke: '#ff4081',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      alignmentGuides.push(guide);
      
      // Snap to edge alignment
      activeObject.set({
        left: objBounds.right - activeObject.getScaledWidth()
      });
    }
    
    // Top edge alignment
    if (Math.abs(activeObjectBounds.top - objBounds.top) < threshold) {
      const guide = new fabric.Line(
        [0, objBounds.top, canvas.getWidth() as number, objBounds.top],
        {
          stroke: '#ff4081',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      alignmentGuides.push(guide);
      
      // Snap to edge alignment
      activeObject.set({ top: objBounds.top });
    }
    
    // Bottom edge alignment
    if (Math.abs(activeObjectBounds.bottom - objBounds.bottom) < threshold) {
      const guide = new fabric.Line(
        [0, objBounds.bottom, canvas.getWidth() as number, objBounds.bottom],
        {
          stroke: '#ff4081',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          data: { type: 'guide' }
        }
      );
      alignmentGuides.push(guide);
      
      // Snap to edge alignment
      activeObject.set({
        top: objBounds.bottom - activeObject.getScaledHeight()
      });
    }
  });
  
  // Add guides to canvas
  alignmentGuides.forEach(guide => canvas.add(guide));
  canvas.renderAll();
}

/**
 * Removes all alignment guides from the canvas
 */
export function removeAlignmentGuides(canvas: fabric.Canvas): void {
  const guideObjects = canvas.getObjects().filter(obj => obj.data?.type === 'guide');
  guideObjects.forEach(obj => canvas.remove(obj));
}

/**
 * Gets the bounds of an object
 */
function getObjectBounds(obj: fabric.Object) {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();
  
  return {
    left,
    top,
    right: left + width,
    bottom: top + height
  };
}
