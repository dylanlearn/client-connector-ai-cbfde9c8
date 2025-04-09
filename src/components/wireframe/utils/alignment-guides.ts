
import { fabric } from 'fabric';
import { AlignmentGuide, GuideVisualization } from '@/components/wireframe/utils/types';

// Default styles for guidelines
const DEFAULT_GUIDE_STYLES: GuideVisualization = {
  guide: {} as AlignmentGuide, // Placeholder, will be overridden
  color: {
    edge: '#2196F3',
    center: '#FF4081',
    distribution: '#4CAF50'
  },
  dashArray: [5, 5],
  width: 1,
  strokeWidth: 1,
  showLabels: true
};

/**
 * Find alignment guides for an object being moved or resized
 */
export function findAlignmentGuides(
  canvas: fabric.Canvas,
  activeObject: fabric.Object,
  threshold: number = 10
): AlignmentGuide[] {
  if (!canvas || !activeObject) return [];
  
  const guides: AlignmentGuide[] = [];
  const allObjects = canvas.getObjects().filter(obj => obj !== activeObject && !obj.data?.type?.includes('guide'));
  
  // Get bounds of active object
  const activeBounds = activeObject.getBoundingRect();
  const activeCenter = {
    x: activeBounds.left + activeBounds.width / 2,
    y: activeBounds.top + activeBounds.height / 2
  };
  
  // Horizontal guides (based on top, center, bottom)
  [
    { value: activeBounds.top, type: 'edge' as const, label: 'Top' },
    { value: activeCenter.y, type: 'center' as const, label: 'Vertical Center' },
    { value: activeBounds.top + activeBounds.height, type: 'edge' as const, label: 'Bottom' }
  ].forEach(({ value, type, label }) => {
    // Check against other objects
    allObjects.forEach(obj => {
      const objBounds = obj.getBoundingRect();
      const objCenter = {
        x: objBounds.left + objBounds.width / 2,
        y: objBounds.top + objBounds.height / 2
      };
      
      // Check edges and centers
      const positions = [
        { value: objBounds.top, type: 'edge' as const, label: 'Top' },
        { value: objCenter.y, type: 'center' as const, label: 'Vertical Center' },
        { value: objBounds.top + objBounds.height, type: 'edge' as const, label: 'Bottom' }
      ];
      
      positions.forEach(pos => {
        if (Math.abs(value - pos.value) < threshold) {
          guides.push({
            position: pos.value,
            orientation: 'horizontal',
            type,
            label: `${label} to ${obj.data?.label || obj.type}'s ${pos.label}`,
            strength: type === 'center' && pos.type === 'center' ? 3 : 2
          });
        }
      });
    });
    
    // Check against canvas edges for snapping
    if (Math.abs(value) < threshold) {
      guides.push({
        position: 0,
        orientation: 'horizontal',
        type: 'edge',
        label: `${label} to Canvas Top`,
        strength: 1
      });
    }
    
    const canvasHeight = canvas.getHeight() || 0;
    if (Math.abs(value - canvasHeight) < threshold) {
      guides.push({
        position: canvasHeight,
        orientation: 'horizontal',
        type: 'edge',
        label: `${label} to Canvas Bottom`,
        strength: 1
      });
    }
  });
  
  // Vertical guides (based on left, center, right)
  [
    { value: activeBounds.left, type: 'edge' as const, label: 'Left' },
    { value: activeCenter.x, type: 'center' as const, label: 'Horizontal Center' },
    { value: activeBounds.left + activeBounds.width, type: 'edge' as const, label: 'Right' }
  ].forEach(({ value, type, label }) => {
    // Check against other objects
    allObjects.forEach(obj => {
      const objBounds = obj.getBoundingRect();
      const objCenter = {
        x: objBounds.left + objBounds.width / 2,
        y: objBounds.top + objBounds.height / 2
      };
      
      // Check edges and centers
      const positions = [
        { value: objBounds.left, type: 'edge' as const, label: 'Left' },
        { value: objCenter.x, type: 'center' as const, label: 'Horizontal Center' },
        { value: objBounds.left + objBounds.width, type: 'edge' as const, label: 'Right' }
      ];
      
      positions.forEach(pos => {
        if (Math.abs(value - pos.value) < threshold) {
          guides.push({
            position: pos.value,
            orientation: 'vertical',
            type,
            label: `${label} to ${obj.data?.label || obj.type}'s ${pos.label}`,
            strength: type === 'center' && pos.type === 'center' ? 3 : 2
          });
        }
      });
    });
    
    // Check against canvas edges for snapping
    if (Math.abs(value) < threshold) {
      guides.push({
        position: 0,
        orientation: 'vertical',
        type: 'edge',
        label: `${label} to Canvas Left`,
        strength: 1
      });
    }
    
    const canvasWidth = canvas.getWidth() || 0;
    if (Math.abs(value - canvasWidth) < threshold) {
      guides.push({
        position: canvasWidth,
        orientation: 'vertical',
        type: 'edge',
        label: `${label} to Canvas Right`,
        strength: 1
      });
    }
  });
  
  // Distribution guides - equal spacing between objects
  // This would be a more advanced feature to implement
  
  // Sort guides by strength (higher strength = more important)
  return guides.sort((a, b) => (b.strength || 0) - (a.strength || 0));
}

