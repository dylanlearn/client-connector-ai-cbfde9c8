
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DesignMemoryEntry, DesignMemoryQueryOptions, mapToDesignMemoryEntry } from "../types/design-memory-types";

/**
 * Service for storing and retrieving design memory entries
 */
export const DesignEntryService = {
  /**
   * Store a new design pattern or example in the memory database
   */
  storeDesignMemory: async (entry: DesignMemoryEntry): Promise<DesignMemoryEntry | null> => {
    try {
      // Cast the table name to any to bypass TypeScript's table name checking
      const { data, error } = await (supabase
        .from('design_memory' as any)
        .insert({
          category: entry.category,
          subcategory: entry.subcategory,
          title: entry.title,
          description: entry.description,
          visual_elements: entry.visual_elements,
          color_scheme: entry.color_scheme,
          typography: entry.typography,
          layout_pattern: entry.layout_pattern,
          tags: entry.tags,
          source_url: entry.source_url,
          image_url: entry.image_url,
          relevance_score: entry.relevance_score || 0.7
        } as any)
        .select() as any)
        .single();

      if (error) {
        console.error("Error storing design memory:", error);
        toast.error("Failed to store design pattern");
        return null;
      }
      
      return mapToDesignMemoryEntry(data);
    } catch (error) {
      console.error("Error storing design memory:", error);
      return null;
    }
  },

  /**
   * Query the design memory database based on various criteria
   */
  queryDesignMemory: async (options: DesignMemoryQueryOptions = {}): Promise<DesignMemoryEntry[]> => {
    try {
      const {
        category,
        subcategory,
        tags,
        searchTerm,
        limit = 20,
        relevanceThreshold = 0.5
      } = options;
      
      // Cast the table name to any to bypass TypeScript's table name checking
      let query = (supabase
        .from('design_memory' as any)
        .select('*') as any)
        .gte('relevance_score', relevanceThreshold);

      // Apply filters based on options
      if (category) {
        query = query.eq('category', category);
      }

      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      }

      if (tags && tags.length > 0) {
        // For each tag, check if it's contained in the tags array
        tags.forEach(tag => {
          query = query.contains('tags', [tag]);
        });
      }

      if (searchTerm) {
        // Search in title and description
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Order by relevance score and limit results
      query = query.order('relevance_score', { ascending: false }).limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error("Error querying design memory:", error);
        toast.error("Failed to retrieve design patterns");
        return [];
      }
      
      return data.map(entry => mapToDesignMemoryEntry(entry));
    } catch (error) {
      console.error("Error querying design memory:", error);
      return [];
    }
  }
};
