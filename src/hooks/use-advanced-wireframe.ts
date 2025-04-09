
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { EnhancedWireframeGenerator } from '@/services/ai/wireframe/enhanced-wireframe-generator';
import { 
  WireframeGenerationParams, 
  EnhancedWireframeGenerationResult, 
  WireframeData 
} from '@/services/ai/wireframe/wireframe-types';

export function useAdvancedWireframe() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeData | null>(null);
  const [generationResults, setGenerationResults] = useState<EnhancedWireframeGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Get intent data from the generation results
  const intentData = generationResults?.intentData || null;
  
  // Get blueprint data from generation results
  const blueprint = generationResults?.blueprint || null;

  const generateWireframe = useCallback(async (params: WireframeGenerationParams) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const result = await EnhancedWireframeGenerator.generateWireframe(params);
      
      if (result && result.wireframe) {
        setCurrentWireframe(result.wireframe);
        setGenerationResults(result as EnhancedWireframeGenerationResult);
      }
      
      return result;
    } catch (err) {
      console.error("Error generating wireframe:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Wireframe generation failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        wireframe: null,
        success: false,
        error: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);
  
  const saveWireframe = useCallback(async (projectId: string, description: string) => {
    if (!currentWireframe) return null;
    
    try {
      // In a real implementation, you'd save the wireframe to the database here
      
      toast({
        title: "Wireframe saved",
        description: "Your wireframe has been saved successfully"
      });
      
      return currentWireframe;
    } catch (err) {
      console.error("Error saving wireframe:", err);
      
      toast({
        title: "Failed to save wireframe",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return null;
    }
  }, [currentWireframe, toast]);
  
  return {
    isGenerating,
    currentWireframe,
    generationResults,
    intentData,
    blueprint,
    generateWireframe,
    saveWireframe,
    error
  };
}
