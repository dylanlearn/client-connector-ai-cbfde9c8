
import { useState, useCallback } from 'react';
import { 
  ContextAwareContentService, 
  ContentGenerationRequest, 
  SectionContentGenerationRequest, 
  GeneratedContentSection 
} from '@/services/ai/wireframe/content/context-aware-content-service';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

// Define required types for content generation
export interface ComponentContent {
  id?: string;
  content: string;
  [key: string]: any;
}

export interface SectionContentResponse {
  sectionId: string;
  name: string;
  content: string;
  components?: ComponentContent[];
  [key: string]: any;
}

export interface GeneratedContent {
  pageTitle?: string;
  pageDescription?: string;
  contentSections?: SectionContentResponse[];
  [key: string]: any;
}

export interface GeneratedSectionContent {
  content?: string;
  components?: ComponentContent[];
  [key: string]: any;
}

export interface UseContentGenerationReturn {
  generateWireframeContent: (wireframe: WireframeData, prompt?: string) => Promise<GeneratedContent>;
  generateSectionContent: (section: WireframeSection, wireframe?: WireframeData, prompt?: string) => Promise<GeneratedSectionContent>;
  isGenerating: boolean;
  error: Error | null;
}

/**
 * Hook for generating content for wireframes and sections
 */
export function useContentGeneration(): UseContentGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Generate content for an entire wireframe
   */
  const generateWireframeContent = useCallback(async (
    wireframe: WireframeData, 
    prompt?: string
  ): Promise<GeneratedContent> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const request: ContentGenerationRequest = {
        wireframe,
        prompt,
        options: {
          detailLevel: 'standard',
          tone: 'professional'
        }
      };
      
      const result = await ContextAwareContentService.generateWireframeContent(request);
      
      // Transform the contentSections to ensure they match the expected SectionContentResponse type
      const transformedSections: SectionContentResponse[] = (result.contentSections || []).map(section => {
        // Ensure components array contains objects with content property
        const processedComponents: ComponentContent[] = Array.isArray(section.components) 
          ? section.components.map(comp => {
              // Create a new object with required content property
              return {
                id: comp.id || undefined,
                // Ensure every component has a content property
                content: typeof comp.content === 'string' ? comp.content : JSON.stringify(comp),
                ...comp
              };
            })
          : [];
        
        // Create section response with required sectionId property
        return {
          sectionId: section.id || '',
          name: section.name || '',
          content: section.content || '',
          components: processedComponents
        };
      });
      
      // Ensure the return value matches the GeneratedContent interface
      const generatedContent: GeneratedContent = {
        pageTitle: result.pageTitle || '',
        pageDescription: result.pageDescription || '',
        contentSections: transformedSections
      };
      
      return generatedContent;
    } catch (e) {
      const errorInstance = e instanceof Error ? e : new Error(String(e));
      setError(errorInstance);
      return {
        pageTitle: '',
        pageDescription: '',
        contentSections: []
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Generate content for a specific section
   */
  const generateSectionContent = useCallback(async (
    section: WireframeSection,
    wireframe?: WireframeData,
    prompt?: string
  ): Promise<GeneratedSectionContent> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const request: SectionContentGenerationRequest = {
        section,
        wireframe,
        prompt,
        options: {
          detailLevel: 'standard',
          tone: 'professional'
        }
      };
      
      const result = await ContextAwareContentService.generateSectionContent(request);
      
      // Ensure components have the required content property
      const transformedComponents: ComponentContent[] = Array.isArray(result.components) 
        ? result.components.map(comp => {
            // Create a new object with required content property
            return {
              id: comp.id || undefined,
              // Ensure every component has a content property
              content: typeof comp.content === 'string' ? comp.content : JSON.stringify(comp),
              ...comp
            };
          })
        : [];
      
      // Ensure the return value matches the GeneratedSectionContent interface
      const generatedSectionContent: GeneratedSectionContent = {
        name: result.name || '',
        content: result.content || '',
        components: transformedComponents
      };
      
      return generatedSectionContent;
    } catch (e) {
      const errorInstance = e instanceof Error ? e : new Error(String(e));
      setError(errorInstance);
      return {
        content: '',
        components: []
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateWireframeContent,
    generateSectionContent,
    isGenerating,
    error
  };
}

// Export a default for compatibility with older imports
export default useContentGeneration;
