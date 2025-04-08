
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  WireframeResult
} from "@/services/ai/wireframe/wireframe-types";
import { v4 as uuidv4 } from "uuid";

export function useWireframeGenerator(
  defaultCreativityLevel: number = 5,
  setCurrentWireframe?: (wireframe: WireframeGenerationResult | null) => void,
  externalToast?: any
) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Use provided toast function or default toast
  const toastFn = externalToast || toast;

  const generateWireframe = useCallback(
    async (params: WireframeGenerationParams): Promise<WireframeGenerationResult | null> => {
      setIsGenerating(true);
      setError(null);
      
      try {
        // Apply creativity level from params or default
        const creativityLevel = params.creativityLevel || defaultCreativityLevel;
        const enhancedCreativity = params.enhancedCreativity ?? creativityLevel > 7;
        
        toastFn({
          title: "Generating wireframe",
          description: enhancedCreativity 
            ? "Creating a highly creative design..." 
            : "Creating a structured wireframe...",
        });
        
        const { data, error } = await supabase.functions.invoke("generate-wireframe", {
          body: {
            ...params,
            // Ensure these are included even if not provided
            creativityLevel,
            enhancedCreativity
          }
        });
        
        if (error) {
          console.error("Error calling wireframe generator:", error);
          
          const result: WireframeGenerationResult = {
            wireframe: { 
              id: uuidv4(),
              title: "Error generating wireframe",
              sections: [],
              description: `Failed to generate: ${error.message}`,
            },
            error: error.message,
            success: false // Add success flag
          };
          
          if (setCurrentWireframe) {
            setCurrentWireframe(result);
          }
          
          return result;
        }
        
        if (data?.success && data?.wireframe) {
          console.log("Wireframe generated successfully:", data);
          
          // Ensure result has all required properties
          const result: WireframeGenerationResult = {
            wireframe: data.wireframe,
            imageUrl: data.imageUrl,
            success: true // Add success flag
          };
          
          if (setCurrentWireframe) {
            setCurrentWireframe(result);
          }
          
          toastFn({
            title: "Wireframe generated",
            description: `Generated "${data.wireframe.title || 'Wireframe'}" successfully`,
          });
          
          return result;
        } else {
          console.error("API error:", data?.error || "Unknown API error");
          
          const result: WireframeGenerationResult = {
            wireframe: { 
              id: uuidv4(),
              title: "Error generating wireframe",
              sections: [],
              description: `Failed to generate: ${data?.error || "Unknown error"}`,
            },
            error: data?.error || "Unknown API error",
            success: false // Add success flag
          };
          
          if (setCurrentWireframe) {
            setCurrentWireframe(result);
          }
          
          toastFn({
            title: "Generation failed",
            description: data?.error || "Failed to generate wireframe",
            variant: "destructive",
          });
          
          return result;
        }
      } catch (err) {
        console.error("Unexpected error in wireframe generation:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        const result: WireframeGenerationResult = {
          wireframe: { 
            id: uuidv4(),
            title: "Error generating wireframe",
            sections: [],
            description: `Failed to generate: ${errorMessage}`,
          },
          error: errorMessage,
          success: false // Add success flag
        };
        
        if (setCurrentWireframe) {
          setCurrentWireframe(result);
        }
        
        toastFn({
          title: "Generation failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return result;
      } finally {
        setIsGenerating(false);
      }
    },
    [defaultCreativityLevel, toastFn, setCurrentWireframe]
  );
  
  const generateCreativeVariation = useCallback(
    async (originalWireframe: WireframeGenerationResult): Promise<WireframeGenerationResult | null> => {
      if (!originalWireframe?.wireframe) return null;
      
      // Prepare params for variation generation
      const variationParams: WireframeGenerationParams = {
        description: `Create a creative variation of: ${originalWireframe.wireframe.description || originalWireframe.wireframe.title}`,
        baseWireframe: originalWireframe.wireframe,
        creativityLevel: Math.min((defaultCreativityLevel || 5) + 2, 10),
        enhancedCreativity: true,
      };
      
      return generateWireframe(variationParams);
    },
    [generateWireframe, defaultCreativityLevel]
  );

  return {
    isGenerating,
    error,
    generateWireframe,
    generateCreativeVariation,
  };
}
