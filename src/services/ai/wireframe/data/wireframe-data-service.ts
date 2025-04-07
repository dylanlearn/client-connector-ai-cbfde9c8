
import { AIWireframe, WireframeData, WireframeSection } from '../wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for wireframe data transformation and processing
 */
export const WireframeDataService = {
  /**
   * Standardize a wireframe record by ensuring all necessary fields
   */
  standardizeWireframeRecord: (wireframe: AIWireframe): AIWireframe => {
    // Ensure a standardized data structure for all wireframes
    let wireframeData: WireframeData | undefined;
    
    // Access data from various possible locations in the object
    if (wireframe.data) {
      wireframeData = wireframe.data;
    } else if (wireframe.wireframe_data) {
      wireframeData = wireframe.wireframe_data;
    } else {
      // Create minimal wireframe data structure if none exists
      wireframeData = {
        title: wireframe.title || 'Untitled Wireframe',
        description: wireframe.description || '',
        sections: wireframe.sections || [],
        layoutType: 'standard'
      };
    }

    // Ensure all sections have IDs
    if (wireframeData.sections) {
      wireframeData.sections = wireframeData.sections.map(section => {
        return {
          ...section,
          id: section.id || uuidv4()
        };
      });
    }

    // Return standardized record
    return {
      ...wireframe,
      data: wireframeData
    };
  },

  /**
   * Get the title of a wireframe, with fallbacks
   */
  getWireframeTitle: (wireframe: AIWireframe): string => {
    // Try to get title from different possible locations
    if (wireframe.data && wireframe.data.title) {
      return wireframe.data.title;
    }
    
    if (wireframe.wireframe_data && wireframe.wireframe_data.title) {
      return wireframe.wireframe_data.title;
    }
    
    return wireframe.title || 'Untitled Wireframe';
  },

  /**
   * Ensure section has required properties
   */
  ensureValidSection: (section: Partial<WireframeSection>): WireframeSection => {
    return {
      id: section.id || uuidv4(),
      name: section.name || 'Unnamed Section',
      sectionType: section.sectionType || 'generic',
      layoutType: section.layoutType || 'standard',
      description: section.description || '',
      components: section.components || [],
      // Copy over any other properties that might exist
      ...section
    };
  }
};
