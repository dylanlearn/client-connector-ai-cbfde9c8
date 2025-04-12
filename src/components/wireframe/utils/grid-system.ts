import { fabric } from 'fabric';

// Define the missing types that were previously imported
export interface GridVisualSettings {
  lineColor: string;
  lineThickness: number;
  dotSize: number;
  opacity: number;
  showLabels: boolean;
  labelColor: string;
}

export interface AlignmentGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  type: 'edge' | 'center' | 'distribution' | 'grid';
  strength?: number;
  label?: string;
}

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

/**
 * Default grid configuration - only define this once
 */
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
 * Default visual settings for grid
 */
export const DEFAULT_VISUAL_SETTINGS: GridVisualSettings = {
  lineColor: 'rgba(200, 200, 200, 0.2)',
  lineThickness: 1,
  dotSize: 1,
  opacity: 0.5,
  showLabels: false,
  labelColor: 'rgba(150, 150, 150, 0.8)'
};

/**
 * Update grid on canvas
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number
): void {
  removeGridFromCanvas(canvas);
  
  if (!config.visible) return;
  
  const gridColor = config.guideColor || DEFAULT_VISUAL_SETTINGS.lineColor;
  
  if (config.type === 'columns') {
    const columnPositions = calculateColumnPositions(
      width,
      config.columns,
      config.gutterWidth,
      config.marginWidth
    );
    
    columnPositions.forEach(position => {
      const line = new fabric.Line([position, 0, position, height], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hasControls: false,
        hasBorders: false,
        objectCaching: false,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    });
  } else {
    const gridSize = config.size;
    
    for (let i = 0; i < width / gridSize; i++) {
      const x = i * gridSize;
      const line = new fabric.Line([x, 0, x, height], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hasControls: false,
        hasBorders: false,
        objectCaching: false,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    }
    
    for (let i = 0; i < height / gridSize; i++) {
      const y = i * gridSize;
      const line = new fabric.Line([0, y, width, y], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hasControls: false,
        hasBorders: false,
        objectCaching: false,
        data: { type: 'grid' }
      });
      canvas.add(line);
      line.sendToBack();
    }
  }
  
  sendGridToBack(canvas);
  canvas.renderAll();
}

/**
 * Remove grid from canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => canvas.remove(obj));
}

/**
 * Calculate positions for columns
 */
export function calculateColumnPositions(
  canvasWidth: number,
  columns: number,
  gutterWidth: number,
  marginWidth: number
): number[] {
  const columnWidth = (canvasWidth - (2 * marginWidth) - ((columns - 1) * gutterWidth)) / columns;
  const positions: number[] = [marginWidth];
  
  for (let i = 1; i < columns; i++) {
    const position = marginWidth + (i * (columnWidth + gutterWidth));
    positions.push(position);
  }
  
  return positions;
}

/**
 * Calculate grid positions
 */
export function calculateGridPositions(
  width: number,
  height: number,
  gridSize: number
): { horizontal: number[]; vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  for (let i = 0; i <= width; i += gridSize) {
    vertical.push(i);
  }
  
  for (let j = 0; j <= height; j += gridSize) {
    horizontal.push(j);
  }
  
  return { horizontal, vertical };
}

/**
 * Get responsive grid configuration
 */
export function getResponsiveGridConfig(
  gridConfig: GridConfiguration,
  width: number
): GridConfiguration {
  // Implement responsive logic here based on width
  return gridConfig;
}

/**
 * Get breakpoint from width
 */
export function getBreakpointFromWidth(width: number): string {
  // Implement breakpoint logic here based on width
  return 'default';
}

/**
 * Get object bounds
 */
export function getObjectBounds(object: fabric.Object): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  return {
    left: object.left || 0,
    top: object.top || 0,
    width: object.width || 0,
    height: object.height || 0
  };
}

/**
 * Generate snap guidelines
 */
export function generateSnapGuidelines(
  objects: fabric.Object[],
  gridSize: number
): { horizontal: number[]; vertical: number[] } {
  const horizontal: number[] = [];
  const vertical: number[] = [];
  
  objects.forEach(object => {
    if (!object.left || !object.top || !object.width || !object.height) return;
    
    horizontal.push(object.top);
    horizontal.push(object.top + object.height);
    horizontal.push(object.top + object.height / 2);
    
    vertical.push(object.left);
    vertical.push(object.left + object.width);
    vertical.push(object.left + object.width / 2);
  });
  
  return { horizontal, vertical };
}

/**
 * Snap object to guidelines
 */
export function snapObjectToGuidelines(
  object: fabric.Object,
  guidelines: { horizontal: number[]; vertical: number[] },
  snapTolerance: number
): { x: number; y: number } {
  let x = object.left || 0;
  let y = object.top || 0;
  
  guidelines.horizontal.forEach(guide => {
    if (Math.abs(guide - y) < snapTolerance) {
      y = guide;
    }
  });
  
  guidelines.vertical.forEach(guide => {
    if (Math.abs(guide - x) < snapTolerance) {
      x = guide;
    }
  });
  
  return { x, y };
}

/**
 * Show alignment guides on canvas
 */
export function showAlignmentGuides(canvas: fabric.Canvas, guides: AlignmentGuide[]): fabric.Line[] {
  const guideObjects: fabric.Line[] = [];
  
  guides.forEach(guide => {
    const line = new fabric.Line(
      guide.orientation === 'vertical'
        ? [guide.position, 0, guide.position, canvas.height || 0]
        : [0, guide.position, canvas.width || 0, guide.position],
      {
        stroke: guide.strength ? 'rgba(0, 200, 0, 0.5)' : 'rgba(0, 120, 255, 0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        hasControls: false,
        hasBorders: false,
        objectCaching: false,
        data: { type: 'guide' }
      }
    );
    
    canvas.add(line);
    guideObjects.push(line);
    line.bringToFront();
  });
  
  canvas.renderAll();
  return guideObjects;
}

/**
 * Remove alignment guides from canvas
 */
export function removeAlignmentGuides(canvas: fabric.Canvas, guideObjects: fabric.Line[]): void {
  guideObjects.forEach(guide => canvas.remove(guide));
  canvas.renderAll();
}

/**
 * Find closest snap position on grid
 */
export function findClosestSnapPosition(point: { x: number, y: number }, gridSize: number): { x: number, y: number } {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Send grid to back of canvas
 */
export function sendGridToBack(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => obj.sendToBack());
}
