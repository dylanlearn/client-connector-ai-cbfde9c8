
import { useState, useCallback } from 'react';
import { DesignReferencesService } from '@/services/ai/design/design-references-service';
import { DesignReference, DesignCategory, DesignReferenceQuery } from '@/services/ai/design/types/design-references-types';
import { websiteDesignReferences } from '@/services/ai/design/data/website-design-references';

/**
 * Hook for accessing and managing design references
 */
export function useDesignReferences() {
  const [isLoading, setIsLoading] = useState(false);
  const [references, setReferences] = useState<DesignReference[]>([]);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize the design references database with pre-defined examples
   */
  const initializeReferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const count = await DesignReferencesService.importDesignReferences(websiteDesignReferences);
      console.log(`Successfully imported ${count} design references`);
      return count;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize design references');
      setError(error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Query design references based on criteria
   */
  const queryReferences = useCallback(async (query: DesignReferenceQuery) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await DesignReferencesService.queryDesignReferences(query);
      setReferences(results);
      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to query design references');
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get references for a specific website category
   */
  const getReferencesForCategory = useCallback(async (category: DesignCategory, limit: number = 5) => {
    return queryReferences({ category, limit });
  }, [queryReferences]);

  return {
    isLoading,
    references,
    error,
    initializeReferences,
    queryReferences,
    getReferencesForCategory,
    // Also expose the raw data for direct access
    allReferences: websiteDesignReferences
  };
}
