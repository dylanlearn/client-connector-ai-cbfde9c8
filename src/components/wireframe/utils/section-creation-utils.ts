
import { AdaptiveWireframeSection } from './section-types';

/**
 * Clone a section with a new ID
 */
export function cloneSection(section: AdaptiveWireframeSection): AdaptiveWireframeSection {
  return {
    ...section,
    id: `${section.id}_clone_${Date.now()}`,
    name: `${section.name} (Copy)`
  };
}

/**
 * Create an empty section
 */
export function createEmptySection(type: string, name?: string): AdaptiveWireframeSection {
  return {
    id: `section_${Date.now()}`,
    name: name || `New ${type} Section`,
    sectionType: type,
    position: {
      x: 0,
      y: 0
    },
    dimensions: {
      width: 800,
      height: 200
    },
    components: []
  };
}

/**
 * Create a grid section
 */
export function createGridSection(columns: number): AdaptiveWireframeSection {
  return {
    id: `grid_section_${Date.now()}`,
    name: `${columns}-Column Grid`,
    sectionType: 'grid',
    layout: {
      type: 'grid',
      columns: columns,
      gap: 16
    },
    position: {
      x: 0,
      y: 0
    },
    dimensions: {
      width: 800,
      height: 400
    },
    components: []
  };
}
