
import { fabric } from 'fabric';
import { AlignmentGuide, GridConfiguration, GridVisualSettings } from './types';

// Default grid configuration
export const DEFAULT_GRID_CONFIG: GridConfiguration = {
  visible: true,
  size: 20,
  snapToGrid: true,
  type: 'lines',
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  snapThreshold: 10,
  showGuides: true,
  guideColor: 'rgba(0, 120, 255, 0.75)',
  showRulers: true,
  rulerSize: 20
};

// Default visual settings for the grid
export const DEFAULT_VISUAL_SETTINGS: GridVisualSettings = {
  color: 'rgba(200, 200, 200, 0.5)',
  opacity: 0.5,
  lineWidth: 1,
  showNumbers: true,
  fontFamily: 'Arial',
  fontSize: 10,
  fontColor: 'rgba(150, 150, 150, 0.9)'
};

/**
 * Creates or updates the grid on the canvas
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number,
  visualSettings: Partial<GridVisualSettings> = {}
): void {
  // First, remove existing grid
  removeGridFromCanvas(canvas);
  
  // If grid is not visible, don't render it
  if (!config.visible) return;
  
  const settings = { ...DEFAULT_VISUAL_SETTINGS, ...visualSettings };
  
  // Create grid based on the type
  if (config.type === 'lines') {
    createLineGrid(canvas, config, width, height, settings);
  } else if (config.type === 'dots') {
    createDotGrid(canvas, config, width, height, settings);
  } else if (config.type === 'columns') {
    createColumnGrid(canvas, config, width, height, settings);
  }
  
  // Add rulers if enabled
  if (config.showRulers) {
    addRulersToCanvas(canvas, config, width, height, settings);
  }
  
  // Send grid to back
  sendGridToBack(canvas);
  
  // Force render
  canvas.renderAll();
}

/**
 * Creates a grid with lines
 */
function createLineGrid(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number,
  settings: GridVisualSettings
): void {
  const { size } = config;
  const gridLines: fabric.Line[] = [];
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += size) {
    const line = new fabric.Line([0, y, width, y], {
      stroke: settings.color,
      selectable: false,
      evented: false,
      strokeWidth: settings.lineWidth,
      opacity: settings.opacity,
      data: { type: 'grid', gridType: 'horizontal' }
    });
    
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += size) {
    const line = new fabric.Line([x, 0, x, height], {
      stroke: settings.color,
      selectable: false,
      evented: false,
      strokeWidth: settings.lineWidth,
      opacity: settings.opacity,
      data: { type: 'grid', gridType: 'vertical' }
    });
    
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Add coordinates if enabled
  if (settings.showNumbers) {
    addGridCoordinates(canvas, config, width, height, settings);
  }
}

/**
 * Creates a grid with dots
 */
function createDotGrid(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number,
  settings: GridVisualSettings
): void {
  const { size } = config;
  const gridDots: fabric.Circle[] = [];
  
  // Create dots at grid intersections
  for (let x = 0; x <= width; x += size) {
    for (let y = 0; y <= height; y += size) {
      const dot = new fabric.Circle({
        left: x,
        top: y,
        radius: settings.lineWidth,
        fill: settings.color,
        selectable: false,
        evented: false,
        opacity: settings.opacity,
        originX: 'center',
        originY: 'center',
        data: { type: 'grid', gridType: 'dot' }
      });
      
      gridDots.push(dot);
      canvas.add(dot);
    }
  }
}

/**
 * Creates a column-based grid
 */
