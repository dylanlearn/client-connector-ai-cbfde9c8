
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, MemoryQueryOptions, GlobalMemory } from "./memory-types";
import { 
  GlobalMemoryBase,
  GlobalMemoryFeedback,
  GlobalMemoryInsights,
  GlobalMemoryRealtime,
  GlobalMemoryRetrieval,
  GlobalMemoryStorage
} from "./global";

/**
 * Service for managing global AI memory
 * This is the anonymous, platform-wide learning layer
 */
export const GlobalMemoryService = {
  /**
   * Store an anonymized memory
   */
  storeAnonymizedMemory: GlobalMemoryStorage.storeAnonymizedMemory,
  
  /**
   * Get global memories based on query options
   */
  getMemories: GlobalMemoryRetrieval.getMemories,
  
  /**
   * Process user feedback on a memory (positive or negative)
   */
  processUserFeedback: GlobalMemoryFeedback.processUserFeedback,
  
  /**
   * Analyze global memories to extract insights
   */
  analyzeInsights: GlobalMemoryInsights.analyzeInsights,
  
  /**
   * Realtime functionality for memory updates
   */
  realtime: {
    subscribeToInsights: GlobalMemoryRealtime.subscribeToInsights,
    triggerAnalysisUpdate: GlobalMemoryRealtime.triggerAnalysisUpdate
  }
};
