
import { fabric } from 'fabric';

export interface GridConfiguration {
  visible: boolean;
  snapToGrid: boolean;
  showGuides: boolean;
  size: number;
  type: 'lines' | 'dots' | 'columns';
  columns: number;
  gutterWidth: number;
  marginWidth: number;
  guideColor: string;
  snapThreshold: number;
}

export const DEFAULT_GRID_CONFIG: GridConfiguration = {
  visible: true,
  snapToGrid: true,
  showGuides: true,
  size: 20,
  type: 'lines',
  columns: 12,
  gutterWidth: 20,
  marginWidth: 40,
  guideColor: 'rgba(0, 120, 255, 0.5)',
  snapThreshold: 10,
};

/**
 * Draw grid on canvas
 */
export function updateGridOnCanvas(
  canvas: fabric.Canvas,
  config: GridConfiguration,
  width: number,
  height: number
): void {
  // Clear existing grid
  removeGridFromCanvas(canvas);
  
  if (!config.visible) return;
  
  const gridObjects: fabric.Object[] = [];
  
  if (config.type === 'columns') {
    // Create column grid
    const { columns, gutterWidth, marginWidth } = config;
    const totalMargin = marginWidth * 2;
    const availableWidth = width - totalMargin;
    const columnWidth = (availableWidth - (gutterWidth * (columns - 1))) / columns;
    
    // Draw margin lines
    const leftMarginLine = new fabric.Line([marginWidth, 0, marginWidth, height], {
      stroke: config.guideColor,
      selectable: false,
      evented: false,
      strokeWidth: 1
    });
    
    const rightMarginLine = new fabric.Line([width - marginWidth, 0, width - marginWidth, height], {
      stroke: config.guideColor,
      selectable: false,
      evented: false,
      strokeWidth: 1
    });
    
    gridObjects.push(leftMarginLine, rightMarginLine);
    
    // Draw column lines
    for (let i = 0; i <= columns; i++) {
      const x = marginWidth + (i * (columnWidth + gutterWidth));
      
      if (i < columns) {
        // Column start
        const columnLine = new fabric.Line([x, 0, x, height], {
          stroke: config.guideColor,
          selectable: false,
          evented: false,
          strokeWidth: 1
        });
        gridObjects.push(columnLine);
        
        // Gutter end
        if (i > 0) {
          const gutterLine = new fabric.Line([x - gutterWidth, 0, x - gutterWidth, height], {
            stroke: config.guideColor,
            selectable: false,
            evented: false,
            strokeWidth: 0.5,
            strokeDashArray: [5, 5]
          });
          gridObjects.push(gutterLine);
        }
      }
    }
  } else {
    // Create regular grid
    const size = config.size;
    const isDots = config.type === 'dots';
    
    // Create horizontal and vertical lines
    for (let i = 0; i < (width / size); i++) {
      const x = i * size;
      
      if (isDots) {
        for (let j = 0; j < (height / size); j++) {
          const y = j * size;
          
          const dot = new fabric.Circle({
            left: x,
            top: y,
            radius: 1,
            fill: config.guideColor,
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center'
          });
          gridObjects.push(dot);
        }
      } else {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: config.guideColor,
          selectable: false,
          evented: false,
          strokeWidth: 0.5
        });
        gridObjects.push(line);
      }
    }
    
    if (!isDots) {
      for (let j = 0; j < (height / size); j++) {
        const y = j * size;
        
        const line = new fabric.Line([0, y, width, y], {
          stroke: config.guideColor,
          selectable: false,
          evented: false,
          strokeWidth: 0.5
        });
        gridObjects.push(line);
      }
    }
  }
  
  // Add all grid objects to canvas
  gridObjects.forEach(obj => {
    obj.data = { type: 'grid' };
    canvas.add(obj);
  });
  
  // Send grid to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.renderAll();
}

/**
 * Remove grid from canvas
 */
export function removeGridFromCanvas(canvas: fabric.Canvas): void {
  const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
}

/**
 * Snap object to grid
 */
