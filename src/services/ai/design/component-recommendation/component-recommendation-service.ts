
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { supabase } from '@/integrations/supabase/client';
import { 
  ComponentRecommendation, 
  ComponentRecommendationRequest, 
  ComponentRecommendationResult
} from './types';
import { AIFeatureType, selectModelForFeature } from '../../ai-model-selector';

/**
 * Service for recommending components based on wireframe context
 */
export class ComponentRecommendationService {
  /**
   * Get component recommendations for an entire wireframe
   */
  static async getRecommendations(
    wireframe: WireframeData,
    pageContext?: string,
    contentType?: string,
    userIntent?: string,
    industry?: string
  ): Promise<ComponentRecommendationResult> {
    try {
      const request: ComponentRecommendationRequest = {
        wireframe,
        pageContext,
        contentType,
        userIntent,
        industry
      };
      
      // Use the AI model selector to get the appropriate model
      const model = selectModelForFeature(AIFeatureType.ComponentRecommendation);
      
      const { data, error } = await supabase.functions.invoke("recommend-components", {
        body: {
          request,
          model
        }
      });
      
      if (error) throw new Error(error.message);
      return data.recommendations;
    } catch (error) {
      console.error("Error getting component recommendations:", error);
      
      // Return fallback recommendations
      return {
        pageContext: '',
        contentType: '',
        recommendationsBySection: [],
        globalRecommendations: [],
        designPatterns: []
      };
    }
  }
  
  /**
   * Get component recommendations for a specific section
   */
  static async getSectionRecommendations(
    wireframe: WireframeData,
    sectionId: string,
    maxRecommendations: number = 5
  ): Promise<ComponentRecommendation[]> {
    try {
      const section = wireframe.sections.find(s => s.id === sectionId);
      
      if (!section) {
        throw new Error(`Section with ID ${sectionId} not found`);
      }
      
      const request: ComponentRecommendationRequest = {
        wireframe,
        sectionId,
        maxRecommendations
      };
      
      const { data, error } = await supabase.functions.invoke("recommend-components", {
        body: {
          request,
          sectionOnly: true
        }
      });
      
      if (error) throw new Error(error.message);
      return data.sectionRecommendations;
    } catch (error) {
      console.error("Error getting section recommendations:", error);
      
      // Return fallback recommendations
      return [
        {
          componentType: 'generic',
          componentName: 'Fallback Component',
          confidence: 50,
          reason: 'Unable to retrieve recommendations'
        }
      ];
    }
  }
}
