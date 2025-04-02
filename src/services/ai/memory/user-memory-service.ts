
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, MemoryQueryOptions, UserMemory } from "./memory-types";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for managing user-specific AI memory
 * This private layer stores tone, layout preferences, and past project context
 */
export const UserMemoryService = {
  /**
   * Store a memory entry for a specific user
   */
  storeMemory: async (
    userId: string,
    content: string,
    category: MemoryCategory,
    metadata: Record<string, any> = {}
  ): Promise<UserMemory | null> => {
    try {
      const memoryEntry: UserMemory = {
        id: uuidv4(),
        userId,
        content,
        category,
        timestamp: new Date(),
        metadata
      };

      // Using type assertion to work around type checking limitations
      // with dynamically created tables
      const { data, error } = await (supabase
        .from('user_memories') as any)
        .insert({
          id: memoryEntry.id,
          user_id: memoryEntry.userId,
          content: memoryEntry.content,
          category: memoryEntry.category,
          timestamp: memoryEntry.timestamp,
          metadata: memoryEntry.metadata
        })
        .select()
        .single();

      if (error) {
        console.error("Error storing user memory:", error);
        return memoryEntry; // Return the original object as fallback
      }
      
      return {
        id: data.id,
        userId: data.user_id,
        content: data.content,
        category: data.category as MemoryCategory,
        timestamp: new Date(data.timestamp),
        metadata: data.metadata
      };
    } catch (error) {
      console.error("Error storing user memory:", error);
      return null;
    }
  },

  /**
   * Retrieve memories for a specific user based on query options
   */
  getMemories: async (
    userId: string,
    options: MemoryQueryOptions = {}
  ): Promise<UserMemory[]> => {
    try {
      const { categories, limit = 50, timeframe, metadata } = options;
      
      // Using type assertion to work around type checking limitations
      let query = (supabase
        .from('user_memories') as any)
        .select('*')
        .eq('user_id', userId);

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

      // Order by timestamp and limit results
      query = query.order('timestamp', { ascending: false }).limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error("Error retrieving user memories:", error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        content: item.content,
        category: item.category as MemoryCategory,
        timestamp: new Date(item.timestamp),
        metadata: item.metadata
      }));
    } catch (error) {
      console.error("Error retrieving user memories:", error);
      return [];
    }
  },

  /**
   * Delete a specific memory entry
   */
  deleteMemory: async (memoryId: string): Promise<boolean> => {
    try {
      const { error } = await (supabase
        .from('user_memories') as any)
        .delete()
        .eq('id', memoryId);

      if (error) {
        console.error("Error deleting user memory:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting user memory:", error);
      return false;
    }
  }
};
