
import { supabase } from "@/integrations/supabase/client";
import { PromptTestStatus } from "../ab-testing-service";

/**
 * Service for database operations related to A/B prompt tests
 */
export const PromptTestsService = {
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
  }
};
