
import { supabase } from "@/integrations/supabase/client";

export interface WireframeGenerationParams {
  prompt: string;
  projectId: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  pages?: string[];
  industry?: string;
  additionalInstructions?: string;
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
  intakeResponses?: {
    businessGoals?: string;
    targetAudience?: string;
    siteFeatures?: string[];
  };
}

export interface WireframeComponent {
  type: string;
  content: string;
  style?: string;
  position?: string;
}

export interface WireframeCopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  body?: string;
}

export interface WireframeAnimationSuggestion {
  type: string;
  element: string;
  timing?: string;
  description?: string;
}

export interface WireframeDynamicElement {
  type: string;
  purpose: string;
  implementation?: string;
}

export interface WireframeStyleVariant {
  name: string;
  description: string;
  keyDifferences: string[];
}

export interface WireframeMobileLayout {
  structure: string;
  stackOrder?: string[];
  adjustments?: string[];
}

export interface WireframeSection {
  name: string;
  sectionType: string;
  description: string;
  layoutType: string;
  components: WireframeComponent[];
  copySuggestions?: WireframeCopySuggestions;
  animationSuggestions?: WireframeAnimationSuggestion;
  designReasoning?: string;
  mobileLayout?: WireframeMobileLayout;
  dynamicElements?: WireframeDynamicElement[];
  styleVariants?: WireframeStyleVariant[];
}

export interface WireframeDesignTokens {
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography: {
    headings?: string;
    body?: string;
    fontPairings?: string[];
  };
  spacing?: {
    sectionPadding?: string;
    elementGap?: string;
  };
}

export interface WireframeQualityFlags {
  unclearInputs?: string[];
  recommendedClarifications?: string[];
}

export interface WireframeData {
  title: string;
  description: string;
  sections: WireframeSection[];
  designTokens?: WireframeDesignTokens;
  qualityFlags?: WireframeQualityFlags;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  generationTime: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIWireframe {
  id: string;
  project_id: string;
  prompt: string;
  description?: string;
  image_url?: string;
  generation_params?: Record<string, any>;
  feedback?: string;
  rating?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  design_tokens?: Record<string, any>;
  mobile_layouts?: Record<string, any>;
  animations?: Record<string, any>;
  style_variants?: Record<string, any>;
  design_reasoning?: string;
  quality_flags?: Record<string, any>;
}

/**
 * Service for AI-powered wireframe generation and management
 */
export const WireframeService = {
  /**
   * Generate a wireframe using AI based on a prompt and parameters
   */
  generateWireframe: async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-wireframe", {
        body: params,
      });

      if (error) {
        console.error("Error generating wireframe:", error);
        throw error;
      }

      const wireframeResult = data as WireframeGenerationResult;
      const wireframeData = wireframeResult.wireframe;

      // Store the generated wireframe in the database
      const { data: savedWireframe, error: saveError } = await supabase
        .from('ai_wireframes')
        .insert({
          project_id: params.projectId,
          prompt: params.prompt,
          description: wireframeData.description,
          generation_params: {
            style: params.style,
            complexity: params.complexity,
            industry: params.industry,
            additionalInstructions: params.additionalInstructions,
            moodboardSelections: params.moodboardSelections,
            intakeResponses: params.intakeResponses,
            model: wireframeResult.model,
            result_data: wireframeData
          } as any, // Cast to any to avoid type issues with JSON
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

      if (saveError) {
        console.error("Error saving wireframe:", saveError);
      } else if (savedWireframe && savedWireframe.length > 0) {
        const wireframeId = savedWireframe[0].id;
        
        // Save sections separately with manual SQL query to avoid type issues
        // We'll handle this for now by omitting this part as it's not working with the Supabase client types
        // Instead, we'll store the section data in the generation_params.result_data field
        // This will still allow us to access the data even though it's not normalized
        
        // Save design tokens if available
        if (wireframeData.designTokens) {
          try {
            // Instead of RPC, directly insert into the design_tokens table
            const { error: tokenError } = await supabase
              .from('design_tokens')
              .insert({
                project_id: params.projectId,
                name: `${wireframeData.title} Design Tokens`,
                category: 'wireframe',
                value: wireframeData.designTokens as any,
                description: `Design tokens for wireframe: ${wireframeData.title}`
              });
            
            if (tokenError) {
              console.error("Error saving design tokens:", tokenError);
            }
          } catch (tokenError) {
            console.error("Exception saving design tokens:", tokenError);
          }
        }
      }

      return wireframeResult;
    } catch (error) {
      console.error("Wireframe generation failed:", error);
      throw error;
    }
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
      console.error("Error fetching wireframes:", error);
      throw error;
    }

    return data as AIWireframe[];
  },

  /**
   * Get a specific wireframe by ID with its sections
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe & { sections?: any[] }> => {
    // Get the wireframe
    const { data: wireframe, error: wireframeError } = await supabase
      .from('ai_wireframes')
      .select('*')
      .eq('id', wireframeId)
      .single();

    if (wireframeError) {
      console.error("Error fetching wireframe:", wireframeError);
      throw wireframeError;
    }

    // Extract sections from the generation_params.result_data field
    // This is a workaround until we properly set up the wireframe_sections table
    const generationParams = (wireframe as AIWireframe).generation_params || {};
    const resultData = generationParams.result_data as WireframeData | undefined;
    const sections = resultData?.sections || [];

    return {
      ...wireframe as AIWireframe,
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
    const updateData: Partial<AIWireframe> = { feedback };
    if (rating !== undefined) {
      updateData.rating = rating;
    }

    const { error } = await supabase
      .from('ai_wireframes')
      .update(updateData)
      .eq('id', wireframeId);

    if (error) {
      console.error("Error updating wireframe feedback:", error);
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
      console.error("Error deleting wireframe:", error);
      throw error;
    }
  }
};
