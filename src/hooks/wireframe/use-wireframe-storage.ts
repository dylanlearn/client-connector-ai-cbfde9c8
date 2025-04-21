
import { useCallback } from "react";
import { toast, Toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIWireframe } from "@/services/ai/wireframe/wireframe-types";

export function useWireframeStorage(
  setWireframes: React.Dispatch<React.SetStateAction<AIWireframe[]>>,
  showToast: (props: Omit<Toast, "id">) => any = toast
) {
  // Load wireframes for a specific project
  const loadProjectWireframes = useCallback(async (projectId: string) => {
    try {
      // In a real implementation, this would fetch wireframes from the database
      const { data, error } = await supabase
        .from("wireframes")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Update the wireframes state
      setWireframes(data as AIWireframe[]);

      return data as AIWireframe[];
    } catch (err) {
      console.error("Error loading wireframes:", err);
      
      // Show error toast
      showToast({
        title: "Failed to load wireframes",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return [];
    }
  }, [setWireframes, showToast]);

  // Get a specific wireframe by ID
  const getWireframe = useCallback(async (wireframeId: string) => {
    try {
      const { data, error } = await supabase
        .from("wireframes")
        .select("*")
        .eq("id", wireframeId)
        .single();

      if (error) throw error;

      return data as AIWireframe;
    } catch (err) {
      console.error("Error fetching wireframe:", err);
      
      // Show error toast
      showToast({
        title: "Failed to load wireframe",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return null;
    }
  }, [showToast]);

  return {
    loadProjectWireframes,
    getWireframe
  };
}
