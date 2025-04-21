
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast'; 
import { useWireframeGenerator } from '@/hooks/wireframe/use-wireframe-generator';
import { 
  WireframeData, 
  WireframeGenerationResult
} from '@/services/ai/wireframe/wireframe-types';

export interface DesignSuggestion {
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    headings: string;
    body: string;
  };
  layoutStyle?: string;
  componentStyles?: Record<string, any>;
  toneDescriptor?: string;
}

export function useWireframeVariations() {
  const [variations, setVariations] = useState<WireframeGenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedDesignSuggestions, setAppliedDesignSuggestions] = useState<DesignSuggestion | null>(null);
  
  // We'll reuse the wireframe generator logic but won't use its state management
  const { 
    generateWireframe: baseGenerateWireframe 
  } = useWireframeGenerator(
    8, // Default creativity level
    () => {}, // We'll handle setting the current wireframe ourselves
    (props) => {
      toast(props);
      return "";
    }
  );
  
  /**
   * Generate a variation of the wireframe
   */
  const generateVariation = useCallback(async (
    baseWireframe: WireframeData, 
    creativityLevel: number = 8,
    focusAreas: string[] = [],
    designSuggestions?: DesignSuggestion
  ) => {
    if (!baseWireframe) {
      toast({
        title: "No wireframe to modify",
        description: "Please select a wireframe to create variations from",
        variant: "destructive"
      });
      return null;
    }
    
    setIsGenerating(true);
    
    try {
      // Prepare specialized prompt based on focus areas
      let focusPrompt = "Create a variation of this wireframe";
      
      if (focusAreas.length > 0) {
        focusPrompt += " with changes focused on " + 
          focusAreas.map(area => area.toLowerCase()).join(", ");
      }
      
      // Apply design suggestions if provided
      const enhancedWireframe = designSuggestions 
        ? applyDesignSuggestionsToWireframe(baseWireframe, designSuggestions)
        : baseWireframe;
      
      // If we have design suggestions, store them
      if (designSuggestions) {
        setAppliedDesignSuggestions(designSuggestions);
      }
      
      // Generate a variation based on the original wireframe
      const result = await baseGenerateWireframe({
        baseWireframe: enhancedWireframe,
        description: `${focusPrompt}. Keep the same page purpose but provide a creative alternative layout and design approach.`,
        creativityLevel,
        enhancedCreativity: true,
        customParams: {
          isVariation: true,
          originalWireframeId: baseWireframe.id,
          focusAreas,
          designSuggestions
        }
      });
      
      if (result && result.wireframe) {
        // Add to variations list
        setVariations(prev => [...prev, result]);
        
        toast({
          title: "Variation created",
          description: "A new wireframe variation has been generated"
        });
        
        return result;
      } else {
        throw new Error("Failed to generate variation");
      }
    } catch (error) {
      console.error("Error generating wireframe variation:", error);
      
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate wireframe variation",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [baseGenerateWireframe]);
  
  /**
   * Apply design suggestions to wireframe data
   */
  const applyDesignSuggestionsToWireframe = (
    wireframe: WireframeData,
    suggestions: DesignSuggestion
  ): WireframeData => {
    // Create a copy to avoid mutating the original
    const enhancedWireframe: WireframeData = {
      ...wireframe,
      colorScheme: suggestions.colorScheme || wireframe.colorScheme,
      typography: suggestions.typography || wireframe.typography
    };
    
    // Apply layout style if provided
    if (suggestions.layoutStyle) {
      enhancedWireframe.style = suggestions.layoutStyle;
    }
    
    // Apply component styles if available and if there are sections
    if (suggestions.componentStyles && enhancedWireframe.sections) {
      enhancedWireframe.sections = enhancedWireframe.sections.map(section => {
        const componentStyle = suggestions.componentStyles?.[section.sectionType];
        if (componentStyle) {
          return {
            ...section,
            style: componentStyle
          };
        }
        return section;
      });
    }
    
    return enhancedWireframe;
  };
  
  /**
   * Clear all variations
   */
  const clearVariations = useCallback(() => {
    setVariations([]);
    setAppliedDesignSuggestions(null);
  }, []);
  
  return {
    variations,
    isGenerating,
    appliedDesignSuggestions,
    generateVariation,
    clearVariations
  };
}

// We'll keep the import for useToast
import { useToast } from '@/hooks/use-toast';
