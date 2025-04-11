
import { fabric } from 'fabric';

interface GridOptions {
  color?: string;
  opacity?: number;
  excludeFromExport?: boolean;
}

/**
 * Creates a grid pattern on the canvas
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  gridColor: string = '#e0e0e0',
  options: GridOptions = {}
): fabric.Object[] {
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridObjects: fabric.Object[] = [];
  
  const { 
    opacity = 0.5,
    excludeFromExport = true
  } = options;
  
  const commonProps = {
    stroke: gridColor,
    strokeWidth: 1,
    selectable: false,
    evented: false,
    excludeFromExport,
    opacity,
    data: { type: 'grid' }
  };
  
  if (gridType === 'dots') {
    // Create dot grid
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        const circle = new fabric.Circle({
          left: x,
          top: y,
          radius: 1,
          fill: gridColor,
          originX: 'center',
          originY: 'center',
          ...commonProps
        });
        
        gridObjects.push(circle);
      }
    }
  } else if (gridType === 'columns') {
    // Create column grid (vertical lines only)
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], commonProps);
      gridObjects.push(line);
    }
  } else {
    // Create standard line grid
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], commonProps);
      gridObjects.push(line);
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new fabric.Line([0, y, width, y], commonProps);
      gridObjects.push(line);
    }
  }
  
  return gridObjects;
}

/**
 * Removes any grid lines from the canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
}

/**
 * Updates the grid on an existing canvas 
 */
export function updateCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  showGrid: boolean = true,
  gridColor: string = '#e0e0e0'
): void {
  // First remove existing grid
  removeGridFromCanvas(canvas);
  
  // Then add new grid if enabled
  if (showGrid) {
    const gridObjects = createCanvasGrid(canvas, gridSize, gridType, gridColor);
    gridObjects.forEach(obj => canvas.add(obj));
    
    // Move grid objects to bottom
    gridObjects.forEach(obj => canvas.sendToBack(obj));
  }
  
  canvas.renderAll();
}
