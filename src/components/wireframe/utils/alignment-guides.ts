
import { fabric } from 'fabric';
import { AlignmentGuide, GuideVisualization } from './types';

// Get object bounds for alignment
export function getObjectBounds(obj: fabric.Object) {
  const width = obj.getScaledWidth();
  const height = obj.getScaledHeight();
  const left = obj.left || 0;
  const top = obj.top || 0;
  
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    width,
    height
  };
}

// Find alignment guides for an object against other objects
export function findAlignmentGuides(
  activeObject: fabric.Object,
  otherObjects: fabric.Object[],
  snapThreshold = 10
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  const activeBounds = getObjectBounds(activeObject);
  
  // Edge positions of the active object
  const activeEdges = {
    left: activeBounds.left,
    right: activeBounds.right,
    top: activeBounds.top,
    bottom: activeBounds.bottom,
    centerX: activeBounds.centerX,
    centerY: activeBounds.centerY
  };
  
  otherObjects.forEach(obj => {
    const targetBounds = getObjectBounds(obj);
    
    // Check horizontal alignments (left, center, right)
    if (Math.abs(activeEdges.left - targetBounds.left) < snapThreshold) {
      guides.push({
        position: targetBounds.left,
        orientation: 'vertical',
        type: 'edge',
        strength: 10
      });
    }
    
    if (Math.abs(activeEdges.right - targetBounds.right) < snapThreshold) {
      guides.push({
        position: targetBounds.right,
        orientation: 'vertical',
        type: 'edge',
        strength: 10
      });
    }
    
    if (Math.abs(activeEdges.centerX - targetBounds.centerX) < snapThreshold) {
      guides.push({
        position: targetBounds.centerX,
        orientation: 'vertical',
        type: 'center',
        strength: 8
      });
    }
    
    // Check vertical alignments (top, middle, bottom)
    if (Math.abs(activeEdges.top - targetBounds.top) < snapThreshold) {
      guides.push({
        position: targetBounds.top,
        orientation: 'horizontal',
        type: 'edge',
        strength: 10
      });
    }
    
    if (Math.abs(activeEdges.bottom - targetBounds.bottom) < snapThreshold) {
      guides.push({
        position: targetBounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        strength: 10
      });
    }
    
    if (Math.abs(activeEdges.centerY - targetBounds.centerY) < snapThreshold) {
      guides.push({
        position: targetBounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        strength: 8
      });
    }
    
    // Check equal spacing (distribution)
    // This would be a more complex implementation requiring knowledge of multiple objects
    // Simplified version here
  });
  
  // Sort guides by strength for better snapping priority
  return guides.sort((a, b) => (b.strength || 0) - (a.strength || 0));
}

// Snap object to guides
export function snapObjectToGuides(
  obj: fabric.Object,
  guides: AlignmentGuide[],
  canvas: fabric.Canvas
): void {
  if (!guides.length) return;
  
  const bounds = getObjectBounds(obj);
  
  // Find the strongest guide in each orientation
  const horizontalGuide = guides.find(g => g.orientation === 'horizontal');
  const verticalGuide = guides.find(g => g.orientation === 'vertical');
  
  // Apply horizontal snapping if available
  if (horizontalGuide) {
    const targetY = horizontalGuide.position;
    let offsetY = 0;
    
    // Determine which part of the object to align
    switch (horizontalGuide.type) {
      case 'edge':
        // Snap top edge
        offsetY = targetY - bounds.top;
        break;
      case 'center':
        // Snap center
        offsetY = targetY - bounds.centerY;
        break;
      case 'distribution':
        // Distribution snapping would be more complex
        break;
    }
    
    // Apply offset
    obj.set({ top: obj.top! + offsetY });
  }
  
  // Apply vertical snapping if available
  if (verticalGuide) {
    const targetX = verticalGuide.position;
    let offsetX = 0;
    
    // Determine which part of the object to align
    switch (verticalGuide.type) {
      case 'edge':
        // Snap left edge
        offsetX = targetX - bounds.left;
        break;
      case 'center':
        // Snap center
        offsetX = targetX - bounds.centerX;
        break;
      case 'distribution':
        // Distribution snapping would be more complex
        break;
    }
    
    // Apply offset
    obj.set({ left: obj.left! + offsetX });
  }
  
  // Update canvas
  canvas.renderAll();
}

// Render alignment guides on canvas
export function renderAlignmentGuides(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  guides: AlignmentGuide[],
  visualization: GuideVisualization
): void {
  // Save context state
  ctx.save();
  
  // Set up line style
  ctx.lineWidth = visualization.strokeWidth;
  ctx.setLineDash(visualization.dashArray);
  
  // Draw each guide
  guides.forEach(guide => {
    // Set color based on guide type
    let color = visualization.color.edge;
    if (guide.type === 'center') {
      color = visualization.color.center;
    } else if (guide.type === 'distribution') {
      color = visualization.color.distribution;
    }
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    
    if (guide.orientation === 'horizontal') {
      // Draw horizontal guide
      ctx.moveTo(0, guide.position);
      ctx.lineTo(canvasWidth, guide.position);
    } else {
      // Draw vertical guide
      ctx.moveTo(guide.position, 0);
      ctx.lineTo(guide.position, canvasHeight);
    }
    
    ctx.stroke();
    
    // Draw labels if enabled
    if (visualization.showLabels && guide.label) {
      ctx.fillStyle = color;
      ctx.font = '10px Arial';
      
      if (guide.orientation === 'horizontal') {
        ctx.fillText(guide.label, 5, guide.position - 5);
      } else {
        ctx.fillText(guide.label, guide.position + 5, 15);
      }
    }
  });
  
  // Restore context state
  ctx.restore();
}

// Highlight object boundary for better visibility
export function highlightObjectBoundary(
  obj: fabric.Object,
  canvas: fabric.Canvas
): void {
  // Remove existing highlights
  const existingHighlights = canvas.getObjects().filter((o: any) => o.isHighlight);
  existingHighlights.forEach(h => canvas.remove(h));
  
  const bounds = getObjectBounds(obj);
  
  // Create highlight rectangle
  const highlight = new fabric.Rect({
    left: bounds.left - 1,
    top: bounds.top - 1,
    width: bounds.width + 2,
    height: bounds.height + 2,
    fill: 'transparent',
    stroke: '#2196F3',
    strokeWidth: 1,
    strokeDashArray: [3, 3],
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false
  });
  
  // Mark as highlight for easy identification
  (highlight as any).isHighlight = true;
  
  // Add to canvas
  canvas.add(highlight);
  canvas.renderAll();
}
