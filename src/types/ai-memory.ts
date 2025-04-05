
/**
 * Centralized type definitions for AI memory functionality
 */

export interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata?: Record<string, any>;
  memory_type?: string;
}

export interface EnhancedMemorySearchResult {
  exactMatches: any[];
  semanticMatches: VectorSearchResult[];
}

export interface StoreMemoryOptions {
  anonymizeForGlobal?: boolean;
  generateEmbedding?: boolean;
}

// Export types from existing files for centralization
export * from '@/services/ai/memory/memory-types';
