
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing design feedback in the memory system
 */
export const DesignFeedbackService = {
  /**
   * Record user feedback about design suggestions
   */
  recordFeedback: async (
    designSuggestionId: string,
    userId: string,
    feedbackType: string,
    rating?: number,
    feedbackContent?: string,
    context?: Record<string, any>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('design_feedback')
        .insert({
          design_suggestion_id: designSuggestionId,
          user_id: userId,
          feedback_type: feedbackType,
          rating: rating,
          feedback_content: feedbackContent,
          context: context || {}
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording design feedback:', error);
      return false;
    }
  }
};
