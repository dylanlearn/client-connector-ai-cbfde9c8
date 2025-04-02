
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for database operations related to A/B prompt variants
 */
export const PromptVariantsService = {
  /**
   * Create variants for a test
   */
  async createVariants(variants: Array<{
    test_id: string;
    name: string;
    prompt_text: string;
    system_prompt?: string;
    is_control: boolean;
    weight: number;
  }>) {
    const { data, error } = await supabase
      .from('ai_prompt_variants')
      .insert(variants)
      .select();
    
    if (error) {
      console.error("Error creating prompt variants:", error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Get a specific variant
   */
  async getVariant(variantId: string) {
    const { data, error } = await supabase
      .from('ai_prompt_variants')
      .select('*')
      .eq('id', variantId)
      .single();
    
    if (error) {
      console.error("Error fetching variant:", error);
      return null;
    }
    
    return data;
  }
};
