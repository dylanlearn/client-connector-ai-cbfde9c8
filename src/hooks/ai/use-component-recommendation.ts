
import { useState, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { 
  ComponentRecommendation,
  ComponentRecommendationResult 
} from '@/services/ai/design/component-recommendation/types';
import { ComponentRecommendationService } from '@/services/ai/design/component-recommendation/component-recommendation-service';

interface UseComponentRecommendationOptions {
  showToasts?: boolean;
}

/**
 * Hook for getting contextual component recommendations
 */
export function useComponentRecommendation({
  showToasts = true
}: UseComponentRecommendationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ComponentRecommendationResult | null>(null);
  const [sectionRecommendations, setSectionRecommendations] = useState<{
    [sectionId: string]: ComponentRecommendation[]
  }>({});
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Get component recommendations for an entire wireframe
   */
  const getRecommendations = useCallback(async (
    wireframe: WireframeData,
    pageContext?: string,
    contentType?: string,
    userIntent?: string,
    industry?: string
  ): Promise<ComponentRecommendationResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ComponentRecommendationService.getRecommendations(
        wireframe,
        pageContext,
        contentType,
        userIntent,
        industry
      );
      
      setRecommendations(result);
      
      if (showToasts) {
        toast.success('Component recommendations generated!');
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error getting component recommendations');
      setError(error);
      
      if (showToasts) {
        toast.error('Error getting component recommendations: ' + error.message);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showToasts]);
  
  /**
   * Get component recommendations for a specific section
   */
  const getSectionRecommendations = useCallback(async (
    wireframe: WireframeData,
    sectionId: string,
    maxRecommendations: number = 5
  ): Promise<ComponentRecommendation[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ComponentRecommendationService.getSectionRecommendations(
        wireframe,
        sectionId,
        maxRecommendations
      );
      
      // Store the section recommendations
      setSectionRecommendations(prev => ({
        ...prev,
        [sectionId]: result
      }));
      
      if (showToasts) {
        toast.success(`Recommendations for section generated!`);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error getting section recommendations');
      setError(error);
      
      if (showToasts) {
        toast.error('Error getting section recommendations: ' + error.message);
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showToasts]);
  
  /**
   * Clear all recommendations
   */
  const clearRecommendations = useCallback(() => {
    setRecommendations(null);
    setSectionRecommendations({});
    setError(null);
  }, []);
  
  return {
    isLoading,
    recommendations,
    sectionRecommendations,
    error,
    getRecommendations,
    getSectionRecommendations,
    clearRecommendations
  };
}

// Export the hook
export default useComponentRecommendation;
