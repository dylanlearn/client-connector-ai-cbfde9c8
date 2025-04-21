import { useState, useCallback } from 'react';
import { toast, Toast } from '@/hooks/use-toast'; 
import { useWireframeGenerator } from '@/hooks/wireframe/use-wireframe-generator';
import { 
  WireframeData, 
  WireframeGenerationResult
} from '@/services/ai/wireframe/wireframe-types';

export function useWireframeVariations() {
  const [variations, setVariations] = useState<WireframeGenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // We'll reuse the wireframe generator logic but won't use its state management
  const { generateWireframe: baseGenerateWireframe } = useWireframeGenerator(
    8, // Default creativity level
    () => {}, // We'll handle setting the current wireframe ourselves
    (toastProps: Omit<Toast, "id">) => toast(toastProps)
  );
  
  /**
   * Generate a variation of the wireframe
   */
  const generateVariation = useCallback(async (
    baseWireframe: WireframeData, 
    creativityLevel: number = 8,
    focusAreas: string[] = []
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
      
      // Generate a variation based on the original wireframe
      const result = await baseGenerateWireframe({
        baseWireframe: baseWireframe,
        description: `${focusPrompt}. Keep the same page purpose but provide a creative alternative layout and design approach.`,
        creativityLevel,
        enhancedCreativity: true,
        customParams: {
          isVariation: true,
          originalWireframeId: baseWireframe.id,
          focusAreas
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
   * Clear all variations
   */
  const clearVariations = useCallback(() => {
    setVariations([]);
  }, []);
  
  return {
    variations,
    isGenerating,
    generateVariation,
    clearVariations
  };
}

// We'll keep the import for useToast
import { useToast } from '@/hooks/use-toast';
