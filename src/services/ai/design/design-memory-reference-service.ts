
import { supabase } from "@/integrations/supabase/client";

export type DesignReference = {
  id: string;
  title: string;
  description?: string;
  type: 'wireframe' | 'component' | 'layout' | 'color-scheme';
  screenshot_url?: string;
  metadata: any;
  tags: string[];
  created_at: string;
  user_id?: string;
};

export type DesignReferenceSearchParams = {
  query?: string;
  type?: 'wireframe' | 'component' | 'layout' | 'color-scheme';
  tags?: string[];
  limit?: number;
  user_id?: string;
  similarTo?: string;
};

/**
 * Service for retrieving and managing design memory references
 */
export const DesignMemoryReferenceService = {
  /**
   * Search for design references based on various criteria
   */
  searchReferences: async (params: DesignReferenceSearchParams): Promise<DesignReference[]> => {
    try {
      let query = supabase
        .from('design_references')
        .select('*');
      
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
      }
      
      if (params.type) {
        query = query.eq('type', params.type);
      }
      
      if (params.tags && params.tags.length > 0) {
        // Search for references that contain at least one of the provided tags
        query = query.contains('tags', params.tags);
      }
      
      if (params.user_id) {
        query = query.eq('user_id', params.user_id);
      }
      
      if (params.limit) {
        query = query.limit(params.limit);
      }
      
      // Sort by most recent first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error searching design references:", error);
        return [];
      }
      
      return data as DesignReference[];
    } catch (error) {
      console.error("Error searching design references:", error);
      return [];
    }
  },
  
  /**
   * Store a new design reference
   */
  storeReference: async (
    title: string,
    type: 'wireframe' | 'component' | 'layout' | 'color-scheme',
    metadata: any,
    tags: string[] = [],
    description?: string,
    screenshot_url?: string,
    user_id?: string
  ): Promise<DesignReference | null> => {
    try {
      const { data, error } = await supabase
        .from('design_references')
        .insert({
          title,
          type,
          description,
          screenshot_url,
          metadata,
          tags,
          user_id
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error storing design reference:", error);
        return null;
      }
      
      return data as DesignReference;
    } catch (error) {
      console.error("Error storing design reference:", error);
      return null;
    }
  },
  
  /**
   * Get similar design references
   */
  getSimilarReferences: async (
    referenceId: string,
    limit: number = 5
  ): Promise<DesignReference[]> => {
    try {
      // First get the reference to find its tags
      const { data: reference, error: referenceError } = await supabase
        .from('design_references')
        .select('*')
        .eq('id', referenceId)
        .single();
      
      if (referenceError || !reference) {
        console.error("Error getting reference:", referenceError);
        return [];
      }
      
      // Then find similar references based on tags
      const { data, error } = await supabase
        .from('design_references')
        .select('*')
        .neq('id', referenceId) // Exclude the current reference
        .contains('tags', reference.tags)
        .limit(limit);
      
      if (error) {
        console.error("Error getting similar references:", error);
        return [];
      }
      
      return data as DesignReference[];
    } catch (error) {
      console.error("Error getting similar references:", error);
      return [];
    }
  }
};
