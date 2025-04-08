
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
      // Add layout intelligence properties
      layoutScore: section?.layoutScore || null,
      optimizationSuggestions: section?.optimizationSuggestions || [],
      patternMatch: section?.patternMatch || null,
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

/**
 * Analyzes wireframe sections for layout patterns and optimization opportunities
 * Enhances sections with layout intelligence insights
 */
export const enhanceSectionsWithLayoutIntelligence = async (
  sections: WireframeSection[] = [],
  patternDetection: boolean = false
): Promise<any[]> => {
  try {
    // First adapt the sections normally
    const adaptedSections = adaptSectionsForVisualizer(sections);
    
    if (!patternDetection) {
      return adaptedSections;
    }
    
    // Import dynamically to prevent circular dependencies
    const { EnhancedLayoutIntelligenceService } = await import('@/services/ai/wireframe/layout-intelligence-enhanced');
    
    // Create a mock wireframe for analysis
    const mockWireframe = {
      id: 'temp-analysis',
      sections: sections,
      title: 'Layout Analysis',
      description: 'Temporary wireframe for layout analysis'
    };
    
    // Get layout analysis
    const layoutAnalysis = await EnhancedLayoutIntelligenceService.analyzeLayout(mockWireframe);
    
    // Enhance sections with layout intelligence
    return adaptedSections.map(section => {
      const sectionSuggestions = layoutAnalysis.suggestions
        .filter(s => s.sectionId === section.id);
      
      return {
        ...section,
        layoutScore: sectionSuggestions.length > 0 
          ? Math.max(...sectionSuggestions.map(s => s.confidence))
          : null,
        optimizationSuggestions: sectionSuggestions.map(s => ({
          text: s.improvement,
          confidence: s.confidence,
          conversionImpact: s.conversionImpact,
          rationale: s.rationale
        })),
        detectedPatterns: layoutAnalysis.patterns.detected
          .filter(pattern => sections.some(s => 
            s.id === section.id && 
            s.components?.some(c => 
              c.type?.toLowerCase().includes(pattern.toLowerCase()) ||
              c.content?.toLowerCase().includes(pattern.toLowerCase())
            )
          ))
      };
    });
  } catch (err) {
    console.error('Error enhancing sections with layout intelligence:', err);
    return adaptSectionsForVisualizer(sections); // Fall back to regular adaptation
  }
};
