
import { fabric } from 'fabric';
import { AlignmentGuide } from './types';

export interface GuideVisualization {
  id: string;
  guide: AlignmentGuide;
  color: string;
  thickness: number;
  opacity: number;
}

export interface AlignmentGuideOptions {
  enabled: boolean;
  threshold: number;
  showEdgeGuides: boolean;
  showCenterGuides: boolean;
  showDistributionGuides: boolean;
  guideColor: string;
}

/**
 * Generate alignment guides based on objects on canvas
 */
export function generateAlignmentGuides(
  canvas: fabric.Canvas,
  activeObject: fabric.Object | null = null
): AlignmentGuide[] {
  if (!canvas || !activeObject) return [];
  
  const guides: AlignmentGuide[] = [];
  const objects = canvas.getObjects().filter(obj => 
    obj !== activeObject && 
    obj.visible !== false && 
    !obj.data?.type?.includes('grid') &&
    !obj.data?.type?.includes('guide')
  );
  
  if (objects.length === 0) return guides;
  
  // Get active object bounds
  const activeLeft = activeObject.left || 0;
  const activeRight = activeLeft + (activeObject.width || 0) * (activeObject.scaleX || 1);
  const activeTop = activeObject.top || 0;
  const activeBottom = activeTop + (activeObject.height || 0) * (activeObject.scaleY || 1);
  const activeCenterX = activeLeft + (activeRight - activeLeft) / 2;
  const activeCenterY = activeTop + (activeBottom - activeTop) / 2;
  
  // For each object, generate guides
  objects.forEach(obj => {
    // Calculate object bounds
    const objLeft = obj.left || 0;
    const objRight = objLeft + (obj.width || 0) * (obj.scaleX || 1);
    const objTop = obj.top || 0;
    const objBottom = objTop + (obj.height || 0) * (obj.scaleY || 1);
    const objCenterX = objLeft + (objRight - objLeft) / 2;
    const objCenterY = objTop + (objBottom - objTop) / 2;
    
    // Horizontal alignment guides (top, center, bottom)
    
    // Top edge alignment
    guides.push({
      position: objTop,
      orientation: 'horizontal',
      type: 'edge',
      strength: 10,
      label: 'Top'
    });
    
    // Bottom edge alignment
    guides.push({
      position: objBottom,
      orientation: 'horizontal',
      type: 'edge',
      strength: 10,
      label: 'Bottom'
    });
    
    // Horizontal center alignment
    guides.push({
      position: objCenterY,
      orientation: 'horizontal',
      type: 'center',
      strength: 8,
      label: 'Center Y'
    });
    
    // Vertical alignment guides (left, center, right)
    
    // Left edge alignment
    guides.push({
      position: objLeft,
      orientation: 'vertical',
      type: 'edge',
      strength: 10,
      label: 'Left'
    });
    
    // Right edge alignment
    guides.push({
      position: objRight,
      orientation: 'vertical',
      type: 'edge',
      strength: 10,
      label: 'Right'
    });
    
    // Vertical center alignment
    guides.push({
      position: objCenterX,
      orientation: 'vertical',
      type: 'center',
      strength: 8,
      label: 'Center X'
    });
  });
  
  return guides;
}

/**
 * Find matching guides for the active object within a threshold
 */
export function findMatchingGuides(
  activeObject: fabric.Object,
  guides: AlignmentGuide[],
  threshold: number = 8
): AlignmentGuide[] {
  if (!activeObject) return [];
  
  const matchingGuides: AlignmentGuide[] = [];
  
  // Calculate active object bounds
  const activeLeft = activeObject.left || 0;
  const activeRight = activeLeft + (activeObject.width || 0) * (activeObject.scaleX || 1);
  const activeTop = activeObject.top || 0;
  const activeBottom = activeTop + (activeObject.height || 0) * (activeObject.scaleY || 1);
  const activeCenterX = activeLeft + (activeRight - activeLeft) / 2;
  const activeCenterY = activeTop + (activeBottom - activeTop) / 2;
  
  // Check each guide for a match
  guides.forEach(guide => {
    const { position, orientation } = guide;
    
    if (orientation === 'horizontal') {
      // Check top edge
      if (Math.abs(activeTop - position) <= threshold) {
        matchingGuides.push(guide);
      }
      
      // Check bottom edge
      if (Math.abs(activeBottom - position) <= threshold) {
        matchingGuides.push(guide);
      }
      
      // Check horizontal center
      if (Math.abs(activeCenterY - position) <= threshold) {
        matchingGuides.push(guide);
      }
    } else if (orientation === 'vertical') {
      // Check left edge
      if (Math.abs(activeLeft - position) <= threshold) {
        matchingGuides.push(guide);
      }
      
      // Check right edge
      if (Math.abs(activeRight - position) <= threshold) {
        matchingGuides.push(guide);
      }
      
      // Check vertical center
      if (Math.abs(activeCenterX - position) <= threshold) {
        matchingGuides.push(guide);
      }
    }
  });
  
  return matchingGuides;
}

