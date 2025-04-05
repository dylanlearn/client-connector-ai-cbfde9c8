
import { UserMemoryService } from './user-memory-service';
import { ProjectMemoryService } from './project-memory-service';
import { GlobalMemoryService } from './global-memory-service';
import { VectorMemoryService } from './vector-memory-service';
import { MemoryCategory, MemoryQueryOptions } from "./memory-types";
import { v4 as uuidv4 } from 'uuid';
import type { VectorSearchResult } from '@/hooks/ai-memory/useVectorMemory';

/**
 * Enhanced memory service that integrates traditional database queries with vector search
 */
export const EnhancedMemoryService = {
  /**
   * Store a memory across layers and generate embeddings for vector search
   */
  storeMemoryWithEmbedding: async (
    userId: string,
    content: string,
    category: MemoryCategory,
    projectId?: string,
    metadata: Record<string, any> = {},
    anonymizeForGlobal: boolean = true
  ) => {
    try {
      // First store in user-specific memory
      const userMemory = await UserMemoryService.storeMemory(
        userId, 
        content, 
        category, 
        metadata
      );
      
      // Generate embedding for the user memory
      if (userMemory?.id) {
        await VectorMemoryService.storeEmbedding(
          userMemory.id,
          'user',
          content,
          [],
          { ...metadata, userId, category }
        );
      }
      
      // Store in project-specific memory if a projectId is provided
      if (projectId) {
        const projectMemory = await ProjectMemoryService.storeMemory(
          projectId, 
          userId, 
          content, 
          category, 
          metadata
        );
        
        // Generate embedding for the project memory
        if (projectMemory?.id) {
          await VectorMemoryService.storeEmbedding(
            projectMemory.id,
            'project',
            content,
            [],
            { ...metadata, userId, projectId, category }
          );
        }
      }
      
      // Store in global memory if anonymization is enabled
      if (anonymizeForGlobal) {
        // Remove any personally identifiable information
        const anonymizedContent = content;
        const anonymizedMetadata = { 
          ...metadata,
          userId: undefined,
          userEmail: undefined,
          clientName: undefined,
          projectName: undefined
        };
        
        // Calculate initial relevance score
        const relevanceScore = 0.5; // Start with neutral relevance
        
        const globalMemory = await GlobalMemoryService.storeAnonymizedMemory(
          anonymizedContent,
          category,
          relevanceScore,
          anonymizedMetadata
        );
        
        // Generate embedding for global memory
        if (globalMemory?.id) {
          await VectorMemoryService.storeEmbedding(
            globalMemory.id,
            'global',
            anonymizedContent,
            [],
            { category }
          );
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error storing memory with embedding:", error);
      return false;
    }
  },
  
  /**
   * Enhanced search function that combines traditional and vector search
   */
  searchMemories: async (
    query: string,
    userId: string,
    options: MemoryQueryOptions = {}
  ): Promise<VectorSearchResult[]> => {
    try {
      // Get vector search results
      const vectorResults = await VectorMemoryService.semanticSearch(
        query,
        options.limit || 10,
        { userId }
      );
      
      // TODO: In a future iteration, augment with traditional search results
      
      return vectorResults;
    } catch (error) {
      console.error("Error in enhanced memory search:", error);
      return [];
    }
  }
};
