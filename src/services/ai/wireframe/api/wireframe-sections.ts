
import { supabase } from "@/integrations/supabase/client";
import { AIWireframe, WireframeSection } from "../wireframe-types";

/**
 * Service for handling wireframe sections operations
 */
export const wireframeSections = {
  /**
   * Get all sections for a wireframe
   */
  getWireframeSections: async (wireframeId: string): Promise<WireframeSection[]> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_sections')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('position_order', { ascending: true });
        
      if (error) {
        throw new Error(`Error fetching wireframe sections: ${error.message}`);
      }
      
      return data as unknown as WireframeSection[];
    } catch (error) {
      console.error("Error fetching wireframe sections:", error);
      throw error;
    }
  },

  /**
   * Add a section to a wireframe
   */
  addWireframeSection: async (
    wireframeId: string, 
    section: WireframeSection
  ): Promise<WireframeSection> => {
    try {
      // Convert the section to the format expected by the database
      const dbSection = {
        wireframe_id: wireframeId,
        name: section.name,
        section_type: section.sectionType,
        description: section.description || null,
        layout_type: section.layoutType,
        components: section.components || null,
        mobile_layout: section.mobileLayout || null,
        style_variants: section.styleVariants || null,
        animation_suggestions: section.animationSuggestions || null,
        copy_suggestions: section.copySuggestions || null,
        design_reasoning: section.designReasoning || null
      };
      
      const { data, error } = await supabase
        .from('wireframe_sections')
        .insert(dbSection)
        .select()
        .single();
        
      if (error) {
        throw new Error(`Error adding wireframe section: ${error.message}`);
      }
      
      return data as unknown as WireframeSection;
    } catch (error) {
      console.error("Error adding wireframe section:", error);
      throw error;
    }
  },
  
  /**
   * Update wireframe sections batch
   */
  updateWireframeSections: async (wireframeId: string, sections: WireframeSection[]): Promise<boolean> => {
    try {
      // First, delete existing sections
      const { error: deleteError } = await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
      
      if (deleteError) {
        throw new Error(`Error deleting existing wireframe sections: ${deleteError.message}`);
      }
      
      // Then, insert new sections if there are any
      if (sections && sections.length > 0) {
        // Convert each section to the DB format
        const newSections = sections.map((section, index) => ({
          wireframe_id: wireframeId,
          position_order: index,
          name: section.name,
          section_type: section.sectionType || '', 
          description: section.description || null,
          layout_type: section.layoutType || '', 
          components: section.components || null,
          mobile_layout: section.mobileLayout || null,
          style_variants: section.styleVariants || null,
          animation_suggestions: section.animationSuggestions || null,
          copy_suggestions: section.copySuggestions || null,
          design_reasoning: section.designReasoning || null
        }));
        
        // Insert each section individually to avoid type errors with bulk insert
        for (const section of newSections) {
          const { error: insertError } = await supabase
            .from('wireframe_sections')
            .insert(section);
          
          if (insertError) {
            throw new Error(`Error inserting new wireframe section: ${insertError.message}`);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error updating wireframe sections:", error);
      throw error;
    }
  },

  /**
   * Get all sections for a wireframe - alias for getWireframeSections
   */
  getSections: async (wireframeId: string): Promise<WireframeSection[]> => {
    return wireframeSections.getWireframeSections(wireframeId);
  },

  /**
   * Save sections for a wireframe
   */
  saveSections: async (wireframeId: string, sections: WireframeSection[]): Promise<boolean> => {
    return wireframeSections.updateWireframeSections(wireframeId, sections);
  },

  /**
   * Update sections for a wireframe - alias for updateWireframeSections
   */
  updateSections: async (wireframeId: string, sections: WireframeSection[]): Promise<boolean> => {
    return wireframeSections.updateWireframeSections(wireframeId, sections);
  },

  /**
   * Delete sections for a wireframe
   */
  deleteSections: async (wireframeId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
      
      if (error) {
        throw new Error(`Error deleting wireframe sections: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting wireframe sections:", error);
      throw error;
    }
  }
};
