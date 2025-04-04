
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface WireframeGenerationParams {
  prompt: string;
  projectId: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  pages?: string[];
  industry?: string;
  additionalInstructions?: string;
}

export interface WireframeComponent {
  type: string;
  content: string;
  style?: string;
  position?: string;
}

export interface WireframeSection {
  name: string;
  description: string;
  components: WireframeComponent[];
}

export interface WireframeData {
  title: string;
  description: string;
  sections: WireframeSection[];
  layout: string;
  colorScheme: string;
  typography: string;
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

      // Store the generated wireframe in the database
      const { data: savedWireframe, error: saveError } = await supabase
        .from('ai_wireframes')
        .insert({
          project_id: params.projectId,
          prompt: params.prompt,
          description: data.wireframe.description,
          generation_params: {
            style: params.style,
            complexity: params.complexity,
            industry: params.industry,
            additionalInstructions: params.additionalInstructions,
            model: data.model,
          },
          status: 'completed'
        })
        .select()
        .single();

      if (saveError) {
        console.error("Error saving wireframe:", saveError);
      }

      return data as WireframeGenerationResult;
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
   * Get a specific wireframe by ID
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe> => {
    const { data, error } = await supabase
      .from('ai_wireframes')
      .select('*')
      .eq('id', wireframeId)
      .single();

    if (error) {
      console.error("Error fetching wireframe:", error);
      throw error;
    }

    return data as AIWireframe;
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
