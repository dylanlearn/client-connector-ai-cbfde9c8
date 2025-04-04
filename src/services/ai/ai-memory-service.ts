
import {
  UserMemoryService,
  GlobalMemoryService,
  ProjectMemoryService,
  VectorMemoryService,
  MemoryCategory,
  MemoryQueryOptions
} from './memory';
import { EnhancedMemoryService } from './memory/enhanced-memory-service';

/**
 * Unified service for AI memory management across different layers
 */
export const AIMemoryService = {
  // User-specific memory layer
  user: {
    store: UserMemoryService.storeMemory,
    get: UserMemoryService.getMemories,
    delete: UserMemoryService.deleteMemory
  },
  
  // Project-specific memory layer (client-scoped micro-memories)
  project: {
    store: ProjectMemoryService.storeMemory,
    get: ProjectMemoryService.getMemories,
    delete: ProjectMemoryService.deleteMemory
  },
  
  // Anonymous global memory layer
  global: {
    store: GlobalMemoryService.storeAnonymizedMemory,
    get: GlobalMemoryService.getMemories,
    processFeedback: GlobalMemoryService.processUserFeedback,
    analyzeInsights: GlobalMemoryService.analyzeInsights,
    realtime: GlobalMemoryService.realtime
  },
  
  // Vector search capabilities
  vector: {
    store: VectorMemoryService.storeEmbedding,
    search: VectorMemoryService.semanticSearch,
    stats: VectorMemoryService.getMemorySystemStats
  },
  
  /**
   * Enhanced store function that also creates embeddings
   */
  storeWithEmbedding: EnhancedMemoryService.storeMemoryWithEmbedding,
  
  /**
   * Enhanced search function that combines traditional and vector search
   */
  enhancedSearch: EnhancedMemoryService.searchMemories,
  
  /**
   * Retrieves memories from all layers based on context
   * This method orchestrates the layered memory approach
   */
  getContextualMemories: async (
    userId: string,
    projectId?: string,
    options: MemoryQueryOptions = {}
  ) => {
    // Get user-specific memories
    const userMemories = await UserMemoryService.getMemories(userId, options);
    
    // Get project-specific memories if a projectId is provided
    const projectMemories = projectId 
      ? await ProjectMemoryService.getMemories(projectId, options)
      : [];
    
    // Get global memories (with higher relevance threshold)
    const globalOptions = {
      ...options,
      relevanceThreshold: 0.5, // Only highly relevant global patterns
      limit: options.limit ? Math.min(options.limit, 20) : 20 // Limit global memories
    };
    const globalMemories = await GlobalMemoryService.getMemories(globalOptions);
    
    return {
      userMemories,
      projectMemories,
      globalMemories
    };
  },
  
  /**
   * Stores a memory across appropriate layers based on context
   */
  storeMemoryAcrossLayers: async (
    userId: string,
    content: string,
    category: MemoryCategory,
    projectId?: string,
    metadata: Record<string, any> = {},
    anonymizeForGlobal: boolean = true,
    generateEmbedding: boolean = true
  ) => {
    if (generateEmbedding) {
      // Use the enhanced version that also creates embeddings
      return await EnhancedMemoryService.storeMemoryWithEmbedding(
        userId,
        content,
        category,
        projectId,
        metadata,
        anonymizeForGlobal
      );
    }
    
    // Traditional storage without embeddings
    // Store in user-specific memory
    await UserMemoryService.storeMemory(userId, content, category, metadata);
    
    // Store in project-specific memory if a projectId is provided
    if (projectId) {
      await ProjectMemoryService.storeMemory(projectId, userId, content, category, metadata);
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
      
      await GlobalMemoryService.storeAnonymizedMemory(
        anonymizedContent,
        category,
        relevanceScore,
        anonymizedMetadata
      );
    }
    
    return true;
  }
};

// Export for use throughout the application
export { MemoryCategory } from './memory';
