
import { fabric } from 'fabric';

export interface GridResult {
  gridLines: fabric.Line[];
  update: () => void;
  destroy: () => void;
}

export interface GridConfig {
  size: number;
  type: 'lines' | 'dots' | 'columns';
  color?: string;
  opacity?: number;
  breakpoints?: Array<{
    name: string;
    width: number;
    columns: number;
    gutterWidth: number;
    marginWidth: number;
  }>;
}

/**
 * Creates a grid on the canvas with performance optimizations
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 20,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  color: string = '#e0e0e0'
): GridResult {
  if (!canvas) {
    return {
      gridLines: [],
      update: () => {},
      destroy: () => {}
    };
  }

  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const gridLines: fabric.Line[] = [];

  // Create optimized grid lines
  const createLines = () => {
    // Clear existing grid
    gridLines.forEach(line => {
      if (canvas.contains(line)) {
        canvas.remove(line);
      }
    });
    gridLines.length = 0;

    if (gridType === 'lines') {
      // Horizontal lines
      for (let i = gridSize; i < height; i += gridSize) {
        const line = new fabric.Line([0, i, width, i], {
          stroke: color,
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectCaching: true, // Cache this object for better performance
          excludeFromExport: true,
          data: { isGridLine: true }
        });
        gridLines.push(line);
      }

      // Vertical lines
      for (let i = gridSize; i < width; i += gridSize) {
        const line = new fabric.Line([i, 0, i, height], {
          stroke: color,
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectCaching: true, // Cache this object for better performance
          excludeFromExport: true,
          data: { isGridLine: true }
        });
        gridLines.push(line);
      }
    } else if (gridType === 'dots') {
      // Create dots at intersections
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          const dot = new fabric.Circle({
            left: x,
            top: y,
            radius: 1,
            fill: color,
            stroke: null,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            objectCaching: true,
            excludeFromExport: true,
            data: { isGridLine: true }
          });
          gridLines.push(dot as unknown as fabric.Line); // Type cast for consistency
        }
      }
    } else if (gridType === 'columns') {
      // Create column grid (12 columns by default)
      const columns = 12;
      const columnWidth = (width - (gridSize * 2)) / columns;
      const marginWidth = gridSize;

      // Left and right margins
      const leftMargin = new fabric.Line([marginWidth, 0, marginWidth, height], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: true,
        excludeFromExport: true,
        data: { isGridLine: true, isMargin: true }
      });
      gridLines.push(leftMargin);

      const rightMargin = new fabric.Line([width - marginWidth, 0, width - marginWidth, height], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: true,
        excludeFromExport: true,
        data: { isGridLine: true, isMargin: true }
      });
      gridLines.push(rightMargin);

      // Column lines
      for (let i = 0; i <= columns; i++) {
        const x = marginWidth + (columnWidth * i);
        const line = new fabric.Line([x, 0, x, height], {
          stroke: color,
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectCaching: true,
          excludeFromExport: true,
          data: { isGridLine: true, isColumn: true, columnIndex: i }
        });
        gridLines.push(line);
      }
    }
    
    // Add all grid lines to canvas with optimized rendering
    const batchSize = 50;
    const addBatch = (startIdx: number) => {
      const endIdx = Math.min(startIdx + batchSize, gridLines.length);
      
      for (let i = startIdx; i < endIdx; i++) {
        canvas.add(gridLines[i]);
        canvas.sendToBack(gridLines[i]);
      }
      
      if (endIdx < gridLines.length) {
        setTimeout(() => addBatch(endIdx), 0);
      } else {
        canvas.renderAll();
      }
    };
    
    addBatch(0);
  };

  // Create initial grid
  createLines();

  return {
    gridLines,
    update: createLines,
    destroy: () => {
      gridLines.forEach(line => {
        if (canvas.contains(line)) {
          canvas.remove(line);
        }
      });
      gridLines.length = 0;
      canvas.renderAll();
    }
  };
}

/**
 * Updates an existing grid on the canvas
 */
export function updateCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 20,
  gridType: 'lines' | 'dots' | 'columns' = 'lines',
  color: string = '#e0e0e0'
): GridResult {
  // Remove any existing grid lines
  const objects = canvas.getObjects();
  objects.forEach(obj => {
    if (obj.data && obj.data.isGridLine) {
      canvas.remove(obj);
    }
  });

  // Create new grid
  return createCanvasGrid(canvas, gridSize, gridType, color);
}

/**
 * Removes all grid lines from a canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  const objects = canvas.getObjects();
  const gridLines: fabric.Object[] = [];
  
  objects.forEach(obj => {
    if (obj.data && obj.data.isGridLine) {
      gridLines.push(obj);
    }
  });
  
  // Remove in batches for better performance
  const batchSize = 50;
  const removeBatch = (startIdx: number) => {
    const endIdx = Math.min(startIdx + batchSize, gridLines.length);
    
    for (let i = startIdx; i < endIdx; i++) {
      canvas.remove(gridLines[i]);
    }
    
    if (endIdx < gridLines.length) {
      setTimeout(() => removeBatch(endIdx), 0);
    } else {
      canvas.renderAll();
    }
  };
  
  removeBatch(0);
}
