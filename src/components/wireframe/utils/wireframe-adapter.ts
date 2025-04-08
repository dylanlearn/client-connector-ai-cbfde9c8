
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Adapts wireframe sections for the visualizer component
 * with improved error handling
 */
export const adaptSectionsForVisualizer = (sections: WireframeSection[] = []): any[] => {
  try {
    return sections.map((section, index) => ({
      id: section?.id || `section-${index}`,
      name: section?.name || `Section ${index + 1}`,
      sectionType: section?.sectionType || 'generic',
      description: section?.description || '',
      // Add other properties that might be needed by the visualizer
      componentVariant: section?.componentVariant || 'default',
      data: section?.data || {},
    }));
  } catch (err) {
    console.error('Error adapting sections for visualizer:', err);
    return []; // Return empty array instead of crashing
  }
};

/**
 * Performance-optimized adapter for wireframe sections
 * Uses memoization to avoid unnecessary recalculations
 * with improved error handling and memory management
 */
export const adaptSectionsWithMemoization = (() => {
  const cache = new Map();
  let lastCacheReset = Date.now();
  
  return (sections: WireframeSection[] = []): any[] => {
    try {
      // Reset cache periodically to prevent memory issues
      if (Date.now() - lastCacheReset > 60000) { // Reset every minute
        cache.clear();
        lastCacheReset = Date.now();
      }
      
      // Create a simpler, more stable cache key
      const cacheKey = sections.map(s => s?.id || 'unknown').join('|');
      
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }
      
      const result = adaptSectionsForVisualizer(sections);
      cache.set(cacheKey, result);
      
      // Limit cache size to prevent memory leaks (smaller limit for safety)
      if (cache.size > 30) {
        // Remove the oldest entry
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    } catch (err) {
      console.error('Error in adaptSectionsWithMemoization:', err);
      return adaptSectionsForVisualizer(sections); // Fallback to non-cached version
    }
  };
})();
