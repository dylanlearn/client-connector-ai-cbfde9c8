import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { AIFeatureType, selectModelForFeature } from '@/services/ai/ai-model-selector';

export interface LayoutRecommendation {
  id: string;
  type: 'hierarchy' | 'alignment' | 'spacing' | 'balance' | 'emphasis' | 'other';
  description: string;
  sectionId?: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  implementationSteps?: string[];
  visualExample?: string;
}

export interface LayoutAnalysisResult {
  score: number;
  recommendations: LayoutRecommendation[];
  strengths: string[];
  summary: string;
}

/**
 * Service for analyzing wireframe layouts and providing design recommendations
 */
export class LayoutAnalyzerService {
  /**
   * Analyze the entire wireframe layout
   */
  static async analyzeLayout(wireframe: WireframeData): Promise<LayoutAnalysisResult> {
    try {
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const promptContent = `
        Analyze this wireframe layout based on design principles:
        ${JSON.stringify({
          title: wireframe.title,
          description: wireframe.description,
          sections: wireframe.sections.map(s => ({
            id: s.id,
            type: s.sectionType,
            name: s.name,
            components: s.components?.length
          }))
        })}
        
        Evaluate for:
        - Visual hierarchy
        - Balance and alignment
        - White space and spacing
        - Emphasis and focus
        - Content density
        - Section ordering

        Provide an analysis in JSON format:
        {
          "score": number between 0-100,
          "recommendations": [
            {
              "id": "unique-id",
              "type": "hierarchy|alignment|spacing|balance|emphasis|other",
              "description": "Clear, actionable recommendation",
              "sectionId": "affected section id or null for global",
              "priority": "high|medium|low",
              "reasoning": "Why this matters for the design",
              "implementationSteps": ["Step 1", "Step 2"]
            }
          ],
          "strengths": ["Strength 1", "Strength 2"],
          "summary": "Brief overall assessment"
        }
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are an expert UX/UI designer specializing in layout analysis. Provide objective, insightful recommendations based on established design principles.",
          temperature: 0.4,
          model
        },
      });
      
      if (error) {
        throw new Error(`Layout analysis error: ${error.message}`);
      }
      
      const response = JSON.parse(data.response);
      
      // Ensure each recommendation has an ID
      const recommendations = response.recommendations.map((rec: any) => ({
        id: rec.id || uuidv4(),
        ...rec
      }));
      
      return {
        score: response.score,
        recommendations,
        strengths: response.strengths,
        summary: response.summary
      };
    } catch (error) {
      console.error('Error analyzing layout:', error);
      
      // Return a fallback result
      return {
        score: 0,
        recommendations: [],
        strengths: [],
        summary: 'Failed to analyze layout. Please try again later.'
      };
    }
  }
  
  /**
   * Analyze a specific section
   */
  static async analyzeSection(section: WireframeSection): Promise<LayoutRecommendation[]> {
    try {
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const promptContent = `
        Analyze this wireframe section based on design principles:
        ${JSON.stringify({
          id: section.id,
          type: section.sectionType,
          name: section.name,
          components: section.components
        })}
        
        Provide section-specific layout recommendations in JSON format:
        [
          {
            "id": "unique-id",
            "type": "hierarchy|alignment|spacing|balance|emphasis|other",
            "description": "Clear, actionable recommendation",
            "sectionId": "${section.id}",
            "priority": "high|medium|low",
            "reasoning": "Why this matters for the design",
            "implementationSteps": ["Step 1", "Step 2"]
          }
        ]
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are an expert UX/UI designer specializing in layout analysis. Provide objective, section-specific recommendations based on established design principles.",
          temperature: 0.4,
          model
        },
      });
      
      if (error) {
        throw new Error(`Section analysis error: ${error.message}`);
      }
      
      const recommendations = JSON.parse(data.response);
      
      // Ensure each recommendation has an ID and the correct sectionId
      return recommendations.map((rec: any) => ({
        id: rec.id || uuidv4(),
        sectionId: section.id,
        ...rec
      }));
    } catch (error) {
      console.error('Error analyzing section:', error);
      return [];
    }
  }
  
  /**
   * Apply a specific layout recommendation to a wireframe
   */
  static async applyRecommendation(
    wireframe: WireframeData,
    recommendationId: string
  ): Promise<WireframeData> {
    // Implementation would require applying specific layout changes
    // This is a placeholder implementation that would be replaced with actual logic
    const updatedWireframe = { ...wireframe };
    
    // In a real implementation, you would:
    // 1. Find the recommendation by ID
    // 2. Apply specific layout changes based on recommendation type
    // 3. Return the updated wireframe
    
    // For now, just return the unchanged wireframe
    console.log(`Applied recommendation ${recommendationId} (mock implementation)`);
    return updatedWireframe;
  }
}
