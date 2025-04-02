import { supabase } from "@/integrations/supabase/client";

/**
 * Service for processing user feedback on global memory entries
 */
export const GlobalMemoryFeedback = {
  /**
   * Process user feedback to improve global memory relevance scores
   */
  processUserFeedback: async (
    memoryId: string,
    isPositive: boolean,
    feedbackDetails?: string
  ): Promise<boolean> => {
    try {
      const { data: memory, error: fetchError } = await (supabase
        .from('global_memories') as any)
        .select('*')
        .eq('id', memoryId)
        .single();

      if (fetchError) {
        console.error("Error fetching global memory:", fetchError);
        return false;
      }
      
      // Adjust relevance score based on feedback
      const relevanceAdjustment = isPositive ? 0.1 : -0.1;
      let newRelevance = memory.relevance_score + relevanceAdjustment;
      
      // Keep relevance score between 0 and 1
      newRelevance = Math.max(0, Math.min(1, newRelevance));
      
      const { error: updateError } = await (supabase
        .from('global_memories') as any)
        .update({
          relevance_score: newRelevance,
          metadata: { 
            ...memory.metadata,
            lastFeedback: isPositive ? 'positive' : 'negative',
            feedbackDetails
          }
        })
        .eq('id', memoryId);

      if (updateError) {
        console.error("Error updating global memory:", updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error processing feedback for global memory:", error);
      return false;
    }
  }
};
