
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing design suggestions in the memory system
 */
export const DesignSuggestionService = {
  /**
   * Store a design suggestion in history
   */
  storeDesignSuggestion: async (
    userId: string,
    prompt: string,
    result: Record<string, any>,
    context?: Record<string, any>,
    usedReferences?: string[]
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('design_suggestion_history')
        .insert({
          user_id: userId,
          prompt: prompt,
          result: result,
          context: context || {},
          used_references: usedReferences || []
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Error storing design suggestion:', error);
      return null;
    }
  },

  /**
   * Rate a stored design suggestion
   */
  rateDesignSuggestion: async (
    suggestionId: string,
    rating: number
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('design_suggestion_history')
        .update({ rating })
        .eq('id', suggestionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error rating design suggestion:', error);
      return false;
    }
  }
};
