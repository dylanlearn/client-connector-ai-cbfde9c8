import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  AIWireframe
} from "./wireframe-types";

/**
 * Service for interfacing with wireframe API functions and database
 */
export const WireframeApiService = {
  /**
   * Generate wireframe by calling the Edge Function
   */
  generateWireframe: async (
    params: WireframeGenerationParams
  ): Promise<WireframeGenerationResult> => {
    try {
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke<{
        wireframe: WireframeData;
        model?: string;
        usage?: { 
          total_tokens: number;
          completion_tokens: number;
          prompt_tokens: number;
        };
      }>('generate-wireframe', {
        body: params
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.wireframe) {
        throw new Error("No wireframe data returned from API");
      }
      
      const endTime = performance.now();
      const generationTime = (endTime - startTime) / 1000; // Convert to seconds
      
      return {
        wireframe: data.wireframe,
        model: data.model,
        usage: data.usage,
        generationTime,
        success: true
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
    }
  },
  
  /**
   * Save wireframe to database
   */
  saveWireframe: async (
    projectId: string,
    prompt: string,
    wireframeData: WireframeData,
    params: WireframeGenerationParams,
    model: string
  ): Promise<AIWireframe> => {
    try {
      // Extract main wireframe data
      const { 
        title, 
        description, 
        sections = [], 
        designTokens, 
        mobileLayouts,
        styleVariants,
        designReasoning,
        animations,
        imageUrl
      } = wireframeData;
      
      // Insert wireframe into database - using type assertion since we know the structure
      const { data, error } = await supabase
        .from('ai_wireframes')
        .insert({
          project_id: projectId,
          prompt: prompt,
          description: description || title,
          design_tokens: designTokens as any,
          mobile_layouts: mobileLayouts as any,
          style_variants: styleVariants as any,
          design_reasoning: designReasoning,
          animations: animations as any,
          generation_params: {
            ...params,
            model,
            result_data: wireframeData // Store the complete wireframe data as JSON
          } as any,
          image_url: imageUrl
        })
        .select('*')
        .single();
      
      if (error) {
        throw new Error(`Error saving wireframe: ${error.message}`);
      }
      
      // Handle sections if present
      if (Array.isArray(sections) && sections.length > 0) {
        // Insert all sections for this wireframe
        const sectionData = sections.map((section, index) => ({
          wireframe_id: data.id,
          name: section.name || `Section ${index + 1}`,
          section_type: section.sectionType,
          description: section.description,
          layout_type: section.layoutType,
          components: section.components,
          position_order: index,
          mobile_layout: section.mobileLayout,
          style_variants: section.styleVariants,
          animation_suggestions: section.animationSuggestions,
          copy_suggestions: section.copySuggestions,
          design_reasoning: section.designReasoning
        }));
        
        const { error: sectionsError } = await supabase
          .from('wireframe_sections')
          .insert(sectionData);
        
        if (sectionsError) {
          console.error("Error saving wireframe sections:", sectionsError);
        }
      }
      
      return data as unknown as AIWireframe;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      throw error;
    }
  },
  
  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string): Promise<AIWireframe[]> => {
    try {
      const { data, error } = await supabase
        .from('ai_wireframes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(`Error fetching wireframes: ${error.message}`);
      }
      
      return data as unknown as AIWireframe[];
    } catch (error) {
      console.error("Error fetching project wireframes:", error);
      throw error;
    }
  },
  
  /**
   * Get the latest wireframe for a project
   */
  getLatestWireframe: async (projectId: string): Promise<AIWireframe | null> => {
    try {
      const { data, error } = await supabase
        .from('ai_wireframes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If no wireframes found, return null instead of throwing error
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Error fetching latest wireframe: ${error.message}`);
      }
      
      return data as unknown as AIWireframe;
    } catch (error) {
      console.error("Error fetching latest wireframe:", error);
      throw error;
    }
  },
  
  /**
   * Get a specific wireframe by ID with its sections
   */
  getWireframe: async (wireframeId: string): Promise<AIWireframe & { sections?: any[] }> => {
    try {
      // Get the wireframe
      const { data: wireframe, error } = await supabase
        .from('ai_wireframes')
        .select('*')
        .eq('id', wireframeId)
        .single();
      
      if (error) {
        throw new Error(`Error fetching wireframe: ${error.message}`);
      }
      
      // Get sections for this wireframe
      const { data: sections, error: sectionsError } = await supabase
        .from('wireframe_sections')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('position_order', { ascending: true });
      
      if (sectionsError) {
        console.error("Error fetching wireframe sections:", sectionsError);
      }
      
      return { 
        ...wireframe as unknown as AIWireframe,
        sections: sections || []
      };
    } catch (error) {
      console.error("Error fetching wireframe:", error);
      throw error;
    }
  },
  
  /**
   * Update wireframe data
   */
  updateWireframeData: async (
    wireframeId: string,
    data: WireframeData
  ): Promise<AIWireframe | null> => {
    try {
      // Update the wireframe in the database
      const { data: updatedWireframe, error } = await supabase
        .from('ai_wireframes')
        .update({
          generation_params: {
            result_data: data
          }
        })
        .eq('id', wireframeId)
        .select('*')
        .single();
      
      if (error) {
        throw new Error(`Error updating wireframe data: ${error.message}`);
      }
      
      // If there are sections, update or insert them
      if (data.sections && data.sections.length > 0) {
        // First, delete existing sections
        const { error: deleteError } = await supabase
          .from('wireframe_sections')
          .delete()
          .eq('wireframe_id', wireframeId);
        
        if (deleteError) {
          console.error("Error deleting existing wireframe sections:", deleteError);
        }
        
        // Then insert the new sections
        const sectionData = data.sections.map((section, index) => ({
          wireframe_id: wireframeId,
          name: section.name || `Section ${index + 1}`,
          section_type: section.sectionType,
          description: section.description,
          layout_type: section.layoutType,
          components: section.components,
          position_order: index,
          mobile_layout: section.mobileLayout,
          style_variants: section.styleVariants,
          animation_suggestions: section.animationSuggestions,
          copy_suggestions: section.copySuggestions,
          design_reasoning: section.designReasoning
        }));
        
        const { error: insertError } = await supabase
          .from('wireframe_sections')
          .insert(sectionData);
        
        if (insertError) {
          console.error("Error inserting new wireframe sections:", insertError);
        }
      }
      
      return updatedWireframe as unknown as AIWireframe;
    } catch (error) {
      console.error("Error updating wireframe data:", error);
      throw error;
    }
  },
  
  /**
   * Update wireframe feedback and rating
   */
  updateWireframeFeedback: async (
    wireframeId: string, 
    feedback: string, 
    rating?: number
  ): Promise<void> => {
    try {
      const updateData: { feedback: string; rating?: number } = { feedback };
      
      if (rating !== undefined) {
        updateData.rating = rating;
      }
      
      const { error } = await supabase
        .from('ai_wireframes')
        .update(updateData)
        .eq('id', wireframeId);
      
      if (error) {
        throw new Error(`Error updating wireframe feedback: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating wireframe feedback:", error);
      throw error;
    }
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<void> => {
    try {
      // First delete sections
      const { error: sectionsError } = await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
      
      if (sectionsError) {
        console.error("Error deleting wireframe sections:", sectionsError);
      }
      
      // Then delete the wireframe
      const { error } = await supabase
        .from('ai_wireframes')
        .delete()
        .eq('id', wireframeId);
      
      if (error) {
        throw new Error(`Error deleting wireframe: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting wireframe:", error);
      throw error;
    }
  }
};
