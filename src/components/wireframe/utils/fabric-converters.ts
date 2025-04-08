
import { WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

/**
 * Convert a wireframe section to a Fabric.js compatible object
 */
export function componentToFabricObject(
  section: WireframeSection,
  options?: {
    scale?: number;
    deviceType?: 'desktop' | 'tablet' | 'mobile';
    interactive?: boolean;
  }
) {
  const { scale = 1, deviceType = 'desktop', interactive = true } = options || {};
  
  // Default position if not provided
  const position = section.position || { x: 0, y: 0 };
  
  // Default dimensions based on section type or fallback
  const dimensions = section.dimensions || {
    width: 300,
    height: 200
  };
  
  // Scale dimensions based on device type
  const scaledDimensions = {
    width: dimensions.width * scale,
    height: dimensions.height * scale
  };
  
  // Basic Fabric object structure - return as a Record type for better compatibility
  return {
    type: 'wireframe-section',
    originX: 'left',
    originY: 'top',
    left: position.x * scale,
    top: position.y * scale,
    width: scaledDimensions.width,
    height: scaledDimensions.height,
    fill: '#f0f0f0',
    stroke: '#cccccc',
    strokeWidth: 1,
    selectable: interactive,
    hasControls: interactive,
    hasBorders: interactive,
    data: {
      id: section.id,
      sectionType: section.sectionType,
      name: section.name,
      componentVariant: section.componentVariant,
      deviceType
    }
  } as Record<string, any>; // Cast to Record<string, any> to make it compatible with fabric.js
}

/**
 * Convert a wireframe component to a Fabric.js compatible object
 */
export function wireframeComponentToFabric(
  component: WireframeComponent,
  options?: {
    parentLeft?: number;
    parentTop?: number;
    scale?: number;
    interactive?: boolean;
  }
) {
  const { parentLeft = 0, parentTop = 0, scale = 1, interactive = true } = options || {};
  
  // Basic component representation - return as a Record type for better compatibility
  return {
    type: 'wireframe-component',
    left: parentLeft + 10,
    top: parentTop + 10,
    width: 100 * scale,
    height: 50 * scale,
    fill: '#ffffff',
    stroke: '#dddddd',
    strokeWidth: 1,
    selectable: interactive,
    hasControls: interactive,
    hasBorders: interactive,
    data: {
      id: component.id,
      type: component.type,
      content: component.content
    }
  } as Record<string, any>; // Cast to Record<string, any> to make it compatible with fabric.js
}

/**
 * Create a wireframe canvas from sections
 */
export function createWireframeCanvas(
  sections: WireframeSection[],
  options?: {
    width?: number;
    height?: number;
    deviceType?: 'desktop' | 'tablet' | 'mobile';
    interactive?: boolean;
  }
) {
  const { width = 1200, height = 800, deviceType = 'desktop', interactive = true } = options || {};
  
  // Canvas configuration
  const canvasConfig = {
    width,
    height,
    backgroundColor: '#f9f9f9'
  };
  
  // Convert sections to fabric objects
  const fabricObjects = sections.map(section => 
    componentToFabricObject(section, { deviceType, interactive })
  );
  
  return {
    canvas: canvasConfig,
    objects: fabricObjects
  };
}

/**
 * Export wireframe canvas to SVG or image format
 */
export function exportWireframeToSVG(fabricCanvas: any): string {
  // Mock implementation
  return '<svg width="1200" height="800"><rect x="0" y="0" width="100%" height="100%" fill="#f9f9f9" /></svg>';
}
