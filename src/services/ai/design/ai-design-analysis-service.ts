
import { supabase } from "@/integrations/supabase/client";

export interface DesignAnalysisRequest {
  promptOrDescription: string;
  context?: Record<string, any>;
  industry?: string;
  category?: string;
}

export interface DesignAnalysisResponse {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  visualElements: Record<string, any>;
  colorScheme: {
    palette: string[];
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontPairings: string[];
  };
  layoutPattern: {
    type: string;
    structure: string;
    spacing: string;
  };
  tags: string[];
  relevanceScore: number;
}

/**
 * Service for analyzing design patterns using AI
 */
export const AIDesignAnalysisService = {
  /**
   * Analyze a design description and generate structured insights
   */
  analyzeDesignPattern: async (
    request: DesignAnalysisRequest
  ): Promise<DesignAnalysisResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        analysis: DesignAnalysisResponse;
        error?: string;
      }>("analyze-design-patterns", {
        body: request
      });

      if (error || !data || data.error) {
        console.error("Error analyzing design pattern:", error || data?.error);
        throw new Error(error?.message || data?.error || "Failed to analyze design pattern");
      }

      return data.analysis;
    } catch (error) {
      console.error("Error in design analysis service:", error);
      throw error;
    }
  },

  /**
   * Store the analysis result in the design memory database
   */
  storeAnalysisResult: async (
    analysis: DesignAnalysisResponse,
    sourceUrl?: string,
    imageUrl?: string
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('design_memory')
        .insert({
          category: analysis.category,
          subcategory: analysis.subcategory,
          title: analysis.title,
          description: analysis.description,
          visual_elements: analysis.visualElements,
          color_scheme: analysis.colorScheme,
          typography: analysis.typography,
          layout_pattern: analysis.layoutPattern,
          tags: analysis.tags,
          source_url: sourceUrl,
          image_url: imageUrl,
          relevance_score: analysis.relevanceScore
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error storing design analysis:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error storing design analysis:", error);
      return null;
    }
  }
};
