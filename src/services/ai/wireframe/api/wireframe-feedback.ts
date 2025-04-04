
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling wireframe feedback operations
 */
export const wireframeFeedback = {
  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (
    wireframeId: string, 
    feedback: string, 
    rating?: number
  ): Promise<void> => {
    try {
      const updateData: { feedback: string; rating?: number } = { feedback };
      
      if (rating !== undefined) {
        updateData.rating = rating;
      }
      
      const { error } = await supabase
        .from('ai_wireframes')
        .update(updateData)
        .eq('id', wireframeId);
      
      if (error) {
        throw new Error(`Error updating wireframe feedback: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating wireframe feedback:", error);
      throw error;
    }
  }
};
