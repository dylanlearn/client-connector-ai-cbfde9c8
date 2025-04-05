
/**
 * AI memory hooks for memory operations across the application
 */

export { useEnhancedMemory } from './useEnhancedMemory';
export { useMemoryAnalytics } from './useMemoryAnalytics';
export type { 
  VectorSearchResult, 
  EnhancedMemorySearchResult 
} from '@/types/ai-memory';
export type {
  SimilarityCluster,
  SimilarityTrend,
  PhraseHeatmapItem,
  BehavioralPattern,
  BehavioralFingerprint
} from './useMemoryAnalytics';
