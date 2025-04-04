import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, GlobalMemoryType, MemoryQueryOptions } from "../memory-types";
import { GlobalMemoryBase } from "./global-memory-base";

/**
 * Service for retrieving global memory entries
 */
export const GlobalMemoryRetrieval = {
  /**
   * Retrieve global memories based on query options
   */
  getMemories: async (
    options: MemoryQueryOptions = {}
  ): Promise<GlobalMemoryType[]> => {
    try {
      const { 
        categories, 
        limit = 50, 
        timeframe, 
        metadata,
        relevanceThreshold = 0.3 
      } = options;
      
      // Using type assertion to work around type checking limitations
      let query = (supabase
        .from('global_memories') as any)
        .select('*')
        .gte('relevance_score', relevanceThreshold);

      // Apply filters based on options
      if (categories && categories.length > 0) {
        query = query.in('category', categories);
      }

      if (timeframe?.from) {
        query = query.gte('timestamp', timeframe.from.toISOString());
      }

      if (timeframe?.to) {
        query = query.lte('timestamp', timeframe.to.toISOString());
      }

      // Filter by metadata if provided
      if (metadata) {
        for (const [key, value] of Object.entries(metadata)) {
          query = query.eq(`metadata->>${key}`, value);
        }
      }

      // Order by relevance and frequency
      query = query.order('relevance_score', { ascending: false })
                  .order('frequency', { ascending: false })
                  .limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error("Error retrieving global memories:", error);
        return [];
      }
      
      return data.map(item => GlobalMemoryBase.mapToGlobalMemory(item));
    } catch (error) {
      console.error("Error retrieving global memories:", error);
      return [];
    }
  }
};