function createColumnGrid(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number,
  settings: GridVisualSettings
): void {
  const { columns, gutterWidth, marginWidth } = config;
  const columnLines: fabric.Line[] = [];
  
  // Calculate column width
  const availableWidth = width - (marginWidth * 2);
  const totalGutterWidth = gutterWidth * (columns - 1);
  const columnWidth = (availableWidth - totalGutterWidth) / columns;
  
  // Create column lines
  for (let i = 0; i <= columns; i++) {
    // Calculate x position
    const x = marginWidth + (i * (columnWidth + gutterWidth));
    
    // Create vertical line
    const line = new fabric.Line([x, 0, x, height], {
      stroke: settings.color,
      selectable: false,
      evented: false,
      strokeWidth: settings.lineWidth,
      opacity: settings.opacity,
      data: { type: 'grid', gridType: 'column' }
    });
    
    columnLines.push(line);
    canvas.add(line);
    
    // Add column numbers
    if (settings.showNumbers) {
      const text = new fabric.Text(String(i), {
        left: x + 4,
        top: 4,
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        fill: settings.fontColor,
        selectable: false,
        evented: false,
        opacity: settings.opacity,
        data: { type: 'grid', gridType: 'columnNumber' }
      });
      
      canvas.add(text);
    }
    
    // Add gutter visualization
    if (i < columns) {
      const gutterStart = x + columnWidth;
      
      // Only add gutter if it's not the last column
      if (gutterStart + gutterWidth <= width - marginWidth) {
        // Create subtle gutter visualization
        const gutter = new fabric.Rect({
          left: gutterStart,
          top: 0,
          width: gutterWidth,
          height: height,
          fill: 'rgba(240, 240, 240, 0.5)',
          stroke: settings.color,
          strokeWidth: 0.5,
          strokeDashArray: [2, 2],
          opacity: settings.opacity * 0.5,
          selectable: false,
          evented: false,
          data: { type: 'grid', gridType: 'gutter' }
        });
        
        canvas.add(gutter);
      }
    }
  }
  
  // Add horizontal guides for better orientation
  for (let y = 0; y <= height; y += config.size * 2) {
    const line = new fabric.Line([0, y, width, y], {
      stroke: settings.color,
      selectable: false,
      evented: false,
      strokeWidth: settings.lineWidth * 0.5,
      opacity: settings.opacity * 0.5,
      strokeDashArray: [4, 4],
      data: { type: 'grid', gridType: 'horizontalGuide' }
    });
    
    canvas.add(line);
  }
}

/**
 * Adds coordinates to the grid
 */
function addGridCoordinates(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number,
  settings: GridVisualSettings
): void {
  const { size } = config;
  
  // Add coordinates at major grid lines (every 5 grid cells)
  for (let x = 0; x <= width; x += size * 5) {
    const text = new fabric.Text(String(x), {
      left: x + 2,
      top: 2,
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      fill: settings.fontColor,
      selectable: false,
      evented: false,
      opacity: settings.opacity,
      data: { type: 'grid', gridType: 'coordinate' }
    });
    
    canvas.add(text);
  }
  
  for (let y = 0; y <= height; y += size * 5) {
    const text = new fabric.Text(String(y), {
      left: 2,
      top: y + 2,
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      fill: settings.fontColor,
      selectable: false,
      evented: false,
      opacity: settings.opacity,
      data: { type: 'grid', gridType: 'coordinate' }
    });
    
    canvas.add(text);
  }
}

/**
 * Adds rulers to the canvas
 */
