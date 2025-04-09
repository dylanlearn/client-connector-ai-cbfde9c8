
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
    }) : undefined
  });
  
  // Add more object types and property assignments as needed
  
  return fabricObject;
}

/**
 * Converts a component definition to a Fabric.js object
 */
export function componentToFabricObject(component: Record<string, any>): fabric.Object {
  const { type, position, dimensions, style, content } = component;
  
  // Default position and dimensions
  const left = position?.x || 0;
  const top = position?.y || 0;
  const width = dimensions?.width || 100;
  const height = dimensions?.height || 50;
  
  // Create different types of objects based on component type
  switch (type) {
    case 'text':
      return new fabric.Text(content || 'Text', {
        left,
        top,
        fontSize: style?.fontSize || 16,
        fontFamily: style?.fontFamily || 'Arial',
        fill: style?.color || '#000000',
        width,
        data: {
          componentType: 'text',
          id: component.id
        }
      });
      
    case 'button':
      const buttonRect = new fabric.Rect({
        left,
        top,
        width,
        height,
        fill: style?.backgroundColor || '#4285f4',
        rx: 4,
        ry: 4,
        stroke: style?.borderColor || 'transparent',
        strokeWidth: style?.borderWidth || 0,
      });
      
      const buttonText = new fabric.Text(content || 'Button', {
        left: left + width / 2,
        top: top + height / 2,
        fontSize: style?.fontSize || 14,
        fontFamily: style?.fontFamily || 'Arial',
        fill: style?.color || '#ffffff',
        originX: 'center',
        originY: 'center'
      });
      
      return new fabric.Group([buttonRect, buttonText], {
        data: {
          componentType: 'button',
          id: component.id
        }
      });
      
    case 'image':
      return new fabric.Rect({
        left,
        top,
        width,
        height,
        fill: '#f0f0f0',
        stroke: '#dddddd',
        strokeWidth: 1,
        rx: 0,
        ry: 0,
        data: {
          componentType: 'image',
          id: component.id
        }
      });
      
    default:
      return new fabric.Rect({
        left,
        top,
        width,
        height,
        fill: style?.backgroundColor || '#f5f5f5',
        stroke: style?.borderColor || '#dddddd',
        strokeWidth: style?.borderWidth || 1,
        data: {
          componentType: type || 'generic',
          id: component.id
        }
      });
  }
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
    interactive = true,
    showBorders = true
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
