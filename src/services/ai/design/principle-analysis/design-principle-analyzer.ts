
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { supabase } from '@/integrations/supabase/client';
import { 
  CompositionPrinciple, 
  DesignPrincipleAnalysis, 
  DesignPrincipleRequest 
} from './types';
import { AIFeatureType, selectModelForFeature } from '../../ai-model-selector';

/**
 * Service for analyzing design principles in wireframes
 */
export class DesignPrincipleAnalyzerService {
  /**
   * Analyze wireframe composition against design principles
   */
  static async analyzeComposition(
    wireframe: WireframeData,
    principleFilters?: CompositionPrinciple[]
  ): Promise<DesignPrincipleAnalysis> {
    try {
      const request: DesignPrincipleRequest = {
        wireframeData: wireframe,
        principleFilters,
        detailedFeedback: true
      };
      
      // Use the AI model selector to get the appropriate model for design analysis
      const model = selectModelForFeature(AIFeatureType.DesignAnalysis);
      
      const { data, error } = await supabase.functions.invoke("analyze-design-principles", {
        body: {
          request,
          model
        }
      });
      
      if (error) throw new Error(error.message);
      return data.analysis;
    } catch (error) {
      console.error("Error analyzing design principles:", error);
      
      // Return fallback analysis
      return {
        overallScore: 50,
        principleScores: [
          {
            principle: 'visualBalance',
            score: 50,
            feedback: 'Unable to analyze visual balance due to an error.',
            suggestions: ['Check the layout manually for visual balance.']
          }
        ],
        summary: 'Analysis failed. Please try again later.',
        topIssues: ['Analysis service unavailable'],
        topStrengths: []
      };
    }
  }
  
  /**
   * Apply improvements for a specific design principle
   */
  static async applyPrincipleImprovements(
    wireframe: WireframeData,
    principle: CompositionPrinciple
  ): Promise<WireframeData> {
    try {
      const { data, error } = await supabase.functions.invoke("apply-design-principle", {
        body: {
          wireframe,
          principle
        }
      });
      
      if (error) throw new Error(error.message);
      return data.improvedWireframe;
    } catch (error) {
      console.error(`Error applying ${principle} improvements:`, error);
      // Return the original wireframe if there's an error
      return wireframe;
    }
  }
}
