
import { supabase } from "@/integrations/supabase/client";
import { WireframeMonitoringService } from "./monitoring-service";
import { 
  WireframeGenerationParams, 
  WireframeGenerationResult, 
  AIWireframe,
  WireframeData
} from "./wireframe-types";
import { withRetry } from "@/utils/retry-utils";

/**
 * Service for API interactions related to wireframe generation
 */
export const WireframeApiService = {
  /**
   * Generate a wireframe using the edge function
   */
  generateWireframe: async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    try {
      const { data, error } = await withRetry(
        async () => supabase.functions.invoke("generate-wireframe", { body: params }),
        { 
          maxRetries: 2,
          onRetry: (attempt) => {
            WireframeMonitoringService.recordEvent('wireframe_generation_retry', {
              projectId: params.projectId,
              attempt
            });
          }
        }
      );

      if (error) {
        throw error;
      }

      return data as WireframeGenerationResult;
    } catch (error) {
      WireframeMonitoringService.recordEvent('wireframe_generation_failure', {
        projectId: params.projectId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'error');
      
      throw error;
    }
  },

  /**
   * Save generated wireframe to the database
   */
  saveWireframe: async (
    projectId: string,
    prompt: string,
    wireframeData: WireframeData,
    params: WireframeGenerationParams,
    model: string
  ): Promise<AIWireframe> => {
    const { data, error } = await supabase
      .from('ai_wireframes')
      .insert({
        project_id: projectId,
        prompt: prompt,
        description: wireframeData.description,
        generation_params: {
          style: params.style,
          complexity: params.complexity,
          industry: params.industry,
          additionalInstructions: params.additionalInstructions,
          moodboardSelections: params.moodboardSelections,
          intakeResponses: params.intakeResponses,
          model: model,
          result_data: wireframeData
        } as any,
        design_tokens: wireframeData.designTokens as any,
        mobile_layouts: wireframeData.sections.reduce((acc, section) => {
          if (section.mobileLayout) {
            acc[section.name] = section.mobileLayout;
          }
          return acc;
        }, {} as Record<string, any>),
        animations: wireframeData.sections.reduce((acc, section) => {
          if (section.animationSuggestions) {
            acc[section.name] = section.animationSuggestions;
          }
          return acc;
        }, {} as Record<string, any>),
        style_variants: wireframeData.sections.reduce((acc, section) => {
          if (section.styleVariants) {
            acc[section.name] = section.styleVariants;
          }
          return acc;
        }, {} as Record<string, any>),
        design_reasoning: wireframeData.sections.map(s => s.designReasoning).filter(Boolean).join('\n\n'),
        quality_flags: wireframeData.qualityFlags as any,
        status: 'completed'
      })
      .select();

    if (error) {
      throw error;
    }

    return data[0] as unknown as AIWireframe;
  },

  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    const { data, error } = await supabase
      .from('ai_wireframes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as unknown as AIWireframe[];
  },

  /**
   * Get a specific wireframe by ID
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe & { sections?: any[] }> => {
    const { data: wireframe, error: wireframeError } = await supabase
      .from('ai_wireframes')
      .select('*')
      .eq('id', wireframeId)
      .single();

    if (wireframeError) {
      throw wireframeError;
    }

    const typedWireframe = wireframe as unknown as AIWireframe;
    const generationParams = typedWireframe.generation_params || {};
    
    // Safely access result_data with type checking
    const resultData = generationParams && typeof generationParams === 'object' && 'result_data' in generationParams 
      ? (generationParams as any).result_data as WireframeData | undefined
      : undefined;
    
    const sections = resultData?.sections || [];

    return {
      ...typedWireframe,
      sections: sections.map((section, index) => ({
        id: `section-${index}`,
        wireframe_id: wireframeId,
        name: section.name,
        description: section.description,
        section_type: section.sectionType,
        layout_type: section.layoutType,
        components: section.components,
        copy_suggestions: section.copySuggestions,
        animation_suggestions: section.animationSuggestions,
        design_reasoning: section.designReasoning,
        position_order: index,
        mobile_layout: section.mobileLayout,
        dynamic_elements: section.dynamicElements,
        style_variants: section.styleVariants
      }))
    };
  },

  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (wireframeId: string, feedback: string, rating?: number): Promise<void> => {
    const updateData: Record<string, any> = { feedback };
    if (rating !== undefined) {
      updateData.rating = rating;
    }

    const { error } = await supabase
      .from('ai_wireframes')
      .update(updateData)
      .eq('id', wireframeId);

    if (error) {
      throw error;
    }
  },

  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<void> => {
    const { error } = await supabase
      .from('ai_wireframes')
      .delete()
      .eq('id', wireframeId);

    if (error) {
      throw error;
    }
  }
};
