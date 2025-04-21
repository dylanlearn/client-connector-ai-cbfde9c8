
import { useState, useCallback } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { 
  ContextAwareContentService, 
  ContentGenerationRequest,
  SectionContentGenerationRequest,
  GeneratedContent,
  GeneratedSectionContent,
  PlaceholderTextOptions
} from '@/services/ai/wireframe/content/context-aware-content-service';
import { toast } from 'sonner';

interface UseContentGenerationOptions {
  showToasts?: boolean;
}

/**
 * Hook for generating contextual wireframe content
 */
export function useContentGeneration({
  showToasts = true
}: UseContentGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GeneratedContent | GeneratedSectionContent | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Generate content for an entire wireframe
   */
  const generateContent = useCallback(async (request: ContentGenerationRequest): Promise<GeneratedContent | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await ContextAwareContentService.generateWireframeContent(request);
      setGenerationResult(result);
      
      if (showToasts) {
        toast.success('Content generated successfully!');
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error generating content');
      setError(error);
      
      if (showToasts) {
        toast.error('Error generating content: ' + error.message);
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [showToasts]);
  
  /**
   * Generate content for a specific section
   */
  const generateSectionContent = useCallback(async (
    request: SectionContentGenerationRequest
  ): Promise<GeneratedSectionContent | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await ContextAwareContentService.generateSectionContent(request);
      setGenerationResult(result);
      
      if (showToasts) {
        toast.success(`Content generated for ${request.section.sectionType} section!`);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error generating section content');
      setError(error);
      
      if (showToasts) {
        toast.error('Error generating section content: ' + error.message);
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [showToasts]);
  
  /**
   * Generate placeholder text with specific parameters
   */
  const generatePlaceholderText = useCallback(async (
    options: PlaceholderTextOptions
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await ContextAwareContentService.generatePlaceholderText(options);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error generating placeholder text');
      setError(error);
      
      if (showToasts) {
        toast.error('Error generating placeholder text: ' + error.message);
      }
      
      return '';
    } finally {
      setIsGenerating(false);
    }
  }, [showToasts]);
  
  /**
   * Clear any previous generation results
   */
  const clearResults = useCallback(() => {
    setGenerationResult(null);
    setError(null);
  }, []);
  
  return {
    isGenerating,
    generationResult,
    error,
    generateContent,
    generateSectionContent,
    generatePlaceholderText,
    clearResults
  };
}
