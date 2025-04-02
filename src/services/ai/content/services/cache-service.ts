
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing AI content cache
 */
export const AICacheService = {
  /**
   * Manually cleanup expired cache entries
   */
  cleanupExpiredCache: async (): Promise<{ 
    success: boolean; 
    entriesRemoved?: number; 
    error?: string;
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke("cleanup-expired-cache");
      
      if (error) {
        console.error("Failed to trigger cache cleanup:", error);
        return { 
          success: false, 
          error: error.message
        };
      }
      
      return { 
        success: true, 
        entriesRemoved: data?.entriesRemoved || 0
      };
    } catch (error) {
      console.error("Error triggering cache cleanup:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};
