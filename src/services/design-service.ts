
import { supabase } from "@/integrations/supabase/client";
import { DesignToken } from "@/types/design";
import { toast } from "sonner";

/**
 * Service for design-related operations
 */
export const DesignService = {
  /**
   * Get design tokens for a project
   */
  async getDesignTokens(projectId: string): Promise<DesignToken[]> {
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching design tokens:', error);
      throw error;
    }
  },
  
  /**
   * Save design preferences
   */
  async saveDesignPreference(
    userId: string,
    category: string,
    designOptionId: string,
    title: string,
    notes?: string
  ): Promise<void> {
    try {
      // Check if preference already exists
      const { data: existing } = await supabase
        .from('design_preferences')
        .select('id')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('design_option_id', designOptionId)
        .maybeSingle();
        
      if (existing) {
        // Update existing preference
        await supabase
          .from('design_preferences')
          .update({
            notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Insert new preference
        await supabase
          .from('design_preferences')
          .insert({
            user_id: userId,
            category,
            design_option_id: designOptionId,
            title,
            notes
          });
      }
      
      toast.success('Design preference saved');
    } catch (error) {
      console.error('Error saving design preference:', error);
      toast.error('Failed to save design preference');
      throw error;
    }
  },
  
  /**
   * Get design analytics
   */
  async getDesignAnalytics(category: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('design_analytics')
        .select('*')
        .eq('category', category);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching design analytics:', error);
      throw error;
    }
  }
};
