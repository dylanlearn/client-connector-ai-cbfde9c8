
import { fabric } from 'fabric';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { FabricConverterOptions } from '../types';

/**
 * Convert a wireframe section to a Fabric.js object
 */
export function sectionToFabricObject(
  section: WireframeSection,
  options: FabricConverterOptions = {}
): fabric.Object {
  const {
    enableEditing = false,
    showLabels = true,
    fitToCanvas = false,
    mode = 'preview'
  } = options;
  
  // Create a group to represent the section
  const group = new fabric.Group([], {
    id: section.id,
    objectType: 'wireframe-section',
    sectionType: section.sectionType,
    hasControls: enableEditing,
    hasBorders: enableEditing,
    selectable: enableEditing,
    lockMovementX: !enableEditing,
    lockMovementY: !enableEditing,
  });

  // Add styling based on section's style properties
  if (section.styleProperties) {
    group.set('backgroundColor', section.styleProperties.backgroundStyle === 'dark' ? '#333333' : '#ffffff');
  }

  // Set position
  if (section.position) {
    group.set('left', section.position.x);
    group.set('top', section.position.y);
  }

  // Add a rect to represent the section background
  const background = new fabric.Rect({
    fill: section.styleProperties?.backgroundStyle === 'dark' ? '#333333' : '#f8f8f8',
    width: section.dimensions?.width || 400,
    height: section.dimensions?.height || 200,
    rx: 4,
    ry: 4,
    stroke: '#e0e0e0',
    strokeWidth: 1,
  });

  // Add the background to the group
  group.addWithUpdate(background);

  // Add section name label if showLabels is true
  if (showLabels) {
    const label = new fabric.Text(section.name, {
      fontSize: 14,
      fill: section.styleProperties?.backgroundStyle === 'dark' ? '#ffffff' : '#333333',
      left: 10,
      top: 10,
    });
    
    group.addWithUpdate(label);
  }

  // Add section type label
  const typeLabel = new fabric.Text(section.sectionType, {
    fontSize: 12,
    fill: '#666666',
    left: 10,
    top: 30,
  });
  
  group.addWithUpdate(typeLabel);
  
  return group;
}

/**
 * Convert a fabric object back to section data
 */
export function fabricObjectToSection(
  fabricObj: fabric.Object
): Partial<WireframeSection> {
  if (!fabricObj) return {};
  
  // Get properties from fabric object
  const props = fabricObj as fabric.Object & {
    id?: string;
    objectType?: string;
    sectionType?: string;
  };
  
  // Build section properties
  const section: Partial<WireframeSection> = {
    id: props.id || '',
    sectionType: props.sectionType || '',
    position: {
      x: fabricObj.left || 0,
      y: fabricObj.top || 0,
    },
    dimensions: {
      width: fabricObj.width || 0,
      height: fabricObj.height || 0,
    },
  };
  
  return section;
}

/**
 * Create a fabric canvas representation of an entire wireframe
 */
export function wireframeToFabricCanvas(
  sections: WireframeSection[],
  canvas: fabric.Canvas,
  options: FabricConverterOptions = {}
): void {
  // Clear the canvas
  canvas.clear();
  
  // Add each section to the canvas
  sections.forEach((section, index) => {
    const fabricSection = sectionToFabricObject(section, options);
    
    // If not positioned, stack sections vertically
    if (!section.position) {
      fabricSection.set('top', index * (section.dimensions?.height || 200) + (index * 20));
      fabricSection.set('left', 20);
    }
    
    canvas.add(fabricSection);
  });
  
  // Fit content to canvas if needed
  if (options.fitToCanvas) {
    canvas.zoomToFit();
  }
}

/**
 * Convert a component to a fabric object
 * This is needed by WireframeCanvasEngine.tsx
 */
export function componentToFabricObject(
  section: WireframeSection,
  index: number,
  deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop'
): fabric.Object {
  // Create a group to represent the component
  const group = new fabric.Group([], {
    id: section.id,
    objectType: 'wireframe-section',
    sectionType: section.sectionType,
    hasControls: true,
    hasBorders: true,
    selectable: true,
  });

  // Default dimensions based on device type
  let defaultWidth = 800;
  let defaultHeight = 200;
  
  switch (deviceType) {
    case 'mobile':
      defaultWidth = 350;
      break;
    case 'tablet':
      defaultWidth = 600;
      break;
    case 'desktop':
    default:
      defaultWidth = 800;
      break;
  }

  // Background color based on style properties or use a default
  const backgroundColor = section.styleProperties?.backgroundStyle === 'dark' 
    ? '#333333' 
    : section.styleProperties?.backgroundStyle === 'accent'
      ? '#f0f9ff'
      : '#f8f8f8';

  // Create the background rectangle
  const background = new fabric.Rect({
    fill: backgroundColor,
    width: section.dimensions?.width || defaultWidth,
    height: section.dimensions?.height || defaultHeight,
    rx: 4,
    ry: 4,
    stroke: '#e0e0e0',
    strokeWidth: 1,
  });
  
  // Add the background to the group
  group.addWithUpdate(background);
  
  // Add section name as a text object
  const title = new fabric.Text(section.name || 'Section', {
    fontSize: deviceType === 'mobile' ? 14 : 18,
    fontWeight: 'bold',
    fill: section.styleProperties?.backgroundStyle === 'dark' ? '#ffffff' : '#333333',
    left: 15,
    top: 15,
  });
  
  group.addWithUpdate(title);
  
  // Add section type as a smaller text
  const typeLabel = new fabric.Text(section.sectionType || 'Unknown Type', {
    fontSize: deviceType === 'mobile' ? 10 : 12,
    fill: '#666666',
    left: 15,
    top: title.height || 20 + 20,
  });
  
  group.addWithUpdate(typeLabel);
  
  // If the section has description, add it
  if (section.description) {
    const description = new fabric.Text(
      section.description.length > 50 
        ? section.description.substring(0, 50) + '...' 
        : section.description, 
      {
        fontSize: deviceType === 'mobile' ? 10 : 12,
        fill: section.styleProperties?.backgroundStyle === 'dark' ? '#cccccc' : '#666666',
        left: 15,
        top: (title.height || 20) + (typeLabel.height || 15) + 25,
      }
    );
    
    group.addWithUpdate(description);
  }
  
  // If not positioned, stack sections vertically
  if (!section.position) {
    group.set('top', index * (section.dimensions?.height || defaultHeight) + (index * 20));
    group.set('left', 20);
  } else {
    group.set('top', section.position.y);
    group.set('left', section.position.x);
  }
  
  return group;
}
