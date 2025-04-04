
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  DesignMemoryService, 
  DesignMemoryEntry, 
  DesignMemoryQueryOptions 
} from '@/services/ai/design/design-memory-service';

export function useDesignMemory() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DesignMemoryEntry[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  /**
   * Query design patterns and examples from the memory database
   */
  const queryDesignPatterns = useCallback(async (options: DesignMemoryQueryOptions = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await DesignMemoryService.queryDesignMemory(options);
      setResults(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to query design patterns');
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Submit feedback on a design suggestion
   */
  const submitFeedback = useCallback(async (
    designSuggestionId: string,
    feedbackType: 'like' | 'dislike' | 'comment',
    rating?: number,
    feedbackContent?: string,
    context: Record<string, any> = {}
  ) => {
    if (!user?.id) return false;
    
    try {
      return await DesignMemoryService.recordFeedback(
        designSuggestionId,
        user.id,
        feedbackType,
        rating,
        feedbackContent,
        context
      );
    } catch (err) {
      console.error("Error submitting feedback:", err);
      return false;
    }
  }, [user]);

  /**
   * Store a generated design suggestion in history
   */
  const storeSuggestion = useCallback(async (
    prompt: string,
    result: Record<string, any>,
    usedReferences: string[] | string = [],
    context: Record<string, any> = {}
  ) => {
    if (!user?.id) return null;
    
    try {
      // Convert usedReferences to an array if it's not already
      const referencesArray = Array.isArray(usedReferences) 
        ? usedReferences 
        : (usedReferences ? [usedReferences] : []);
      
      return await DesignMemoryService.storeDesignSuggestion(
        user.id,
        prompt,
        result,
        context,
        referencesArray
      );
    } catch (err) {
      console.error("Error storing suggestion:", err);
      return null;
    }
  }, [user]);

  /**
   * Rate a previously generated design suggestion
   */
  const rateSuggestion = useCallback(async (id: string, rating: number) => {
    try {
      // Convert the rating to a string if the API expects a string
      return await DesignMemoryService.rateDesignSuggestion(id, rating);
    } catch (err) {
      console.error("Error rating suggestion:", err);
      return false;
    }
  }, []);

  return {
    isLoading,
    results,
    error,
    queryDesignPatterns,
    submitFeedback,
    storeSuggestion,
    rateSuggestion
  };
}
