
import { useCallback } from "react";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";
import { WireframeManagementService } from "@/services/ai/wireframe/management/wireframe-management-service";

export function useWireframeFeedback(
  wireframes: AIWireframe[],
  setWireframes: (wireframes: AIWireframe[]) => void,
  toast: any
) {
  /**
   * Provide feedback for a wireframe
   */
  const provideFeedback = useCallback(async (
    wireframeId: string, 
    feedback: string, 
    rating?: number
  ) => {
    try {
      const success = await WireframeManagementService.updateWireframeFeedback(
        wireframeId, 
        feedback, 
        rating
      );
      
      if (success) {
        // Update the wireframes state with the new feedback
        setWireframes(wireframes.map(wireframe => 
          wireframe.id === wireframeId 
            ? { ...wireframe, feedback, rating } 
            : wireframe
        ));
        
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback"
        });
        
        return true;
      } else {
        throw new Error("Failed to update wireframe feedback");
      }
    } catch (error) {
      console.error("Error providing feedback:", error);
      
      toast({
        title: "Error submitting feedback",
        description: "Please try again later",
        variant: "destructive"
      });
      
      return false;
    }
  }, [wireframes, setWireframes, toast]);
  
  /**
   * Delete a wireframe
   */
  const deleteWireframe = useCallback(async (wireframeId: string) => {
    try {
      const success = await WireframeManagementService.deleteWireframe(wireframeId);
      
      if (success) {
        // Remove the deleted wireframe from state
        setWireframes(wireframes.filter(wireframe => wireframe.id !== wireframeId));
        
        toast({
          title: "Wireframe deleted",
          description: "Wireframe has been successfully deleted"
        });
        
        return true;
      } else {
        throw new Error("Failed to delete wireframe");
      }
    } catch (error) {
      console.error("Error deleting wireframe:", error);
      
      toast({
        title: "Error deleting wireframe",
        description: "Please try again later",
        variant: "destructive"
      });
      
      return false;
    }
  }, [wireframes, setWireframes, toast]);
  
  return {
    provideFeedback,
    deleteWireframe
  };
}