export function snapObjectToGrid(obj: fabric.Object, config: GridConfiguration): void {
  if (!config.snapToGrid) return;
  
  const size = config.size;
  
  // Get object position
  let left = obj.left || 0;
  let top = obj.top || 0;
  
  // Snap to grid
  const newLeft = Math.round(left / size) * size;
  const newTop = Math.round(top / size) * size;
  
  // Apply snapped position
  obj.set({
    left: newLeft,
    top: newTop
  });
}

/**
 * Create alignment guides for object
 */
export function createAlignmentGuides(canvas: fabric.Canvas, targetObject: fabric.Object): void {
  // Remove existing guides
  removeAlignmentGuides(canvas);
  
  if (!targetObject) return;
  
  const allObjects = canvas.getObjects().filter(obj => {
    return obj !== targetObject && !obj.data?.type?.includes('guide') && !obj.data?.type?.includes('grid');
  });
  
  if (allObjects.length === 0) return;
  
  const guides: fabric.Line[] = [];
  const guideOptions = {
    stroke: 'rgba(0, 120, 255, 0.8)',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5]
  };
  
  const targetLeft = targetObject.left || 0;
  const targetTop = targetObject.top || 0;
  const targetRight = targetLeft + (targetObject.width || 0) * (targetObject.scaleX || 1);
  const targetBottom = targetTop + (targetObject.height || 0) * (targetObject.scaleY || 1);
  const targetCenterX = targetLeft + (targetObject.width || 0) * (targetObject.scaleX || 1) / 2;
  const targetCenterY = targetTop + (targetObject.height || 0) * (targetObject.scaleY || 1) / 2;
  
  // Check each object for alignment
  allObjects.forEach(obj => {
    const objLeft = obj.left || 0;
    const objTop = obj.top || 0;
    const objRight = objLeft + (obj.width || 0) * (obj.scaleX || 1);
    const objBottom = objTop + (obj.height || 0) * (obj.scaleY || 1);
    const objCenterX = objLeft + (obj.width || 0) * (obj.scaleX || 1) / 2;
    const objCenterY = objTop + (obj.height || 0) * (obj.scaleY || 1) / 2;
    
    // Horizontal alignments
    if (Math.abs(targetLeft - objLeft) < 10) {
      // Left edges align
      const line = new fabric.Line([objLeft, 0, objLeft, canvas.height || 1000], guideOptions);
      line.data = { type: 'alignmentGuide' };
      guides.push(line);
    }
    
    if (Math.abs(targetRight - objRight) < 10) {
      // Right edges align
      const line = new fabric.Line([objRight, 0, objRight, canvas.height || 1000], guideOptions);
      line.data = { type: 'alignmentGuide' };
      guides.push(line);
    }
    
    if (Math.abs(targetCenterX - objCenterX) < 10) {
      // Centers align horizontally
      const line = new fabric.Line([objCenterX, 0, objCenterX, canvas.height || 1000], guideOptions);
      line.data = { type: 'alignmentGuide' };
      guides.push(line);
    }
    
    // Vertical alignments
    if (Math.abs(targetTop - objTop) < 10) {
      // Top edges align
      const line = new fabric.Line([0, objTop, canvas.width || 1000, objTop], guideOptions);
      line.data = { type: 'alignmentGuide' };
      guides.push(line);
    }
    
    if (Math.abs(targetBottom - objBottom) < 10) {
      // Bottom edges align
      const line = new fabric.Line([0, objBottom, canvas.width || 1000, objBottom], guideOptions);
      line.data = { type: 'alignmentGuide' };
      guides.push(line);
    }
    
    if (Math.abs(targetCenterY - objCenterY) < 10) {
      // Centers align vertically
      const line = new fabric.Line([0, objCenterY, canvas.width || 1000, objCenterY], guideOptions);
      line.data = { type: 'alignmentGuide' };
      guides.push(line);
    }
  });
  
  // Add guides to canvas
  guides.forEach(guide => canvas.add(guide));
}

