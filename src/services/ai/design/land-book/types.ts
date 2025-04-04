
import { DesignMemoryEntry, DesignMemoryQueryOptions } from "../types/design-memory-types";

export interface LandBookQueryOptions extends DesignMemoryQueryOptions {
  pageSize?: number;
  page?: number;
  sortBy?: 'relevance' | 'date' | 'popularity';
  sortDirection?: 'asc' | 'desc';
}

export interface LandBookAnalysis {
  designType: string;
  conversionScore: number;
  keyElements: string[];
  targetAudience: string[];
  industryRelevance: string[];
}

export interface LandBookPaginatedResult {
  data: DesignMemoryEntry[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CacheItem {
  timestamp: number;
  data: any;
  expiresIn: number;
}
