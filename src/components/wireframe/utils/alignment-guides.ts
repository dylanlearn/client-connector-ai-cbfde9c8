
import { fabric } from 'fabric';
import { AlignmentGuide, GuideVisualization } from './types';

/**
 * Generates alignment guides for objects on the canvas
 */
export function generateAlignmentGuides(
  canvas: fabric.Canvas,
  activeObject: fabric.Object | null,
  showEdgeGuides: boolean = true,
  showCenterGuides: boolean = true,
  showDistributionGuides: boolean = false
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  
  if (!activeObject || !canvas) return guides;
  
  // Get all objects except the active one and grid/guides
  const otherObjects = canvas.getObjects().filter(obj => {
    // Skip the active object itself
    if (obj === activeObject) return false;
    
    // Skip grid lines and guides
    if (obj.data?.type === 'grid' || obj.data?.type === 'alignmentGuide') return false;
    
    // Include only visible objects
    return obj.visible !== false;
  });
  
  // Get active object bounds
  const activeLeft = activeObject.left || 0;
  const activeTop = activeObject.top || 0;
  const activeWidth = (activeObject.width || 0) * (activeObject.scaleX || 1);
  const activeHeight = (activeObject.height || 0) * (activeObject.scaleY || 1);
  const activeRight = activeLeft + activeWidth;
  const activeBottom = activeTop + activeHeight;
  const activeCenterX = activeLeft + activeWidth / 2;
  const activeCenterY = activeTop + activeHeight / 2;
  
  // Create guides for edges alignment
  if (showEdgeGuides) {
    otherObjects.forEach(obj => {
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);
      const objRight = objLeft + objWidth;
      const objBottom = objTop + objHeight;
      
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
    });
  }
  
  // Create guides for center alignment
  if (showCenterGuides) {
    otherObjects.forEach(obj => {
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);
      const objCenterX = objLeft + objWidth / 2;
      const objCenterY = objTop + objHeight / 2;
      
      // Horizontal center alignment
      guides.push({
        position: objCenterY,
        orientation: 'horizontal',
        type: 'center',
        strength: 15,
        label: 'HCenter'
      });
      
      // Vertical center alignment
      guides.push({
        position: objCenterX,
        orientation: 'vertical',
        type: 'center',
        strength: 15,
        label: 'VCenter'
      });
    });
  }
  
  // Create guides for canvas center and edges
  const canvasWidth = canvas.width || 0;
  const canvasHeight = canvas.height || 0;
  
  guides.push({
    position: canvasWidth / 2,
    orientation: 'vertical',
    type: 'center',
    strength: 20,
    label: 'Canvas Center'
  });
  
  guides.push({
    position: canvasHeight / 2,
    orientation: 'horizontal',
    type: 'center',
    strength: 20,
    label: 'Canvas Center'
  });
  
  guides.push({
    position: 0,
    orientation: 'vertical',
    type: 'edge',
    strength: 20,
    label: 'Canvas Left'
  });
  
  guides.push({
    position: canvasWidth,
    orientation: 'vertical',
    type: 'edge',
    strength: 20,
    label: 'Canvas Right'
  });
  
  guides.push({
    position: 0,
    orientation: 'horizontal',
    type: 'edge',
    strength: 20,
    label: 'Canvas Top'
  });
  
  guides.push({
    position: canvasHeight,
    orientation: 'horizontal',
    type: 'edge',
    strength: 20,
    label: 'Canvas Bottom'
  });
  
  // Distribution guides (evenly space objects)
  if (showDistributionGuides && otherObjects.length >= 2) {
    // Get sorted positions for horizontal distribution
    const sortedHorizontal = [...otherObjects]
      .sort((a, b) => (a.top || 0) - (b.top || 0));
      
    // Create guides between each adjacent pair
    for (let i = 0; i < sortedHorizontal.length - 1; i++) {
      const obj1 = sortedHorizontal[i];
      const obj2 = sortedHorizontal[i + 1];
      
      const obj1Bottom = (obj1.top || 0) + (obj1.height || 0) * (obj1.scaleY || 1);
      const obj2Top = obj2.top || 0;
      const midPoint = obj1Bottom + (obj2Top - obj1Bottom) / 2;
      
      guides.push({
        position: midPoint,
        orientation: 'horizontal',
        type: 'distribution',
        strength: 8,
        label: 'Distribute'
      });
    }
    
    // Get sorted positions for vertical distribution
    const sortedVertical = [...otherObjects]
      .sort((a, b) => (a.left || 0) - (b.left || 0));
      
    // Create guides between each adjacent pair
    for (let i = 0; i < sortedVertical.length - 1; i++) {
      const obj1 = sortedVertical[i];
      const obj2 = sortedVertical[i + 1];
      
      const obj1Right = (obj1.left || 0) + (obj1.width || 0) * (obj1.scaleX || 1);
      const obj2Left = obj2.left || 0;
      const midPoint = obj1Right + (obj2Left - obj1Right) / 2;
      
      guides.push({
        position: midPoint,
        orientation: 'vertical',
        type: 'distribution',
        strength: 8,
        label: 'Distribute'
      });
    }
  }
  
  return guides;
}

