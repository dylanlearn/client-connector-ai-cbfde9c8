
/**
 * Utility to determine which OpenAI model to use based on feature type
 */
export enum AIFeatureType {
  DataAnalytics = 'data_analytics',
  DesignRecommendation = 'design_recommendation',
  ContentGeneration = 'content_generation',
  Summarization = 'summarization',
  Conversation = 'conversation'
}

/**
 * Selects the appropriate AI model based on feature importance and complexity
 */
export const selectModelForFeature = (featureType: AIFeatureType): string => {
  // Use GPT-4o for all data analytics and important creative tasks
  switch (featureType) {
    case AIFeatureType.DataAnalytics:
    case AIFeatureType.DesignRecommendation:
    case AIFeatureType.ContentGeneration:
      return 'gpt-4o'; // Use full GPT-4o for important features
    
    case AIFeatureType.Summarization:
    case AIFeatureType.Conversation:
    default:
      return 'gpt-4o-mini'; // Use GPT-4o-mini for simpler tasks
  }
};
