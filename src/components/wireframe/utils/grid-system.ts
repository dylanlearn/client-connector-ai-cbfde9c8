
import { fabric } from 'fabric';

// Grid Configuration Interface
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

// Default Grid Configuration
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

// Export visual settings as well
export const DEFAULT_VISUAL_SETTINGS = {
  color: 'rgba(120, 120, 120, 0.4)',
  opacity: 0.5,
  lineWidth: 1,
  showNumbers: false,
  fontFamily: 'Arial',
  fontSize: 10,
  fontColor: 'rgba(100, 100, 100, 0.6)'
};

/**
 * Updates the grid on the canvas
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas, 
  config: GridConfiguration,
  width: number,
  height: number
): void {
  // First remove any existing grid
  removeGridFromCanvas(canvas);
  
  // Don't draw grid if not visible
  if (!config.visible) return;
  
  // Create grid based on type
  let gridLines: fabric.Line[] = [];
  
  if (config.type === 'lines' || config.type === 'dots') {
    // Create horizontal lines
    for (let i = 0; i <= height; i += config.size) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: DEFAULT_VISUAL_SETTINGS.color,
        selectable: false,
        evented: false,
        strokeDashArray: config.type === 'dots' ? [1, config.size - 1] : [],
        strokeWidth: DEFAULT_VISUAL_SETTINGS.lineWidth
      });
      
      line.set({
        data: { type: 'grid-line', orientation: 'horizontal' }
      });
      
      gridLines.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += config.size) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: DEFAULT_VISUAL_SETTINGS.color,
        selectable: false,
        evented: false,
        strokeDashArray: config.type === 'dots' ? [1, config.size - 1] : [],
        strokeWidth: DEFAULT_VISUAL_SETTINGS.lineWidth
      });
      
      line.set({
        data: { type: 'grid-line', orientation: 'vertical' }
      });
      
      gridLines.push(line);
    }
  } else if (config.type === 'columns') {
    // Calculate column positions
    const positions = calculateColumnPositions(width, config.columns, config.gutterWidth, config.marginWidth);
    
    positions.forEach(position => {
      const line = new fabric.Line([position, 0, position, height], {
        stroke: DEFAULT_VISUAL_SETTINGS.color,
        selectable: false,
        evented: false,
        strokeWidth: DEFAULT_VISUAL_SETTINGS.lineWidth
      });
      
      line.set({
        data: { type: 'grid-column', orientation: 'vertical' }
      });
      
      gridLines.push(line);
    });
  }
  
  // Add all grid lines to canvas
  gridLines.forEach(line => canvas.add(line));
  sendGridToBack(canvas);
}

/**
 * Remove grid from canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => {
    if (!obj.data) return false;
    return obj.data.type?.includes('grid');
  });
  
  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
}

/**
 * Calculate column positions
 */
export function calculateColumnPositions(
  canvasWidth: number,
  columns: number,
  gutterWidth: number,
  marginWidth: number
): number[] {
  const positions: number[] = [];
  const availableWidth = canvasWidth - (marginWidth * 2);
  const gutters = columns - 1;
  const totalGutterWidth = gutters * gutterWidth;
  const columnWidth = (availableWidth - totalGutterWidth) / columns;
  
  // Add left margin
  positions.push(marginWidth);
  
  // Add column lines
  let currentPosition = marginWidth;
  
  for (let i = 0; i < columns; i++) {
    currentPosition += columnWidth;
    
    if (i < columns - 1) {
      positions.push(currentPosition);
      currentPosition += gutterWidth;
      positions.push(currentPosition);
    }
  }
  
  // Add right margin
  positions.push(canvasWidth - marginWidth);
  
  return positions;
}

/**
 * Calculate snap positions
 */
