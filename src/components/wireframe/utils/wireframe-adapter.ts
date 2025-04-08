
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Adapts wireframe sections for the visualizer component
 */
export const adaptSectionsForVisualizer = (sections: WireframeSection[] = []): any[] => {
  return sections.map((section, index) => ({
    id: section.id || `section-${index}`,
    name: section.name,
    sectionType: section.sectionType,
    description: section.description || '',
  }));
};
