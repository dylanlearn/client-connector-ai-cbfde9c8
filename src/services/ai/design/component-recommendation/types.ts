
/**
 * Types for the Contextual Component Recommendation System
 */

export interface ComponentRecommendation {
  componentType: string;
  componentName: string;
  confidence: number; // 0-100
  reason: string;
  exampleUsage?: string;
  designPattern?: string;
}

export interface SectionComponentRecommendations {
  sectionId: string;
  sectionType: string;
  recommendations: ComponentRecommendation[];
}

export interface ComponentRecommendationResult {
  pageContext: string;
  contentType: string;
  recommendationsBySection: SectionComponentRecommendations[];
  globalRecommendations: ComponentRecommendation[];
  designPatterns: string[];
}

export interface ComponentRecommendationRequest {
  wireframe: any;
  pageContext?: string;
  contentType?: string;
  userIntent?: string;
  industry?: string;
  sectionId?: string;
  maxRecommendations?: number;
}
