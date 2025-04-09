
import { fabric } from 'fabric';
import { GridGuideline } from '@/components/wireframe/utils/types';

/**
 * Generates a set of guidelines for an object to snap to when dragged near other objects
 * @param objects - The objects to compare against
 * @param activeObject - The object being dragged
 * @param threshold - The distance threshold for snapping
 * @returns Array of guidelines for snapping
 */
export function generateSnapGuidelines(
  objects: fabric.Object[],
  activeObject: fabric.Object,
  threshold: number = 10
): GridGuideline[] {
  if (!activeObject) return [];

  const guidelines: GridGuideline[] = [];
  
  // Calculate bounds for active object
  const activeObjectBounds = getObjectBounds(activeObject);
  
  objects.forEach(obj => {
    if (obj === activeObject) return;
    
    const objBounds = getObjectBounds(obj);
    
    // Check for horizontal alignments (tops, centers, bottoms)
    // Top edge alignment
    if (Math.abs(objBounds.top - activeObjectBounds.top) < threshold) {
      guidelines.push({
        position: objBounds.top,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Center alignment
    if (Math.abs(objBounds.centerY - activeObjectBounds.centerY) < threshold) {
      guidelines.push({
        position: objBounds.centerY,
        orientation: 'horizontal',
        type: 'center'
      });
    }
    
    // Bottom edge alignment
    if (Math.abs(objBounds.bottom - activeObjectBounds.bottom) < threshold) {
      guidelines.push({
        position: objBounds.bottom,
        orientation: 'horizontal',
        type: 'edge'
      });
    }
    
    // Check for vertical alignments (lefts, centers, rights)
    // Left edge alignment
    if (Math.abs(objBounds.left - activeObjectBounds.left) < threshold) {
      guidelines.push({
        position: objBounds.left,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    // Center alignment
    if (Math.abs(objBounds.centerX - activeObjectBounds.centerX) < threshold) {
      guidelines.push({
        position: objBounds.centerX,
        orientation: 'vertical',
        type: 'center'
      });
    }
    
    // Right edge alignment
    if (Math.abs(objBounds.right - activeObjectBounds.right) < threshold) {
      guidelines.push({
        position: objBounds.right,
        orientation: 'vertical',
        type: 'edge'
      });
    }
    
    // Equal spacing/distribution between objects (simplified version)
    // This would be more complex in a full implementation
  });
  
  return guidelines;
}

/**
 * Calculate and get the bounding box coordinates of an object
 * @param obj The fabric object to calculate bounds for
 * @returns Object containing bounds coordinates
 */
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

/**
 * Creates a grid of lines for the canvas background
 * @param canvas The fabric canvas
 * @param gridSize Size of the grid cells
 * @param gridType Type of grid to create ('lines', 'dots', 'columns')
 * @returns Array of fabric objects representing the grid
 */
export function createCanvasGrid(
  canvas: fabric.Canvas,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines'
): fabric.Object[] {
  if (!canvas) return [];
  
  const gridObjects: fabric.Object[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  switch (gridType) {
    case 'dots':
      // Create dots at grid intersections
      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          const dot = new fabric.Circle({
            left: x,
            top: y,
            radius: 1,
            fill: '#ccc',
            stroke: '',
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            hoverCursor: 'default'
          });
          gridObjects.push(dot);
        }
      }
      break;
      
    case 'columns':
      // Create a column-based grid (vertical lines only, with different spacing)
      const columnCount = 12; // Standard 12-column grid
      const columnWidth = width / columnCount;
      
      for (let i = 0; i <= columnCount; i++) {
        const x = i * columnWidth;
        const isMainColumn = i % 3 === 0;
        
        const line = new fabric.Line([x, 0, x, height], {
          stroke: isMainColumn ? '#aaa' : '#ddd',
          strokeWidth: isMainColumn ? 0.5 : 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      
      // Add some horizontal lines for reference
      for (let y = 0; y <= height; y += gridSize * 5) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#ddd',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      break;
      
    case 'lines':
    default:
      // Create standard grid lines
      for (let x = 0; x <= width; x += gridSize) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: '#e0e0e0',
          strokeWidth: x % (gridSize * 5) === 0 ? 0.7 : 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      
      for (let y = 0; y <= height; y += gridSize) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#e0e0e0',
          strokeWidth: y % (gridSize * 5) === 0 ? 0.7 : 0.5,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        gridObjects.push(line);
      }
      break;
  }
  
  return gridObjects;
}

/**
 * Applies snap logic to move an object to specified guidelines
 * @param object The fabric object to snap
 * @param guidelines The guidelines to snap to
 * @param canvas The fabric canvas
 */
export function snapObjectToGuidelines(
  object: fabric.Object, 
  guidelines: GridGuideline[],
  canvas: fabric.Canvas
): void {
  if (!object || !guidelines.length) return;
  
  const objectBounds = getObjectBounds(object);
  
  let horizontalSnap = false;
  let verticalSnap = false;
  
  // Process horizontal guidelines
  const horizontalGuidelines = guidelines.filter(g => g.orientation === 'horizontal');
  if (horizontalGuidelines.length) {
    // Sort by type importance (edge > center > distribution)
    const sortedH = [...horizontalGuidelines].sort((a, b) => {
      // Priority: edge, center, distribution
      const typePriority = { 'edge': 0, 'center': 1, 'distribution': 2 };
      return typePriority[a.type] - typePriority[b.type];
    });
    
    const guide = sortedH[0]; // Use most important guide
    
    // Apply snap based on type
    switch (guide.type) {
      case 'edge':
        // Check if this is a top or bottom edge snap
        if (Math.abs(guide.position - objectBounds.top) <= Math.abs(guide.position - objectBounds.bottom)) {
          object.set('top', guide.position);
        } else {
          object.set('top', guide.position - objectBounds.height);
        }
        horizontalSnap = true;
        break;
      case 'center':
        object.set('top', guide.position - objectBounds.height / 2);
        horizontalSnap = true;
        break;
      case 'distribution':
        // More complex distribution logic would go here
        break;
    }
  }
  
  // Process vertical guidelines
  const verticalGuidelines = guidelines.filter(g => g.orientation === 'vertical');
  if (verticalGuidelines.length) {
    // Sort by type importance (edge > center > distribution)
    const sortedV = [...verticalGuidelines].sort((a, b) => {
      // Priority: edge, center, distribution
      const typePriority = { 'edge': 0, 'center': 1, 'distribution': 2 };
      return typePriority[a.type] - typePriority[b.type];
    });
    
    const guide = sortedV[0]; // Use most important guide
    
    // Apply snap based on type
    switch (guide.type) {
      case 'edge':
        // Check if this is a left or right edge snap
        if (Math.abs(guide.position - objectBounds.left) <= Math.abs(guide.position - objectBounds.right)) {
          object.set('left', guide.position);
        } else {
          object.set('left', guide.position - objectBounds.width);
        }
        verticalSnap = true;
        break;
      case 'center':
        object.set('left', guide.position - objectBounds.width / 2);
        verticalSnap = true;
        break;
      case 'distribution':
        // More complex distribution logic would go here
        break;
    }
  }
  
  if (horizontalSnap || verticalSnap) {
    canvas.renderAll();
  }
}