/**
 * Apply snapping to an object based on guides
 */
export function applySnappingFromGuides(
  object: fabric.Object,
  guides: AlignmentGuide[],
  threshold: number = 10
): void {
  if (!object || !guides.length) return;
  
  const bounds = object.getBoundingRect();
  const center = {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2
  };
  
  // Find horizontal guides
  const horizontalGuides = guides.filter(g => g.orientation === 'horizontal');
  if (horizontalGuides.length) {
    const guide = horizontalGuides[0]; // Take the strongest guide
    const objectTop = object.top || 0;
    const objectHeight = object.getScaledHeight ? object.getScaledHeight() : (bounds.height || 0);
    
    let newTop = objectTop;
    if (guide.type === 'center') {
      // Snap center to guide
      newTop = guide.position - objectHeight / 2;
    } else {
      // Determine if we're snapping top or bottom edge
      const topDiff = Math.abs((objectTop) - guide.position);
      const bottomDiff = Math.abs((objectTop + objectHeight) - guide.position);
      
      if (topDiff < bottomDiff && topDiff < threshold) {
        newTop = guide.position;
      } else if (bottomDiff < threshold) {
        newTop = guide.position - objectHeight;
      }
    }
    
    object.set({ top: newTop });
  }
  
  // Find vertical guides
  const verticalGuides = guides.filter(g => g.orientation === 'vertical');
  if (verticalGuides.length) {
    const guide = verticalGuides[0]; // Take the strongest guide
    const objectLeft = object.left || 0;
    const objectWidth = object.getScaledWidth ? object.getScaledWidth() : (bounds.width || 0);
    
    let newLeft = objectLeft;
    if (guide.type === 'center') {
      // Snap center to guide
      newLeft = guide.position - objectWidth / 2;
    } else {
      // Determine if we're snapping left or right edge
      const leftDiff = Math.abs((objectLeft) - guide.position);
      const rightDiff = Math.abs((objectLeft + objectWidth) - guide.position);
      
      if (leftDiff < rightDiff && leftDiff < threshold) {
        newLeft = guide.position;
      } else if (rightDiff < threshold) {
        newLeft = guide.position - objectWidth;
      }
    }
    
    object.set({ left: newLeft });
  }
}

/**
 * Render alignment guides on canvas
 */
export function renderAlignmentGuides(
  canvas: fabric.Canvas,
  guides: AlignmentGuide[],
  guideStyles: GuideVisualization = DEFAULT_GUIDE_STYLES
): void {
  if (!canvas) return;
  
  // Remove any existing guides
  const existingGuides = canvas.getObjects().filter(obj => obj.data?.type === 'alignmentGuide');
  existingGuides.forEach(guide => canvas.remove(guide));
  
  if (!guides.length) {
    canvas.requestRenderAll();
    return;
  }
  
  // Create guides
  guides.forEach(guide => {
    // Determine guide color based on type
    let guideColor = typeof guideStyles.color === 'string' 
      ? guideStyles.color 
      : (guideStyles.color.edge || '#2196F3');
    
    if (typeof guideStyles.color !== 'string') {
      if (guide.type === 'center') guideColor = guideStyles.color.center;
      if (guide.type === 'distribution') guideColor = guideStyles.color.distribution;
    }
    
    // Create guide line
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    if (guide.orientation === 'horizontal') {
      const line = new fabric.Line([0, guide.position, canvasWidth || 1000, guide.position], {
        stroke: guideColor,
        strokeWidth: guideStyles.strokeWidth || 1,
        strokeDashArray: guideStyles.dashArray || [5, 5],
        selectable: false,
        evented: false,
        data: {
          type: 'alignmentGuide',
          guideData: guide
        }
      });
      canvas.add(line);
    } else {
      const line = new fabric.Line([guide.position, 0, guide.position, canvasHeight || 1000], {
        stroke: guideColor,
        strokeWidth: guideStyles.strokeWidth || 1,
        strokeDashArray: guideStyles.dashArray || [5, 5],
        selectable: false,
        evented: false,
        data: {
          type: 'alignmentGuide',
          guideData: guide
        }
      });
      canvas.add(line);
    }
    
    // Add label if enabled
    if (guideStyles.showLabels && guide.label) {
      const label = new fabric.Text(guide.label, {
        fontSize: 12,
        fontFamily: 'Arial',
        fill: guideColor,
        backgroundColor: 'rgba(255,255,255,0.7)',
        left: guide.orientation === 'vertical' ? guide.position + 5 : 5,
        top: guide.orientation === 'horizontal' ? guide.position - 20 : 5,
        selectable: false,
        evented: false,
        data: {
          type: 'alignmentGuide',
          guideData: guide
        }
      });
      canvas.add(label);
    }
  });
  
  // Render all changes
  canvas.requestRenderAll();
}
