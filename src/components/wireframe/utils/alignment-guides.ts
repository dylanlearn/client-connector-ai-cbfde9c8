
import { fabric } from 'fabric';
import { AlignmentGuide, GuideVisualization } from '@/components/wireframe/utils/types';

// Default styles for guidelines
const DEFAULT_GUIDE_STYLES: GuideVisualization = {
  color: {
    edge: '#2196F3',
    center: '#FF4081',
    distribution: '#4CAF50'
  },
  strokeWidth: 1,
  dashArray: [5, 5],
  showLabels: true
};

/**
 * Creates guide lines for alignment on a canvas
 */
export function createAlignmentGuides(
  canvas: fabric.Canvas,
  target: fabric.Object,
  allObjects: fabric.Object[],
  snapTolerance: number = 10,
  styles: Partial<GuideVisualization> = {}
): AlignmentGuide[] {
  // Merge styles with defaults
  const guideStyles = { ...DEFAULT_GUIDE_STYLES, ...styles };
  const guides: AlignmentGuide[] = [];
  
  // Skip if no target or no objects to align with
  if (!target || allObjects.length === 0) return guides;
  
  // Calculate target bounds
  const targetBounds = getObjectBounds(target);
  
  // Loop through all objects to find alignment opportunities
  allObjects.forEach(obj => {
    if (obj === target || !obj.visible) return;
    
    const objBounds = getObjectBounds(obj);
    
    // Left edge alignment
    if (Math.abs(targetBounds.left - objBounds.left) <= snapTolerance) {
      guides.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge',
        strength: 10,
        label: `Left: ${Math.round(objBounds.left)}`
      });
    }
    
    // Right edge alignment
    if (Math.abs(targetBounds.right - objBounds.right) <= snapTolerance) {
      guides.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge',
        strength: 10,
        label: `Right: ${Math.round(objBounds.right)}`
      });
    }
    
    // Horizontal center alignment
    if (Math.abs(targetBounds.centerX - objBounds.centerX) <= snapTolerance) {
      guides.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center',
        strength: 8,
        label: `Center X: ${Math.round(objBounds.centerX)}`
      });
    }
    
    // Top edge alignment
    if (Math.abs(targetBounds.top - objBounds.top) <= snapTolerance) {
      guides.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge',
        strength: 10,
        label: `Top: ${Math.round(objBounds.top)}`
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(targetBounds.bottom - objBounds.bottom) <= snapTolerance) {
      guides.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge',
        strength: 10,
        label: `Bottom: ${Math.round(objBounds.bottom)}`
      });
    }
    
    // Vertical center alignment
    if (Math.abs(targetBounds.centerY - objBounds.centerY) <= snapTolerance) {
      guides.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center',
        strength: 8,
        label: `Center Y: ${Math.round(objBounds.centerY)}`
      });
    }
  });
  
  return guides;
}

/**
 * Applies snap to the strongest alignment guide
 */
export function snapToStrongestGuide(
  target: fabric.Object,
  guides: AlignmentGuide[]
): fabric.Object {
  if (!target || guides.length === 0) return target;
  
  const targetBounds = getObjectBounds(target);
  
  // Find strongest vertical guide
  const verticalGuides = guides.filter(g => g.orientation === 'vertical');
  
  if (verticalGuides.length > 0) {
    verticalGuides.sort((a, b) => (b.strength || 0) - (a.strength || 0));
    const strongestVGuide = verticalGuides[0];
    
    // Apply vertical snap based on guide type
    if (strongestVGuide.type === 'edge') {
      if (Math.abs(targetBounds.left - strongestVGuide.position) < Math.abs(targetBounds.right - strongestVGuide.position)) {
        // Snap left edge
        target.set('left', strongestVGuide.position);
      } else {
        // Snap right edge
        target.set('left', strongestVGuide.position - targetBounds.width);
      }
    } else if (strongestVGuide.type === 'center') {
      // Snap to center
      target.set('left', strongestVGuide.position - targetBounds.width / 2);
    }
  }
  
  // Find strongest horizontal guide
  const horizontalGuides = guides.filter(g => g.orientation === 'horizontal');
  
  if (horizontalGuides.length > 0) {
    horizontalGuides.sort((a, b) => (b.strength || 0) - (a.strength || 0));
    const strongestHGuide = horizontalGuides[0];
    
    // Apply horizontal snap based on guide type
    if (strongestHGuide.type === 'edge') {
      if (Math.abs(targetBounds.top - strongestHGuide.position) < Math.abs(targetBounds.bottom - strongestHGuide.position)) {
        // Snap top edge
        target.set('top', strongestHGuide.position);
      } else {
        // Snap bottom edge
        target.set('top', strongestHGuide.position - targetBounds.height);
      }
    } else if (strongestHGuide.type === 'center') {
      // Snap to center
      target.set('top', strongestHGuide.position - targetBounds.height / 2);
    }
  }
  
  return target;
}

/**
 * Creates grid alignment guides based on grid size
 */
export function createGridGuides(
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  // Create vertical grid guides
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    guides.push({
      position: x,
      orientation: 'vertical',
      type: 'grid'
    });
  }
  
  // Create horizontal grid guides
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    guides.push({
      position: y,
      orientation: 'horizontal',
      type: 'grid'
    });
  }
  
  return guides;
}

