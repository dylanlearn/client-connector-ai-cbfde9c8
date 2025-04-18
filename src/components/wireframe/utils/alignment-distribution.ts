
import { fabric } from 'fabric';

// Types for alignment and distribution
export interface AlignmentOptions {
  respectBounds?: boolean;
  alignToCanvas?: boolean;
}

// Helper function to get the selected objects or all objects if none are selected
const getTargetObjects = (canvas: fabric.Canvas, options: AlignmentOptions = {}): fabric.Object[] => {
  // Get active selection or selected object
  const activeSelection = canvas.getActiveObject();
  
  if (activeSelection && activeSelection.type === 'activeSelection') {
    // Return objects within the active selection
    return (activeSelection as fabric.ActiveSelection).getObjects();
  } else if (activeSelection) {
    // Single object selected
    return [activeSelection];
  } else if (options.alignToCanvas) {
    // No selection, but alignToCanvas is true - use all objects
    return canvas.getObjects().filter(obj => obj.visible !== false);
  }
  
  return [];
};

// Calculate bounds of a group of objects
const calculateBounds = (objects: fabric.Object[]): {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
} => {
  if (!objects.length) {
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    };
  }

  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  objects.forEach((obj) => {
    const objBounds = obj.getBoundingRect(true, true);
    left = Math.min(left, objBounds.left);
    top = Math.min(top, objBounds.top);
    right = Math.max(right, objBounds.left + objBounds.width);
    bottom = Math.max(bottom, objBounds.top + objBounds.height);
  });

  const width = right - left;
  const height = bottom - top;

  return {
    left,
    top,
    right,
    bottom,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
  };
};

// Alignment functions
export const alignObjects = {
  left: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;

    const bounds = calculateBounds(objects);
    
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const deltaX = bounds.left - objBounds.left;
      obj.set('left', obj.left ? obj.left + deltaX : deltaX);
      obj.setCoords();
    });
    
    canvas.renderAll();
    return true;
  },
  
  centerH: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;

    const bounds = calculateBounds(objects);
    
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const objCenter = objBounds.left + objBounds.width / 2;
      const deltaX = bounds.centerX - objCenter;
      obj.set('left', obj.left ? obj.left + deltaX : deltaX);
      obj.setCoords();
    });
    
    canvas.renderAll();
    return true;
  },
  
  right: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;

    const bounds = calculateBounds(objects);
    
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const objRight = objBounds.left + objBounds.width;
      const deltaX = bounds.right - objRight;
      obj.set('left', obj.left ? obj.left + deltaX : deltaX);
      obj.setCoords();
    });
    
    canvas.renderAll();
    return true;
  },
  
  top: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;

    const bounds = calculateBounds(objects);
    
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const deltaY = bounds.top - objBounds.top;
      obj.set('top', obj.top ? obj.top + deltaY : deltaY);
      obj.setCoords();
    });
    
    canvas.renderAll();
    return true;
  },
  
  middle: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;

    const bounds = calculateBounds(objects);
    
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const objCenter = objBounds.top + objBounds.height / 2;
      const deltaY = bounds.centerY - objCenter;
      obj.set('top', obj.top ? obj.top + deltaY : deltaY);
      obj.setCoords();
    });
    
    canvas.renderAll();
    return true;
  },
  
  bottom: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;

    const bounds = calculateBounds(objects);
    
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const objBottom = objBounds.top + objBounds.height;
      const deltaY = bounds.bottom - objBottom;
      obj.set('top', obj.top ? obj.top + deltaY : deltaY);
      obj.setCoords();
    });
    
    canvas.renderAll();
    return true;
  }
};

