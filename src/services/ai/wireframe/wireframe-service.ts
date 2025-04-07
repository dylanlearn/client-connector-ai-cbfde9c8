
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeSection } from "./wireframe-types";

/**
 * Service for handling wireframe CRUD operations
 */
export const WireframeService = {
  /**
   * Get all wireframes for a project
   */
  getProjectWireframes: async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('wireframes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Error fetching wireframes: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getProjectWireframes:", error);
      throw error;
    }
  },

  /**
   * Get a specific wireframe by ID with its sections
   */
  getWireframe: async (wireframeId: string) => {
    try {
      // Get the wireframe
      const { data: wireframe, error: wireframeError } = await supabase
        .from('wireframes')
        .select('*')
        .eq('id', wireframeId)
        .maybeSingle();
      
      if (wireframeError || !wireframe) {
        throw new Error(`Error fetching wireframe: ${wireframeError?.message || 'Not found'}`);
      }
      
      // Get sections for this wireframe
      const { data: sections, error: sectionsError } = await supabase
        .from('wireframe_sections')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('position_order', { ascending: true });
      
      if (sectionsError) {
        throw new Error(`Error fetching wireframe sections: ${sectionsError.message}`);
      }
      
      return { 
        ...wireframe,
        sections: sections || [] 
      };
    } catch (error) {
      console.error("Error in getWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Save a new wireframe
   */
  createWireframe: async (wireframeData: {
    title: string;
    description?: string;
    data: WireframeData;
    sections?: WireframeSection[];
  }) => {
    try {
      const { title, description, data } = wireframeData;
      
      const { data: newWireframe, error } = await supabase
        .from('wireframes')
        .insert({
          title,
          description,
          data
        })
        .select('*')
        .single();
      
      if (error || !newWireframe) {
        throw new Error(`Error creating wireframe: ${error?.message || 'Unknown error'}`);
      }
      
      // If sections are provided, save them
      if (wireframeData.sections && wireframeData.sections.length > 0) {
        await WireframeService.saveSections(newWireframe.id, wireframeData.sections);
      }
      
      return newWireframe;
    } catch (error) {
      console.error("Error in createWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Save sections for a wireframe
   */
  saveSections: async (wireframeId: string, sections: WireframeSection[]) => {
    try {
      // The RPC function makes it easy to save all sections at once
      const { data, error } = await supabase
        .rpc('save_wireframe_sections', { 
          p_wireframe_id: wireframeId,
          p_sections: sections 
        });
        
      if (error) {
        throw new Error(`Error saving wireframe sections: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error in saveSections:", error);
      throw error;
    }
  },
  
  /**
   * Update a wireframe
   */
  updateWireframe: async (wireframeId: string, updates: {
    title?: string;
    description?: string;
    data?: WireframeData;
    sections?: WireframeSection[];
  }) => {
    try {
      // Create an update object with only the fields that are provided
      const updateObject: any = {};
      if (updates.title !== undefined) updateObject.title = updates.title;
      if (updates.description !== undefined) updateObject.description = updates.description;
      if (updates.data !== undefined) updateObject.data = updates.data;
      
      // Update the wireframe
      const { data: updatedWireframe, error } = await supabase
        .from('wireframes')
        .update(updateObject)
        .eq('id', wireframeId)
        .select('*')
        .single();
      
      if (error || !updatedWireframe) {
        throw new Error(`Error updating wireframe: ${error?.message || 'Unknown error'}`);
      }
      
      // If sections are provided, save them
      if (updates.sections && updates.sections.length > 0) {
        await WireframeService.saveSections(wireframeId, updates.sections);
      }
      
      return updatedWireframe;
    } catch (error) {
      console.error("Error in updateWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Delete a wireframe
   */
  deleteWireframe: async (wireframeId: string) => {
    try {
      const { error } = await supabase
        .from('wireframes')
        .delete()
        .eq('id', wireframeId);
      
      if (error) {
        throw new Error(`Error deleting wireframe: ${error.message}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteWireframe:", error);
      throw error;
    }
  }
};