/**
 * Visualize guides on the canvas
 */
export function visualizeGuides(
  canvas: fabric.Canvas,
  guides: AlignmentGuide[],
  color: string = 'rgba(0, 120, 255, 0.75)'
): fabric.Line[] {
  if (!canvas) return [];
  
  const visualizations: fabric.Line[] = [];
  const canvasWidth = canvas.width || 1000;
  const canvasHeight = canvas.height || 800;
  
  guides.forEach((guide, index) => {
    const { position, orientation } = guide;
    
    let line: fabric.Line;
    
    if (orientation === 'horizontal') {
      // Create horizontal line
      line = new fabric.Line([0, position, canvasWidth, position], {
        stroke: color,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      });
    } else {
      // Create vertical line
      line = new fabric.Line([position, 0, position, canvasHeight], {
        stroke: color,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      });
    }
    
    // Add metadata
    line.set({
      data: {
        type: 'alignment-guide',
        guideIndex: index,
        guideType: guide.type,
        label: guide.label
      }
    });
    
    canvas.add(line);
    canvas.bringToFront(line);
    
    visualizations.push(line);
  });
  
  return visualizations;
}

/**
 * Remove guide visualizations from canvas
 */
export function removeGuideVisualizations(canvas: fabric.Canvas): void {
  if (!canvas) return;
  
  const guides = canvas.getObjects().filter(obj => 
    obj?.data?.type === 'alignment-guide'
  );
  
  guides.forEach(guide => canvas.remove(guide));
  canvas.renderAll();
}

/**
 * Snap object to guides
 */
export function snapObjectToGuides(
  activeObject: fabric.Object,
  guides: AlignmentGuide[],
  threshold: number = 8
): { didSnap: boolean, newLeft?: number, newTop?: number } {
  if (!activeObject) return { didSnap: false };
  
  const result = { didSnap: false, newLeft: undefined, newTop: undefined };
  
  // Calculate active object bounds
  const activeLeft = activeObject.left || 0;
  const activeRight = activeLeft + (activeObject.width || 0) * (activeObject.scaleX || 1);
  const activeTop = activeObject.top || 0;
  const activeBottom = activeTop + (activeObject.height || 0) * (activeObject.scaleY || 1);
  const activeCenterX = activeLeft + (activeRight - activeLeft) / 2;
  const activeCenterY = activeTop + (activeBottom - activeTop) / 2;
  
  // First check horizontal guides
  guides.filter(g => g.orientation === 'horizontal').forEach(guide => {
    const { position, type } = guide;
    
    if (Math.abs(activeTop - position) <= threshold) {
      // Snap top edge
      result.didSnap = true;
      result.newTop = position;
    } else if (Math.abs(activeBottom - position) <= threshold) {
      // Snap bottom edge
      result.didSnap = true;
      result.newTop = position - (activeBottom - activeTop);
    } else if (Math.abs(activeCenterY - position) <= threshold) {
      // Snap center
      result.didSnap = true;
      result.newTop = position - (activeBottom - activeTop) / 2;
    }
  });
  
  // Then check vertical guides
  guides.filter(g => g.orientation === 'vertical').forEach(guide => {
    const { position, type } = guide;
    
    if (Math.abs(activeLeft - position) <= threshold) {
      // Snap left edge
      result.didSnap = true;
      result.newLeft = position;
    } else if (Math.abs(activeRight - position) <= threshold) {
      // Snap right edge
      result.didSnap = true;
      result.newLeft = position - (activeRight - activeLeft);
    } else if (Math.abs(activeCenterX - position) <= threshold) {
      // Snap center
      result.didSnap = true;
      result.newLeft = position - (activeRight - activeLeft) / 2;
    }
  });
  
  return result;
}

/**
 * Guide Handler Class to manage alignment guides
 */
