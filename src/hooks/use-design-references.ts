
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  DesignMemoryReferenceService, 
  DesignReference,
  DesignReferenceSearchParams
} from '@/services/ai/design/design-memory-reference-service';
import { useToast } from '@/hooks/use-toast';

export function useDesignReferences() {
  const [references, setReferences] = useState<DesignReference[]>([]);
  const [similarReferences, setSimilarReferences] = useState<DesignReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const searchReferences = useCallback(async (params: DesignReferenceSearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add user_id to params if not explicitly provided
      const searchParams = {
        ...params,
        user_id: params.user_id || user?.id
      };
      
      const results = await DesignMemoryReferenceService.searchReferences(searchParams);
      setReferences(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search references';
      setError(new Error(errorMessage));
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const storeReference = useCallback(async (
    title: string,
    type: 'wireframe' | 'component' | 'layout' | 'color-scheme',
    metadata: any,
    tags: string[] = [],
    description?: string,
    screenshot_url?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await DesignMemoryReferenceService.storeReference(
        title,
        type,
        metadata,
        tags,
        description,
        screenshot_url,
        user?.id
      );
      
      if (result) {
        toast({
          title: "Reference Saved",
          description: "Design reference has been stored for future use",
        });
        
        // Update the references list if we already have references loaded
        if (references.length > 0) {
          setReferences(prevRefs => [result, ...prevRefs]);
        }
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to store reference';
      setError(new Error(errorMessage));
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, references, toast]);

  const findSimilarReferences = useCallback(async (referenceId: string, limit: number = 5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await DesignMemoryReferenceService.getSimilarReferences(referenceId, limit);
      setSimilarReferences(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find similar references';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    references,
    similarReferences,
    isLoading,
    error,
    searchReferences,
    storeReference,
    findSimilarReferences
  };
}
