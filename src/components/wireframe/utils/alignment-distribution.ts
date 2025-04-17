
import { fabric } from 'fabric';

interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Get the bounding box for a collection of objects
 */
export function getCollectionBounds(objects: fabric.Object[]): BoundingBox {
  if (!objects.length) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  objects.forEach(obj => {
    const objBounds = obj.getBoundingRect(true, true);
    minX = Math.min(minX, objBounds.left);
    minY = Math.min(minY, objBounds.top);
    maxX = Math.max(maxX, objBounds.left + objBounds.width);
    maxY = Math.max(maxY, objBounds.top + objBounds.height);
  });

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Alignment functions
 */
export const alignObjects = {
  // Horizontal alignments
  left: (canvas: fabric.Canvas, targetLeft?: number) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    // If targetLeft is not provided, use the left-most object as reference
    if (targetLeft === undefined) {
      const bounds = getCollectionBounds(activeObjects);
      targetLeft = bounds.left;
    }
    
    activeObjects.forEach(obj => {
      obj.set('left', targetLeft);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  centerH: (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    const selectionBounds = getCollectionBounds(activeObjects);
    const centerX = selectionBounds.left + selectionBounds.width / 2;
    
    activeObjects.forEach(obj => {
      const objWidth = obj.getScaledWidth();
      obj.set('left', centerX - objWidth / 2);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  right: (canvas: fabric.Canvas, targetRight?: number) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    // If targetRight is not provided, use the right-most object as reference
    if (targetRight === undefined) {
      const bounds = getCollectionBounds(activeObjects);
      targetRight = bounds.left + bounds.width;
    }
    
    activeObjects.forEach(obj => {
      const objWidth = obj.getScaledWidth();
      obj.set('left', targetRight - objWidth);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  // Vertical alignments
  top: (canvas: fabric.Canvas, targetTop?: number) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    // If targetTop is not provided, use the top-most object as reference
    if (targetTop === undefined) {
      const bounds = getCollectionBounds(activeObjects);
      targetTop = bounds.top;
    }
    
    activeObjects.forEach(obj => {
      obj.set('top', targetTop);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  middle: (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    const selectionBounds = getCollectionBounds(activeObjects);
    const centerY = selectionBounds.top + selectionBounds.height / 2;
    
    activeObjects.forEach(obj => {
      const objHeight = obj.getScaledHeight();
      obj.set('top', centerY - objHeight / 2);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  bottom: (canvas: fabric.Canvas, targetBottom?: number) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
    
    // If targetBottom is not provided, use the bottom-most object as reference
    if (targetBottom === undefined) {
      const bounds = getCollectionBounds(activeObjects);
      targetBottom = bounds.top + bounds.height;
    }
    
    activeObjects.forEach(obj => {
      const objHeight = obj.getScaledHeight();
      obj.set('top', targetBottom - objHeight);
    });
    
    canvas.requestRenderAll();
    return true;
  }
};

/**
 * Distribution functions
 */
export const distributeObjects = {
  horizontally: (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length < 3) return false;
    
    // Sort objects by their horizontal position
    const sortedObjects = [...activeObjects].sort((a, b) => 
      (a.left || 0) - (b.left || 0)
    );
    
    // Calculate total available space
    const firstObject = sortedObjects[0];
    const lastObject = sortedObjects[sortedObjects.length - 1];
    const leftBound = firstObject.left || 0;
    const rightBound = (lastObject.left || 0) + lastObject.getScaledWidth();
    const totalSpace = rightBound - leftBound;
    
    // Calculate total objects width
    let totalObjectsWidth = 0;
    sortedObjects.forEach(obj => {
      totalObjectsWidth += obj.getScaledWidth();
    });
    
    // Calculate equal spacing between objects
    const spacing = (totalSpace - totalObjectsWidth) / (sortedObjects.length - 1);
    
    // Position each object with equal spacing
    let currentLeft = leftBound;
    sortedObjects.forEach((obj, index) => {
      if (index === 0) return; // Skip the first object, it stays in place
      if (index === sortedObjects.length - 1) return; // Skip the last object, it stays in place
      
      const previousObj = sortedObjects[index - 1];
      currentLeft = (previousObj.left || 0) + previousObj.getScaledWidth() + spacing;
      obj.set('left', currentLeft);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  vertically: (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length < 3) return false;
    
    // Sort objects by their vertical position
    const sortedObjects = [...activeObjects].sort((a, b) => 
      (a.top || 0) - (b.top || 0)
    );
    
    // Calculate total available space
    const firstObject = sortedObjects[0];
    const lastObject = sortedObjects[sortedObjects.length - 1];
    const topBound = firstObject.top || 0;
    const bottomBound = (lastObject.top || 0) + lastObject.getScaledHeight();
    const totalSpace = bottomBound - topBound;
    
    // Calculate total objects height
    let totalObjectsHeight = 0;
    sortedObjects.forEach(obj => {
      totalObjectsHeight += obj.getScaledHeight();
    });
    
    // Calculate equal spacing between objects
    const spacing = (totalSpace - totalObjectsHeight) / (sortedObjects.length - 1);
    
    // Position each object with equal spacing
    let currentTop = topBound;
    sortedObjects.forEach((obj, index) => {
      if (index === 0) return; // Skip the first object, it stays in place
      if (index === sortedObjects.length - 1) return; // Skip the last object, it stays in place
      
      const previousObj = sortedObjects[index - 1];
      currentTop = (previousObj.top || 0) + previousObj.getScaledHeight() + spacing;
      obj.set('top', currentTop);
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  spaceEvenlyHorizontal: (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length < 3) return false;
    
    // Sort objects by their horizontal position
    const sortedObjects = [...activeObjects].sort((a, b) => 
      (a.left || 0) - (b.left || 0)
    );
    
    // Calculate the bounds of the selection
    const bounds = getCollectionBounds(activeObjects);
    
    // Calculate equal spacing
    const totalWidth = bounds.width;
    let objectsWidth = 0;
    
    sortedObjects.forEach(obj => {
      objectsWidth += obj.getScaledWidth();
    });
    
    const totalSpacing = totalWidth - objectsWidth;
    const spacing = totalSpacing / (sortedObjects.length - 1);
    
    // Position objects
    let currentLeft = bounds.left;
    sortedObjects.forEach((obj, index) => {
      obj.set('left', currentLeft);
      currentLeft += obj.getScaledWidth() + spacing;
    });
    
    canvas.requestRenderAll();
    return true;
  },
  
  spaceEvenlyVertical: (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects || activeObjects.length < 3) return false;
    
    // Sort objects by their vertical position
    const sortedObjects = [...activeObjects].sort((a, b) => 
      (a.top || 0) - (b.top || 0)
    );
    
    // Calculate the bounds of the selection
    const bounds = getCollectionBounds(activeObjects);
    
    // Calculate equal spacing
    const totalHeight = bounds.height;
    let objectsHeight = 0;
    
    sortedObjects.forEach(obj => {
      objectsHeight += obj.getScaledHeight();
    });
    
    const totalSpacing = totalHeight - objectsHeight;
    const spacing = totalSpacing / (sortedObjects.length - 1);
    
    // Position objects
    let currentTop = bounds.top;
    sortedObjects.forEach((obj, index) => {
      obj.set('top', currentTop);
      currentTop += obj.getScaledHeight() + spacing;
    });
    
    canvas.requestRenderAll();
    return true;
  }
};

/**
 * Create dynamic alignment guides
 */
export function createAlignmentGuides(
  canvas: fabric.Canvas, 
  object: fabric.Object,
  objects: fabric.Object[],
  threshold: number = 10
): fabric.Line[] {
  const guides: fabric.Line[] = [];
  
  if (!object || !objects.length) return guides;
  
  // Get object bounds
  const objectBounds = object.getBoundingRect(true, true);
  const objectCenter = {
    x: objectBounds.left + objectBounds.width / 2,
    y: objectBounds.top + objectBounds.height / 2
  };
  
  // For each other object, check if we should create alignment guides
  objects.forEach(otherObj => {
    if (otherObj === object) return;
    
    const otherBounds = otherObj.getBoundingRect(true, true);
    const otherCenter = {
      x: otherBounds.left + otherBounds.width / 2,
      y: otherBounds.top + otherBounds.height / 2
    };
    
    // Horizontal center alignment
    if (Math.abs(objectCenter.x - otherCenter.x) < threshold) {
      guides.push(
        new fabric.Line(
          [otherCenter.x, 0, otherCenter.x, canvas.height || 600],
          {
            stroke: '#1EAEDB',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false
          }
        )
      );
    }
    
    // Vertical center alignment
    if (Math.abs(objectCenter.y - otherCenter.y) < threshold) {
      guides.push(
        new fabric.Line(
          [0, otherCenter.y, canvas.width || 800, otherCenter.y],
          {
            stroke: '#1EAEDB',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false
          }
        )
      );
    }
    
    // Left edge alignment
    if (Math.abs(objectBounds.left - otherBounds.left) < threshold) {
      guides.push(
        new fabric.Line(
          [otherBounds.left, 0, otherBounds.left, canvas.height || 600],
          {
            stroke: '#1EAEDB',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false
          }
        )
      );
    }
    
    // Right edge alignment
    if (Math.abs(
      (objectBounds.left + objectBounds.width) - 
      (otherBounds.left + otherBounds.width)
    ) < threshold) {
      const rightEdge = otherBounds.left + otherBounds.width;
      guides.push(
        new fabric.Line(
          [rightEdge, 0, rightEdge, canvas.height || 600],
          {
            stroke: '#1EAEDB',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false
          }
        )
      );
    }
    
    // Top edge alignment
    if (Math.abs(objectBounds.top - otherBounds.top) < threshold) {
      guides.push(
        new fabric.Line(
          [0, otherBounds.top, canvas.width || 800, otherBounds.top],
          {
            stroke: '#1EAEDB',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false
          }
        )
      );
    }
    
    // Bottom edge alignment
    if (Math.abs(
      (objectBounds.top + objectBounds.height) - 
      (otherBounds.top + otherBounds.height)
    ) < threshold) {
      const bottomEdge = otherBounds.top + otherBounds.height;
      guides.push(
        new fabric.Line(
          [0, bottomEdge, canvas.width || 800, bottomEdge],
          {
            stroke: '#1EAEDB',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false
          }
        )
      );
    }
  });
  
  return guides;
}

/**
 * Clear all alignment guides from the canvas
 */
export function clearAlignmentGuides(canvas: fabric.Canvas) {
  const guides = canvas.getObjects().filter(obj => {
    return obj.type === 'line' && 
      obj.stroke === '#1EAEDB' && 
      !obj.selectable && 
      !obj.evented;
  });
  
  guides.forEach(guide => {
    canvas.remove(guide);
  });
  
  canvas.requestRenderAll();
}
