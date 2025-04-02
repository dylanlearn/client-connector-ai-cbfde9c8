
import { supabase } from "@/integrations/supabase/client";
import { GlobalMemory, MemoryCategory } from "../memory-types";
import { v4 as uuidv4 } from "uuid";
import { GlobalMemoryBase } from "./global-memory-base";

/**
 * Service for storing and updating global memory entries
 */
export const GlobalMemoryStorage = {
  /**
   * Store an anonymized memory entry in the global layer
   */
  storeAnonymizedMemory: async (
    content: string,
    category: MemoryCategory,
    relevanceScore: number = 0.5,
    metadata: Record<string, any> = {}
  ): Promise<GlobalMemory | null> => {
    try {
      // Before trying to use the database, create a memory object we can return
      // if the database operations fail (temporary workaround until tables are created)
      const memoryEntry: GlobalMemory = {
        id: uuidv4(),
        content,
        category,
        timestamp: new Date(),
        frequency: 1,
        relevanceScore,
        metadata
      };

      // Check for similar existing memories to update frequency
      const { data: existingMemories } = await (supabase
        .from('global_memories') as any)
        .select('*')
        .eq('category', category)
        .textSearch('content', content, {
          config: 'english',
          type: 'plain'
        })
        .limit(1);

      if (existingMemories && existingMemories.length > 0) {
        // Update existing memory frequency and relevance
        const existingMemory = existingMemories[0];
        const newFrequency = existingMemory.frequency + 1;
        const newRelevance = (existingMemory.relevance_score + relevanceScore) / 2; // Average
        
        const { data, error } = await (supabase
          .from('global_memories') as any)
          .update({
            frequency: newFrequency,
            relevance_score: newRelevance,
            timestamp: new Date(), // Update timestamp to reflect recent usage
            metadata: { ...existingMemory.metadata, ...metadata }
          })
          .eq('id', existingMemory.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating global memory:", error);
          return memoryEntry; // Return the original object as fallback
        }
        
        return GlobalMemoryBase.mapToGlobalMemory(data);
      } else {
        // Create new memory entry
        const { data, error } = await (supabase
          .from('global_memories') as any)
          .insert({
            id: memoryEntry.id,
            content: memoryEntry.content,
            category: memoryEntry.category,
            timestamp: memoryEntry.timestamp,
            frequency: memoryEntry.frequency,
            relevance_score: memoryEntry.relevanceScore,
            metadata: memoryEntry.metadata
          })
          .select()
          .single();

        if (error) {
          console.error("Error storing global memory:", error);
          return memoryEntry; // Return the original object as fallback
        }
        
        return GlobalMemoryBase.mapToGlobalMemory(data);
      }
    } catch (error) {
      console.error("Error storing global memory:", error);
      return null;
    }
  }
};
