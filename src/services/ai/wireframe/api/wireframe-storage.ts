
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeData, 
  AIWireframe
} from "../wireframe-types";
import { wireframeSections } from "./wireframe-sections";
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate UUID format
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Service for wireframe storage and retrieval operations
 */
export const wireframeStorage = {
  /**
   * Save wireframe to database
   */
  saveWireframe: async (
    projectId: string,
    prompt: string,
    wireframeData: WireframeData,
    params: any,
    model: string
  ): Promise<AIWireframe> => {
    try {
      // Ensure projectId is a valid UUID
      const validProjectId = isValidUUID(projectId) ? projectId : uuidv4();
      
      // Extract main wireframe data
      const { 
        title, 
        description, 
        sections = [], 
        designTokens = {}, 
        mobileLayouts = null,
        styleVariants = null,
        designReasoning = null,
        animations = null,
        imageUrl = null
      } = wireframeData;
      
      // Convert wireframeData to a JSON-compatible format
      const wireframeDataJson = JSON.parse(JSON.stringify(wireframeData));
      
      // Insert wireframe into database - using type assertion since we know the structure
      const { data, error } = await supabase
        .from('ai_wireframes')
        .insert({
          project_id: validProjectId,
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
            result_data: wireframeDataJson // Store the complete wireframe data as JSON
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
        await wireframeSections.saveSections(data.id, sections);
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
      // Ensure projectId is a valid UUID
      if (!isValidUUID(projectId)) {
        console.warn(`Invalid UUID format for project ID: ${projectId}. Returning empty array.`);
        return [];
      }
      
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
      const sections = await wireframeSections.getSections(wireframeId);
      
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
      // Convert wireframeData to JSON-compatible format
      const wireframeDataJson = JSON.parse(JSON.stringify(data));
      
      // Update the wireframe in the database using the RPC function
      // Use type assertion to bypass the TypeScript error with RPC
      const { data: updatedWireframe, error } = await (supabase
        .rpc('update_wireframe_data', {
          p_wireframe_id: wireframeId,
          p_data: wireframeDataJson
        }) as any);
      
      if (error) {
        throw new Error(`Error updating wireframe data: ${error.message}`);
      }
      
      // If there are sections, update or insert them
      if (data.sections && data.sections.length > 0) {
        await wireframeSections.updateSections(wireframeId, data.sections);
      }
      
      return updatedWireframe as unknown as AIWireframe;
    } catch (error) {
      console.error("Error updating wireframe data:", error);
      throw error;
    }
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string): Promise<void> => {
    try {
      // First delete sections
      await wireframeSections.deleteSections(wireframeId);
      
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
