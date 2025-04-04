
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { VectorMemoryService } from '@/services/ai/memory/vector-memory-service';

export interface SimilarityCluster {
  cluster_name: string;
  count: number;
  similarity: number;
  top_terms: { term: string, count: number }[];
  examples: { content: string, metadata: Record<string, any> }[];
}

export interface SimilarityTrend {
  segment: string;
  count: number;
  clusters: SimilarityCluster[];
  average_similarity: number;
}

export interface PhraseHeatmapItem {
  phrase: string;
  count: number;
  outcome: number;
  impact: number;
}

export interface BehavioralPattern {
  element?: string;
  count?: number;
  frequency?: number;
  page?: string;
  category?: string;
  percentage?: number;
  global_pattern?: string;
  user_alignment?: number;
}

export interface BehavioralFingerprint {
  name: string;
  type: string;
  strength: number;
  patterns: BehavioralPattern[];
}

export function useMemoryAnalytics() {
  const [similarityTrends, setSimilarityTrends] = useState<SimilarityTrend[]>([]);
  const [phraseHeatmap, setPhraseHeatmap] = useState<PhraseHeatmapItem[]>([]);
  const [behavioralFingerprints, setBehavioralFingerprints] = useState<BehavioralFingerprint[]>([]);
  const [isLoading, setIsLoading] = useState<{
    trends: boolean;
    heatmap: boolean;
    fingerprints: boolean;
  }>({
    trends: false,
    heatmap: false,
    fingerprints: false
  });
  const [error, setError] = useState<Error | null>(null);
  
  const { user } = useAuth();

  /**
   * Get embedding similarity trends across different memory segments
   */
  const fetchSimilarityTrends = useCallback(async (
    options: {
      segmentBy?: 'user' | 'project' | 'category';
      timeframe?: { from: Date, to?: Date };
      limit?: number;
    } = {}
  ) => {
    setIsLoading(prev => ({ ...prev, trends: true }));
    setError(null);
    
    try {
      const data = await VectorMemoryService.getEmbeddingSimilarityTrends(options);
      if (data && data.trends) {
        setSimilarityTrends(data.trends);
      }
      return data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch similarity trends');
      setError(errorObj);
      return null;
    } finally {
      setIsLoading(prev => ({ ...prev, trends: false }));
    }
  }, []);

  /**
   * Get phrase heatmap data showing correlation between phrases and outcomes
   */
  const fetchPhraseHeatmap = useCallback(async (
    options: {
      outcomeMetric?: string;
      timeRange?: { from: Date, to?: Date };
      minSimilarity?: number;
    } = {}
  ) => {
    setIsLoading(prev => ({ ...prev, heatmap: true }));
    setError(null);
    
    try {
      const data = await VectorMemoryService.getPromptHeatmaps(options);
      if (data && data.phrases) {
        setPhraseHeatmap(data.phrases);
      }
      return data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch phrase heatmap');
      setError(errorObj);
      return null;
    } finally {
      setIsLoading(prev => ({ ...prev, heatmap: false }));
    }
  }, []);

  /**
   * Get behavioral fingerprints for personalized memory recall
   */
  const fetchBehavioralFingerprints = useCallback(async (
    options: {
      clusterCount?: number;
      includeGlobalPatterns?: boolean;
      minInteractions?: number;
    } = {}
  ) => {
    setIsLoading(prev => ({ ...prev, fingerprints: true }));
    setError(null);
    
    try {
      const data = await VectorMemoryService.getBehavioralFingerprints(
        user?.id,
        options
      );
      
      if (data && data.fingerprints) {
        setBehavioralFingerprints(data.fingerprints);
      }
      return data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch behavioral fingerprints');
      setError(errorObj);
      return null;
    } finally {
      setIsLoading(prev => ({ ...prev, fingerprints: false }));
    }
  }, [user]);

  return {
    similarityTrends,
    phraseHeatmap,
    behavioralFingerprints,
    isLoading,
    error,
    fetchSimilarityTrends,
    fetchPhraseHeatmap,
    fetchBehavioralFingerprints
  };
}
