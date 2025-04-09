import { fabric } from 'fabric';
import { SectionRenderingOptions } from './types';

/**
 * Converts a Tailwind CSS class string to a Fabric.js style object
 */
export function tailwindToFabric(tailwindClasses: string): Record<string, any> {
  const styles: Record<string, any> = {};
  
  // Basic conversion - expand as needed
  if (tailwindClasses.includes('font-bold')) {
    styles.fontWeight = 'bold';
  }
  
  if (tailwindClasses.includes('italic')) {
    styles.fontStyle = 'italic';
  }
  
  if (tailwindClasses.includes('underline')) {
    styles.textDecoration = 'underline';
  }
  
  // Add more conversions as needed
  
  return styles;
}

/**
 * Converts a Fabric.js object to a simplified JSON representation
 */
export function fabricToObject(obj: fabric.Object): Record<string, any> {
  return {
    type: obj.type,
    left: obj.left,
    top: obj.top,
    width: obj.width,
    height: obj.height,
    fill: obj.fill,
    stroke: obj.stroke,
    strokeWidth: obj.strokeWidth,
    angle: obj.angle,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    opacity: obj.opacity,
    visible: obj.visible,
    shadow: obj.shadow ? {
      color: obj.shadow.color,
      blur: obj.shadow.blur,
      offsetX: obj.shadow.offsetX,
      offsetY: obj.shadow.offsetY
    } : null,
    // Add more properties as needed
  };
}

/**
 * Converts a simplified object representation to a Fabric.js object
 */
export function objectToFabric(obj: Record<string, any>): fabric.Object {
  // Basic object creation - expand as needed
  const fabricObject = new fabric.Rect({ // Default to rectangle
    left: obj.left,
    top: obj.top,
    width: obj.width,
    height: obj.height,
    fill: obj.fill,
    stroke: obj.stroke,
    strokeWidth: obj.strokeWidth,
    angle: obj.angle,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    opacity: obj.opacity,
    visible: obj.visible,
    shadow: obj.shadow ? new fabric.Shadow({
      color: obj.shadow.color,
      blur: obj.shadow.blur,
      offsetX: obj.shadow.offsetX,
      offsetY: obj.shadow.offsetY
    }) : null
  });
  
  // Add more object types and property assignments as needed
  
  return fabricObject;
}

/**
 * Renders a wireframe section to a Fabric.js canvas
 */
export function renderSectionToFabric(
  canvas: fabric.Canvas, 
  section: any,
  options: SectionRenderingOptions = {}
) {
  if (!canvas || !section) return null;
  
  const {
    responsive = false,
    darkMode = false,
    showGrid = false,
    gridSize = 10,
    deviceType = 'desktop',
    interactive = true
  } = options;
  
  // Basic rendering - expand as needed
  const rect = new fabric.Rect({
    left: section.position?.x || 50,
    top: section.position?.y || 50,
    width: section.dimensions?.width || 200,
    height: section.dimensions?.height || 100,
    fill: section.backgroundColor || (darkMode ? '#333' : '#eee'),
    stroke: darkMode ? '#555' : '#ccc',
    strokeWidth: 1,
    selectable: interactive,
    evented: interactive,
    hasControls: interactive,
    hasBorders: interactive,
    data: {
      id: section.id,
      type: 'section',
      sectionType: section.sectionType
    }
  });
  
  canvas.add(rect);
  
  return rect;
}

/**
 * Converts a Fabric.js canvas to a data URI
 */
export function canvasToDataURI(canvas: fabric.Canvas, format: string = 'png', quality: number = 1): string {
  return canvas.toDataURL({
    format: format as 'png' | 'jpeg' | 'svg',
    quality: quality
  });
}
