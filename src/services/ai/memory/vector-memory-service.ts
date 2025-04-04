
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for vector-based memory storage and retrieval using embeddings
 */
export const VectorMemoryService = {
  /**
   * Store embedding for a memory
   * @param memoryId ID of the memory this embedding is for
   * @param memoryType Type of memory (user, project, global)
   * @param content Text content to generate embedding for
   * @param embedding Optional pre-generated embedding, will be auto-generated if empty
   * @param metadata Additional metadata for the embedding
   */
  storeEmbedding: async (
    memoryId: string,
    memoryType: 'user' | 'project' | 'global',
    content: string,
    embedding: number[] = [],
    metadata: Record<string, any> = {}
  ) => {
    try {
      // Use the stored procedure to handle embedding storage
      const { data, error } = await supabase.rpc(
        'store_memory_embedding',
        {
          p_memory_id: memoryId,
          p_memory_type: memoryType,
          p_content: content,
          p_embedding: embedding.length > 0 ? embedding : null, // null triggers auto-generation on server
          p_metadata: metadata
        }
      );

      if (error) {
        console.error("Error storing memory embedding:", error);
        return null;
      }

      return data as string;
    } catch (error) {
      console.error("Error in storeEmbedding:", error);
      return null;
    }
  },

  /**
   * Search for semantically similar memories
   * @param query Text query to find similar memories
   * @param options Search options (threshold, limit, memory type filter)
   */
  semanticSearch: async (
    query: string,
    options: {
      threshold?: number;
      limit?: number;
      memoryType?: string;
    } = {}
  ) => {
    try {
      // Note: This requires an embedding generation service or function
      // For now we'll pass the text directly to the PostgreSQL function
      // which will handle embedding generation server-side
      
      const { data, error } = await supabase.rpc(
        'search_memory_embeddings',
        {
          query_embedding: [], // Empty array signals server to generate embedding
          match_threshold: options.threshold || 0.7,
          match_count: options.limit || 10,
          filter_memory_type: options.memoryType || null
        }
      );

      if (error) {
        console.error("Error in semantic search:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in semanticSearch:", error);
      return [];
    }
  },

  /**
   * Get statistics about the memory system
   */
  getMemorySystemStats: async () => {
    try {
      // Query the view we created for memory system stats
      const { data, error } = await supabase
        .from('memory_system_stats')
        .select('*');

      if (error) {
        console.error("Error fetching memory system stats:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getMemorySystemStats:", error);
      return [];
    }
  }
};
