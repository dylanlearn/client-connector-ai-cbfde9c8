
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  ContextAwareContentService, 
  ContentGenerationRequest,
  GeneratedSectionContent,
  GeneratedContent
} from '@/services/ai/wireframe/content/context-aware-content-service';

interface UseContentGenerationOptions {
  showToasts?: boolean;
}

/**
 * Hook for generating contextually aware content for wireframes
 */
export function useContentGeneration({
  showToasts = true
}: UseContentGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedSectionContent[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Generate content for an entire wireframe
   */
  const generateWireframeContent = useCallback(async (request: ContentGenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const content = await ContextAwareContentService.generateWireframeContent(request);
      setGeneratedContent(content);
      
      if (showToasts && content.length > 0) {
        toast.success(`Generated content for ${content.length} sections`);
      }
      
      return content;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error generating content');
      setError(error);
      
      if (showToasts) {
        toast.error('Error generating content: ' + error.message);
      }
      
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [showToasts]);
  
  /**
   * Generate content for a specific section
   */
  const generateSectionContent = useCallback(async (request: ContentGenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const content = await ContextAwareContentService.generateSectionContent(request);
      
      // Update the generatedContent array with the new content
      setGeneratedContent(prev => {
        const existingIndex = prev.findIndex(item => item.sectionId === content.sectionId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = content;
          return updated;
        }
        return [...prev, content];
      });
      
      if (showToasts) {
        toast.success(`Generated content for ${content.sectionType} section`);
      }
      
      return content;
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
   * Generate placeholder text
   */
  const generatePlaceholderText = useCallback(async (
    context: string,
    paragraphCount: number = 1,
    sentencesPerParagraph: number = 3
  ) => {
    setError(null);
    
    try {
      return await ContextAwareContentService.generatePlaceholderText(
        context, 
        paragraphCount, 
        sentencesPerParagraph
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error generating placeholder text');
      setError(error);
      
      if (showToasts) {
        toast.error('Error generating placeholder text: ' + error.message);
      }
      
      return ['Error generating placeholder text. Please try again.'];
    }
  }, [showToasts]);
  
  /**
   * Apply generated content to a wireframe
   */
  const applyContentToWireframe = useCallback((
    wireframe: WireframeData,
    content: GeneratedSectionContent[]
  ): WireframeData => {
    try {
      if (!wireframe || !wireframe.sections) {
        return wireframe;
      }
      
      // Create a deep copy of the wireframe
      const updatedWireframe = JSON.parse(JSON.stringify(wireframe));
      
      // Apply content to each matching section
      content.forEach(sectionContent => {
        const sectionIndex = updatedWireframe.sections.findIndex(
          (s: any) => s.id === sectionContent.sectionId
        );
        
        if (sectionIndex >= 0) {
          // Update the section with the generated content
          updatedWireframe.sections[sectionIndex].copySuggestions = {
            ...updatedWireframe.sections[sectionIndex].copySuggestions,
            ...mapGeneratedContentToCopySuggestions(sectionContent.content)
          };
          
          // For hero sections, directly apply the title
          if (sectionContent.sectionType.toLowerCase() === 'hero' && sectionContent.content.heading) {
            updatedWireframe.title = sectionContent.content.heading;
          }
        }
      });
      
      return updatedWireframe;
    } catch (error) {
      console.error('Error applying content to wireframe:', error);
      return wireframe;
    }
  }, []);
  
  /**
   * Clear generated content
   */
  const clearGeneratedContent = useCallback(() => {
    setGeneratedContent([]);
    setError(null);
  }, []);
  
  return {
    isGenerating,
    generatedContent,
    error,
    generateWireframeContent,
    generateSectionContent,
    generatePlaceholderText,
    applyContentToWireframe,
    clearGeneratedContent
  };
}

/**
 * Helper function to map generated content to copySuggestions format
 */
function mapGeneratedContentToCopySuggestions(content: GeneratedContent) {
  return {
    heading: content.heading,
    subheading: content.subheading,
    supportText: content.body,
    primaryCta: content.ctaPrimary,
    secondaryCta: content.ctaSecondary
  };
}
