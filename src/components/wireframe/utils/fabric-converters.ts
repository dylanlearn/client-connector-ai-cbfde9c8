
import { fabric } from 'fabric';
import { WireframeSection } from '@/types/wireframe';
import { AdaptiveWireframeSection } from './section-types';

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
