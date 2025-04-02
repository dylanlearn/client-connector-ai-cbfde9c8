
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for A/B testing analytics operations
 */
export const PromptAnalyticsService = {
  /**
   * Record an impression
   */
  async recordImpression(testId: string, variantId: string, userId: string) {
    const { error } = await supabase
      .from('ai_prompt_impressions')
      .insert({
        test_id: testId,
        variant_id: variantId,
        user_id: userId
      });
    
    if (error) {
      console.error("Error recording impression:", error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Record a success
   */
  async recordSuccess(testId: string, variantId: string, userId: string, latencyMs: number, tokenUsage?: number) {
    const { error } = await supabase
      .from('ai_prompt_results')
      .insert({
        test_id: testId,
        variant_id: variantId,
        user_id: userId,
        successful: true,
        latency_ms: latencyMs,
        token_usage: tokenUsage
      });
    
    if (error) {
      console.error("Error recording success:", error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Record a failure
   */
  async recordFailure(testId: string, variantId: string, userId: string, errorType?: string) {
    const { error } = await supabase
      .from('ai_prompt_results')
      .insert({
        test_id: testId,
        variant_id: variantId,
        user_id: userId,
        successful: false,
        error_type: errorType
      });
    
    if (error) {
      console.error("Error recording failure:", error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Get impressions count
   */
  async getImpressions(testId: string) {
    const { data, error } = await supabase
      .from('ai_prompt_impressions')
      .select('variant_id')
      .eq('test_id', testId);
    
    if (error) {
      console.error("Error getting impressions:", error);
      return [];
    }
    
    return data;
  },
  
  /**
   * Get results
   */
  async getResults(testId: string) {
    const { data, error } = await supabase
      .from('ai_prompt_results')
      .select('*')
      .eq('test_id', testId);
    
    if (error) {
      console.error("Error getting results:", error);
      return [];
    }
    
    return data;
  }
};
