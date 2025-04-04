
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { AIWireframe, WireframeSection, WireframeComponent, CopySuggestions, WireframeData } from "../wireframe-types";

/**
 * Service for managing wireframe sections in the database
 */
export const wireframeSections = {
  /**
   * Get all sections for a wireframe
   */
  getSections: async (wireframeId: string): Promise<WireframeSection[]> => {
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
          layout: section.layout as any,
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
      console.error("Error in getSections:", error);
      return [];
    }
  },
  
  /**
   * Save sections for a wireframe
   */
  saveSections: async (wireframeId: string, sections: WireframeSection[]): Promise<boolean> => {
    try {
      if (!Array.isArray(sections) || sections.length === 0) {
        return true; // No sections to save
      }
      
      const sectionPromises = sections.map((section, index) => {
        // Convert section to database format
        const dbSection = {
          wireframe_id: wireframeId,
          position_order: index,
          name: section.name || "",
          section_type: section.sectionType || "",
          description: section.description || "",
          layout_type: section.layoutType || "",
          layout: (section.layout || {}) as Json,
          components: (section.components || []) as unknown as Json,
          copy_suggestions: (section.copySuggestions || {}) as unknown as Json,
          design_reasoning: section.designReasoning || "",
          mobile_layout: section.mobileLayout as Json,
          animation_suggestions: section.animationSuggestions as Json,
          dynamic_elements: section.dynamicElements as Json,
          style_variants: section.styleVariants as Json
        };
        
        return supabase
          .from('wireframe_sections')
          .insert(dbSection);
      });
      
      await Promise.all(sectionPromises);
      return true;
    } catch (error) {
      console.error("Error saving wireframe sections:", error);
      return false;
    }
  },
  
  /**
   * Update sections for a wireframe
   */
  updateSections: async (wireframeId: string, sections: WireframeSection[]): Promise<boolean> => {
    try {
      // First, delete all existing sections for this wireframe
      const { error: deleteError } = await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
      
      if (deleteError) {
        console.error("Error deleting existing wireframe sections:", deleteError);
        return false;
      }
      
      // Then insert all sections with position order
      if (sections && sections.length > 0) {
        return await wireframeSections.saveSections(wireframeId, sections);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating wireframe sections:", error);
      return false;
    }
  },
  
  /**
   * Delete all sections for a wireframe
   */
  deleteSections: async (wireframeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('wireframe_sections')
        .delete()
        .eq('wireframe_id', wireframeId);
        
      if (error) {
        console.error("Error deleting wireframe sections:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteSections:", error);
      return false;
    }
  }
};

// Also export as wireframeSectionsService for backward compatibility
export const wireframeSectionsService = wireframeSections;
