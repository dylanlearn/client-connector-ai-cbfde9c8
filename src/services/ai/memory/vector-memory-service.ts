
import { supabase } from '@/integrations/supabase/client';
import { VectorSearchResult } from '@/types/ai-memory';

interface SearchOptions {
  threshold?: number;
  limit?: number;
  memoryType?: string;
  categoryFilter?: string[];
}

/**
 * Service for interacting with vector embeddings for memory
 */
export const VectorMemoryService = {
  /**
   * Store a new embedding
   */
  storeEmbedding: async (
    memoryId: string,
    memoryType: 'user' | 'project' | 'global',
    content: string,
    tags: string[] = [],
    metadata: Record<string, any> = {}
  ) => {
    try {
      // Generate embedding on the Supabase edge function
      const { data, error } = await supabase.functions.invoke('generate-embedding', {
        body: { text: content }
      });

      if (error) throw error;
      
      const embedding = data.embedding;
      
      // Store in memory_embeddings table
      const { error: insertError } = await supabase
        .from('memory_embeddings')
        .insert({
          memory_id: memoryId,
          content: content,
          memory_type: memoryType,
          metadata: metadata,
          embedding: embedding
        });

      if (insertError) throw insertError;
      
      return true;
    } catch (error) {
      console.error("Error storing embedding:", error);
      return false;
    }
  },

  /**
   * Search for semantically similar memories
   */
  semanticSearch: async (
    query: string,
    options: SearchOptions = {}
  ): Promise<VectorSearchResult[]> => {
    try {
      // Set default options
      const threshold = options.threshold || 0.7;
      const limit = options.limit || 10;
      
      // Generate embedding for the query
      const { data, error } = await supabase.functions.invoke('generate-embedding', {
        body: { text: query }
      });

      if (error) throw error;
      
      const embedding = data.embedding;
      
      // Build query object for similarity search
      let queryBuilder = supabase
        .rpc('match_memories', {
          query_embedding: embedding,
          match_threshold: threshold,
          match_count: limit
        });
      
      // Add memory type filter if specified
      if (options.memoryType) {
        queryBuilder = queryBuilder.eq('memory_type', options.memoryType);
      }
      
      // Add category filter if specified
      if (options.categoryFilter && options.categoryFilter.length > 0) {
        // This assumes metadata->>'category' exists in the JSON
        queryBuilder = queryBuilder.in('metadata->>category', options.categoryFilter);
      }
      
      // Execute the query
      const { data: results, error: searchError } = await queryBuilder;
      
      if (searchError) throw searchError;
      
      return results as VectorSearchResult[];
    } catch (error) {
      console.error("Error in vector semantic search:", error);
      return [];
    }
  },

  /**
   * Get memory system statistics
   */
  getMemorySystemStats: async () => {
    try {
      const { data, error } = await supabase
        .from('memory_system_stats')
        .select('*');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching memory system stats:", error);
      return [];
    }
  }
};