// Distribution functions
export const distributeObjects = {
  horizontally: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 3) return false;
    
    // Sort objects by their left position
    const sortedObjects = [...objects].sort((a, b) => {
      const boundsA = a.getBoundingRect(true, true);
      const boundsB = b.getBoundingRect(true, true);
      return boundsA.left - boundsB.left;
    });
    
    const firstObj = sortedObjects[0];
    const lastObj = sortedObjects[sortedObjects.length - 1];
    const firstBounds = firstObj.getBoundingRect(true, true);
    const lastBounds = lastObj.getBoundingRect(true, true);
    
    // Calculate total available space
    const totalSpace = (lastBounds.left - firstBounds.left - firstBounds.width);
    
    // Calculate total width of middle objects
    let totalMiddleWidth = 0;
    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const bounds = sortedObjects[i].getBoundingRect(true, true);
      totalMiddleWidth += bounds.width;
    }
    
    // Calculate gap between objects
    const numGaps = sortedObjects.length - 1;
    const gap = (totalSpace - totalMiddleWidth) / numGaps;
    
    if (gap < 0) return false; // Objects are overlapping, can't distribute
    
    // Position each object except the first one
    let currentLeft = firstBounds.left + firstBounds.width + gap;
    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const obj = sortedObjects[i];
      const bounds = obj.getBoundingRect(true, true);
      const deltaX = currentLeft - bounds.left;
      
      obj.set('left', obj.left ? obj.left + deltaX : deltaX);
      obj.setCoords();
      
      currentLeft += bounds.width + gap;
    }
    
    canvas.renderAll();
    return true;
  },
  
  vertically: (canvas: fabric.Canvas, options: AlignmentOptions = {}): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 3) return false;
    
    // Sort objects by their top position
    const sortedObjects = [...objects].sort((a, b) => {
      const boundsA = a.getBoundingRect(true, true);
      const boundsB = b.getBoundingRect(true, true);
      return boundsA.top - boundsB.top;
    });
    
    const firstObj = sortedObjects[0];
    const lastObj = sortedObjects[sortedObjects.length - 1];
    const firstBounds = firstObj.getBoundingRect(true, true);
    const lastBounds = lastObj.getBoundingRect(true, true);
    
    // Calculate total available space
    const totalSpace = (lastBounds.top - firstBounds.top - firstBounds.height);
    
    // Calculate total height of middle objects
    let totalMiddleHeight = 0;
    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const bounds = sortedObjects[i].getBoundingRect(true, true);
      totalMiddleHeight += bounds.height;
    }
    
    // Calculate gap between objects
    const numGaps = sortedObjects.length - 1;
    const gap = (totalSpace - totalMiddleHeight) / numGaps;
    
    if (gap < 0) return false; // Objects are overlapping, can't distribute
    
    // Position each object except the first one
    let currentTop = firstBounds.top + firstBounds.height + gap;
    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const obj = sortedObjects[i];
      const bounds = obj.getBoundingRect(true, true);
      const deltaY = currentTop - bounds.top;
      
      obj.set('top', obj.top ? obj.top + deltaY : deltaY);
      obj.setCoords();
      
      currentTop += bounds.height + gap;
    }
    
    canvas.renderAll();
    return true;
  },
  
  spaceEvenlyHorizontal: (canvas: fabric.Canvas, options?: AlignmentOptions): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;
    
    // Sort objects by their left position
    const sortedObjects = [...objects].sort((a, b) => {
      const boundsA = a.getBoundingRect(true, true);
      const boundsB = b.getBoundingRect(true, true);
      return boundsA.left - boundsB.left;
    });
    
    const bounds = calculateBounds(sortedObjects);
    const totalWidth = bounds.width;
    
    // Calculate individual object widths
    let objectsWidth = 0;
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      objectsWidth += objBounds.width;
    });
    
    // Calculate equal space between objects
    const spacing = (totalWidth - objectsWidth) / (objects.length - 1);
    if (spacing < 0) return false; // Objects are too wide to space evenly
    
    // Position objects with equal spacing
    let currentX = bounds.left;
    sortedObjects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const deltaX = currentX - objBounds.left;
      
      obj.set('left', obj.left ? obj.left + deltaX : deltaX);
      obj.setCoords();
      
      currentX += objBounds.width + spacing;
    });
    
    canvas.renderAll();
    return true;
  },
  
  spaceEvenlyVertical: (canvas: fabric.Canvas, options?: AlignmentOptions): boolean => {
    const objects = getTargetObjects(canvas, options);
    if (objects.length < 2) return false;
    
    // Sort objects by their top position
    const sortedObjects = [...objects].sort((a, b) => {
      const boundsA = a.getBoundingRect(true, true);
      const boundsB = b.getBoundingRect(true, true);
      return boundsA.top - boundsB.top;
    });
    
    const bounds = calculateBounds(sortedObjects);
    const totalHeight = bounds.height;
    
    // Calculate individual object heights
    let objectsHeight = 0;
    objects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      objectsHeight += objBounds.height;
    });
    
    // Calculate equal space between objects
    const spacing = (totalHeight - objectsHeight) / (objects.length - 1);
    if (spacing < 0) return false; // Objects are too tall to space evenly
    
    // Position objects with equal spacing
    let currentY = bounds.top;
    sortedObjects.forEach((obj) => {
      const objBounds = obj.getBoundingRect(true, true);
      const deltaY = currentY - objBounds.top;
      
      obj.set('top', obj.top ? obj.top + deltaY : deltaY);
      obj.setCoords();
      
      currentY += objBounds.height + spacing;
    });
    
    canvas.renderAll();
    return true;
  }
};

