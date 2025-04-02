
import { supabase } from "@/integrations/supabase/client";
import { PromptTestStatus } from "./ab-testing-service";

/**
 * Service for database operations related to A/B prompt testing
 * Uses direct query approach to avoid TypeScript table definitions issues
 */
export const PromptDBService = {
  /**
   * Fetch active test for a content type
   */
  async getActiveTest(contentType: string) {
    const { data, error } = await supabase
      .from('ai_prompt_tests')
      .select('*, variants:ai_prompt_variants(*)')
      .eq('content_type', contentType)
      .eq('status', 'active')
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching active prompt test:", error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Fetch all tests with their variants
   */
  async getAllTests() {
    const { data, error } = await supabase
      .from('ai_prompt_tests')
      .select('*, variants:ai_prompt_variants(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching prompt tests:", error);
      return [];
    }
    
    return data;
  },
  
  /**
   * Fetch a specific test by ID
   */
  async getTest(testId: string) {
    const { data, error } = await supabase
      .from('ai_prompt_tests')
      .select('*, variants:ai_prompt_variants(*)')
      .eq('id', testId)
      .single();
    
    if (error) {
      console.error("Error fetching prompt test:", error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Create a new test
   */
  async createTest(testData: {
    name: string;
    description?: string;
    content_type: string;
    min_sample_size?: number;
    confidence_threshold?: number;
  }) {
    const { data, error } = await supabase
      .from('ai_prompt_tests')
      .insert({
        name: testData.name,
        description: testData.description,
        content_type: testData.content_type,
        min_sample_size: testData.min_sample_size || 100,
        confidence_threshold: testData.confidence_threshold || 95,
        status: 'active' as PromptTestStatus
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating prompt test:", error);
      return null;
    }
    
    return data;
  },
  
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
  },
  
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
