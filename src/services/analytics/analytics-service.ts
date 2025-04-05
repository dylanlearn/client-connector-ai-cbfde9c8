
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for analytics operations
 */
export const AnalyticsService = {
  /**
   * Get interaction metrics for a project
   */
  async getProjectInteractionMetrics(projectId: string) {
    try {
      const { data, error } = await supabase.rpc('get_project_interaction_metrics', {
        project_id_param: projectId
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project interaction metrics:', error);
      throw error;
    }
  },
  
  /**
   * Get design analytics
   */
  async getDesignAnalytics(category: string) {
    try {
      const { data, error } = await supabase
        .from('design_analytics')
        .select('*')
        .eq('category', category);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching design analytics:', error);
      throw error;
    }
  },
  
  /**
   * Get animation analytics
   */
  async getAnimationAnalytics(animationType: string) {
    try {
      const { data, error } = await supabase
        .from('animation_analytics')
        .select('*')
        .eq('animation_type', animationType);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching animation analytics:', error);
      throw error;
    }
  },
  
  /**
   * Save user feedback on design
   */
  async saveDesignFeedback(
    userId: string, 
    designSuggestionId: string, 
    feedback: string, 
    rating?: number
  ) {
    try {
      const { error } = await supabase
        .from('design_feedback')
        .insert({
          user_id: userId,
          design_suggestion_id: designSuggestionId,
          feedback_content: feedback,
          feedback_type: 'user_rating',
          rating
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error saving design feedback:', error);
      throw error;
    }
  }
};
