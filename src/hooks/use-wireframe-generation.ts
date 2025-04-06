
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WireframeService } from "@/services/ai/wireframe/wireframe-service";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  AIWireframe, 
  WireframeData 
} from "@/services/ai/wireframe/wireframe-types";

export function useWireframeGeneration() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [creativityLevel, setCreativityLevel] = useState<number>(8); // Default high creativity
  const { toast } = useToast();

  const generateWireframe = async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      toast({
        title: "Generating wireframe",
        description: "Creating a highly creative design, this might take a moment...",
      });
      
      // Add creativity parameters
      const enhancedParams = {
        ...params,
        enhancedCreativity: true,
        creativityLevel: creativityLevel,
      };
      
      // Call the wireframe generation service
      console.log("Calling wireframe service with params:", enhancedParams);
      const result = await WireframeService.generateWireframe(enhancedParams);
      console.log("Generated wireframe result:", result);
      
      // Make sure the wireframe property exists and has sections
      if (result && result.wireframe) {
        if (!result.wireframe.sections && !result.wireframe.pages) {
          // Create default empty sections array if none exists
          result.wireframe.sections = [];
        }
        
        // Ensure wireframe data is properly structured for visualization
        if (Array.isArray(result.wireframe.pages) && result.wireframe.pages.length > 0) {
          // Make sure each page has a sections array
          result.wireframe.pages = result.wireframe.pages.map(page => ({
            ...page,
            sections: Array.isArray(page.sections) ? page.sections : []
          }));
        }
      }
      
      setCurrentWireframe(result);
      setCreativityLevel(result.creativityLevel || creativityLevel); // Update creativity level if returned
      
      toast({
        title: "Creative wireframe generated",
        description: `Generated "${result.wireframe.title || 'New wireframe'}" in ${result.generationTime.toFixed(2)}s`,
      });
      
      return result;
    } catch (err) {
      console.error("Error generating wireframe:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate wireframe";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Wireframe generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCreativeVariation = async (baseWireframe: WireframeData, projectId?: string) => {
    if (!baseWireframe) return null;
    
    try {
      toast({
        title: "Generating creative variation",
        description: "Creating an alternative design concept...",
      });
      
      // Create a new variation with increased creativity
      const params: WireframeGenerationParams = {
        description: `Creative variation of: ${baseWireframe.title || 'Existing wireframe'}`,
        enhancedCreativity: true,
        creativityLevel: Math.min(creativityLevel + 2, 10), // Increase creativity but cap at 10
        baseWireframe,
        projectId
      };
      
      return await generateWireframe(params);
    } catch (error) {
      console.error("Error generating variation:", error);
      toast({
        title: "Variation generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
    }
  };
  
  const loadProjectWireframes = async (projectId: string) => {
    try {
      const results = await WireframeService.getProjectWireframes(projectId);
      setWireframes(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load wireframes";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Failed to load wireframes",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    }
  };

  const getWireframe = async (wireframeId: string) => {
    try {
      return await WireframeService.getWireframe(wireframeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get wireframe";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Failed to load wireframe",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  const provideFeedback = async (wireframeId: string, feedback: string, rating?: number) => {
    try {
      await WireframeService.updateWireframeFeedback(wireframeId, feedback, rating);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback",
      });
      
      // Refresh the wireframes list if we have them loaded
      if (wireframes.length > 0) {
        const projectId = wireframes[0].project_id;
        await loadProjectWireframes(projectId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit feedback";
      
      toast({
        title: "Failed to submit feedback",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteWireframe = async (wireframeId: string) => {
    try {
      await WireframeService.deleteWireframe(wireframeId);
      
      // Update the local state by removing the deleted wireframe
      setWireframes(prevWireframes => 
        prevWireframes.filter(wireframe => wireframe.id !== wireframeId)
      );
      
      toast({
        title: "Wireframe deleted",
        description: "The wireframe has been removed",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete wireframe";
      
      toast({
        title: "Failed to delete wireframe",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    isGenerating,
    wireframes,
    currentWireframe,
    error,
    creativityLevel,
    generateWireframe,
    generateCreativeVariation,
    setCreativityLevel,
    loadProjectWireframes,
    getWireframe,
    provideFeedback,
    deleteWireframe
  };
}
