
import { fabric } from 'fabric';

export interface GuideOptions {
  guideColor: string;
  snapDistance: number;
  showDistanceIndicators: boolean;
  showCenterGuides: boolean;
  showBoundingBox: boolean;
  showRotationGuides: boolean;
}

export const DEFAULT_GUIDE_OPTIONS = {
  guideColor: '#2563eb',
  snapDistance: 8,
  showDistanceIndicators: true,
  showCenterGuides: true,
  showBoundingBox: true,
  showRotationGuides: true
};

/**
 * Generates alignment guides for selected objects relative to other objects on the canvas
 */
export function generateAlignmentGuides(canvas: fabric.Canvas, target: fabric.Object, options: Partial<GuideOptions> = {}) {
  const guides: AlignmentGuide[] = [];
  const mergedOptions = { ...DEFAULT_GUIDE_OPTIONS, ...options };
  
  if (!canvas || !target) return guides;
  
  const allObjects = canvas.getObjects().filter(obj => obj !== target && obj.visible);
  const targetBounds = target.getBoundingRect();
  
  // Get center lines of target
  const targetCenterX = targetBounds.left + targetBounds.width / 2;
  const targetCenterY = targetBounds.top + targetBounds.height / 2;
  
  allObjects.forEach(obj => {
    const objBounds = obj.getBoundingRect();
    
    // Edge alignment guides
    // Left edge
    guides.push({
      orientation: 'vertical',
      position: objBounds.left,
      type: 'left-edge'
    });
    
    // Right edge
    guides.push({
      orientation: 'vertical',
      position: objBounds.left + objBounds.width,
      type: 'right-edge'
    });
    
    // Top edge
    guides.push({
      orientation: 'horizontal',
      position: objBounds.top,
      type: 'top-edge'
    });
    
    // Bottom edge
    guides.push({
      orientation: 'horizontal',
      position: objBounds.top + objBounds.height,
      type: 'bottom-edge'
    });
    
    // Center alignment guides
    if (mergedOptions.showCenterGuides) {
      // Vertical center
      guides.push({
        orientation: 'vertical',
        position: objBounds.left + objBounds.width / 2,
        type: 'center'
      });
      
      // Horizontal center
      guides.push({
        orientation: 'horizontal',
        position: objBounds.top + objBounds.height / 2,
        type: 'center'
      });
    }
  });
  
  return guides;
}

export interface AlignmentGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  type: string;
  label?: string;
}

/**
 * Find matching guides for an object's edges that are within the snap threshold
 */
export function findMatchingGuides(guides: AlignmentGuide[], target: fabric.Object, threshold: number): AlignmentGuide[] {
  if (!target) return [];
  
  const matchingGuides: AlignmentGuide[] = [];
  const bounds = target.getBoundingRect();
  
  // Target edges
  const targetEdges = {
    left: bounds.left,
    right: bounds.left + bounds.width,
    top: bounds.top,
    bottom: bounds.top + bounds.height,
    centerX: bounds.left + bounds.width / 2,
    centerY: bounds.top + bounds.height / 2
  };
  
  guides.forEach(guide => {
    // Check vertical guides
    if (guide.orientation === 'vertical') {
      // Left edge alignment
      if (Math.abs(targetEdges.left - guide.position) < threshold) {
        matchingGuides.push(guide);
      }
      // Right edge alignment
      else if (Math.abs(targetEdges.right - guide.position) < threshold) {
        matchingGuides.push(guide);
      }
      // Center alignment
      else if (Math.abs(targetEdges.centerX - guide.position) < threshold) {
        matchingGuides.push(guide);
      }
    }
    // Check horizontal guides
    else if (guide.orientation === 'horizontal') {
      // Top edge alignment
      if (Math.abs(targetEdges.top - guide.position) < threshold) {
        matchingGuides.push(guide);
      }
      // Bottom edge alignment
      else if (Math.abs(targetEdges.bottom - guide.position) < threshold) {
        matchingGuides.push(guide);
      }
      // Center alignment
      else if (Math.abs(targetEdges.centerY - guide.position) < threshold) {
        matchingGuides.push(guide);
      }
    }
  });
  
  return matchingGuides;
}

/**
 * Creates visual indicators for guides
 */
export function visualizeGuides(canvas: fabric.Canvas, guides: AlignmentGuide[], guideColor: string = '#2563eb'): fabric.Line[] {
  if (!canvas) return [];
  
  const canvasDimensions = {
    width: canvas.width || 1000,
    height: canvas.height || 1000
  };
  
  const visualGuides: fabric.Line[] = [];
  
  guides.forEach((guide, index) => {
    let guideElement: fabric.Line;
    
    // Create line based on orientation
    if (guide.orientation === 'horizontal') {
      guideElement = new fabric.Line([0, guide.position, canvasDimensions.width, guide.position], {
        stroke: guideColor,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        data: { type: 'guide', id: `guide-${index}` }
      });
    } else {
      guideElement = new fabric.Line([guide.position, 0, guide.position, canvasDimensions.height], {
        stroke: guideColor,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        data: { type: 'guide', id: `guide-${index}` }
      });
    }
    
    canvas.add(guideElement);
    visualGuides.push(guideElement);
  });
  
  canvas.renderAll();
  return visualGuides;
}

