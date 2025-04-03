
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DesignMemoryEntry {
  id?: string;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  visual_elements: Record<string, any>;
  color_scheme?: Record<string, any>;
  typography?: Record<string, any>;
  layout_pattern?: Record<string, any>;
  tags: string[];
  source_url?: string;
  image_url?: string;
  relevance_score?: number;
}

export interface DesignMemoryQueryOptions {
  category?: string;
  subcategory?: string;
  tags?: string[];
  searchTerm?: string;
  limit?: number;
  relevanceThreshold?: number;
}

/**
 * Service for managing design memory entries
 */
export const DesignMemoryService = {
  /**
   * Store a new design pattern or example in the memory database
   */
  storeDesignMemory: async (entry: DesignMemoryEntry): Promise<DesignMemoryEntry | null> => {
    try {
      const { data, error } = await supabase
        .from('design_memory')
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
        })
        .select()
        .single();

      if (error) {
        console.error("Error storing design memory:", error);
        toast.error("Failed to store design pattern");
        return null;
      }
      
      return data as DesignMemoryEntry;
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
      
      let query = supabase
        .from('design_memory')
        .select('*')
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
      
      return data as DesignMemoryEntry[];
    } catch (error) {
      console.error("Error querying design memory:", error);
      return [];
    }
  },

  /**
   * Record user feedback about design suggestions
   */
  recordFeedback: async (
    userId: string,
    designSuggestionId: string,
    feedbackType: 'like' | 'dislike' | 'comment',
    feedbackContent?: string,
    rating?: number,
    context: Record<string, any> = {}
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('design_feedback').insert({
        user_id: userId,
        design_suggestion_id: designSuggestionId,
        feedback_type: feedbackType,
        feedback_content: feedbackContent,
        rating,
        context
      });

      if (error) {
        console.error("Error recording design feedback:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error recording design feedback:", error);
      return false;
    }
  },

  /**
   * Store a design suggestion in history
   */
  storeDesignSuggestion: async (
    userId: string,
    prompt: string,
    result: Record<string, any>,
    usedReferences: string[] = [],
    context: Record<string, any> = {}
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('design_suggestion_history')
        .insert({
          user_id: userId,
          prompt,
          result,
          used_references: usedReferences,
          context
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error storing design suggestion:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error storing design suggestion:", error);
      return null;
    }
  },

  /**
   * Rate a stored design suggestion
   */
  rateDesignSuggestion: async (id: string, rating: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('design_suggestion_history')
        .update({ rating })
        .eq('id', id);

      if (error) {
        console.error("Error rating design suggestion:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error rating design suggestion:", error);
      return false;
    }
  }
};
