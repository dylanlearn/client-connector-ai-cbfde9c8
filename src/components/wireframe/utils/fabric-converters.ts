
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