/**
 * Creates distribution guides for even spacing between objects
 */
export function createDistributionGuides(
  canvas: fabric.Canvas,
  target: fabric.Object,
  tolerance: number = 10
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  if (!canvas || !target) return guides;
  
  const allObjects = canvas.getObjects().filter(obj => 
    obj !== target && !obj.data?.temporary && obj.visible
  );
  
  if (allObjects.length < 2) return guides;
  
  // Sort objects by position for horizontal distribution
  const horizontalObjects = [...allObjects].sort((a, b) => 
    (a.left || 0) - (b.left || 0)
  );
  
  // Check for equal horizontal spacing
  if (horizontalObjects.length >= 3) {
    for (let i = 1; i < horizontalObjects.length - 1; i++) {
      const prev = horizontalObjects[i - 1];
      const curr = horizontalObjects[i];
      const next = horizontalObjects[i + 1];
      
      const distLeft = (curr.left || 0) - (prev.left || 0);
      const distRight = (next.left || 0) - (curr.left || 0);
      
      if (Math.abs(distLeft - distRight) <= tolerance) {
        guides.push({
          position: curr.left || 0,
          orientation: 'vertical',
          type: 'distribution',
          strength: 5,
          label: `Equal spacing: ${Math.round(distLeft)}`
        });
      }
    }
  }
  
  // Sort objects by position for vertical distribution
  const verticalObjects = [...allObjects].sort((a, b) => 
    (a.top || 0) - (b.top || 0)
  );
  
  // Check for equal vertical spacing
  if (verticalObjects.length >= 3) {
    for (let i = 1; i < verticalObjects.length - 1; i++) {
      const prev = verticalObjects[i - 1];
      const curr = verticalObjects[i];
      const next = verticalObjects[i + 1];
      
      const distTop = (curr.top || 0) - (prev.top || 0);
      const distBottom = (next.top || 0) - (curr.top || 0);
      
      if (Math.abs(distTop - distBottom) <= tolerance) {
        guides.push({
          position: curr.top || 0,
          orientation: 'horizontal',
          type: 'distribution',
          strength: 5,
          label: `Equal spacing: ${Math.round(distTop)}`
        });
      }
    }
  }
  
  return guides;
}

/**
 * Renders alignment guides on the canvas
 */
export function renderAlignmentGuides(
  canvas: fabric.Canvas,
  guides: AlignmentGuide[],
  styles: Partial<GuideVisualization> = {}
): fabric.Object[] {
  const guideObjects: fabric.Object[] = [];
  if (!canvas || guides.length === 0) return guideObjects;
  
  // Merge styles with defaults
  const guideStyles = { ...DEFAULT_GUIDE_STYLES, ...styles };
  
  // Create guides
  guides.forEach(guide => {
    // Determine guide color based on type
    let guideColor = guideStyles.color.edge;
    if (guide.type === 'center') guideColor = guideStyles.color.center;
    if (guide.type === 'distribution') guideColor = guideStyles.color.distribution;
    
    // Create guide line
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    let line: fabric.Line;
    
    if (guide.orientation === 'horizontal') {
      line = new fabric.Line([0, guide.position, canvasWidth, guide.position], {
        stroke: guideColor,
        strokeWidth: guideStyles.strokeWidth,
        strokeDashArray: guideStyles.dashArray,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { temporary: true, type: 'guide' }
      });
    } else {
      line = new fabric.Line([guide.position, 0, guide.position, canvasHeight], {
        stroke: guideColor,
        strokeWidth: guideStyles.strokeWidth,
        strokeDashArray: guideStyles.dashArray,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { temporary: true, type: 'guide' }
      });
    }
    
    canvas.add(line);
    guideObjects.push(line);
    
    // Add label if enabled
    if (guideStyles.showLabels && guide.label) {
      const labelX = guide.orientation === 'vertical' ? guide.position + 5 : 10;
      const labelY = guide.orientation === 'horizontal' ? guide.position - 20 : 10;
      
      const text = new fabric.Text(guide.label, {
        left: labelX,
        top: labelY,
        fontSize: 10,
        fontFamily: 'Arial',
        fill: guideColor,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 2,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { temporary: true, type: 'guide' }
      });
      
      canvas.add(text);
      guideObjects.push(text);
    }
  });
  
  canvas.renderAll();
  return guideObjects;
}

/**
 * Gets bounds of an object accounting for transforms
 */
export function getObjectBounds(obj: fabric.Object) {
  const left = obj.left || 0;
  const top = obj.top || 0;
  const width = (obj.width || 0) * (obj.scaleX || 1);
  const height = (obj.height || 0) * (obj.scaleY || 1);
  
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

/**
 * Cleans up temporary guide objects from canvas
 */
export function clearGuideObjects(canvas: fabric.Canvas) {
  if (!canvas) return;
  
  const guideObjects = canvas.getObjects().filter(obj => 
    (obj.data?.temporary === true && obj.data?.type === 'guide')
  );
  
  guideObjects.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
}