function addRulersToCanvas(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number,
  settings: GridVisualSettings
): void {
  const rulerSize = config.rulerSize;
  const rulerColor = 'rgba(240, 240, 240, 0.9)';
  const rulerStroke = 'rgba(200, 200, 200, 0.8)';
  
  // Horizontal ruler
  const horizontalRuler = new fabric.Rect({
    top: 0,
    left: 0,
    width: width,
    height: rulerSize,
    fill: rulerColor,
    stroke: rulerStroke,
    strokeWidth: 1,
    selectable: false,
    evented: false,
    data: { type: 'grid', gridType: 'ruler' }
  });
  
  // Vertical ruler
  const verticalRuler = new fabric.Rect({
    top: 0,
    left: 0,
    width: rulerSize,
    height: height,
    fill: rulerColor,
    stroke: rulerStroke,
    strokeWidth: 1,
    selectable: false,
    evented: false,
    data: { type: 'grid', gridType: 'ruler' }
  });
  
  canvas.add(horizontalRuler, verticalRuler);
  
  // Add ruler markings
  const markingInterval = config.size * 2;
  
  // Horizontal markings
  for (let x = rulerSize; x < width; x += markingInterval) {
    const isLargeMarking = (x - rulerSize) % (markingInterval * 5) === 0;
    const markingHeight = isLargeMarking ? rulerSize / 2 : rulerSize / 3;
    
    const marking = new fabric.Line(
      [x, 0, x, markingHeight],
      {
        stroke: 'rgba(100, 100, 100, 0.8)',
        strokeWidth: isLargeMarking ? 1 : 0.5,
        selectable: false,
        evented: false,
        data: { type: 'grid', gridType: 'rulerMarking' }
      }
    );
    
    canvas.add(marking);
    
    // Add text for major markings
    if (isLargeMarking) {
      const text = new fabric.Text(String(x), {
        left: x + 2,
        top: markingHeight + 2,
        fontSize: settings.fontSize - 1,
        fontFamily: settings.fontFamily,
        fill: 'rgba(100, 100, 100, 0.8)',
        selectable: false,
        evented: false,
        data: { type: 'grid', gridType: 'rulerText' }
      });
      
      canvas.add(text);
    }
  }
  
  // Vertical markings
  for (let y = rulerSize; y < height; y += markingInterval) {
    const isLargeMarking = (y - rulerSize) % (markingInterval * 5) === 0;
    const markingWidth = isLargeMarking ? rulerSize / 2 : rulerSize / 3;
    
    const marking = new fabric.Line(
      [0, y, markingWidth, y],
      {
        stroke: 'rgba(100, 100, 100, 0.8)',
        strokeWidth: isLargeMarking ? 1 : 0.5,
        selectable: false,
        evented: false,
        data: { type: 'grid', gridType: 'rulerMarking' }
      }
    );
    
    canvas.add(marking);
    
    // Add text for major markings
    if (isLargeMarking) {
      const text = new fabric.Text(String(y), {
        left: markingWidth + 2,
        top: y + 2,
        fontSize: settings.fontSize - 1,
        fontFamily: settings.fontFamily,
        fill: 'rgba(100, 100, 100, 0.8)',
        selectable: false,
        evented: false,
        data: { type: 'grid', gridType: 'rulerText' }
      });
      
      canvas.add(text);
    }
  }
  
  // Rule corner
  const rulerCorner = new fabric.Rect({
    top: 0,
    left: 0,
    width: rulerSize,
    height: rulerSize,
    fill: rulerColor,
    stroke: rulerStroke,
    strokeWidth: 1,
    selectable: false,
    evented: false,
    data: { type: 'grid', gridType: 'rulerCorner' }
  });
  
  canvas.add(rulerCorner);
}

/**
 * Brings grid elements to the front of the canvas ordering
 */
export function sendGridToBack(canvas: fabric.Canvas): void {
  // Get all grid elements
  const gridElements = canvas.getObjects().filter(obj => 
    obj.data && typeof obj.data === 'object' && obj.data.type === 'grid'
  );
  
  // Send each grid element to back
  gridElements.forEach(element => {
    canvas.sendToBack(element);
  });
}

/**
 * Removes grid elements from canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  // Get all grid elements
  const gridElements = canvas.getObjects().filter(obj => 
    obj.data && typeof obj.data === 'object' && obj.data.type === 'grid'
  );
  
  // Remove each grid element
  gridElements.forEach(element => {
    canvas.remove(element);
  });
}

/**
 * Calculate snap positions for the grid and other objects
 */
