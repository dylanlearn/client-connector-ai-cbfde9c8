
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
    // Add other properties that might be needed by the visualizer
    // but aren't part of the WireframeSection interface
    componentVariant: section.componentVariant,
    data: section.data,
  }));
};

/**
 * Performance-optimized adapter for wireframe sections
 * Uses memoization to avoid unnecessary recalculations
 */
export const adaptSectionsWithMemoization = (() => {
  const cache = new Map();
  
  return (sections: WireframeSection[] = []): any[] => {
    // Create a cache key based on section IDs and modification timestamps if available
    const cacheKey = sections.map(s => `${s.id}-${s.updatedAt || ''}`).join('|');
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    const result = adaptSectionsForVisualizer(sections);
    cache.set(cacheKey, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 50) {
      // Remove the oldest entry
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
})();
