import { fabric } from 'fabric';
import { AlignmentGuide } from '@/components/wireframe/utils/types';

/**
 * Finds potential alignment guides between an object and other objects on the canvas
 */
export function findAlignmentGuides(
  activeObject: fabric.Object, 
  otherObjects: fabric.Object[], 
  threshold: number = 10
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  if (!activeObject) return guides;
  
  const activeBounds = getObjectBounds(activeObject);
  
  // Collect all other objects' bounds
  const otherBounds = otherObjects.map(obj => getObjectBounds(obj));
  
  // Check for horizontal alignments
  otherBounds.forEach(bounds => {
    // Top edge alignment
    if (Math.abs(bounds.top - activeBounds.top) < threshold) {
      guides.push({
        position: bounds.top,
        orientation: 'horizontal',
        type: 'edge',
        label: `Top: ${Math.round(bounds.top)}px`,
        strength: 10
      });
    }
    
    // Center alignment
    if (Math.abs(bounds.centerY - activeBounds.centerY) < threshold) {
      guides.push({
        position: bounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        label: `Middle: ${Math.round(bounds.centerY)}px`,
        strength: 8
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(bounds.bottom - activeBounds.bottom) < threshold) {
      guides.push({
        position: bounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        label: `Bottom: ${Math.round(bounds.bottom)}px`,
        strength: 10
      });
    }
    
    // Vertical alignments
    // Left edge alignment
    if (Math.abs(bounds.left - activeBounds.left) < threshold) {
      guides.push({
        position: bounds.left,
        orientation: 'vertical',
        type: 'edge',
        label: `Left: ${Math.round(bounds.left)}px`,
        strength: 10
      });
    }
    
    // Center alignment
    if (Math.abs(bounds.centerX - activeBounds.centerX) < threshold) {
      guides.push({
        position: bounds.centerX,
        orientation: 'vertical',
        type: 'center',
        label: `Center: ${Math.round(bounds.centerX)}px`,
        strength: 8
      });
    }
    
    // Right edge alignment
    if (Math.abs(bounds.right - activeBounds.right) < threshold) {
      guides.push({
        position: bounds.right,
        orientation: 'vertical',
        type: 'edge',
        label: `Right: ${Math.round(bounds.right)}px`,
        strength: 10
      });
    }
  });
  
  // Add distance distribution guides
  // This is more complex and would require calculating equal distances between multiple objects
  // For simplicity, we'll skip this in this implementation
  
  return guides;
}

/**
 * Calculates and returns the bounds of an object
 */
export function getObjectBounds(object: fabric.Object) {
  const scaleX = object.scaleX || 1;
  const scaleY = object.scaleY || 1;
  const angle = object.angle || 0;
  const strokeWidth = object.strokeWidth || 0;
  let width = (object.width || 0) * scaleX;
  let height = (object.height || 0) * scaleY;
  const left = object.left || 0;
  const top = object.top || 0;
  
  // If the object is rotated, we need the bounding box
  if (angle !== 0) {
    // Get the bounding rect accounting for rotation
    const boundingRect = object.getBoundingRect();
    width = boundingRect.width;
    height = boundingRect.height;
  }
  
  return {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    width,
    height
  };
}

/**
 * Applies snapping to an object based on guides
 */
export function snapObjectToGuides(
  object: fabric.Object, 
  guides: AlignmentGuide[], 
  canvas: fabric.Canvas
) {
  if (!object || !guides.length) return;
  
  const bounds = getObjectBounds(object);
  
  // Find strongest horizontal guide
  const horizontalGuides = guides.filter(g => g.orientation === 'horizontal');
  if (horizontalGuides.length) {
    // Sort by strength (if available) or default to edge > center > distribution
    horizontalGuides.sort((a, b) => {
      if (a.strength !== undefined && b.strength !== undefined) {
        return b.strength - a.strength; // Higher strength first
      }
      
      // Default priority
      const typePriority: Record<string, number> = { 'edge': 3, 'center': 2, 'distribution': 1, 'grid': 2 };
      return typePriority[b.type] - typePriority[a.type];
    });
    
    const bestHGuide = horizontalGuides[0];
    
    if (bestHGuide.type === 'edge') {
      // Either top or bottom edge - figure out which one is closest
      if (Math.abs(bestHGuide.position - bounds.top) <= Math.abs(bestHGuide.position - bounds.bottom)) {
        object.set('top', bestHGuide.position);
      } else {
        object.set('top', bestHGuide.position - bounds.height);
      }
    } else if (bestHGuide.type === 'center') {
      object.set('top', bestHGuide.position - bounds.height / 2);
    } else if (bestHGuide.type === 'distribution' || bestHGuide.type === 'grid') {
      // Distribution snapping logic would go here
    }
  }
  
  // Find strongest vertical guide
  const verticalGuides = guides.filter(g => g.orientation === 'vertical');
  if (verticalGuides.length) {
    // Sort by strength (if available) or default to edge > center > distribution
    verticalGuides.sort((a, b) => {
      if (a.strength !== undefined && b.strength !== undefined) {
        return b.strength - a.strength; // Higher strength first
      }
      
      // Default priority
      const typePriority: Record<string, number> = { 'edge': 3, 'center': 2, 'distribution': 1, 'grid': 2 };
      return typePriority[b.type] - typePriority[a.type];
    });
    
    const bestVGuide = verticalGuides[0];
    
    if (bestVGuide.type === 'edge') {
      // Either left or right edge - figure out which one is closest
      if (Math.abs(bestVGuide.position - bounds.left) <= Math.abs(bestVGuide.position - bounds.right)) {
        object.set('left', bestVGuide.position);
      } else {
        object.set('left', bestVGuide.position - bounds.width);
      }
    } else if (bestVGuide.type === 'center') {
      object.set('left', bestVGuide.position - bounds.width / 2);
    } else if (bestVGuide.type === 'distribution' || bestVGuide.type === 'grid') {
      // Distribution snapping logic would go here
    }
  }
  
  // Let the canvas know we've modified an object
  canvas.renderAll();
}

/**
 * Renders alignment guides on the canvas context
 */
export function renderAlignmentGuides(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  guides: AlignmentGuide[],
  visualizationSettings: {
    color: { edge: string; center: string; distribution: string; };
    strokeWidth: number;
    dashArray?: number[];
    showLabels?: boolean;
  }
) {
  if (!ctx) return;
  
  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  guides.forEach(guide => {
    // Set line style based on guide type
    ctx.strokeStyle = guide.type === 'center' 
      ? visualizationSettings.color.center 
      : guide.type === 'distribution' 
        ? visualizationSettings.color.distribution 
        : visualizationSettings.color.edge;
    
    ctx.lineWidth = visualizationSettings.strokeWidth;
    
    if (visualizationSettings.dashArray && visualizationSettings.dashArray.length) {
      ctx.setLineDash(visualizationSettings.dashArray);
    }
    
    ctx.beginPath();
    
    if (guide.orientation === 'horizontal') {
      ctx.moveTo(0, guide.position);
      ctx.lineTo(canvasWidth, guide.position);
    } else {
      ctx.moveTo(guide.position, 0);
      ctx.lineTo(guide.position, canvasHeight);
    }
    
    ctx.stroke();
    
    // Draw label if enabled
    if (visualizationSettings.showLabels && guide.label) {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '10px Arial';
      ctx.fillText(
        guide.label,
        guide.orientation === 'vertical' ? guide.position + 5 : 5,
        guide.orientation === 'horizontal' ? guide.position + 15 : 15
      );
    }
  });
  
  ctx.restore();
}

/**
 * Highlights an object's boundary while dragging
 */
export function highlightObjectBoundary(
  object: fabric.Object, 
  canvas: fabric.Canvas
) {
  const bounds = getObjectBounds(object);
  
  // Create a temporary rectangle to highlight the bounds
  const highlight = new fabric.Rect({
    left: bounds.left - 1,
    top: bounds.top - 1,
    width: bounds.width + 2,
    height: bounds.height + 2,
    fill: 'transparent',
    stroke: '#2196F3',
    strokeWidth: 1,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false,
    isHighlight: true, // Custom property for easy identification
    opacity: 0.8
  });
  
  // Remove any existing highlights
  const existingHighlights = canvas.getObjects().filter(obj => (obj as any).isHighlight);
  existingHighlights.forEach(h => canvas.remove(h));
  
  // Add new highlight
  canvas.add(highlight);
  canvas.renderAll();
  
  // Remove after a short delay
  setTimeout(() => {
    canvas.remove(highlight);
    canvas.renderAll();
  }, 1000);
}