/**
 * Find matching guides within threshold distance
 */
export function findMatchingGuides(
  activeObject: fabric.Object,
  guides: AlignmentGuide[],
  threshold: number = 8
): AlignmentGuide[] {
  if (!activeObject) return [];
  
  // Get active object bounds
  const activeLeft = activeObject.left || 0;
  const activeTop = activeObject.top || 0;
  const activeWidth = (activeObject.width || 0) * (activeObject.scaleX || 1);
  const activeHeight = (activeObject.height || 0) * (activeObject.scaleY || 1);
  const activeRight = activeLeft + activeWidth;
  const activeBottom = activeTop + activeHeight;
  const activeCenterX = activeLeft + activeWidth / 2;
  const activeCenterY = activeTop + activeHeight / 2;
  
  const matchingGuides: AlignmentGuide[] = [];
  
  // Check each guide
  guides.forEach(guide => {
    let distance = Infinity;
    
    // Calculate distance based on guide orientation
    if (guide.orientation === 'vertical') {
      // Compare with left, center, and right edges
      const distanceLeft = Math.abs(activeLeft - guide.position);
      const distanceCenter = Math.abs(activeCenterX - guide.position);
      const distanceRight = Math.abs(activeRight - guide.position);
      
      distance = Math.min(distanceLeft, distanceCenter, distanceRight);
    } else {
      // Compare with top, center, and bottom edges
      const distanceTop = Math.abs(activeTop - guide.position);
      const distanceCenter = Math.abs(activeCenterY - guide.position);
      const distanceBottom = Math.abs(activeBottom - guide.position);
      
      distance = Math.min(distanceTop, distanceCenter, distanceBottom);
    }
    
    // Add guide if within threshold
    if (distance <= threshold) {
      matchingGuides.push(guide);
    }
  });
  
  return matchingGuides;
}

/**
 * Visualize alignment guides on canvas
 */
export function visualizeGuides(
  canvas: fabric.Canvas,
  guides: AlignmentGuide[],
  color: string = 'rgba(0, 120, 255, 0.75)',
  strokeWidth: number = 1
): void {
  // First remove any existing guides
  removeGuideVisualizations(canvas);
  
  // Create guide visualizations
  guides.forEach(guide => {
    let line: fabric.Line;
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    
    if (guide.orientation === 'vertical') {
      line = new fabric.Line(
        [guide.position, 0, guide.position, canvasHeight],
        {
          stroke: color,
          strokeWidth,
          strokeDashArray: guide.type === 'distribution' ? [5, 5] : undefined,
          selectable: false,
          evented: false,
          data: { 
            type: 'alignmentGuide',
            guideType: guide.type,
            orientation: guide.orientation
          }
        }
      );
    } else {
      line = new fabric.Line(
        [0, guide.position, canvasWidth, guide.position],
        {
          stroke: color,
          strokeWidth,
          strokeDashArray: guide.type === 'distribution' ? [5, 5] : undefined,
          selectable: false,
          evented: false,
          data: { 
            type: 'alignmentGuide',
            guideType: guide.type,
            orientation: guide.orientation
          }
        }
      );
    }
    
    canvas.add(line);
    line.bringToFront();
    
    // Add label if provided
    if (guide.label) {
      const text = new fabric.Text(guide.label, {
        left: guide.orientation === 'vertical' ? guide.position + 5 : 5,
        top: guide.orientation === 'horizontal' ? guide.position + 5 : 5,
        fontSize: 10,
        fontFamily: 'Arial',
        fill: color,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        selectable: false,
        evented: false,
        data: { 
          type: 'alignmentGuideLabel',
          guideType: guide.type,
          orientation: guide.orientation
        }
      });
      
      canvas.add(text);
      text.bringToFront();
    }
  });
}