export function calculateSnapPositions(
  activeObject: fabric.Object,
  allObjects: fabric.Object[],
  gridConfig: GridConfiguration,
  canvasWidth: number,
  canvasHeight: number
): { horizontal: number[], vertical: number[] } {
  const { snapToGrid, size, type, columns, gutterWidth, marginWidth } = gridConfig;
  const snapPositions = {
    horizontal: [] as number[],
    vertical: [] as number[]
  };
  
  // Add grid snap positions if snap to grid is enabled
  if (snapToGrid) {
    // Add positions based on grid type
    if (type === 'lines' || type === 'dots') {
      // Regular grid
      for (let x = 0; x <= canvasWidth; x += size) {
        snapPositions.vertical.push(x);
      }
      for (let y = 0; y <= canvasHeight; y += size) {
        snapPositions.horizontal.push(y);
      }
    } else if (type === 'columns') {
      // Column-based grid
      const availableWidth = canvasWidth - (marginWidth * 2);
      const totalGutterWidth = gutterWidth * (columns - 1);
      const columnWidth = (availableWidth - totalGutterWidth) / columns;
      
      // Add column positions
      for (let i = 0; i <= columns; i++) {
        const x = marginWidth + (i * (columnWidth + gutterWidth));
        snapPositions.vertical.push(x);
        
        // Add column center position
        if (i < columns) {
          snapPositions.vertical.push(x + columnWidth / 2);
        }
        
        // Add gutter edge positions
        if (i < columns) {
          snapPositions.vertical.push(x + columnWidth);
        }
      }
      
      // Add regular grid positions for the y axis
      for (let y = 0; y <= canvasHeight; y += size) {
        snapPositions.horizontal.push(y);
      }
    }
  }
  
  // Add object snap positions
  allObjects.forEach(obj => {
    // Skip if it's the same as the active object
    if (obj === activeObject) return;
    
    // Skip grid lines and guides
    if (obj.data?.type === 'grid' || obj.data?.type === 'alignmentGuide') return;
    
    // Get object bounds
    const objLeft = obj.left || 0;
    const objTop = obj.top || 0;
    const objWidth = obj.width || 0;
    const objHeight = obj.height || 0;
    const objScaleX = obj.scaleX || 1;
    const objScaleY = obj.scaleY || 1;
    const objRight = objLeft + objWidth * objScaleX;
    const objBottom = objTop + objHeight * objScaleY;
    const objCenterX = objLeft + (objWidth * objScaleX) / 2;
    const objCenterY = objTop + (objHeight * objScaleY) / 2;
    
    // Add horizontal positions (top, center, bottom edges)
    snapPositions.horizontal.push(objTop, objCenterY, objBottom);
    
    // Add vertical positions (left, center, right edges)
    snapPositions.vertical.push(objLeft, objCenterX, objRight);
  });
  
  // Add canvas boundaries
  snapPositions.horizontal.push(0, canvasHeight / 2, canvasHeight);
  snapPositions.vertical.push(0, canvasWidth / 2, canvasWidth);
  
  return snapPositions;
}

/**
 * Find closest snap position within threshold
 */
export function findClosestSnapPosition(
  position: number,
  snapPositions: number[],
  threshold: number
): number | null {
  let closest = null;
  let minDistance = threshold;
  
  for (const snapPos of snapPositions) {
    const distance = Math.abs(position - snapPos);
    if (distance < minDistance) {
      minDistance = distance;
      closest = snapPos;
    }
  }
  
  return closest;
}

/**
 * Show alignment guides on canvas
 */
export function showAlignmentGuides(
  canvas: fabric.Canvas,
  activeSnaps: { horizontal: number[], vertical: number[] },
  guideColor: string = 'rgba(0, 120, 255, 0.75)'
): void {
  // Remove existing guides
  removeAlignmentGuides(canvas);
  
  // Create horizontal guides
  activeSnaps.horizontal.forEach(y => {
    const guide = new fabric.Line([0, y, canvas.width || 0, y], {
      stroke: guideColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'alignmentGuide', orientation: 'horizontal' }
    });
    
    canvas.add(guide);
    guide.bringToFront();
  });
  
  // Create vertical guides
  activeSnaps.vertical.forEach(x => {
    const guide = new fabric.Line([x, 0, x, canvas.height || 0], {
      stroke: guideColor,
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'alignmentGuide', orientation: 'vertical' }
    });
    
    canvas.add(guide);
    guide.bringToFront();
  });
}

/**
 * Remove alignment guides from canvas
 */
export function removeAlignmentGuides(canvas: fabric.Canvas): void {
  // Get all alignment guides
  const guides = canvas.getObjects().filter(obj => 
    obj.data && typeof obj.data === 'object' && obj.data.type === 'alignmentGuide'
  );
  
  // Remove each guide
  guides.forEach(guide => {
    canvas.remove(guide);
  });
}
