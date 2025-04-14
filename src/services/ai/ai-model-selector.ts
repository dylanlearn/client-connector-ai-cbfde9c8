
/**
 * Enum for AI feature types to help with model selection
 */
export enum AIFeatureType {
  TextGeneration = 'text_generation',
  ImageGeneration = 'image_generation',
  CodeGeneration = 'code_generation',
  DataAnalytics = 'data_analytics',
  WireframeGeneration = 'wireframe_generation',
  Conversation = 'conversation'
}

/**
 * Select the appropriate model for a given AI feature
 * This allows centralized control of which models are used for which features
 */
export function selectModelForFeature(featureType: AIFeatureType): string {
  switch (featureType) {
    case AIFeatureType.TextGeneration:
      return 'gpt-4o';
    case AIFeatureType.ImageGeneration:
      return 'dall-e-3';
    case AIFeatureType.CodeGeneration:
      return 'gpt-4o';
    case AIFeatureType.DataAnalytics:
      return 'gpt-4o';
    case AIFeatureType.WireframeGeneration:
      return 'gpt-4o';
    case AIFeatureType.Conversation:
      return 'gpt-4o';
    default:
      return 'gpt-4o'; // Default to GPT-4o for most tasks
  }
}

/**
 * Get the maximum input tokens allowed for a given model
 */
export function getModelMaxInputTokens(model: string): number {
  switch (model) {
    case 'gpt-4o':
      return 128000;
    case 'gpt-4':
      return 8192;
    case 'gpt-3.5-turbo':
      return 4096;
    default:
      return 4096; // Default to 4k tokens
  }
}

/**
 * Get the appropriate temperature setting for a given feature type
 */
export function getTemperatureForFeature(featureType: AIFeatureType): number {
  switch (featureType) {
    case AIFeatureType.CodeGeneration:
      return 0.2; // Low temperature for precise code
    case AIFeatureType.DataAnalytics:
      return 0.3; // Lower temperature for consistent analysis
    case AIFeatureType.WireframeGeneration:
      return 0.7; // Higher for creative outputs
    case AIFeatureType.Conversation:
      return 0.8; // Higher for conversational variety
    default:
      return 0.7; // Default temperature
  }
}
