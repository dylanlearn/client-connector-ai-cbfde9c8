
/**
 * Enum for AI feature types to select the appropriate model
 */
export enum AIFeatureType {
  TextGeneration = 'text',
  ImageGeneration = 'image',
  CodeGeneration = 'code',
  DesignRecommendation = 'design',
  Analysis = 'analysis',
  ContentOptimization = 'optimization',
}

/**
 * Interface for pattern recognition options
 */
export interface PatternRecognitionOptions {
  maxResults?: number;
  industryContext?: string;
}

/**
 * Selects the appropriate AI model based on feature type and complexity
 */
export function selectModelForFeature(
  featureType: AIFeatureType,
  complexity: 'low' | 'medium' | 'high' = 'medium'
): string {
  // Map feature types to models based on complexity
  switch (featureType) {
    case AIFeatureType.TextGeneration:
      return complexity === 'high' ? 'gpt-4o' : 'gpt-4o-mini';
      
    case AIFeatureType.ImageGeneration:
      return 'dalle-3';
      
    case AIFeatureType.CodeGeneration:
      return complexity === 'high' ? 'gpt-4o' : 'gpt-4o-mini';
      
    case AIFeatureType.DesignRecommendation:
      return complexity === 'low' ? 'gpt-4o-mini' : 'gpt-4o';
      
    case AIFeatureType.Analysis:
      return 'gpt-4o';
      
    case AIFeatureType.ContentOptimization:
      return complexity === 'high' ? 'gpt-4o' : 'gpt-4o-mini';
      
    default:
      // Default to a reasonable model
      return 'gpt-4o-mini';
  }
}
