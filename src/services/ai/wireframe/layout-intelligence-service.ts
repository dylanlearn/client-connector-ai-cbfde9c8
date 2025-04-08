
import { WireframeSection, AIWireframe } from './wireframe-types';
import { supabase } from "@/integrations/supabase/client";
import { AIFeatureType, selectModelForFeature } from "../ai-model-selector";

/**
 * Service for advanced layout intelligence capabilities
 */
export class LayoutIntelligenceService {
  /**
   * Analyzes the current wireframe layout and provides improvement suggestions
   */
  static async analyzeLayout(wireframe: AIWireframe): Promise<{
    suggestions: Array<{
      sectionId: string;
      suggestion: string;
      improvement: string;
      confidence: number;
    }>;
    overallScore: number;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('generation-api', {
        body: {
          action: 'analyze-wireframe-layout',
          wireframe: wireframe,
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error analyzing layout:", error);
      // Return fallback suggestions if API call fails
      return {
        suggestions: wireframe.sections.slice(0, 2).map(section => ({
          sectionId: section.id,
          suggestion: "Improve visual hierarchy",
          improvement: "Consider adjusting the spacing and typography weight to create clearer visual hierarchy.",
          confidence: 0.7
        })),
        overallScore: 0.6
      };
    }
  }
  
  /**
   * Optimizes section arrangement for better visual flow and conversion
   */
  static async optimizeSectionOrder(sections: WireframeSection[], pageType: string): Promise<{
    optimizedOrder: string[];
    reasonings: Record<string, string>;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('generation-api', {
        body: {
          action: 'optimize-section-order',
          sections: sections,
          pageType: pageType
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error optimizing section order:", error);
      // Return original order as fallback
      return {
        optimizedOrder: sections.map(s => s.id),
        reasonings: {}
      };
    }
  }
  
  /**
   * Recommends responsive layout adjustments for different devices
   */
  static async generateResponsiveRules(
    section: WireframeSection, 
    targetDevice: 'mobile' | 'tablet' | 'desktop'
  ): Promise<{
    layoutRules: Record<string, any>;
    styleChanges: Record<string, any>;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('generation-api', {
        body: {
          action: 'generate-responsive-rules',
          section: section,
          targetDevice: targetDevice
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error generating responsive rules:", error);
      // Return fallback rules
      return {
        layoutRules: {
          stackVertically: targetDevice === 'mobile',
          reduceMargins: targetDevice === 'mobile',
          simplifyLayout: targetDevice === 'mobile'
        },
        styleChanges: {
          fontSize: targetDevice === 'mobile' ? '90%' : '100%',
          spacing: targetDevice === 'mobile' ? 'compact' : 'comfortable'
        }
      };
    }
  }
  
  /**
   * Generate AI-powered layout suggestions based on site type and content
   */
  static async suggestLayouts(
    siteType: string,
    contentRequirements: string[]
  ): Promise<Array<{
    name: string;
    description: string;
    wireframeSections: Partial<WireframeSection>[];
    conversionFocus?: string;
  }>> {
    try {
      const model = selectModelForFeature(AIFeatureType.WireframeGeneration);
      const { data, error } = await supabase.functions.invoke('generation-api', {
        body: {
          action: 'suggest-layouts',
          siteType: siteType,
          contentRequirements: contentRequirements,
          model: model
        }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error suggesting layouts:", error);
      // Return fallback suggestions
      return [
        {
          name: "Standard Landing Layout",
          description: "Classic landing page with hero, features, testimonials, and CTA sections",
          wireframeSections: [
            { sectionType: "hero", name: "Hero Section" },
            { sectionType: "features", name: "Features Grid" },
            { sectionType: "testimonials", name: "Testimonials" },
            { sectionType: "cta", name: "Call to Action" }
          ]
        }
      ];
    }
  }
}