/**
 * Remove guide visualizations from canvas
 */
export function removeGuideVisualizations(canvas: fabric.Canvas): void {
  // Get all alignment guides and labels
  const guideElements = canvas.getObjects().filter(obj =>
    obj.data && typeof obj.data === 'object' && 
    (obj.data.type === 'alignmentGuide' || obj.data.type === 'alignmentGuideLabel')
  );
  
  // Remove each guide element
  guideElements.forEach(element => {
    canvas.remove(element);
  });
}

/**
 * Snap object to matching guides
 */
export function snapObjectToGuides(
  activeObject: fabric.Object,
  guides: AlignmentGuide[],
  threshold: number = 8
): { snapped: boolean, snappedX: boolean, snappedY: boolean } {
  if (!activeObject) return { snapped: false, snappedX: false, snappedY: false };
  
  let snappedX = false;
  let snappedY = false;
  
  // Get active object bounds
  const activeLeft = activeObject.left || 0;
  const activeTop = activeObject.top || 0;
  const activeWidth = (activeObject.width || 0) * (activeObject.scaleX || 1);
  const activeHeight = (activeObject.height || 0) * (activeObject.scaleY || 1);
  const activeRight = activeLeft + activeWidth;
  const activeBottom = activeTop + activeHeight;
  const activeCenterX = activeLeft + activeWidth / 2;
  const activeCenterY = activeTop + activeHeight / 2;
  
  // Find the closest vertical guide
  let closestVerticalGuide: AlignmentGuide | null = null;
  let closestVerticalDistance = threshold;
  let verticalEdgeType: 'left' | 'center' | 'right' = 'left';
  
  guides.filter(g => g.orientation === 'vertical').forEach(guide => {
    // Check left edge
    const distanceLeft = Math.abs(activeLeft - guide.position);
    if (distanceLeft < closestVerticalDistance) {
      closestVerticalDistance = distanceLeft;
      closestVerticalGuide = guide;
      verticalEdgeType = 'left';
    }
    
    // Check center
    const distanceCenter = Math.abs(activeCenterX - guide.position);
    if (distanceCenter < closestVerticalDistance) {
      closestVerticalDistance = distanceCenter;
      closestVerticalGuide = guide;
      verticalEdgeType = 'center';
    }
    
    // Check right edge
    const distanceRight = Math.abs(activeRight - guide.position);
    if (distanceRight < closestVerticalDistance) {
      closestVerticalDistance = distanceRight;
      closestVerticalGuide = guide;
      verticalEdgeType = 'right';
    }
  });
  
  // Find the closest horizontal guide
  let closestHorizontalGuide: AlignmentGuide | null = null;
  let closestHorizontalDistance = threshold;
  let horizontalEdgeType: 'top' | 'center' | 'bottom' = 'top';
  
  guides.filter(g => g.orientation === 'horizontal').forEach(guide => {
    // Check top edge
    const distanceTop = Math.abs(activeTop - guide.position);
    if (distanceTop < closestHorizontalDistance) {
      closestHorizontalDistance = distanceTop;
      closestHorizontalGuide = guide;
      horizontalEdgeType = 'top';
    }
    
    // Check center
    const distanceCenter = Math.abs(activeCenterY - guide.position);
    if (distanceCenter < closestHorizontalDistance) {
      closestHorizontalDistance = distanceCenter;
      closestHorizontalGuide = guide;
      horizontalEdgeType = 'center';
    }
    
    // Check bottom edge
    const distanceBottom = Math.abs(activeBottom - guide.position);
    if (distanceBottom < closestHorizontalDistance) {
      closestHorizontalDistance = distanceBottom;
      closestHorizontalGuide = guide;
      horizontalEdgeType = 'bottom';
    }
  });
  
  // Apply snapping for vertical guide
  if (closestVerticalGuide) {
    let newLeft = activeLeft;
    
    switch (verticalEdgeType) {
      case 'left':
        newLeft = closestVerticalGuide.position;
        break;
      case 'center':
        newLeft = closestVerticalGuide.position - activeWidth / 2;
        break;
      case 'right':
        newLeft = closestVerticalGuide.position - activeWidth;
        break;
    }
    
    activeObject.set({ left: newLeft });
    snappedX = true;
  }
  
  // Apply snapping for horizontal guide
  if (closestHorizontalGuide) {
    let newTop = activeTop;
    
    switch (horizontalEdgeType) {
      case 'top':
        newTop = closestHorizontalGuide.position;
        break;
      case 'center':
        newTop = closestHorizontalGuide.position - activeHeight / 2;
        break;
      case 'bottom':
        newTop = closestHorizontalGuide.position - activeHeight;
        break;
    }
    
    activeObject.set({ top: newTop });
    snappedY = true;
  }
  
  return { 
    snapped: snappedX || snappedY, 
    snappedX, 
    snappedY 
  };
}

