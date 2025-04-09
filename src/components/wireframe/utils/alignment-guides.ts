
import { fabric } from 'fabric';
import { AlignmentGuide, GuideVisualization } from './types';

/**
 * Finds alignment guides for the target object relative to other objects
 */
export function findAlignmentGuides(
  targetObject: fabric.Object,
  allObjects: fabric.Object[],
  threshold: number = 10
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  if (!targetObject) return guides;
  
  const targetBounds = getObjectBounds(targetObject);
  
  allObjects.forEach(obj => {
    if (obj === targetObject || !obj.visible) return;
    
    const objBounds = getObjectBounds(obj);
    
    // Check horizontal alignments
    
    // Left edge alignment
    if (Math.abs(targetBounds.left - objBounds.left) < threshold) {
      guides.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge',
        label: 'Left'
      });
    }
    
    // Right edge alignment
    if (Math.abs(targetBounds.right - objBounds.right) < threshold) {
      guides.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge',
        label: 'Right'
      });
    }
    
    // Center alignment
    if (Math.abs(targetBounds.centerX - objBounds.centerX) < threshold) {
      guides.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center',
        label: 'Center'
      });
    }
    
    // Check vertical alignments
    
    // Top edge alignment
    if (Math.abs(targetBounds.top - objBounds.top) < threshold) {
      guides.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge',
        label: 'Top'
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(targetBounds.bottom - objBounds.bottom) < threshold) {
      guides.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        label: 'Bottom'
      });
    }
    
    // Middle alignment
    if (Math.abs(targetBounds.centerY - objBounds.centerY) < threshold) {
      guides.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        label: 'Middle'
      });
    }
  });
  
  return guides;
}

/**
 * Helper to get an object's bounds including all transformations
 */
export function getObjectBounds(obj: fabric.Object) {
  const bounds = obj.getBoundingRect();
  
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.left + bounds.width,
    bottom: bounds.top + bounds.height,
    centerX: bounds.left + bounds.width / 2,
    centerY: bounds.top + bounds.height / 2,
    width: bounds.width,
    height: bounds.height
  };
}

/**
 * Snap an object to alignment guides
 */
export function snapObjectToGuides(
  obj: fabric.Object,
  guides: AlignmentGuide[],
  canvas: fabric.Canvas
) {
  if (!obj || !guides.length) return;
  
  const bounds = getObjectBounds(obj);
  
  guides.forEach(guide => {
    if (guide.orientation === 'vertical') {
      // Vertical guide (affecting x-position)
      if (guide.type === 'edge') {
        // Snap left or right edge
        if (Math.abs(guide.position - bounds.left) < 10) {
          obj.set({ left: guide.position });
        } else if (Math.abs(guide.position - bounds.right) < 10) {
          obj.set({ left: guide.position - bounds.width });
        }
      } else if (guide.type === 'center') {
        // Snap center
        obj.set({ left: guide.position - bounds.width / 2 });
      }
    } else {
      // Horizontal guide (affecting y-position)
      if (guide.type === 'edge') {
        // Snap top or bottom edge
        if (Math.abs(guide.position - bounds.top) < 10) {
          obj.set({ top: guide.position });
        } else if (Math.abs(guide.position - bounds.bottom) < 10) {
          obj.set({ top: guide.position - bounds.height });
        }
      } else if (guide.type === 'center') {
        // Snap middle
        obj.set({ top: guide.position - bounds.height / 2 });
      }
    }
  });
  
  canvas.renderAll();
}

/**
 * Render alignment guides on canvas
 */
export function renderAlignmentGuides(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  guides: AlignmentGuide[],
  visualization: GuideVisualization
) {
  if (!ctx || !guides.length) return;
  
  // Save current context state
  ctx.save();
  
  guides.forEach(guide => {
    // Set style based on guide type
    ctx.strokeStyle = 
      guide.type === 'center' ? visualization.color.center :
      guide.type === 'distribution' ? visualization.color.distribution :
      visualization.color.edge;
    
    ctx.lineWidth = visualization.strokeWidth;
    
    // Set dash pattern
    if (visualization.dashArray.length) {
      ctx.setLineDash(visualization.dashArray);
    } else {
      ctx.setLineDash([]);
    }
    
    // Begin path
    ctx.beginPath();
    
    // Draw guide line
    if (guide.orientation === 'vertical') {
      ctx.moveTo(guide.position, 0);
      ctx.lineTo(guide.position, canvasHeight);
    } else {
      ctx.moveTo(0, guide.position);
      ctx.lineTo(canvasWidth, guide.position);
    }
    
    // Stroke the line
    ctx.stroke();
    
    // Add label if enabled
    if (visualization.showLabels && guide.label) {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      
      if (guide.orientation === 'vertical') {
        ctx.fillText(guide.label, guide.position + 5, 20);
      } else {
        ctx.fillText(guide.label, 5, guide.position - 5);
      }
    }
  });
  
  // Restore context state
  ctx.restore();
}

/**
 * Highlight an object's boundary
 */
export function highlightObjectBoundary(
  obj: fabric.Object,
  canvas: fabric.Canvas
) {
  if (!obj || !canvas) return;
  
  const bounds = obj.getBoundingRect();
  
  // Create highlight rectangle
  const highlight = new fabric.Rect({
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    fill: 'transparent',
    stroke: '#2196F3',
    strokeWidth: 1,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false
  });
  
  // Add custom property to identify this as a highlight
  (highlight as any).isHighlight = true;
  
  // Add to canvas
  canvas.add(highlight);
  canvas.renderAll();
  
  // Remove after a delay
  setTimeout(() => {
    canvas.remove(highlight);
    canvas.renderAll();
  }, 1000);
}
