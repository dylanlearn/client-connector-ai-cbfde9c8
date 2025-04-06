
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, AIWireframe } from "./wireframe-types";

export interface AdvancedWireframeParams {
  userInput: string;
  projectId?: string;
  styleToken?: string;
  includeDesignMemory?: boolean;
}

export interface DesignMemory {
  id: string;
  project_id: string;
  blueprint_id?: string;
  layout_patterns: any;
  style_preferences: any;
  component_preferences: any;
  wireframe_blueprints?: any;
}

export const AdvancedWireframeService = {
  /**
   * Generate an advanced wireframe using the updated edge function
   */
  generateWireframe: async (params: AdvancedWireframeParams) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-advanced-wireframe', {
        body: params
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.wireframe) {
        throw new Error("No wireframe data returned from API");
      }
      
      return data;
    } catch (error) {
      console.error("Error generating advanced wireframe:", error);
      throw error;
    }
  },
  
  /**
   * Save a wireframe to the database
   */
  saveWireframe: async (
    projectId: string,
    prompt: string,
    wireframeData: WireframeData,
    intentData: any,
    blueprint: any
  ) => {
    try {
      // First, save the prompt
      const { data: promptData, error: promptError } = await supabase
        .from('wireframe_prompts')
        .insert({
          user_id: supabase.auth.getUser().then(res => res.data.user?.id),
          raw_input: prompt,
          structured_intent: intentData,
          visual_tone: intentData?.visualTone || ''
        })
        .select()
        .single();
      
      if (promptError) {
        throw promptError;
      }
      
      // Save the blueprint
      const { data: blueprintData, error: blueprintError } = await supabase
        .from('wireframe_blueprints')
        .insert({
          prompt_id: promptData.id,
          blueprint_data: blueprint,
          style_token: wireframeData.styleToken || intentData?.visualTone || 'modern'
        })
        .select()
        .single();
      
      if (blueprintError) {
        throw blueprintError;
      }
      
      // Save the generated wireframe
      const { data: generatedData, error: generatedError } = await supabase
        .from('wireframe_generated')
        .insert({
          blueprint_id: blueprintData.id,
          rendered_data: wireframeData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (generatedError) {
        throw generatedError;
      }
      
      return generatedData;
    } catch (error) {
      console.error("Error saving advanced wireframe:", error);
      throw error;
    }
  },
  
  /**
   * Store design memory for a project
   */
  storeDesignMemory: async (
    projectId: string,
    blueprintId: string,
    layoutPatterns: any,
    stylePreferences: any,
    componentPreferences: any
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: {
          action: 'store',
          projectId,
          blueprintId,
          layoutPatterns,
          stylePreferences,
          componentPreferences
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error storing design memory:", error);
      throw error;
    }
  },
  
  /**
   * Retrieve design memory for a project
   */
  retrieveDesignMemory: async (projectId?: string): Promise<DesignMemory | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: {
          action: 'retrieve',
          projectId
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data?.data || null;
    } catch (error) {
      console.error("Error retrieving design memory:", error);
      return null;
    }
  },
  
  /**
   * Update design memory
   */
  updateDesignMemory: async (memoryId: string, updates: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: {
          action: 'update',
          memoryId,
          updates
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error updating design memory:", error);
      throw error;
    }
  },
  
  /**
   * Get component variants
   */
  getComponentVariants: async (componentType?: string) => {
    try {
      let query = supabase.from('wireframe_component_variants').select('*');
      
      if (componentType) {
        query = query.eq('component_type', componentType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error getting component variants:", error);
      return [];
    }
  },
  
  /**
   * Get style modifiers
   */
  getStyleModifiers: async () => {
    try {
      const { data, error } = await supabase
        .from('wireframe_style_modifiers')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error getting style modifiers:", error);
      return [];
    }
  }
};
