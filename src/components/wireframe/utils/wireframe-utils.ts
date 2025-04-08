
import { v4 as uuidv4 } from 'uuid';

/**
 * Normalize wireframe data structure for the visualizers
 */
export function normalizeWireframeData(data: any) {
  if (!data) return null;
  
  // Ensure basic wireframe structure
  const wireframeData = {
    id: data.id || uuidv4(),
    title: data.title || 'Untitled Wireframe',
    description: data.description || '',
    sections: Array.isArray(data.sections) ? data.sections : [],
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    // Retain any other properties
    ...data
  };
  
  // Ensure each section has required properties
  wireframeData.sections = wireframeData.sections.map((section: any, index: number) => ({
    id: section.id || `section-${index}-${uuidv4().substring(0, 8)}`,
    name: section.name || `Section ${index + 1}`,
    description: section.description || '',
    sectionType: section.sectionType || 'generic',
    componentVariant: section.componentVariant || undefined,
    // Ensure other properties
    ...section
  }));
  
  return wireframeData;
}

/**
 * Convert wireframe data to simpler format for export/serialization
 */
export function serializeWireframeData(wireframe: any) {
  if (!wireframe) return null;
  
  return {
    id: wireframe.id,
    title: wireframe.title,
    description: wireframe.description,
    sections: wireframe.sections?.map((section: any) => ({
      id: section.id,
      name: section.name,
      description: section.description,
      sectionType: section.sectionType,
      componentVariant: section.componentVariant,
      components: section.components || [],
      styleProperties: section.styleProperties || {}
    })) || [],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Create a basic wireframe for new projects
 */
export function createEmptyWireframe() {
  return {
    id: uuidv4(),
    title: 'New Wireframe',
    description: 'Start adding sections to your wireframe',
    sections: [],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Add a new section to wireframe data
 */
export function addSectionToWireframe(wireframe: any, section: any) {
  if (!wireframe) return null;
  
  const normalizedSection = {
    id: section.id || uuidv4(),
    name: section.name || 'New Section',
    sectionType: section.sectionType || 'generic',
    description: section.description || '',
    ...section
  };
  
  return {
    ...wireframe,
    sections: [...(wireframe.sections || []), normalizedSection],
    lastUpdated: new Date().toISOString()
  };
}
