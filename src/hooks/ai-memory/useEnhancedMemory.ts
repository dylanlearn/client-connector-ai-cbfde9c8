
import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { EnhancedMemoryService } from '@/services/ai/memory/enhanced-memory-service';
import { MemoryCategory, MemoryQueryOptions } from '@/services/ai/memory';

export function useEnhancedMemory() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<{
    exactMatches: any[];
    semanticMatches: any[];
  }>({
    exactMatches: [],
    semanticMatches: []
  });
  
  /**
   * Store a memory with automatic embedding generation
   */
  const storeMemory = useCallback(async (
    content: string,
    category: string,
    projectId?: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Map string category to enum
      const memoryCategory = category as MemoryCategory;
      
      const result = await EnhancedMemoryService.storeMemoryWithEmbedding(
        user.id,
        content,
        memoryCategory,
        projectId,
        metadata
      );
      
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to store memory');
      setError(errorObj);
      console.error("Error storing memory:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  /**
   * Advanced search combining traditional and semantic search
   */
  const searchMemories = useCallback(async (
    query: string,
    options: MemoryQueryOptions & {
      useVectorSearch?: boolean;
      similarityThreshold?: number;
    } = {}
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await EnhancedMemoryService.searchMemories(query, {
        ...options,
        userId: user?.id
      });
      
      setSearchResults(results);
      return results;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to search memories');
      setError(errorObj);
      console.error("Error searching memories:", err);
      return {
        exactMatches: [],
        semanticMatches: []
      };
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  return {
    storeMemory,
    searchMemories,
    searchResults,
    isLoading,
    error
  };
}