export function calculateSnapPositions(
  canvas: fabric.Canvas,
  config: GridConfiguration
): { horizontal: number[], vertical: number[] } {
  const canvasWidth = canvas.width ?? 1000;
  const canvasHeight = canvas.height ?? 800;
  
  if (config.type === 'columns') {
    const columnPositions = calculateColumnPositions(
      canvasWidth,
      config.columns,
      config.gutterWidth,
      config.marginWidth
    );
    
    return {
      vertical: columnPositions,
      horizontal: Array.from({ length: Math.floor(canvasHeight / config.size) + 1 }, 
        (_, i) => i * config.size)
    };
  } else {
    return {
      horizontal: Array.from({ length: Math.floor(canvasHeight / config.size) + 1 }, 
        (_, i) => i * config.size),
      vertical: Array.from({ length: Math.floor(canvasWidth / config.size) + 1 }, 
        (_, i) => i * config.size)
    };
  }
}

/**
 * Find closest snap position
 */
export function findClosestSnapPosition(
  value: number,
  positions: number[],
  threshold: number = 10
): number | null {
  let closest = null;
  let closestDistance = threshold;
  
  for (const position of positions) {
    const distance = Math.abs(position - value);
    if (distance < closestDistance) {
      closest = position;
      closestDistance = distance;
    }
  }
  
  return closest;
}

/**
 * Send grid to back
 */
export function sendGridToBack(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => {
    if (!obj.data) return false;
    return obj.data.type?.includes('grid');
  });
  
  gridObjects.forEach(obj => canvas.sendToBack(obj));
}

/**
 * Show alignment guides
 */
export function showAlignmentGuides(
  canvas: fabric.Canvas,
  guides: { orientation: 'horizontal' | 'vertical', position: number }[],
  color: string = 'rgba(0, 120, 255, 0.75)'
): void {
  if (!canvas) return;
  
  // Remove existing guides
  removeAlignmentGuides(canvas);
  
  // Draw new guides
  guides.forEach((guide, index) => {
    let guideObject;
    
    if (guide.orientation === 'horizontal') {
      guideObject = new fabric.Line([
        0, guide.position, 
        canvas.width ?? 1000, guide.position
      ], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5]
      });
    } else {
      guideObject = new fabric.Line([
        guide.position, 0,
        guide.position, canvas.height ?? 800
      ], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5]
      });
    }
    
    guideObject.set({
      data: {
        type: 'alignment-guide',
        orientation: guide.orientation,
        index
      }
    });
    
    canvas.add(guideObject);
    canvas.bringToFront(guideObject);
  });
}

/**
 * Remove alignment guides
 */
export function removeAlignmentGuides(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  const guideObjects = canvas.getObjects().filter(obj => {
    if (!obj.data) return false;
    return obj.data.type === 'alignment-guide';
  });
  
  guideObjects.forEach(obj => canvas.remove(obj));
}

// Re-export grid types for wider use
export interface GridBreakpoint {
  name: string;
  width: number;
  color?: string;
}

export interface GridConfig {
  size: number;
  type: 'lines' | 'dots' | 'columns' | 'custom';
  visible: boolean;
  snapToGrid: boolean;
  color: string;
  opacity: number;
  showBreakpoints: boolean;
  breakpoints: GridBreakpoint[];
  columns: number;
  gutterSize: number;
  marginSize: number;
}

export const TAILWIND_BREAKPOINTS: GridBreakpoint[] = [
  { name: 'sm', width: 640, color: 'blue-400' },
  { name: 'md', width: 768, color: 'green-400' },
  { name: 'lg', width: 1024, color: 'orange-400' },
  { name: 'xl', width: 1280, color: 'purple-400' },
  { name: '2xl', width: 1536, color: 'pink-400' }
];

export const DEFAULT_GRID_CONFIG: GridConfig = {
  size: 8,
  type: 'lines',
  visible: true,
  snapToGrid: true,
  color: 'rgba(0,0,0,0.1)',
  opacity: 0.5,
  showBreakpoints: true,
  breakpoints: TAILWIND_BREAKPOINTS,
  columns: 12,
  gutterSize: 16,
  marginSize: 24
};

// This should help with the breakpoint identification
export function getBreakpointFromWidth(width: number, breakpoints = TAILWIND_BREAKPOINTS): GridBreakpoint | null {
  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (width >= breakpoints[i].width) {
      return breakpoints[i];
    }
  }
  return null;
}

