
import { fabric } from 'fabric';
import { AlignmentGuide } from './types';

/**
 * Calculate bounds for all sections in the wireframe
 */
export function calculateSectionsBounds(sections: fabric.Object[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (!sections || sections.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  
  sections.forEach((section) => {
    if (!section) return;
    
    const left = section.left || 0;
    const top = section.top || 0;
    const width = section.width || 0;
    const height = section.height || 0;
    const scaleX = section.scaleX || 1;
    const scaleY = section.scaleY || 1;
    
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;
    
    const right = left + scaledWidth;
    const bottom = top + scaledHeight;
    
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
  });
  
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Find alignment guides between sections
 */
export function findAlignmentGuides(
  activeSection: fabric.Object,
  allSections: fabric.Object[],
  tolerance: number = 10
): AlignmentGuide[] {
  if (!activeSection) return [];
  
  const guides: AlignmentGuide[] = [];
  const otherSections = allSections.filter(section => section !== activeSection);
  
  // Get active section bounds
  const activeLeft = activeSection.left || 0;
  const activeTop = activeSection.top || 0;
  const activeWidth = (activeSection.width || 0) * (activeSection.scaleX || 1);
  const activeHeight = (activeSection.height || 0) * (activeSection.scaleY || 1);
  const activeRight = activeLeft + activeWidth;
  const activeBottom = activeTop + activeHeight;
  const activeCenterX = activeLeft + activeWidth / 2;
  const activeCenterY = activeTop + activeHeight / 2;
  
  // For each other section, check for alignments
  otherSections.forEach(section => {
    if (!section) return;
    
    const left = section.left || 0;
    const top = section.top || 0;
    const width = (section.width || 0) * (section.scaleX || 1);
    const height = (section.height || 0) * (section.scaleY || 1);
    const right = left + width;
    const bottom = top + height;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Check for horizontal alignment
    // Left edges
    if (Math.abs(activeLeft - left) < tolerance) {
      guides.push({
        position: left,
        orientation: 'vertical',
        type: 'edge',
        strength: 1 - Math.abs(activeLeft - left) / tolerance
      });
    }
    
    // Right edges
    if (Math.abs(activeRight - right) < tolerance) {
      guides.push({
        position: right,
        orientation: 'vertical',
        type: 'edge',
        strength: 1 - Math.abs(activeRight - right) / tolerance
      });
    }
    
    // Centers X
    if (Math.abs(activeCenterX - centerX) < tolerance) {
      guides.push({
        position: centerX,
        orientation: 'vertical',
        type: 'center',
        strength: 1 - Math.abs(activeCenterX - centerX) / tolerance
      });
    }
    
    // Check for vertical alignment
    // Top edges
    if (Math.abs(activeTop - top) < tolerance) {
      guides.push({
        position: top,
        orientation: 'horizontal',
        type: 'edge',
        strength: 1 - Math.abs(activeTop - top) / tolerance
      });
    }
    
    // Bottom edges
    if (Math.abs(activeBottom - bottom) < tolerance) {
      guides.push({
        position: bottom,
        orientation: 'horizontal',
        type: 'edge',
        strength: 1 - Math.abs(activeBottom - bottom) / tolerance
      });
    }
    
    // Centers Y
    if (Math.abs(activeCenterY - centerY) < tolerance) {
      guides.push({
        position: centerY,
        orientation: 'horizontal',
        type: 'center',
        strength: 1 - Math.abs(activeCenterY - centerY) / tolerance
      });
    }
    
    // Check for spacing
    // Equal horizontal spacing
    if (Math.abs(activeLeft - right) < tolerance) {
      guides.push({
        position: right,
        orientation: 'vertical',
        type: 'distribution',
        strength: 1 - Math.abs(activeLeft - right) / tolerance
      });
    }
    
    if (Math.abs(activeRight - left) < tolerance) {
      guides.push({
        position: left,
        orientation: 'vertical',
        type: 'distribution',
        strength: 1 - Math.abs(activeRight - left) / tolerance
      });
    }
    
    // Equal vertical spacing
    if (Math.abs(activeTop - bottom) < tolerance) {
      guides.push({
        position: bottom,
        orientation: 'horizontal',
        type: 'distribution',
        strength: 1 - Math.abs(activeTop - bottom) / tolerance
      });
    }
    
    if (Math.abs(activeBottom - top) < tolerance) {
      guides.push({
        position: top,
        orientation: 'horizontal',
        type: 'distribution',
        strength: 1 - Math.abs(activeBottom - top) / tolerance
      });
    }
  });
  
  // Sort guides by strength (strongest first)
  return guides.sort((a, b) => b.strength - a.strength);
}

/**
 * Highlight selected object with visual indicators
 */
export function highlightSelectedSection(
  canvas: fabric.Canvas, 
  selectedObject: fabric.Object | null,
  color: string = '#4285f4'
): void {
  if (!canvas) return;
  
  // Remove all existing highlights
  const existingHighlights = canvas.getObjects().filter(obj => (obj as any)._isHighlight);
  existingHighlights.forEach(obj => canvas.remove(obj));
  
  if (!selectedObject) return;
  
  // Get object bounds
  const left = selectedObject.left || 0;
  const top = selectedObject.top || 0;
  const width = (selectedObject.width || 0) * (selectedObject.scaleX || 1);
  const height = (selectedObject.height || 0) * (selectedObject.scaleY || 1);
  
  // Create border highlight
  const border = new fabric.Rect({
    left: left - 2,
    top: top - 2,
    width: width + 4,
    height: height + 4,
    fill: 'transparent',
    stroke: color,
    strokeWidth: 2,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false
  });
  (border as any)._isHighlight = true;
  
  // Create corner handles
  const handleSize = 8;
  const handles = [
    // Top left
    new fabric.Rect({
      left: left - handleSize / 2,
      top: top - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Top right
    new fabric.Rect({
      left: left + width - handleSize / 2,
      top: top - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Bottom left
    new fabric.Rect({
      left: left - handleSize / 2,
      top: top + height - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Bottom right
    new fabric.Rect({
      left: left + width - handleSize / 2,
      top: top + height - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Middle top
    new fabric.Rect({
      left: left + width / 2 - handleSize / 2,
      top: top - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Middle right
    new fabric.Rect({
      left: left + width - handleSize / 2,
      top: top + height / 2 - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Middle bottom
    new fabric.Rect({
      left: left + width / 2 - handleSize / 2,
      top: top + height - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    }),
    // Middle left
    new fabric.Rect({
      left: left - handleSize / 2,
      top: top + height / 2 - handleSize / 2,
      width: handleSize,
      height: handleSize,
      fill: color,
      selectable: false,
      evented: false
    })
  ];
  
  // Add highlighting elements to canvas
  canvas.add(border);
  handles.forEach(handle => {
    (handle as any)._isHighlight = true;
    canvas.add(handle);
  });
  
  // Make sure highlights are behind the selected object
  border.moveTo(0);
  handles.forEach(handle => handle.moveTo(1));
  selectedObject.moveTo(handles.length + 1);
  
  canvas.renderAll();
}
