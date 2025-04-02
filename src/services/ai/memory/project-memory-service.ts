
import { supabase } from "@/integrations/supabase/client";
import { MemoryCategory, MemoryQueryOptions, ProjectMemory } from "./memory-types";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for managing project-specific AI memory
 * This allows for client-scoped micro-memories for agencies managing multiple brands
 */
export const ProjectMemoryService = {
  /**
   * Store a memory entry for a specific project
   */
  storeMemory: async (
    projectId: string,
    userId: string,
    content: string,
    category: MemoryCategory,
    metadata: Record<string, any> = {}
  ): Promise<ProjectMemory | null> => {
    try {
      const memoryEntry: ProjectMemory = {
        id: uuidv4(),
        projectId,
        userId,
        content,
        category,
        timestamp: new Date(),
        metadata
      };

      const { data, error } = await supabase
        .from('project_memories')
        .insert({
          id: memoryEntry.id,
          project_id: memoryEntry.projectId,
          user_id: memoryEntry.userId,
          content: memoryEntry.content,
          category: memoryEntry.category,
          timestamp: memoryEntry.timestamp,
          metadata: memoryEntry.metadata
        })
        .select()
        .single();

      if (error) {
        console.error("Error storing project memory:", error);
        return memoryEntry; // Return the original object as fallback
      }
      
      return {
        id: data.id,
        projectId: data.project_id,
        userId: data.user_id,
        content: data.content,
        category: data.category as MemoryCategory,
        timestamp: new Date(data.timestamp),
        metadata: data.metadata
      };
    } catch (error) {
      console.error("Error storing project memory:", error);
      return null;
    }
  },

  /**
   * Retrieve memories for a specific project based on query options
   */
  getMemories: async (
    projectId: string,
    options: MemoryQueryOptions = {}
  ): Promise<ProjectMemory[]> => {
    try {
      const { categories, limit = 50, timeframe, metadata } = options;
      
      let query = supabase
        .from('project_memories')
        .select('*')
        .eq('project_id', projectId);

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
        console.error("Error retrieving project memories:", error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        projectId: item.project_id,
        userId: item.user_id,
        content: item.content,
        category: item.category as MemoryCategory,
        timestamp: new Date(item.timestamp),
        metadata: item.metadata
      }));
    } catch (error) {
      console.error("Error retrieving project memories:", error);
      return [];
    }
  },

  /**
   * Delete a specific memory entry
   */
  deleteMemory: async (memoryId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_memories')
        .delete()
        .eq('id', memoryId);

      if (error) {
        console.error("Error deleting project memory:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting project memory:", error);
      return false;
    }
  }
};
