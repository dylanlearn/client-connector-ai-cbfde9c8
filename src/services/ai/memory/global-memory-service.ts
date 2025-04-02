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
        const existingMemory = existingMemories[0] as GlobalMemory;
        const newFrequency = existingMemory.frequency + 1;
        const newRelevance = (existingMemory.relevanceScore + relevanceScore) / 2; // Average
        
        const { data, error } = await supabase
          .from('global_memories')
          .update({
            frequency: newFrequency,
            relevanceScore: newRelevance,
            timestamp: new Date(), // Update timestamp to reflect recent usage
            metadata: { ...existingMemory.metadata, ...metadata }
          })
          .eq('id', existingMemory.id)
          .select()
          .single();

        if (error) throw error;
        return data as GlobalMemory;
      } else {
        // Create new memory entry
        const memoryEntry: GlobalMemory = {
          id: uuidv4(),
          content,
          category,
          timestamp: new Date(),
          frequency: 1,
          relevanceScore,
          metadata
        };

        const { data, error } = await supabase
          .from('global_memories')
          .insert(memoryEntry)
          .select()
          .single();

        if (error) throw error;
        return data as GlobalMemory;
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
        .gte('relevanceScore', relevanceThreshold);

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
      query = query.order('relevanceScore', { ascending: false })
                  .order('frequency', { ascending: false })
                  .limit(limit);

      const { data, error } = await query;

      if (error) throw error;
      return data as GlobalMemory[];
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

      if (fetchError) throw fetchError;
      
      const currentMemory = memory as GlobalMemory;
      // Adjust relevance score based on feedback
      const relevanceAdjustment = isPositive ? 0.1 : -0.1;
      let newRelevance = currentMemory.relevanceScore + relevanceAdjustment;
      
      // Keep relevance score between 0 and 1
      newRelevance = Math.max(0, Math.min(1, newRelevance));
      
      const { error: updateError } = await supabase
        .from('global_memories')
        .update({
          relevanceScore: newRelevance,
          metadata: { 
            ...currentMemory.metadata,
            lastFeedback: isPositive ? 'positive' : 'negative',
            feedbackDetails
          }
        })
        .eq('id', memoryId);

      if (updateError) throw updateError;
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
        .order('relevanceScore', { ascending: false })
        .order('frequency', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return ["Not enough data to extract insights"];
      }
      
      // Use AI to analyze patterns in the global memories
      const memories = data as GlobalMemory[];
      const memoryContents = memories.map(m => m.content).join("\n");
      
      const promptContent = `
        Analyze the following collection of design insights and extract key patterns, trends, 
        and actionable recommendations:
        
        ${memoryContents}
        
        Provide a JSON array of string insights that summarize the most valuable patterns 
        found in these anonymized data points.
      `;
      
      const systemPrompt = `You are an analytics expert specialized in extracting 
        meaningful patterns from design data. Focus on identifying actionable insights 
        that can improve design recommendations.`;
      
      // Use GPT-4o for in-depth analysis
      const model = selectModelForFeature(AIFeatureType.DataAnalytics);
      
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt,
          temperature: 0.4,
          model
        },
      });
      
      if (aiError) throw aiError;
      
      return JSON.parse(aiResponse.response);
    } catch (error) {
      console.error("Error analyzing global memory insights:", error);
      return ["Error analyzing insights from global memory"];
    }
  }
};
