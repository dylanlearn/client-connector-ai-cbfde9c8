
import { GlobalMemory, MemoryCategory, MemoryQueryOptions } from "./memory-types";
import { GlobalMemoryStorage } from "./global/global-memory-storage";
import { GlobalMemoryRetrieval } from "./global/global-memory-retrieval";
import { GlobalMemoryFeedback } from "./global/global-memory-feedback";
import { GlobalMemoryInsights } from "./global/global-memory-insights";
import { GlobalMemoryRealtime } from "./global/global-memory-realtime";

/**
 * Service for managing anonymized global AI memory
 * This layer learns from aggregated feedback, successful outputs, and interaction patterns
 */
export const GlobalMemoryService = {
  /**
   * Store an anonymized memory entry in the global layer
   */
  storeAnonymizedMemory: GlobalMemoryStorage.storeAnonymizedMemory,

  /**
   * Retrieve global memories based on query options
   */
  getMemories: GlobalMemoryRetrieval.getMemories,

  /**
   * Process user feedback to improve global memory relevance scores
   */
  processUserFeedback: GlobalMemoryFeedback.processUserFeedback,

  /**
   * Analyze global memories to extract insights using AI
   */
  analyzeInsights: GlobalMemoryInsights.analyzeInsights,
  
  /**
   * Real-time functionality for global memory
   */
  realtime: {
    /**
     * Subscribe to real-time memory insights
     */
    subscribeToInsights: GlobalMemoryRealtime.subscribeToInsights,
    
    /**
     * Trigger a real-time analysis update
     */
    triggerAnalysisUpdate: GlobalMemoryRealtime.triggerAnalysisUpdate
  }
};
