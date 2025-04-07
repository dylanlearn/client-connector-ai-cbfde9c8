
import { useCallback } from "react";
import { WireframeService } from "@/services/ai/wireframe/wireframe-service";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";

export function useWireframeStorage(
  setWireframes: (wireframes: AIWireframe[]) => void,
  toast: any
) {
  const loadProjectWireframes = useCallback(async (projectId: string) => {
    try {
      const results = await WireframeService.getProjectWireframes(projectId);
      setWireframes(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load wireframes";
      
      toast({
        title: "Failed to load wireframes",
        description: errorMessage,
        variant: "destructive",
      });
      
      return [];
    }
  }, [toast, setWireframes]);

  const getWireframe = async (wireframeId: string) => {
    try {
      return await WireframeService.getWireframe(wireframeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get wireframe";
      
      toast({
        title: "Failed to load wireframe",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  return {
    loadProjectWireframes,
    getWireframe
  };
}
