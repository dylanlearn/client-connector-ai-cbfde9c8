
import { supabase } from "@/integrations/supabase/client";
import { DesignSuggestion } from "../types/design-memory-types";

/**
 * Service for managing design suggestions history
 */
export const DesignSuggestionService = {
  /**
   * Store a design suggestion in history
   */
  storeDesignSuggestion: async (
    userId: string,
    prompt: string,
    result: Record<string, any>,
    usedReferences: string[] = [],
    context: Record<string, any> = {}
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('design_suggestion_history')
        .insert({
          user_id: userId,
          prompt,
          result,
          used_references: usedReferences,
          context
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error storing design suggestion:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error storing design suggestion:", error);
      return null;
    }
  },

  /**
   * Rate a stored design suggestion
   */
  rateDesignSuggestion: async (id: string, rating: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('design_suggestion_history')
        .update({ rating })
        .eq('id', id);

      if (error) {
        console.error("Error rating design suggestion:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error rating design suggestion:", error);
      return false;
    }
  }
};
