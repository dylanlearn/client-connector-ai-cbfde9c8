
import { fabric } from 'fabric';
import { WireframeSection } from '@/types/wireframe';
import { AdaptiveWireframeSection } from './section-types';
import { DeviceType } from './responsive-utils';
import { SectionRenderingOptions } from './types';

/**
 * Convert a WireframeSection to a Fabric.js object
 */
export function sectionToFabricObject(section: WireframeSection): fabric.Object {
  // Create a basic rectangle representing the section
  const rect = new fabric.Rect({
    left: section.position?.x || 0,
    top: section.position?.y || 0,
    width: section.dimensions?.width || 200,
    height: section.dimensions?.height || 100,
    fill: 'rgba(200, 200, 200, 0.3)',
    stroke: '#666',
    strokeWidth: 1,
    rx: 5,
    ry: 5,
    hasControls: true,
    lockRotation: true,
    transparentCorners: false,
    cornerColor: '#0080ff',
    cornerStyle: 'circle',
    cornerSize: 10,
    data: section
  });

  // Add text label for the section
  const text = new fabric.Text(section.name || 'Section', {
    left: (section.position?.x || 0) + 10,
    top: (section.position?.y || 0) + 10,
    fontSize: 14,
    fill: '#333',
    selectable: false
  });
  
  // Group the rectangle and text
  return new fabric.Group([rect, text], {
    hasControls: true,
    lockRotation: true,
    transparentCorners: false,
    cornerColor: '#0080ff',
    cornerStyle: 'circle',
    cornerSize: 10,
    data: section
  });
}

/**
 * Convert a Fabric.js object to a WireframeSection
 */
export function fabricObjectToSection(obj: fabric.Object): AdaptiveWireframeSection {
  // Get the existing section data if available
  const existingData = obj.data as AdaptiveWireframeSection || {};
  
  // Update position and dimensions
  return {
    ...existingData,
    id: existingData.id || `section-${Date.now()}`,
    name: existingData.name || 'Unnamed Section',
    sectionType: existingData.sectionType || 'generic',
    position: {
      x: obj.left || 0,
      y: obj.top || 0
    },
    dimensions: {
      width: obj.width || 200,
      height: obj.height || 100
    }
  };
}

/**
 * Convert a component to a Fabric.js object with rendering options
 */
export function componentToFabricObject(
  component: WireframeSection | any, 
  options?: SectionRenderingOptions
): fabric.Object {
  // Default rendering options
  const { deviceType = 'desktop', interactive = true } = options || {};
  
  // Base position and dimensions
  const left = component.position?.x || 0;
  const top = component.position?.y || 0;
  const width = component.dimensions?.width || 200;
  const height = component.dimensions?.height || 100;
  
  // Create the main component rectangle
  const rect = new fabric.Rect({
    left,
    top,
    width,
    height,
    fill: component.backgroundColor || 'rgba(240, 240, 240, 0.5)',
    stroke: '#888',
    strokeWidth: 1,
    rx: 5,
    ry: 5,
    hasControls: interactive,
    selectable: interactive,
    lockRotation: true,
    data: {
      id: component.id,
      type: 'component',
      componentType: component.sectionType
    }
  });
  
  // Create component label
  const label = new fabric.Text(component.name || 'Component', {
    left: left + 10,
    top: top + 10,
    fontSize: 14,
    fill: '#333',
    selectable: false
  });
  
  // Group the elements
  const group = new fabric.Group([rect, label], {
    hasControls: interactive,
    selectable: interactive,
    data: {
      id: component.id,
      type: 'component',
      componentType: component.sectionType
    }
  });
  
  return group;
}
