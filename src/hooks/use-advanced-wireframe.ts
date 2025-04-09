
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Extend the existing WireframeGenerationResult to include the properties we need
interface EnhancedWireframeGenerationResult {
  wireframe: any;
  error?: string;
  intentData?: any;
  blueprint?: any;
  success: boolean;
  generationTime?: number;
}

export function useAdvancedWireframe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [intentData, setIntentData] = useState<any>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  
  const { toast } = useToast();
  const [currentWireframe, setCurrentWireframe] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Enhanced wireframe generator with error handling
  const generateWireframe = useCallback(async (params: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call - in a real app, this would call an API
      console.log("Generating wireframe with params:", params);
      
      // Mock result for demo purposes
      const result: EnhancedWireframeGenerationResult = {
        wireframe: {
          id: uuidv4(),
          title: `Wireframe for ${params.projectId || 'New Project'}`,
          description: params.userInput || params.description || 'A generated wireframe',
          sections: [
            {
              id: uuidv4(),
              name: 'Hero Section',
              sectionType: 'hero',
              description: 'Main hero section with headline and call to action'
            },
            {
              id: uuidv4(),
              name: 'Features Section',
              sectionType: 'features',
              description: 'Display of key product features'
            }
          ],
          lastUpdated: new Date().toISOString()
        },
        intentData: { userIntent: 'create landing page', audience: 'general' },
        blueprint: { layout: 'standard', style: params.styleToken || 'modern' },
        success: true
      };
      
      setCurrentWireframe(result.wireframe);
      
      // Store intent and blueprint data if available
      if (result.intentData) {
        setIntentData(result.intentData);
      }
      
      if (result.blueprint) {
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
      setIsGenerating(false);
    }
  }, [toast]);
  
  // Save wireframe with enhanced options
  const saveWireframe = useCallback(async (projectId: string, prompt: string) => {
    if (!currentWireframe) {
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
      const wireframeToSave = currentWireframe;
      
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

  // Add function to create a WireframeEditor component in EnhancedWireframeStudio
  const getWireframe = useCallback(async (wireframeId: string) => {
    // In a real app, this would fetch from an API
    return currentWireframe;
  }, [currentWireframe]);

  const loadProjectWireframes = useCallback(async (projectId: string) => {
    // In a real app, this would fetch from an API
    return currentWireframe ? [currentWireframe] : [];
  }, [currentWireframe]);

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
