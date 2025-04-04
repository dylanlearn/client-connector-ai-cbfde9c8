
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, MemoryQueryOptions } from "./memory-types";

/**
 * Service for managing memory embeddings and vector search
 */
export const VectorMemoryService = {
  /**
   * Stores a memory with its vector embedding
   */
  storeEmbedding: async (
    memoryId: string,
    memoryType: 'user' | 'project' | 'global',
    content: string, 
    embedding: number[],
    metadata: Record<string, any> = {}
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-embedding', {
        body: { content }
      });
      
      if (error) {
        console.error("Error generating embedding:", error);
        return null;
      }
      
      // Store embedding using the database function
      const { data: embeddingData, error: storeError } = await supabase.rpc(
        'store_memory_embedding',
        {
          p_memory_id: memoryId,
          p_memory_type: memoryType,
          p_content: content,
          p_embedding: embedding || data.embedding,
          p_metadata: metadata
        }
      );
      
      if (storeError) {
        console.error("Error storing memory embedding:", storeError);
        return null;
      }
      
      return embeddingData;
    } catch (error) {
      console.error("Error in storeEmbedding:", error);
      return null;
    }
  },

  /**
   * Performs semantic search across memory embeddings
   */
  semanticSearch: async (
    query: string,
    options: {
      memoryType?: string;
      threshold?: number;
      limit?: number;
    } = {}
  ) => {
    try {
      // Generate embedding for the query text
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
        body: { content: query }
      });
      
      if (embeddingError) {
        console.error("Error generating query embedding:", embeddingError);
        return [];
      }
      
      // Use the embedding to search for similar memories
      const { data, error } = await supabase.rpc(
        'search_memory_embeddings',
        {
          query_embedding: embeddingData.embedding,
          match_threshold: options.threshold || 0.7,
          match_count: options.limit || 10,
          filter_memory_type: options.memoryType || null
        }
      );
      
      if (error) {
        console.error("Error searching memory embeddings:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in semanticSearch:", error);
      return [];
    }
  },
  
  /**
   * Gets memory system statistics for monitoring and visualization
   */
  getMemorySystemStats: async () => {
    try {
      const { data, error } = await supabase
        .from('memory_system_stats')
        .select('*');
        
      if (error) {
        console.error("Error getting memory system stats:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in getMemorySystemStats:", error);
      return null;
    }
  }
};
