
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
  options: SectionRenderingOptions
): fabric.Object | null {
  if (!canvas || !section) return null;
  
  // Use default options or provided values
  const {
    width = 200,
    height = 100,
    darkMode = false,
    showGrid = false,
    gridSize = 10,
    responsive = false,
    deviceType = 'desktop',
    interactive = true,
    showBorders = true
  } = options;
  
  // Basic rendering - expand as needed
  const rect = new fabric.Rect({
    left: section.position?.x || 50,
    top: section.position?.y || 50,
    width: section.dimensions?.width || width,
    height: section.dimensions?.height || height,
    fill: section.backgroundColor || (darkMode ? '#333' : '#eee'),
    stroke: showBorders ? (darkMode ? '#555' : '#ccc') : 'transparent',
    strokeWidth: showBorders ? 1 : 0,
    strokeDashArray: [5, 5],
    selectable: interactive,
    evented: interactive,
    hasControls: interactive,
    hasBorders: interactive,
    data: {
      id: section.id,
      type: 'section',
      sectionType: section.sectionType,
      name: section.name || 'Section'
    }
  });
  
  canvas.add(rect);
  
  // Add a label for the section
  if (section.name) {
    const label = new fabric.Text(section.name, {
      left: (section.position?.x || 50) + 10,
      top: (section.position?.y || 50) + 10,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: darkMode ? '#ddd' : '#333',
      selectable: false,
      evented: interactive,
    });
    
    canvas.add(label);
    
    // Group the label with the section (optional)
    const group = new fabric.Group([rect, label], {
      left: section.position?.x || 50,
      top: section.position?.y || 50,
      selectable: interactive,
      evented: interactive,
      hasControls: interactive,
      hasBorders: interactive,
      data: {
        id: section.id,
        type: 'section',
        sectionType: section.sectionType,
        name: section.name || 'Section'
      }
    });
    
    canvas.remove(rect);
    canvas.remove(label);
    canvas.add(group);
    
    return group;
  }
  
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

/**
 * Creates a grid visual overlay on a section
 */
export function addGridToSection(
  canvas: fabric.Canvas,
  section: fabric.Object,
  gridSize: number = 10,
  gridType: 'lines' | 'dots' | 'columns' = 'lines'
): void {
  if (!canvas || !section) return;
  
  // Get section bounds
  const left = section.left || 0;
  const top = section.top || 0;
  const width = (section.width || 0) * (section.scaleX || 1);
  const height = (section.height || 0) * (section.scaleY || 1);
  
  // Create grid lines
  const gridLines: fabric.Object[] = [];
  
  // Using a group to contain all grid elements
  const gridGroup = new fabric.Group([], {
    left,
    top,
    width,
    height,
    selectable: false,
    evented: false,
    data: {
      type: 'sectionGrid',
      sectionId: section.data?.id
    }
  });
  
  if (gridType === 'lines' || gridType === 'dots') {
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      if (gridType === 'lines') {
        const line = new fabric.Line([0, y, width, y], {
          stroke: 'rgba(200, 200, 200, 0.5)',
          selectable: false,
          evented: false,
          strokeWidth: 0.5,
          left: 0,
          top: 0
        });
        gridLines.push(line);
      } else {
        // Dots at intersections
        for (let x = 0; x <= width; x += gridSize) {
          const dot = new fabric.Circle({
            left: x,
            top: y,
            radius: 1,
            fill: 'rgba(200, 200, 200, 0.8)',
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center'
          });
          gridLines.push(dot);
        }
      }
    }
    
    // Vertical lines (only for line grid)
    if (gridType === 'lines') {
      for (let x = 0; x <= width; x += gridSize) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: 'rgba(200, 200, 200, 0.5)',
          selectable: false,
          evented: false,
          strokeWidth: 0.5,
          left: 0,
          top: 0
        });
        gridLines.push(line);
      }
    }
  } else if (gridType === 'columns') {
    // Column grid
    const columns = 12;
    const gutterWidth = 10;
    const contentWidth = width - (gutterWidth * (columns - 1));
    const columnWidth = contentWidth / columns;
    
    let currentX = 0;
    for (let i = 0; i < columns; i++) {
      // Column
      const column = new fabric.Rect({
        left: currentX,
        top: 0,
        width: columnWidth,
        height,
        fill: 'rgba(200, 200, 255, 0.1)',
        selectable: false,
        evented: false,
        stroke: 'rgba(180, 180, 200, 0.5)',
        strokeWidth: 0.5,
        strokeDashArray: [2, 2]
      });
      gridLines.push(column);
      
      currentX += columnWidth + gutterWidth;
    }
  }
  
  // Add lines to group
  gridGroup.addWithUpdate(gridLines);
  
  // Add to canvas
  canvas.add(gridGroup);
  gridGroup.moveToFront();
}
