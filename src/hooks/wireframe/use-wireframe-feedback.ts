
import { useCallback } from "react";
import { Toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";

export function useWireframeFeedback(
  wireframes: AIWireframe[],
  setWireframes: React.Dispatch<React.SetStateAction<AIWireframe[]>>,
  showToast: (props: Toast) => string
) {
  // Provide feedback on a wireframe
  const provideFeedback = useCallback(async (
    wireframeId: string,
    feedback: string
  ) => {
    try {
      // In a real implementation, this would update the wireframe with feedback
      const { data, error } = await supabase
        .from("wireframe_feedback")
        .insert([
          {
            wireframe_id: wireframeId,
            feedback,
            created_at: new Date().toISOString()
          }
        ])
        .single();

      if (error) throw error;

      // Show success toast
      showToast({
        title: "Feedback submitted",
        description: "Your feedback has been saved successfully"
      });

      return true;
    } catch (err) {
      console.error("Error submitting feedback:", err);
      
      // Show error toast
      showToast({
        title: "Failed to submit feedback",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  }, [showToast]);

  // Delete a wireframe
  const deleteWireframe = useCallback(async (wireframeId: string) => {
    try {
      const { error } = await supabase
        .from("wireframes")
        .delete()
        .eq("id", wireframeId);

      if (error) throw error;

      // Update the local state by removing the deleted wireframe
      setWireframes(prevWireframes => 
        prevWireframes.filter(wireframe => wireframe.id !== wireframeId)
      );

      // Show success toast
      showToast({
        title: "Wireframe deleted",
        description: "The wireframe has been deleted successfully"
      });

      return true;
    } catch (err) {
      console.error("Error deleting wireframe:", err);
      
      // Show error toast
      showToast({
        title: "Failed to delete wireframe",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  }, [setWireframes, showToast]);

  return {
    provideFeedback,
    deleteWireframe
  };
}
