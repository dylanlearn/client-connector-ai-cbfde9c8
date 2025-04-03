
import { supabase } from "@/integrations/supabase/client";
import { DesignFeedback } from "../types/design-memory-types";

/**
 * Service for managing user feedback about designs
 */
export const DesignFeedbackService = {
  /**
   * Record user feedback about design suggestions
   */
  recordFeedback: async (
    userId: string,
    designSuggestionId: string,
    feedbackType: 'like' | 'dislike' | 'comment',
    feedbackContent?: string,
    rating?: number,
    context: Record<string, any> = {}
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('design_feedback').insert({
        user_id: userId,
        design_suggestion_id: designSuggestionId,
        feedback_type: feedbackType,
        feedback_content: feedbackContent,
        rating,
        context
      });

      if (error) {
        console.error("Error recording design feedback:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error recording design feedback:", error);
      return false;
    }
  }
};
