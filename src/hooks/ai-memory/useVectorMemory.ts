
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth'; 
import { VectorMemoryService } from '@/services/ai/memory/vector-memory-service';

export interface VectorSearchResult {
  id: string;
  memory_id: string;
  memory_type: string;
  content: string;
  similarity: number;
  created_at: string;
  metadata: Record<string, any>;
}

export interface MemoryStat {
  memory_type: string;
  memory_count: number;
  oldest_memory?: string;
  newest_memory?: string;
  avg_clusters_per_memory?: number;
}

interface VectorSearchOptions {
  memoryType?: string;
  threshold?: number;
  limit?: number;
}

export function useVectorMemory() {
  const [results, setResults] = useState<VectorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  /**
   * Search for memories using semantic similarity
   */
  const searchMemories = useCallback(async (
    query: string,
    options: VectorSearchOptions = {}
  ) => {
    if (!query.trim()) return [];
    
    setIsSearching(true);
    setError(null);
    
    try {
      const searchResults = await VectorMemoryService.semanticSearch(
        query,
        options
      );
      
      const typedResults = searchResults as VectorSearchResult[];
      setResults(typedResults);
      return typedResults;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to search memories');
      setError(errorObj);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Store a memory with its embedding
   */
  const storeMemoryWithEmbedding = useCallback(async (
    content: string,
    memoryType: 'user' | 'project' | 'global',
    memoryId: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id || !content) return null;
    
    try {
      return await VectorMemoryService.storeEmbedding(
        memoryId,
        memoryType,
        content,
        [],  // We'll let the service generate the embedding
        metadata
      );
    } catch (err) {
      console.error("Error storing memory with embedding:", err);
      return null;
    }
  }, [user]);

  /**
   * Get memory system statistics for visualization or monitoring
   */
  const getMemoryStats = useCallback(async (): Promise<MemoryStat[]> => {
    try {
      const stats = await VectorMemoryService.getMemorySystemStats();
      return stats as MemoryStat[];
    } catch (err) {
      console.error("Error fetching memory stats:", err);
      return [];
    }
  }, []);

  return {
    results,
    isSearching,
    error,
    searchMemories,
    storeMemoryWithEmbedding,
    getMemoryStats
  };
}