// Preset alignments
export const alignmentPresets = {
  topLeft: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.left(canvas) && alignObjects.top(canvas)) {
      return true;
    }
    return false;
  },
  
  topCenter: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.centerH(canvas) && alignObjects.top(canvas)) {
      return true;
    }
    return false;
  },
  
  topRight: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.right(canvas) && alignObjects.top(canvas)) {
      return true;
    }
    return false;
  },
  
  middleLeft: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.left(canvas) && alignObjects.middle(canvas)) {
      return true;
    }
    return false;
  },
  
  center: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.centerH(canvas) && alignObjects.middle(canvas)) {
      return true;
    }
    return false;
  },
  
  middleRight: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.right(canvas) && alignObjects.middle(canvas)) {
      return true;
    }
    return false;
  },
  
  bottomLeft: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.left(canvas) && alignObjects.bottom(canvas)) {
      return true;
    }
    return false;
  },
  
  bottomCenter: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.centerH(canvas) && alignObjects.bottom(canvas)) {
      return true;
    }
    return false;
  },
  
  bottomRight: (canvas: fabric.Canvas): boolean => {
    if (alignObjects.right(canvas) && alignObjects.bottom(canvas)) {
      return true;
    }
    return false;
  }
};

// Dynamic alignment guides
export interface AlignmentGuide {
  type: 'edge' | 'center' | 'line';
  position: fabric.Point;
  dimension: number; // length of guide
  orientation: 'horizontal' | 'vertical';
}

