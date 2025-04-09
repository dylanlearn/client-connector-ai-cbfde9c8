
import { fabric } from 'fabric';
import { AlignmentGuide } from './types';

export interface ObjectBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

/**
 * Calculate the bounds of a fabric object
 */
export function getObjectBounds(obj: fabric.Object): ObjectBounds {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = obj.width || 0;
  const height = obj.height || 0;
  const scaleX = obj.scaleX || 1;
  const scaleY = obj.scaleY || 1;
  
  const scaledWidth = width * scaleX;
  const scaledHeight = height * scaleY;
  
  const right = left + scaledWidth;
  const bottom = top + scaledHeight;
  const centerX = left + scaledWidth / 2;
  const centerY = top + scaledHeight / 2;
  
  return { left, right, top, bottom, centerX, centerY, width: scaledWidth, height: scaledHeight };
}

/**
 * Find alignment guides for the active object against other objects
 */
export function findAlignmentGuides(
  activeObject: fabric.Object,
  allObjects: fabric.Object[],
  snapTolerance: number = 10
): AlignmentGuide[] {
  if (!activeObject) return [];
  
  const guides: AlignmentGuide[] = [];
  const activeBounds = getObjectBounds(activeObject);
  const otherObjects = allObjects.filter(obj => obj !== activeObject);
  
  otherObjects.forEach(obj => {
    const targetBounds = getObjectBounds(obj);
    
    // Vertical center alignment
    if (Math.abs(activeBounds.centerX - targetBounds.centerX) <= snapTolerance) {
      guides.push({
        position: targetBounds.centerX,
        orientation: 'vertical',
        type: 'center',
        strength: 1 - Math.abs(activeBounds.centerX - targetBounds.centerX) / snapTolerance
      });
    }
    
    // Horizontal center alignment
    if (Math.abs(activeBounds.centerY - targetBounds.centerY) <= snapTolerance) {
      guides.push({
        position: targetBounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        strength: 1 - Math.abs(activeBounds.centerY - targetBounds.centerY) / snapTolerance
      });
    }
    
    // Left edge alignment
    if (Math.abs(activeBounds.left - targetBounds.left) <= snapTolerance) {
      guides.push({
        position: targetBounds.left,
        orientation: 'vertical',
        type: 'edge',
        strength: 1 - Math.abs(activeBounds.left - targetBounds.left) / snapTolerance
      });
    }
    
    // Right edge alignment
    if (Math.abs(activeBounds.right - targetBounds.right) <= snapTolerance) {
      guides.push({
        position: targetBounds.right,
        orientation: 'vertical',
        type: 'edge',
        strength: 1 - Math.abs(activeBounds.right - targetBounds.right) / snapTolerance
      });
    }
    
    // Top edge alignment
    if (Math.abs(activeBounds.top - targetBounds.top) <= snapTolerance) {
      guides.push({
        position: targetBounds.top,
        orientation: 'horizontal',
        type: 'edge',
        strength: 1 - Math.abs(activeBounds.top - targetBounds.top) / snapTolerance
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(activeBounds.bottom - targetBounds.bottom) <= snapTolerance) {
      guides.push({
        position: targetBounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        strength: 1 - Math.abs(activeBounds.bottom - targetBounds.bottom) / snapTolerance
      });
    }
    
    // Equal spacing - horizontal
    if (Math.abs(activeBounds.left - targetBounds.right) <= snapTolerance) {
      guides.push({
        position: targetBounds.right,
        orientation: 'vertical',
        type: 'distribution',
        strength: 1 - Math.abs(activeBounds.left - targetBounds.right) / snapTolerance
      });
    }
    
    // Equal spacing - vertical
    if (Math.abs(activeBounds.top - targetBounds.bottom) <= snapTolerance) {
      guides.push({
        position: targetBounds.bottom,
        orientation: 'horizontal',
        type: 'distribution',
        strength: 1 - Math.abs(activeBounds.top - targetBounds.bottom) / snapTolerance
      });
    }
  });
  
  // Sort guides by strength (strongest first)
  return guides.sort((a, b) => b.strength - a.strength);
}

/**
 * Apply snapping to guides for a moving object
 */
export function snapObjectToGuides(
  obj: fabric.Object,
  guides: AlignmentGuide[],
  canvas: fabric.Canvas
): void {
  if (!obj || !canvas) return;
  
  const bounds = getObjectBounds(obj);
  let hasSnapped = false;
  
  // Find the strongest guide for each direction (horizontal/vertical)
  const strongestHorizontal = guides
    .filter(g => g.orientation === 'horizontal')
    .sort((a, b) => b.strength - a.strength)[0];
    
  const strongestVertical = guides
    .filter(g => g.orientation === 'vertical')
    .sort((a, b) => b.strength - a.strength)[0];
  
  // Apply horizontal snapping
  if (strongestHorizontal) {
    // Determine what to snap (top, center, or bottom)
    if (strongestHorizontal.type === 'edge' && Math.abs(bounds.top - strongestHorizontal.position) < Math.abs(bounds.bottom - strongestHorizontal.position)) {
      obj.set('top', strongestHorizontal.position);
    } else if (strongestHorizontal.type === 'edge') {
      obj.set('top', strongestHorizontal.position - bounds.height);
    } else if (strongestHorizontal.type === 'center') {
      obj.set('top', strongestHorizontal.position - bounds.height / 2);
    }
    hasSnapped = true;
  }
  
  // Apply vertical snapping
  if (strongestVertical) {
    // Determine what to snap (left, center, or right)
    if (strongestVertical.type === 'edge' && Math.abs(bounds.left - strongestVertical.position) < Math.abs(bounds.right - strongestVertical.position)) {
      obj.set('left', strongestVertical.position);
    } else if (strongestVertical.type === 'edge') {
      obj.set('left', strongestVertical.position - bounds.width);
    } else if (strongestVertical.type === 'center') {
      obj.set('left', strongestVertical.position - bounds.width / 2);
    }
    hasSnapped = true;
  }
  
  // Update canvas if any snapping occurred
  if (hasSnapped) {
    canvas.renderAll();
  }
}

/**
 * Draw alignment guides on the canvas
 */
export function renderAlignmentGuides(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  guides: AlignmentGuide[]
): void {
  if (!ctx) return;
  
  // Apply some global settings for all guides
  ctx.save();
  
  guides.forEach(guide => {
    // Set line style based on guide type
    ctx.strokeStyle = guide.type === 'center' ? '#0066ff' : 
                     guide.type === 'edge' ? '#00cc66' : '#cc00ff';
    ctx.lineWidth = 1;
    ctx.setLineDash(guide.type === 'distribution' ? [4, 4] : []);
    
    // Draw the guide line
    ctx.beginPath();
    
    if (guide.orientation === 'horizontal') {
      ctx.moveTo(0, guide.position);
      ctx.lineTo(canvasWidth, guide.position);
    } else {
      ctx.moveTo(guide.position, 0);
      ctx.lineTo(guide.position, canvasHeight);
    }
    
    ctx.stroke();
    
    // Draw emphasis at ends or decorations
    if (guide.type === 'center') {
      // Add arrow indicators for center lines
      const arrowSize = 4;
      
      if (guide.orientation === 'horizontal') {
        // Left arrow
        ctx.beginPath();
        ctx.moveTo(arrowSize, guide.position - arrowSize);
        ctx.lineTo(0, guide.position);
        ctx.lineTo(arrowSize, guide.position + arrowSize);
        ctx.stroke();
        
        // Right arrow
        ctx.beginPath();
        ctx.moveTo(canvasWidth - arrowSize, guide.position - arrowSize);
        ctx.lineTo(canvasWidth, guide.position);
        ctx.lineTo(canvasWidth - arrowSize, guide.position + arrowSize);
        ctx.stroke();
      } else {
        // Top arrow
        ctx.beginPath();
        ctx.moveTo(guide.position - arrowSize, arrowSize);
        ctx.lineTo(guide.position, 0);
        ctx.lineTo(guide.position + arrowSize, arrowSize);
        ctx.stroke();
        
        // Bottom arrow
        ctx.beginPath();
        ctx.moveTo(guide.position - arrowSize, canvasHeight - arrowSize);
        ctx.lineTo(guide.position, canvasHeight);
        ctx.lineTo(guide.position + arrowSize, canvasHeight - arrowSize);
        ctx.stroke();
      }
    }
  });
  
  ctx.restore(); // Restore original context settings
}

/**
 * Create placement guides for canvas
 */
export function createCanvasGuides(
  canvas: fabric.Canvas, 
  gridSize: number, 
  columns: number = 12,
  margin: number = 20
): AlignmentGuide[] {
  if (!canvas) return [];
  
  const guides: AlignmentGuide[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create horizontal guides (rows)
  for (let y = margin; y < height - margin; y += gridSize) {
    guides.push({
      position: y,
      orientation: 'horizontal',
      type: 'edge',
      strength: 0.5
    });
  }
  
  // Create vertical guides (columns)
  const columnWidth = (width - margin * 2) / columns;
  for (let i = 0; i <= columns; i++) {
    const x = margin + i * columnWidth;
    guides.push({
      position: x,
      orientation: 'vertical',
      type: 'edge',
      strength: 0.8 // Stronger for columns
    });
  }
  
  // Add center guides
  guides.push({
    position: width / 2,
    orientation: 'vertical',
    type: 'center',
    strength: 1 // Strongest for center
  });
  
  guides.push({
    position: height / 2,
    orientation: 'horizontal',
    type: 'center',
    strength: 1 // Strongest for center
  });
  
  return guides;
}

/**
 * Highlight object boundaries
 */
export function highlightObjectBoundary(
  obj: fabric.Object,
  canvas: fabric.Canvas,
  color: string = '#4285f4'
): void {
  if (!obj || !canvas) return;
  
  const bounds = getObjectBounds(obj);
  
  // Create or update highlight rectangle
  let highlight = canvas.getObjects().find(o => (o as any).isHighlight && (o as any).targetId === obj.id) as fabric.Rect | undefined;
  
  if (!highlight) {
    highlight = new fabric.Rect({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false
    });
    
    // Add custom properties
    (highlight as any).isHighlight = true;
    (highlight as any).targetId = obj.id;
    
    canvas.add(highlight);
  } else {
    highlight.set({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height
    });
  }
  
  canvas.renderAll();
}
