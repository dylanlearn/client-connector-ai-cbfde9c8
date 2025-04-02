import { supabase } from "@/integrations/supabase/client";
import { GlobalMemory, MemoryCategory, MemoryQueryOptions } from "./memory-types";
import { v4 as uuidv4 } from "uuid";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for managing anonymized global AI memory
 * This layer learns from aggregated feedback, successful outputs, and interaction patterns
 */
export const GlobalMemoryService = {
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
      const { data: existingMemories } = await supabase
        .from('global_memories')
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
        
        const { data, error } = await supabase
          .from('global_memories')
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
        
        return {
          id: data.id,
          content: data.content,
          category: data.category as MemoryCategory,
          timestamp: new Date(data.timestamp),
          frequency: data.frequency,
          relevanceScore: data.relevance_score,
          metadata: data.metadata
        };
      } else {
        // Create new memory entry
        const { data, error } = await supabase
          .from('global_memories')
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
        
        return {
          id: data.id,
          content: data.content,
          category: data.category as MemoryCategory,
          timestamp: new Date(data.timestamp),
          frequency: data.frequency,
          relevanceScore: data.relevance_score,
          metadata: data.metadata
        };
      }
    } catch (error) {
      console.error("Error storing global memory:", error);
      return null;
    }
  },

  /**
   * Retrieve global memories based on query options
   */
  getMemories: async (
    options: MemoryQueryOptions = {}
  ): Promise<GlobalMemory[]> => {
    try {
      const { 
        categories, 
        limit = 50, 
        timeframe, 
        metadata,
        relevanceThreshold = 0.3 
      } = options;
      
      let query = supabase
        .from('global_memories')
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
      
      return data.map(item => ({
        id: item.id,
        content: item.content,
        category: item.category as MemoryCategory,
        timestamp: new Date(item.timestamp),
        frequency: item.frequency,
        relevanceScore: item.relevance_score,
        metadata: item.metadata
      }));
    } catch (error) {
      console.error("Error retrieving global memories:", error);
      return [];
    }
  },

  /**
   * Process user feedback to improve global memory relevance scores
   */
  processUserFeedback: async (
    memoryId: string,
    isPositive: boolean,
    feedbackDetails?: string
  ): Promise<boolean> => {
    try {
      const { data: memory, error: fetchError } = await supabase
        .from('global_memories')
        .select('*')
        .eq('id', memoryId)
        .single();

      if (fetchError) {
        console.error("Error fetching global memory:", fetchError);
        return false;
      }
      
      // Adjust relevance score based on feedback
      const relevanceAdjustment = isPositive ? 0.1 : -0.1;
      let newRelevance = memory.relevance_score + relevanceAdjustment;
      
      // Keep relevance score between 0 and 1
      newRelevance = Math.max(0, Math.min(1, newRelevance));
      
      const { error: updateError } = await supabase
        .from('global_memories')
        .update({
          relevance_score: newRelevance,
          metadata: { 
            ...memory.metadata,
            lastFeedback: isPositive ? 'positive' : 'negative',
            feedbackDetails
          }
        })
        .eq('id', memoryId);

      if (updateError) {
        console.error("Error updating global memory:", updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error processing feedback for global memory:", error);
      return false;
    }
  },

  /**
   * Analyze global memories to extract insights using AI
   */
  analyzeInsights: async (
    category: MemoryCategory,
    limit: number = 100
  ): Promise<string[]> => {
    try {
      // Fetch most relevant memories from the specified category
      const { data, error } = await supabase
        .from('global_memories')
        .select('*')
        .eq('category', category)
        .order('relevance_score', { ascending: false })
        .order('frequency', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error("Error fetching global memories for analysis:", error);
        return ["Not enough data to extract insights"];
      }
      
      if (!data || data.length === 0) {
        return ["Not enough data to extract insights"];
      }
      
      // Use AI to analyze patterns in the global memories
      const memories = data.map(m => ({
        id: m.id,
        content: m.content,
        category: m.category as MemoryCategory,
        timestamp: new Date(m.timestamp),
        frequency: m.frequency,
        relevanceScore: m.relevance_score,
        metadata: m.metadata
      }));
      
      const memoryContents = memories.map(m => m.content).join("\n");
      
      try {
        // Call the analyze-memory-patterns edge function
        const { data: analysisData, error: fnError } = await supabase.functions.invoke("analyze-memory-patterns", {
          body: {
            category,
            limit
          },
        });
        
        if (fnError) {
          console.error("Error invoking analyze-memory-patterns function:", fnError);
          return ["Error analyzing insights from global memory"];
        }
        
        return analysisData.insights;
      } catch (aiError) {
        console.error("Error analyzing global memory insights:", aiError);
        // Fallback to returning sample insights
        return [
          "Users prefer clean, minimalist layouts", 
          "Dark mode is preferred for extended usage", 
          "Accessibility considerations are important across all designs"
        ];
      }
    } catch (error) {
      console.error("Error analyzing global memory insights:", error);
      return ["Error analyzing insights from global memory"];
    }
  }
};