/**
 * Removes guide visualizations from the canvas
 */
export function removeGuideVisualizations(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  const guides = canvas.getObjects().filter(obj => obj.data?.type === 'guide');
  guides.forEach(guide => canvas.remove(guide));
  canvas.renderAll();
}

/**
 * Snaps an object to nearby guides
 */
export function snapObjectToGuides(target: fabric.Object, guides: AlignmentGuide[], threshold: number = 8): void {
  if (!target) return;
  
  const bounds = target.getBoundingRect();
  let snappedX = false;
  let snappedY = false;
  
  // Target edges
  const targetEdges = {
    left: bounds.left,
    right: bounds.left + bounds.width,
    top: bounds.top,
    bottom: bounds.top + bounds.height,
    centerX: bounds.left + bounds.width / 2,
    centerY: bounds.top + bounds.height / 2
  };
  
  guides.forEach(guide => {
    if (snappedX && guide.orientation === 'vertical') return;
    if (snappedY && guide.orientation === 'horizontal') return;
    
    // Check vertical guides
    if (guide.orientation === 'vertical') {
      // Snap left edge
      if (Math.abs(targetEdges.left - guide.position) < threshold) {
        target.set('left', guide.position);
        snappedX = true;
      }
      // Snap right edge
      else if (Math.abs(targetEdges.right - guide.position) < threshold) {
        target.set('left', guide.position - bounds.width);
        snappedX = true;
      }
      // Snap center
      else if (Math.abs(targetEdges.centerX - guide.position) < threshold) {
        target.set('left', guide.position - bounds.width / 2);
        snappedX = true;
      }
    }
    // Check horizontal guides
    else if (guide.orientation === 'horizontal') {
      // Snap top edge
      if (Math.abs(targetEdges.top - guide.position) < threshold) {
        target.set('top', guide.position);
        snappedY = true;
      }
      // Snap bottom edge
      else if (Math.abs(targetEdges.bottom - guide.position) < threshold) {
        target.set('top', guide.position - bounds.height);
        snappedY = true;
      }
      // Snap center
      else if (Math.abs(targetEdges.centerY - guide.position) < threshold) {
        target.set('top', guide.position - bounds.height / 2);
        snappedY = true;
      }
    }
  });
  
  if (snappedX || snappedY) {
    target.setCoords();
  }
}

/**
 * Class for managing guide creation and interaction
 */
export class GuideHandler {
  private canvas: fabric.Canvas;
  private activeGuides: fabric.Line[] = [];
  private options: GuideOptions;
  
  constructor(canvas: fabric.Canvas, options: Partial<GuideOptions> = {}) {
    this.canvas = canvas;
    this.options = { ...DEFAULT_GUIDE_OPTIONS, ...options };
    this.initializeEvents();
  }
  
  private initializeEvents(): void {
    this.canvas.on('object:moving', this.handleObjectMoving);
    this.canvas.on('object:modified', this.handleObjectModified);
    this.canvas.on('selection:cleared', this.clearGuides);
  }
  
  private handleObjectMoving = (e: fabric.IEvent): void => {
    const target = e.target;
    if (!target) return;
    
    this.clearGuides();
    
    const guides = generateAlignmentGuides(this.canvas, target, this.options);
    const matchingGuides = findMatchingGuides(guides, target, this.options.snapDistance);
    
    if (matchingGuides.length > 0) {
      this.activeGuides = visualizeGuides(this.canvas, matchingGuides, this.options.guideColor);
      snapObjectToGuides(target, matchingGuides, this.options.snapDistance);
    }
  };
  
  private handleObjectModified = (): void => {
    this.clearGuides();
  };
  
  private clearGuides = (): void => {
    this.activeGuides.forEach(guide => this.canvas.remove(guide));
    this.activeGuides = [];
    this.canvas.renderAll();
  };
  
  public setOptions(options: Partial<GuideOptions>): void {
    this.options = { ...this.options, ...options };
  }
  
  public destroy(): void {
    this.canvas.off('object:moving', this.handleObjectMoving);
    this.canvas.off('object:modified', this.handleObjectModified);
    this.canvas.off('selection:cleared', this.clearGuides);
    this.clearGuides();
  }
}

// Export a default object with all functions
export default {
  generateAlignmentGuides,
  findMatchingGuides,
  visualizeGuides,
  removeGuideVisualizations,
  snapObjectToGuides,
  GuideHandler,
  DEFAULT_GUIDE_OPTIONS
};
