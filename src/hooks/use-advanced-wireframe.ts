
import { useState, useCallback } from 'react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useAdvancedWireframe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [intentData, setIntentData] = useState<any>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  
  const { toast } = useToast();
  const {
    isGenerating,
    currentWireframe,
    generateWireframe: baseGenerateWireframe,
    loadProjectWireframes,
    getWireframe
  } = useWireframeGeneration();

  // Enhanced wireframe generator with error handling
  const generateWireframe = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await baseGenerateWireframe(params);
      
      // Store intent and blueprint data if available
      if (result?.intentData) {
        setIntentData(result.intentData);
      }
      
      if (result?.blueprint) {
        setBlueprint(result.blueprint);
      }
      
      return result;
    } catch (err) {
      console.error("Error in advanced wireframe generation:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseGenerateWireframe, toast]);
  
  // Save wireframe with enhanced options
  const saveWireframe = useCallback(async (projectId: string, prompt: string) => {
    if (!currentWireframe?.wireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe first"
      });
      return null;
    }
    
    try {
      setLoading(true);
      
      // If we're using a real API, we would call it here
      // For now, we'll just add an ID if it doesn't exist
      const wireframeToSave = currentWireframe.wireframe;
      
      if (!wireframeToSave.id) {
        wireframeToSave.id = uuidv4();
      }
      
      // Update metadata
      wireframeToSave.lastUpdated = new Date().toISOString();
      
      toast({
        title: "Wireframe saved",
        description: "Your wireframe has been saved successfully"
      });
      
      return wireframeToSave;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save wireframe";
      
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentWireframe, toast]);

  return {
    isGenerating: isGenerating || loading,
    currentWireframe,
    intentData,
    blueprint,
    error,
    generateWireframe,
    saveWireframe,
    loadProjectWireframes,
    getWireframe
  };
}
