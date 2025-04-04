
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
      // Convert the number[] to a string representation for the RPC call
      // This matches what Supabase expects based on the types
      const embeddingString = embedding.length > 0 ? JSON.stringify(embedding) : null;

      // Use the stored procedure to handle embedding storage
      const { data, error } = await supabase.rpc(
        'store_memory_embedding',
        {
          p_memory_id: memoryId,
          p_memory_type: memoryType,
          p_content: content,
          // Pass string representation of embedding or null to trigger auto-generation
          p_embedding: embeddingString,
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
      // First, generate an embedding for the query text using the generate-embedding function
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
        body: { content: query }
      });
      
      if (embeddingError) {
        console.error("Error generating embedding:", embeddingError);
        return [];
      }
      
      // Use the generated embedding for the semantic search
      const queryEmbedding = embeddingData.embedding;
      
      // Call the search_memory_embeddings function with the embedding
      const { data, error } = await supabase.rpc(
        'search_memory_embeddings',
        {
          query_embedding: queryEmbedding,
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
  },

  /**
   * Get embedding similarity trends across different memory segments
   * Groups similar embeddings to identify clusters per client segment
   */
  getEmbeddingSimilarityTrends: async (
    options: {
      segmentBy?: 'user' | 'project' | 'category';
      timeframe?: { from: Date, to?: Date };
      limit?: number;
    } = {}
  ) => {
    try {
      // Call the new function to get embedding similarity trends
      const { data, error } = await supabase.functions.invoke('analyze-memory-patterns', {
        body: { 
          analysis_type: 'similarity_trends',
          segment_by: options.segmentBy || 'category',
          timeframe: options.timeframe ? {
            from: options.timeframe.from.toISOString(),
            to: options.timeframe.to?.toISOString() || new Date().toISOString()
          } : undefined,
          limit: options.limit || 10
        }
      });

      if (error) {
        console.error("Error fetching embedding similarity trends:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getEmbeddingSimilarityTrends:", error);
      return [];
    }
  },

  /**
   * Get prompt heatmaps showing which phrases lead to certain outcomes
   */
  getPromptHeatmaps: async (
    options: {
      outcomeMetric?: string;
      timeRange?: { from: Date, to?: Date };
      minSimilarity?: number;
    } = {}
  ) => {
    try {
      // Call the function to get prompt heatmaps
      const { data, error } = await supabase.functions.invoke('analyze-memory-patterns', {
        body: {
          analysis_type: 'prompt_heatmaps',
          outcome_metric: options.outcomeMetric || 'relevance_score',
          time_range: options.timeRange ? {
            from: options.timeRange.from.toISOString(),
            to: options.timeRange.to?.toISOString() || new Date().toISOString()
          } : undefined,
          min_similarity: options.minSimilarity || 0.5
        }
      });

      if (error) {
        console.error("Error fetching prompt heatmaps:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPromptHeatmaps:", error);
      return [];
    }
  },

  /**
   * Get behavioral fingerprints to cluster user styles for personalized memory recall
   */
  getBehavioralFingerprints: async (
    userId?: string,
    options: {
      clusterCount?: number;
      includeGlobalPatterns?: boolean;
      minInteractions?: number;
    } = {}
  ) => {
    try {
      // Call the function to get behavioral fingerprints
      const { data, error } = await supabase.functions.invoke('analyze-memory-patterns', {
        body: {
          analysis_type: 'behavioral_fingerprints',
          user_id: userId,
          cluster_count: options.clusterCount || 5,
          include_global_patterns: options.includeGlobalPatterns !== false,
          min_interactions: options.minInteractions || 10
        }
      });

      if (error) {
        console.error("Error fetching behavioral fingerprints:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getBehavioralFingerprints:", error);
      return [];
    }
  }
};