export class GuideHandler {
  private canvas: fabric.Canvas;
  private enabled: boolean;
  private threshold: number;
  private showEdgeGuides: boolean;
  private showCenterGuides: boolean;
  private showDistributionGuides: boolean;
  private guideColor: string;
  private activeGuides: fabric.Line[];
  private boundOnObjectMoving: (e: any) => void;
  private boundOnObjectModified: (e: any) => void;
  private boundOnObjectScaling: (e: any) => void;
  
  constructor(canvas: fabric.Canvas, options: Partial<AlignmentGuideOptions> = {}) {
    this.canvas = canvas;
    this.enabled = options.enabled ?? true;
    this.threshold = options.threshold ?? 10;
    this.showEdgeGuides = options.showEdgeGuides ?? true;
    this.showCenterGuides = options.showCenterGuides ?? true;
    this.showDistributionGuides = options.showDistributionGuides ?? false;
    this.guideColor = options.guideColor ?? 'rgba(0, 120, 255, 0.75)';
    this.activeGuides = [];
    
    // Bind event handlers
    this.boundOnObjectMoving = this.onObjectMoving.bind(this);
    this.boundOnObjectModified = this.onObjectModified.bind(this);
    this.boundOnObjectScaling = this.onObjectScaling.bind(this);
    
    this.initialize();
  }
  
  initialize(): void {
    if (this.enabled) {
      this.canvas.on('object:moving', this.boundOnObjectMoving);
      this.canvas.on('object:modified', this.boundOnObjectModified);
      this.canvas.on('object:scaling', this.boundOnObjectScaling);
    }
  }
  
  dispose(): void {
    this.canvas.off('object:moving', this.boundOnObjectMoving);
    this.canvas.off('object:modified', this.boundOnObjectModified);
    this.canvas.off('object:scaling', this.boundOnObjectScaling);
    this.removeGuides();
  }
  
  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    
    this.enabled = enabled;
    
    if (enabled) {
      this.canvas.on('object:moving', this.boundOnObjectMoving);
      this.canvas.on('object:modified', this.boundOnObjectModified);
      this.canvas.on('object:scaling', this.boundOnObjectScaling);
    } else {
      this.canvas.off('object:moving', this.boundOnObjectMoving);
      this.canvas.off('object:modified', this.boundOnObjectModified);
      this.canvas.off('object:scaling', this.boundOnObjectScaling);
      this.removeGuides();
    }
  }
  
  private onObjectMoving(e: any): void {
    if (!this.enabled || !e.target) return;
    
    this.removeGuides();
    
    const activeObject = e.target;
    const allGuides = this.generateAllGuides();
    const matchingGuides = findMatchingGuides(activeObject, allGuides, this.threshold);
    
    if (matchingGuides.length > 0) {
      this.activeGuides = visualizeGuides(this.canvas, matchingGuides, this.guideColor);
      
      // Snap the object
      const { didSnap, newLeft, newTop } = snapObjectToGuides(activeObject, matchingGuides, this.threshold);
      
      if (didSnap) {
        if (typeof newLeft !== 'undefined') {
          activeObject.set({ left: newLeft });
        }
        
        if (typeof newTop !== 'undefined') {
          activeObject.set({ top: newTop });
        }
      }
    }
  }
  
  private onObjectModified(e: any): void {
    this.removeGuides();
  }
  
  private onObjectScaling(e: any): void {
    this.removeGuides();
  }
  
  private generateAllGuides(): AlignmentGuide[] {
    return generateAlignmentGuides(this.canvas, this.canvas.getActiveObject());
  }
  
  private removeGuides(): void {
    removeGuideVisualizations(this.canvas);
    this.activeGuides = [];
  }
}

// Define alignment edge types
export type AlignmentEdge = 'top' | 'left' | 'right' | 'bottom' | 'center';

// Example function to handle snap comparisons with type safety
export function compareEdges(edge1: AlignmentEdge, edge2: AlignmentEdge): boolean {
  // For horizontal alignment
  if (edge1 === 'top' && edge2 === 'top') return true;
  if (edge1 === 'top' && edge2 === 'bottom') return false;
  if (edge1 === 'top' && edge2 === 'center') return false;
  
  // For vertical alignment
  if (edge1 === 'left' && edge2 === 'left') return true;
  if (edge1 === 'left' && edge2 === 'right') return false;
  if (edge1 === 'left' && edge2 === 'center') return false;
  
  return edge1 === edge2;
}