/**
 * Custom guide handler for fabric canvas
 */
export class GuideHandler {
  private canvas: fabric.Canvas;
  private guides: AlignmentGuide[] = [];
  private enabled: boolean = true;
  private threshold: number = 8;
  private showEdgeGuides: boolean = true;
  private showCenterGuides: boolean = true;
  private showDistributionGuides: boolean = false;
  private guideColor: string = 'rgba(0, 120, 255, 0.75)';
  
  constructor(canvas: fabric.Canvas, options?: {
    enabled?: boolean;
    threshold?: number;
    showEdgeGuides?: boolean;
    showCenterGuides?: boolean;
    showDistributionGuides?: boolean;
    guideColor?: string;
  }) {
    this.canvas = canvas;
    
    if (options) {
      this.enabled = options.enabled ?? this.enabled;
      this.threshold = options.threshold ?? this.threshold;
      this.showEdgeGuides = options.showEdgeGuides ?? this.showEdgeGuides;
      this.showCenterGuides = options.showCenterGuides ?? this.showCenterGuides;
      this.showDistributionGuides = options.showDistributionGuides ?? this.showDistributionGuides;
      this.guideColor = options.guideColor ?? this.guideColor;
    }
    
    this.bindEvents();
  }
  
  private bindEvents(): void {
    this.canvas.on('object:moving', this.handleObjectMoving.bind(this));
    this.canvas.on('object:modified', this.handleObjectModified.bind(this));
    this.canvas.on('selection:cleared', this.handleSelectionCleared.bind(this));
  }
  
  private handleObjectMoving(e: { target?: fabric.Object }): void {
    if (!this.enabled || !e.target) return;
    
    // Generate guides for the moving object
    this.guides = generateAlignmentGuides(
      this.canvas,
      e.target,
      this.showEdgeGuides,
      this.showCenterGuides,
      this.showDistributionGuides
    );
    
    // Find matching guides
    const matchingGuides = findMatchingGuides(e.target, this.guides, this.threshold);
    
    // Visualize matching guides
    visualizeGuides(this.canvas, matchingGuides, this.guideColor);
    
    // Snap to guides
    if (matchingGuides.length > 0) {
      snapObjectToGuides(e.target, matchingGuides, this.threshold);
    }
  }
  
  private handleObjectModified(): void {
    removeGuideVisualizations(this.canvas);
  }
  
  private handleSelectionCleared(): void {
    removeGuideVisualizations(this.canvas);
  }
  
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      removeGuideVisualizations(this.canvas);
    }
  }
  
  public setThreshold(threshold: number): void {
    this.threshold = threshold;
  }
  
  public setOptions(options: {
    enabled?: boolean;
    threshold?: number;
    showEdgeGuides?: boolean;
    showCenterGuides?: boolean;
    showDistributionGuides?: boolean;
    guideColor?: string;
  }): void {
    if (options.enabled !== undefined) this.enabled = options.enabled;
    if (options.threshold !== undefined) this.threshold = options.threshold;
    if (options.showEdgeGuides !== undefined) this.showEdgeGuides = options.showEdgeGuides;
    if (options.showCenterGuides !== undefined) this.showCenterGuides = options.showCenterGuides;
    if (options.showDistributionGuides !== undefined) this.showDistributionGuides = options.showDistributionGuides;
    if (options.guideColor !== undefined) this.guideColor = options.guideColor;
  }
  
  public dispose(): void {
    this.canvas.off('object:moving', this.handleObjectMoving.bind(this));
    this.canvas.off('object:modified', this.handleObjectModified.bind(this));
    this.canvas.off('selection:cleared', this.handleSelectionCleared.bind(this));
    removeGuideVisualizations(this.canvas);
  }
}
