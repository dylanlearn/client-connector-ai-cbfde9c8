
import { DesignMemoryEntry } from '../types/design-memory-types';

/**
 * Result of a pattern recognition operation
 */
export interface PatternRecognitionResult {
  confidence: number;
  patternId: string;
  matchedFeatures: string[];
  similarPatterns: Array<{
    patternId: string;
    similarityScore: number;
  }>;
}

/**
 * Feature vector representation of a design pattern
 */
export interface PatternFeatureVector {
  layoutType: number[];
  colorContrast: number;
  typographyScale: number[];
  spacingDensity: number;
  componentComplexity: number;
  visualHierarchy: number[];
}

/**
 * Options for pattern recognition operations
 */
export interface PatternRecognitionOptions {
  minConfidence?: number;
  industryContext?: string;
  includeFeatureAnalysis?: boolean;
  maxResults?: number;
}

/**
 * Similar pattern result type
 */
export interface SimilarPatternResult {
  patternId: string;
  similarityScore: number;
}