/**
 * Remove alignment guides
 */
export function removeAlignmentGuides(canvas: fabric.Canvas): void {
  const guides = canvas.getObjects().filter(obj => obj.data?.type === 'alignmentGuide');
  guides.forEach(obj => canvas.remove(obj));
}

/**
 * Calculate snap positions for an object
 */
export function calculateSnapPositions(
  obj: fabric.Object,
  otherObjects: fabric.Object[],
  config: GridConfiguration,
  canvasWidth: number,
  canvasHeight: number
): { horizontal: number[], vertical: number[] } {
  const snapPositions = {
    horizontal: [] as number[],
    vertical: [] as number[]
  };
  
  // Add grid snap positions
  if (config.type === 'columns') {
    // Calculate column positions
    const { columns, gutterWidth, marginWidth } = config;
    const totalMargin = marginWidth * 2;
    const availableWidth = canvasWidth - totalMargin;
    const columnWidth = (availableWidth - (gutterWidth * (columns - 1))) / columns;
    
    // Add margin lines
    snapPositions.vertical.push(marginWidth);
    snapPositions.vertical.push(canvasWidth - marginWidth);
    
    // Add column lines
    for (let i = 0; i <= columns; i++) {
      const x = marginWidth + (i * (columnWidth + gutterWidth));
      snapPositions.vertical.push(x);
      
      if (i > 0) {
        snapPositions.vertical.push(x - gutterWidth);
      }
    }
  } else {
    // Add regular grid lines
    for (let i = 0; i <= canvasWidth; i += config.size) {
      snapPositions.vertical.push(i);
    }
    
    for (let i = 0; i <= canvasHeight; i += config.size) {
      snapPositions.horizontal.push(i);
    }
  }
  
  // Add other objects' positions for alignment
  otherObjects.forEach(otherObj => {
    const left = otherObj.left || 0;
    const top = otherObj.top || 0;
    const width = (otherObj.width || 0) * (otherObj.scaleX || 1);
    const height = (otherObj.height || 0) * (otherObj.scaleY || 1);
    
    // Add positions for vertical alignment
    snapPositions.vertical.push(left); // Left edge
    snapPositions.vertical.push(left + width); // Right edge
    snapPositions.vertical.push(left + width / 2); // Center
    
    // Add positions for horizontal alignment
    snapPositions.horizontal.push(top); // Top edge
    snapPositions.horizontal.push(top + height); // Bottom edge
    snapPositions.horizontal.push(top + height / 2); // Center
  });
  
  return snapPositions;
}

/**
 * Find the closest snap position within threshold
 */
export function findClosestSnapPosition(
  value: number,
  positions: number[],
  threshold: number
): number | null {
  let closestPosition = null;
  let minDistance = threshold;
  
  positions.forEach(position => {
    const distance = Math.abs(position - value);
    if (distance < minDistance) {
      minDistance = distance;
      closestPosition = position;
    }
  });
  
  return closestPosition;
}

/**
 * Show alignment guides based on snap positions
 */
export function showAlignmentGuides(
  canvas: fabric.Canvas,
  positions: { horizontal: number[], vertical: number[] },
  guideColor: string
): void {
  // Remove existing guides
  removeAlignmentGuides(canvas);
  
  const guides: fabric.Line[] = [];
  const guideOptions = {
    stroke: guideColor,
    strokeWidth: 1,
    selectable: false,
    evented: false
  };
  
  // Create horizontal guides
  positions.horizontal.forEach(y => {
    const line = new fabric.Line([0, y, canvas.width || 1000, y], guideOptions);
    line.data = { type: 'alignmentGuide' };
    guides.push(line);
  });
  
  // Create vertical guides
  positions.vertical.forEach(x => {
    const line = new fabric.Line([x, 0, x, canvas.height || 1000], guideOptions);
    line.data = { type: 'alignmentGuide' };
    guides.push(line);
  });
  
  // Add guides to canvas
  guides.forEach(guide => canvas.add(guide));
  canvas.renderAll();
}
