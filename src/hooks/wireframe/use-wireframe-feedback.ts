
import { useCallback } from "react";
import { WireframeService } from "@/services/ai/wireframe/wireframe-service";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";

export function useWireframeFeedback(
  wireframes: AIWireframe[],
  setWireframes: React.Dispatch<React.SetStateAction<AIWireframe[]>>,
  toast: any
) {
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
        await WireframeService.getProjectWireframes(projectId)
          .then(updatedWireframes => {
            setWireframes(updatedWireframes);
          });
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
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete wireframe";
      
      toast({
        title: "Failed to delete wireframe",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return {
    provideFeedback,
    deleteWireframe
  };
}