// Create alignment guides based on object positions
export const createAlignmentGuides = (
  canvas: fabric.Canvas,
  activeObject: fabric.Object,
  otherObjects: fabric.Object[]
): fabric.Line[] => {
  if (!activeObject || !otherObjects.length) return [];
  
  const activeBounds = activeObject.getBoundingRect(true, true);
  const activeCenter = {
    x: activeBounds.left + activeBounds.width / 2,
    y: activeBounds.top + activeBounds.height / 2
  };
  
  const guides: fabric.Line[] = [];
  const snapThreshold = 10; // pixels
  const guideStyle = {
    stroke: '#2196f3', // blue color
    strokeWidth: 1,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    data: { type: 'guide' }
  };
  
  // Function to create a guide line
  const createGuideLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isActive: boolean
  ): fabric.Line => {
    const line = new fabric.Line([x1, y1, x2, y2], {
      ...guideStyle,
      opacity: isActive ? 1 : 0.5,
    });
    return line;
  };
  
  // Check each object for possible alignments
  otherObjects.forEach(obj => {
    const objBounds = obj.getBoundingRect(true, true);
    const objCenter = {
      x: objBounds.left + objBounds.width / 2,
      y: objBounds.top + objBounds.height / 2
    };
    
    // Check for vertical alignments (left, center, right)
    
    // Left edges alignment
    if (Math.abs(activeBounds.left - objBounds.left) < snapThreshold) {
      const y1 = Math.min(activeBounds.top, objBounds.top) - 20;
      const y2 = Math.max(
        activeBounds.top + activeBounds.height,
        objBounds.top + objBounds.height
      ) + 20;
      
      guides.push(
        createGuideLine(
          objBounds.left,
          y1,
          objBounds.left,
          y2,
          true
        )
      );
    }
    
    // Right edges alignment
    if (
      Math.abs(
        activeBounds.left + activeBounds.width - 
        (objBounds.left + objBounds.width)
      ) < snapThreshold
    ) {
      const y1 = Math.min(activeBounds.top, objBounds.top) - 20;
      const y2 = Math.max(
        activeBounds.top + activeBounds.height,
        objBounds.top + objBounds.height
      ) + 20;
      
      guides.push(
        createGuideLine(
          objBounds.left + objBounds.width,
          y1,
          objBounds.left + objBounds.width,
          y2,
          true
        )
      );
    }
    
    // Center vertical alignment
    if (Math.abs(activeCenter.x - objCenter.x) < snapThreshold) {
      const y1 = Math.min(activeBounds.top, objBounds.top) - 20;
      const y2 = Math.max(
        activeBounds.top + activeBounds.height,
        objBounds.top + objBounds.height
      ) + 20;
      
      guides.push(
        createGuideLine(
          objCenter.x,
          y1,
          objCenter.x,
          y2,
          true
        )
      );
    }
    
    // Check for horizontal alignments (top, middle, bottom)
    
    // Top edges alignment
    if (Math.abs(activeBounds.top - objBounds.top) < snapThreshold) {
      const x1 = Math.min(activeBounds.left, objBounds.left) - 20;
      const x2 = Math.max(
        activeBounds.left + activeBounds.width,
        objBounds.left + objBounds.width
      ) + 20;
      
      guides.push(
        createGuideLine(
          x1,
          objBounds.top,
          x2,
          objBounds.top,
          true
        )
      );
    }
    
    // Bottom edges alignment
    if (
      Math.abs(
        activeBounds.top + activeBounds.height - 
        (objBounds.top + objBounds.height)
      ) < snapThreshold
    ) {
      const x1 = Math.min(activeBounds.left, objBounds.left) - 20;
      const x2 = Math.max(
        activeBounds.left + activeBounds.width,
        objBounds.left + objBounds.width
      ) + 20;
      
      guides.push(
        createGuideLine(
          x1,
          objBounds.top + objBounds.height,
          x2,
          objBounds.top + objBounds.height,
          true
        )
      );
    }
    
    // Middle horizontal alignment
    if (Math.abs(activeCenter.y - objCenter.y) < snapThreshold) {
      const x1 = Math.min(activeBounds.left, objBounds.left) - 20;
      const x2 = Math.max(
        activeBounds.left + activeBounds.width,
        objBounds.left + objBounds.width
      ) + 20;
      
      guides.push(
        createGuideLine(
          x1,
          objCenter.y,
          x2,
          objCenter.y,
          true
        )
      );
    }
  });
  
  return guides;
};

// Clear all alignment guides from canvas
export const clearAlignmentGuides = (canvas: fabric.Canvas): void => {
  const guides = canvas.getObjects().filter(obj => obj.data?.type === 'guide');
  guides.forEach(guide => canvas.remove(guide));
};
