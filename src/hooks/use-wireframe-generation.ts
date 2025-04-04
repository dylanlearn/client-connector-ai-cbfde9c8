
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WireframeService, WireframeGenerationParams, WireframeGenerationResult, AIWireframe } from "@/services/ai/wireframe/wireframe-service";

export function useWireframeGeneration() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframes, setWireframes] = useState<AIWireframe[]>([]);
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const generateWireframe = async (params: WireframeGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      toast({
        title: "Generating wireframe",
        description: "This might take a moment...",
      });
      
      const result = await WireframeService.generateWireframe(params);
      
      setCurrentWireframe(result);
      
      toast({
        title: "Wireframe generated",
        description: `Generated "${result.wireframe.title}" in ${result.generationTime.toFixed(2)}s`,
      });
      
      return result;
    } catch (err) {
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
    generateWireframe,
    loadProjectWireframes,
    getWireframe,
    provideFeedback,
    deleteWireframe,
  };
}
