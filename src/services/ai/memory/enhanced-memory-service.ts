
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
      
      // Store in global memory only for certain categories that benefit platform-wide learning
      // and only if anonymization is enabled
      if (anonymizeForGlobal && [
        MemoryCategory.SuccessfulOutput,
        MemoryCategory.InteractionPattern,
        MemoryCategory.ClientFeedback
      ].includes(category)) {
        // Remove any personally identifiable information
        const anonymizedContent = content;
        const anonymizedMetadata = { 
          ...metadata,
          // Remove or mask sensitive fields
          userId: undefined,
          userEmail: undefined,
          clientName: undefined,
          projectName: undefined
        };
        
        // Calculate an initial relevance score
        const relevanceScore = 0.5; // Start with neutral relevance
        
        const globalMemory = await GlobalMemoryService.storeAnonymizedMemory(
          anonymizedContent,
          category,
          relevanceScore,
          anonymizedMetadata
        );
        
        // Generate embedding for the global memory
        if (globalMemory?.id) {
          await VectorMemoryService.storeEmbedding(
            globalMemory.id,
            'global',
            anonymizedContent,
            [],
            { ...anonymizedMetadata, category, relevanceScore }
          );
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error in storeMemoryWithEmbedding:", error);
      return false;
    }
  },
  
  /**
   * Search for memories using both traditional queries and vector similarity
   */
  searchMemories: async (
    query: string,
    options: MemoryQueryOptions & {
      userId?: string;
      projectId?: string;
      useVectorSearch?: boolean;
      similarityThreshold?: number;
    } = {}
  ) => {
    const results = {
      exactMatches: [] as any[],
      semanticMatches: [] as VectorSearchResult[],
    };
    
    // Traditional database query
    if (options.userId) {
      results.exactMatches = [
        ...results.exactMatches,
        ...await UserMemoryService.getMemories(options.userId, options)
      ];
    }
    
    if (options.projectId) {
      results.exactMatches = [
        ...results.exactMatches,
        ...await ProjectMemoryService.getMemories(options.projectId, options)
      ];
    }
    
    // Add global memories
    results.exactMatches = [
      ...results.exactMatches,
      ...await GlobalMemoryService.getMemories(options)
    ];
    
    // Vector similarity search if enabled
    if (options.useVectorSearch !== false) {
      const vectorResults = await VectorMemoryService.semanticSearch(query, {
        threshold: options.similarityThreshold || 0.7,
        limit: options.limit,
        memoryType: options.userId ? 'user' : (options.projectId ? 'project' : undefined)
      });
      
      results.semanticMatches = vectorResults as VectorSearchResult[];
    }
    
    return results;
  }
};
