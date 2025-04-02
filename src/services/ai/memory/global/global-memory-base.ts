
import { supabase } from "@/integrations/supabase/client";
import { GlobalMemory, MemoryCategory } from "../memory-types";

/**
 * Base utility functions for global memory operations
 */
export const GlobalMemoryBase = {
  /**
   * Map a database result to a GlobalMemory object
   */
  mapToGlobalMemory(item: any): GlobalMemory {
    return {
      id: item.id,
      content: item.content,
      category: item.category as MemoryCategory,
      timestamp: new Date(item.timestamp),
      frequency: item.frequency,
      relevanceScore: item.relevance_score,
      metadata: item.metadata
    };
  }
};
