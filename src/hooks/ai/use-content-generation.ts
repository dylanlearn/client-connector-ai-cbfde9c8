
import { useState, useCallback } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { 
  ContextAwareContentService, 
  ContentGenerationRequest,
  SectionContentGenerationRequest,
  PlaceholderTextOptions
} from '@/services/ai/wireframe/content/context-aware-content-service';
import { toast } from 'sonner';

// Define our own interfaces that match what we actually use in the components
export interface GeneratedContent {
  pageTitle: string;
  pageDescription: string;
  contentSections: Array<{
    sectionId: string;
    name: string;
    content: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface GeneratedSectionContent {
  name: string;
  content: string;
  [key: string]: any;
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
      
      // Transform service result to our expected interface format
      const formattedResult: GeneratedContent = {
        pageTitle: result.pageTitle || request.wireframe.title || '',
        pageDescription: result.pageDescription || request.wireframe.description || '',
        contentSections: Array.isArray(result.contentSections) 
          ? result.contentSections 
          : []
      };
      
      setGenerationResult(formattedResult);
      
      if (showToasts) {
        toast.success('Content generated successfully!');
      }
      
      return formattedResult;
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
      
      // Transform service result to our expected interface format
      const formattedResult: GeneratedSectionContent = {
        name: result.name || request.section.name || '',
        content: typeof result.content === 'string' ? result.content : ''
      };
      
      setGenerationResult(formattedResult);
      
      if (showToasts) {
        toast.success(`Content generated for ${request.section.sectionType} section!`);
      }
      
      return formattedResult;
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
