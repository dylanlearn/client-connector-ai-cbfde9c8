
import { DesignReference, DesignCategory, DesignReferenceQuery } from './types/design-references-types';
import { DesignMemoryService } from './design-memory-service';

/**
 * Service for managing design references
 */
export const DesignReferencesService = {
  /**
   * Store a design reference example in the memory database
   */
  storeDesignReference: async (reference: DesignReference): Promise<boolean> => {
    try {
      // Convert the reference to a memory entry format
      const memoryEntry = {
        title: reference.name,
        category: `reference-${reference.category}`,
        subcategory: reference.category,
        description: reference.description || `${reference.name} - A reference design for ${reference.category} websites`,
        visual_elements: reference.visualElements || {
          layout: 'Not specified',
          color_scheme: 'Not specified',
          typography: 'Not specified',
          spacing: 'Not specified',
          imagery: 'Not specified'
        },
        tags: reference.tags,
        source_url: reference.url,
        relevance_score: 0.9 // High relevance for curated examples
      };

      // Store the reference in the design memory database
      await DesignMemoryService.storeDesignMemory(memoryEntry);
      return true;
    } catch (error) {
      console.error('Error storing design reference:', error);
      return false;
    }
  },

  /**
   * Import a batch of design references
   */
  importDesignReferences: async (references: DesignReference[]): Promise<number> => {
    let successCount = 0;

    for (const reference of references) {
      const success = await DesignReferencesService.storeDesignReference(reference);
      if (success) {
        successCount++;
      }
    }

    return successCount;
  },

  /**
   * Query design references based on criteria
   */
  queryDesignReferences: async (query: DesignReferenceQuery): Promise<DesignReference[]> => {
    // Implement query functionality using the DesignMemoryService
    const memoryOptions = {
      category: query.category ? `reference-${query.category}` : undefined,
      tags: query.tags,
      search_term: query.search,
      limit: query.limit || 20
    };

    const results = await DesignMemoryService.queryDesignMemory(memoryOptions);
    
    // Map the results back to DesignReference format
    return results.map(result => ({
      name: result.title || '',
      description: result.description,
      url: result.source_url,
      category: (result.subcategory as DesignCategory) || 'saas',
      tags: result.tags || [],
      visualElements: {
        layout: result.visual_elements?.layout,
        colorScheme: result.visual_elements?.color_scheme,
        typography: result.visual_elements?.typography,
        spacing: result.visual_elements?.spacing,
        imagery: result.visual_elements?.imagery
      }
    }));
  },

  /**
   * Get design references for a specific website category
   */
  getDesignReferencesForCategory: async (category: DesignCategory, limit: number = 5): Promise<DesignReference[]> => {
    return DesignReferencesService.queryDesignReferences({
      category,
      limit
    });
  }
};
