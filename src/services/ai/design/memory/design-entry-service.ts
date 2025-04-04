
import { supabase } from "@/integrations/supabase/client";
import { DesignMemoryEntry, DesignMemoryQueryOptions } from '../types/design-memory-types';

/**
 * Service for managing design memory entries in the database
 */
export const DesignEntryService = {
  /**
   * Store a design pattern or reference in the memory database
   */
  storeDesignMemory: async (entry: DesignMemoryEntry): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('design_memory')
        .insert({
          category: entry.category,
          subcategory: entry.subcategory,
          title: entry.title,
          description: entry.description,
          tags: entry.tags,
          source_url: entry.source_url,
          image_url: entry.image_url,
          visual_elements: entry.visual_elements,
          color_scheme: entry.color_scheme,
          typography: entry.typography,
          layout_pattern: entry.layout_pattern,
          relevance_score: entry.relevance_score || 0.7
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error storing design memory:', error);
      return false;
    }
  },

  /**
   * Query the design memory database based on various criteria
   */
  queryDesignMemory: async (options: DesignMemoryQueryOptions = {}): Promise<DesignMemoryEntry[]> => {
    try {
      let query = supabase
        .from('design_memory')
        .select('*');

      // Apply filters if provided
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.subcategory) {
        query = query.eq('subcategory', options.subcategory);
      }

      if (options.tags && options.tags.length > 0) {
        // For each tag, check if it's contained in the tags array
        options.tags.forEach(tag => {
          query = query.contains('tags', [tag]);
        });
      }

      if (options.search_term) {
        query = query.or(`title.ilike.%${options.search_term}%,description.ilike.%${options.search_term}%`);
      }

      // Apply relevance threshold if provided
      if (options.relevance_threshold) {
        query = query.gte('relevance_score', options.relevance_threshold);
      }

      // Apply sorting and limits
      query = query.order('relevance_score', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match the DesignMemoryEntry type
      return (data || []).map(item => ({
        category: item.category,
        subcategory: item.subcategory,
        title: item.title,
        description: item.description,
        tags: item.tags,
        source_url: item.source_url,
        image_url: item.image_url,
        visual_elements: item.visual_elements as DesignMemoryEntry['visual_elements'],
        color_scheme: item.color_scheme as DesignMemoryEntry['color_scheme'],
        typography: item.typography as DesignMemoryEntry['typography'],
        layout_pattern: item.layout_pattern as DesignMemoryEntry['layout_pattern'],
        relevance_score: item.relevance_score
      }));
    } catch (error) {
      console.error('Error querying design memory:', error);
      return [];
    }
  }
};
