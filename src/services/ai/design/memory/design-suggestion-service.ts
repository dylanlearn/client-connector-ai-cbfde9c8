
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
      // Cast the table name to any to bypass TypeScript's table name checking
      const { data, error } = await (supabase
        .from('design_suggestion_history' as any)
        .insert({
          user_id: userId,
          prompt,
          result,
          used_references: usedReferences,
          context
        } as any)
        .select('id')
        .single() as any);

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
      // Cast the table name to any to bypass TypeScript's table name checking
      const { error } = await (supabase
        .from('design_suggestion_history' as any)
        .update({ rating } as any)
        .eq('id', id) as any);

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