// Helpful for calculating object bounds
export function getObjectBounds(obj: fabric.Object): { left: number, top: number, right: number, bottom: number } {
  const scaleX = obj.scaleX ?? 1;
  const scaleY = obj.scaleY ?? 1;
  const left = obj.left ?? 0;
  const top = obj.top ?? 0;
  const width = (obj.width ?? 0) * scaleX;
  const height = (obj.height ?? 0) * scaleY;
  
  return {
    left,
    top,
    right: left + width,
    bottom: top + height
  };
}

// Generate guidelines for snapping
export function generateSnapGuidelines(
  canvasObjects: fabric.Object[],
  activeObject: fabric.Object,
  threshold = 10
): { horizontal: number[], vertical: number[] } {
  if (!activeObject) return { horizontal: [], vertical: [] };
  
  const horizontalGuides: number[] = [];
  const verticalGuides: number[] = [];
  
  canvasObjects.forEach(obj => {
    if (obj === activeObject || !obj.visible) return;
    
    const activeBounds = getObjectBounds(activeObject);
    const objBounds = getObjectBounds(obj);
    
    // Top edges
    if (Math.abs(activeBounds.top - objBounds.top) < threshold) {
      horizontalGuides.push(objBounds.top);
    }
    
    // Bottom edges
    if (Math.abs(activeBounds.bottom - objBounds.bottom) < threshold) {
      horizontalGuides.push(objBounds.bottom);
    }
    
    // Centers (vertical alignment)
    if (Math.abs((activeBounds.top + activeBounds.bottom) / 2 - (objBounds.top + objBounds.bottom) / 2) < threshold) {
      horizontalGuides.push((objBounds.top + objBounds.bottom) / 2);
    }
    
    // Left edges
    if (Math.abs(activeBounds.left - objBounds.left) < threshold) {
      verticalGuides.push(objBounds.left);
    }
    
    // Right edges
    if (Math.abs(activeBounds.right - objBounds.right) < threshold) {
      verticalGuides.push(objBounds.right);
    }
    
    // Centers (horizontal alignment)
    if (Math.abs((activeBounds.left + activeBounds.right) / 2 - (objBounds.left + objBounds.right) / 2) < threshold) {
      verticalGuides.push((objBounds.left + objBounds.right) / 2);
    }
  });
  
  return {
    horizontal: [...new Set(horizontalGuides)],
    vertical: [...new Set(verticalGuides)]
  };
}

// Snap object to guidelines
export function snapObjectToGuidelines(
  obj: fabric.Object,
  guidelines: { horizontal: number[], vertical: number[] },
  threshold = 10
): { snapped: boolean, newLeft?: number, newTop?: number } {
  if (!obj) return { snapped: false };
  
  const bounds = getObjectBounds(obj);
  let snapped = false;
  let newLeft: number | undefined = undefined;
  let newTop: number | undefined = undefined;
  
  // Check horizontal guidelines
  const activeObjCenterY = (bounds.top + bounds.bottom) / 2;
  for (const guidePos of guidelines.horizontal) {
    // Top edge
    if (Math.abs(bounds.top - guidePos) < threshold) {
      newTop = guidePos;
      snapped = true;
      break;
    }
    // Bottom edge
    if (Math.abs(bounds.bottom - guidePos) < threshold) {
      newTop = guidePos - (bounds.bottom - bounds.top);
      snapped = true;
      break;
    }
    // Center
    if (Math.abs(activeObjCenterY - guidePos) < threshold) {
      newTop = guidePos - (bounds.bottom - bounds.top) / 2;
      snapped = true;
      break;
    }
  }
  
  // Check vertical guidelines
  const activeObjCenterX = (bounds.left + bounds.right) / 2;
  for (const guidePos of guidelines.vertical) {
    // Left edge
    if (Math.abs(bounds.left - guidePos) < threshold) {
      newLeft = guidePos;
      snapped = true;
      break;
    }
    // Right edge
    if (Math.abs(bounds.right - guidePos) < threshold) {
      newLeft = guidePos - (bounds.right - bounds.left);
      snapped = true;
      break;
    }
    // Center
    if (Math.abs(activeObjCenterX - guidePos) < threshold) {
      newLeft = guidePos - (bounds.right - bounds.left) / 2;
      snapped = true;
      break;
    }
  }
  
  return { snapped, newLeft, newTop };
}
