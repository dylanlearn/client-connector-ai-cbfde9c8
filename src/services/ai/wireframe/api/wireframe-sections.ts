
import { supabase } from "@/integrations/supabase/client";
import { WireframeSection } from "../wireframe-types";

/**
 * Service for handling wireframe section operations
 */
export const wireframeSections = {
  /**
   * Save sections for a wireframe
   */
  saveSections: async (wireframeId: string, sections: WireframeSection[]): Promise<void> => {
    try {
      // Insert all sections for this wireframe
      const sectionData = sections.map((section, index) => ({
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
      
      const { error } = await supabase
        .from('wireframe_sections')
        .insert(sectionData);
      
      if (error) {
        console.error("Error saving wireframe sections:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error saving wireframe sections:", error);
      throw error;
    }
  },
  
  /**
   * Get sections for a wireframe
   */
  getSections: async (wireframeId: string): Promise<any[]> => {
    try {
      const { data: sections, error } = await supabase
        .from('wireframe_sections')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('position_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching wireframe sections:", error);
        throw error;
      }
      
      return sections || [];
    } catch (error) {
      console.error("Error fetching wireframe sections:", error);
      return [];
    }
  },
  
  /**
   * Update sections for a wireframe
   * First deletes existing sections, then inserts new ones
   */
  updateSections: async (wireframeId: string, sections: WireframeSection[]): Promise<void> => {
    try {
      // First, delete existing sections
      await this.deleteSections(wireframeId);
      
      // Then insert the new sections
      await this.saveSections(wireframeId, sections);
    } catch (error) {
      console.error("Error updating wireframe sections:", error);
      throw error;
    }
  },
  
  /**
   * Delete all sections for a wireframe
   */
  deleteSections: async (wireframeId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
      
      if (error) {
        console.error("Error deleting wireframe sections:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error deleting wireframe sections:", error);
      throw error;
    }
  }
};
