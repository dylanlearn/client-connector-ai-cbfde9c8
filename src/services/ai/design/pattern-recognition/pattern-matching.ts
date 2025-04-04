
import { PatternFeatureVector, PatternRecognitionOptions, PatternRecognitionResult, SimilarPatternResult } from './types';

/**
 * Compute similarities between a feature vector and known patterns
 */
export function computePatternSimilarities(
  featureVector: PatternFeatureVector,
  industryContext?: string
): Array<PatternRecognitionResult> {
  // This would be an advanced algorithm in production
  // For now, we'll return a simplified result
  return [{
    confidence: 0.85,
    patternId: 'minimal-split-screen',
    matchedFeatures: ['layout', 'typography', 'spacing'],
    similarPatterns: getSimilarPatterns('minimal-split-screen', 2)
  },
  {
    confidence: 0.72,
    patternId: 'dark-hero-dual-image',
    matchedFeatures: ['contrast', 'imagery', 'layout'],
    similarPatterns: getSimilarPatterns('dark-hero-dual-image', 2)
  }];
}

/**
 * Get similar patterns to a reference pattern
 */
export function getSimilarPatterns(
  referencePatternId: string,
  limit: number
): Array<SimilarPatternResult> {
  // Simplified implementation
  const similarPatterns: Record<string, Array<SimilarPatternResult>> = {
    'minimal-split-screen': [
      { patternId: 'startup-split-hero', similarityScore: 0.82 },
      { patternId: 'content-first-blog', similarityScore: 0.68 }
    ],
    'dark-hero-dual-image': [
      { patternId: 'creative-agency-portfolio', similarityScore: 0.75 },
      { patternId: 'ecommerce-product-showcase', similarityScore: 0.64 }
    ],
    'startup-split-hero': [
      { patternId: 'minimal-split-screen', similarityScore: 0.82 },
      { patternId: 'dark-hero-dual-image', similarityScore: 0.71 }
    ]
  };
  
  return (similarPatterns[referencePatternId] || []).slice(0, limit);
}

/**
 * Apply pattern recognition options to filter and limit results
 */
export function applyOptionsToResults(
  similarities: PatternRecognitionResult[],
  options: PatternRecognitionOptions
): PatternRecognitionResult[] {
  const {
    minConfidence = 0.65,
    maxResults = 5
  } = options;
  
  // Filter by confidence and limit results
  return similarities
    .filter(sim => sim.confidence >= minConfidence)
    .slice(0, maxResults);
}
