
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { AIWireframe, WireframeSection, WireframeComponent, CopySuggestions, WireframeData } from "../wireframe-types";

/**
 * Service for managing wireframe sections in the database
 */
export const wireframeSectionsService = {
  /**
   * Get all sections for a wireframe
   */
  getSectionsForWireframe: async (wireframeId: string): Promise<WireframeSection[]> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_sections')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('position_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching wireframe sections:", error);
        return [];
      }
      
      // Convert from database format to WireframeSection type
      return (data || []).map(section => {
        return {
          id: section.id,
          name: section.name,
          sectionType: section.section_type,
          layoutType: section.layout_type,
          layout: section.layout,
          components: section.components as unknown as WireframeComponent[],
          copySuggestions: section.copy_suggestions as unknown as CopySuggestions,
          designReasoning: section.design_reasoning,
          mobileLayout: section.mobile_layout,
          animationSuggestions: section.animation_suggestions,
          dynamicElements: section.dynamic_elements,
          styleVariants: section.style_variants,
          positionOrder: section.position_order,
          description: section.description
        };
      });
    } catch (error) {
      console.error("Error in getSectionsForWireframe:", error);
      return [];
    }
  },
  
  /**
   * Save a single section
   */
  saveSection: async (section: WireframeSection, wireframeId: string): Promise<string | null> => {
    try {
      // Convert section to database format
      const dbSection = {
        wireframe_id: wireframeId,
        name: section.name,
        section_type: section.sectionType,
        description: section.description || '',
        layout_type: section.layoutType,
        layout: section.layout as Json,
        components: section.components as unknown as Json,
        mobile_layout: section.mobileLayout as Json,
        style_variants: section.styleVariants as Json,
        animation_suggestions: section.animationSuggestions as Json,
        copy_suggestions: section.copySuggestions as Json,
        design_reasoning: section.designReasoning || '',
        dynamic_elements: section.dynamicElements as Json,
        position_order: section.positionOrder || 0
      };
      
      const { data, error } = await supabase
        .from('wireframe_sections')
        .insert(dbSection)
        .select()
        .single();
      
      if (error) {
        console.error("Error saving wireframe section:", error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error("Error in saveSection:", error);
      return null;
    }
  },
  
  /**
   * Update sections for a wireframe
   */
  updateSections: async (sections: WireframeSection[], wireframeId: string): Promise<boolean> => {
    try {
      // First, delete all existing sections for this wireframe
      await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
      
      // Then insert all sections with position order
      const sectionPromises = sections.map((section, index) => {
        // Convert section to database format
        const dbSection = {
          wireframe_id: wireframeId,
          position_order: index,
          name: section.name,
          section_type: section.sectionType,
          description: section.description || '',
          layout_type: section.layoutType,
          layout: section.layout as Json,
          components: section.components as unknown as Json,
          mobile_layout: section.mobileLayout as Json,
          style_variants: section.styleVariants as Json,
          animation_suggestions: section.animationSuggestions as Json,
          copy_suggestions: section.copySuggestions as Json,
          design_reasoning: section.designReasoning || '',
          dynamic_elements: section.dynamicElements as Json
        };
        
        return this.saveSection(section, wireframeId);
      });
      
      await Promise.all(sectionPromises);
      
      return true;
    } catch (error) {
      console.error("Error updating wireframe sections:", error);
      return false;
    }
  }
};
