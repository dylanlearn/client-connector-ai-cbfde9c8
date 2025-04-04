import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, GlobalMemoryType } from "../memory-types";
import { v4 as uuidv4 } from "uuid";

// Global memory storage operations
export const GlobalMemoryStorage = {
  /**
   * Store an anonymized memory entry
   */
  storeAnonymizedMemory: async (
    content: string,
    category: MemoryCategory,
    relevanceScore: number = 0.5,
    metadata: Record<string, any> = {}
  ): Promise<GlobalMemoryType | null> => {
    try {
      const memoryEntry: GlobalMemoryType = {
        id: uuidv4(),
        content,
        category,
        relevanceScore,
        frequency: 1,
        timestamp: new Date(),
        metadata
      };

      // Using type assertion to work around type checking limitations
      const { data, error } = await (supabase
        .from('memory_analysis_results') as any)
        .insert({
          id: memoryEntry.id,
          content: memoryEntry.content,
          category: memoryEntry.category,
          relevance_score: memoryEntry.relevanceScore,
          frequency: memoryEntry.frequency,
          timestamp: memoryEntry.timestamp,
          metadata: memoryEntry.metadata
        })
        .select()
        .single();

      if (error) {
        console.error("Error storing anonymized global memory:", error);
        return null;
      }
      
      return {
        id: data.id,
        content: data.content,
        category: data.category as MemoryCategory,
        relevanceScore: data.relevance_score,
        frequency: data.frequency,
        timestamp: new Date(data.timestamp),
        metadata: data.metadata
      };
    } catch (error) {
      console.error("Error storing anonymized global memory:", error);
      return null;
    }
  },

  /**
   * Process user feedback on a global memory entry
   */
  processUserFeedback: async (
    memoryId: string,
    isHelpful: boolean
  ): Promise<boolean> => {
    try {
      // Fetch the existing memory entry
      const { data: existingMemory, error: fetchError } = await (supabase
        .from('memory_analysis_results') as any)
        .select('*')
        .eq('id', memoryId)
        .single();

      if (fetchError) {
        console.error("Error fetching global memory for feedback:", fetchError);
        return false;
      }

      if (!existingMemory) {
        console.warn("Global memory entry not found for feedback:", memoryId);
        return false;
      }

      // Update relevance score based on feedback
      const currentRelevance = existingMemory.relevance_score || 0.5;
      const updatedRelevance = isHelpful ? Math.min(1, currentRelevance + 0.1) : Math.max(0, currentRelevance - 0.1);

      // Update frequency (helpful or not)
      const currentFrequency = existingMemory.frequency || 1;
      const updatedFrequency = currentFrequency + 1;

      // Update the memory entry with new relevance and frequency
      const { error: updateError } = await (supabase
        .from('memory_analysis_results') as any)
        .update({
          relevance_score: updatedRelevance,
          frequency: updatedFrequency
        })
        .eq('id', memoryId);

      if (updateError) {
        console.error("Error updating global memory with feedback:", updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error processing user feedback on global memory:", error);
      return false;
    }
  },
};
