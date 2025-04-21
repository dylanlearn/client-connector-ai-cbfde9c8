
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

// Extended interface to ensure we have the right properties
export interface ExtendedGeneratedContent extends GeneratedContent {
  pageTitle?: string;
  pageDescription?: string;
  contentSections: Array<{
    sectionId: string;
    name?: string;
    content?: string;
    [key: string]: any;
  }>;
}

export interface ExtendedGeneratedSectionContent extends GeneratedSectionContent {
  name?: string;
  content: string;
}

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
  const [generationResult, setGenerationResult] = useState<ExtendedGeneratedContent | ExtendedGeneratedSectionContent | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Generate content for an entire wireframe
   */
  const generateContent = useCallback(async (request: ContentGenerationRequest): Promise<ExtendedGeneratedContent | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await ContextAwareContentService.generateWireframeContent(request);
      // Cast to our extended interface that ensures the required properties
      const extendedResult: ExtendedGeneratedContent = {
        ...result,
        contentSections: result.contentSections || []
      };
      
      setGenerationResult(extendedResult);
      
      if (showToasts) {
        toast.success('Content generated successfully!');
      }
      
      return extendedResult;
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
  ): Promise<ExtendedGeneratedSectionContent | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await ContextAwareContentService.generateSectionContent(request);
      // Cast to our extended interface that ensures the required properties
      const extendedResult: ExtendedGeneratedSectionContent = {
        ...result,
        content: result.content || ''
      };
      
      setGenerationResult(extendedResult);
      
      if (showToasts) {
        toast.success(`Content generated for ${request.section.sectionType} section!`);
      }
      
      return extendedResult;
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
