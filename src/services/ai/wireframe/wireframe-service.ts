
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeSection, WireframeGenerationParams, WireframeGenerationResult } from './wireframe-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for wireframe management in the application
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
      console.error("Error in wireframe service getProjectWireframes:", error);
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
        .single();
      
      if (wireframeError) {
        throw new Error(`Error fetching wireframe: ${wireframeError.message}`);
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
      
      return { ...wireframe, sections: sections || [] };
    } catch (error) {
      console.error("Error in wireframe service getWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Create a new wireframe
   */
  createWireframe: async (wireframeData: {
    title: string;
    description?: string;
    data: WireframeData;
    sections?: WireframeSection[];
  }) => {
    try {
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        throw new Error("User must be authenticated to create wireframes");
      }
      
      // Insert wireframe into database
      const { data: wireframe, error: wireframeError } = await supabase
        .from('wireframes')
        .insert({
          user_id: userId,
          title: wireframeData.title,
          description: wireframeData.description || '',
          data: wireframeData.data
        })
        .select()
        .single();
      
      if (wireframeError) {
        throw new Error(`Error creating wireframe: ${wireframeError.message}`);
      }
      
      // If there are sections, add them to the database
      if (wireframeData.sections && wireframeData.sections.length > 0) {
        await WireframeService.saveSections(wireframe.id, wireframeData.sections);
      }
      
      return wireframe;
    } catch (error) {
      console.error("Error in wireframe service createWireframe:", error);
      throw error;
    }
  },
  
  /**
   * Save sections for a wireframe
   */
  saveSections: async (wireframeId: string, sections: WireframeSection[]) => {
    try {
      const { data, error } = await supabase
        .rpc('save_wireframe_sections', {
          p_wireframe_id: wireframeId,
          p_sections: JSON.parse(JSON.stringify(sections))
        });
      
      if (error) {
        throw new Error(`Error saving wireframe sections: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error in wireframe service saveSections:", error);
      throw error;
    }
  },
  
  /**
   * Update an existing wireframe
   */
  updateWireframe: async (wireframeId: string, updates: Partial<WireframeData>) => {
    try {
      const { data, error } = await supabase
        .from('wireframes')
        .update({ data: updates, updated_at: new Date() })
        .eq('id', wireframeId)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error updating wireframe: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("Error in wireframe service updateWireframe:", error);
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
      console.error("Error in wireframe service deleteWireframe:", error);
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
  ) => {
    try {
      const updateData: { feedback: string; rating?: number } = { feedback };
      
      if (rating !== undefined) {
        updateData.rating = rating;
      }
      
      const { error } = await supabase
        .from('wireframes')
        .update(updateData)
        .eq('id', wireframeId);
      
      if (error) {
        throw new Error(`Error updating wireframe feedback: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in wireframe service updateWireframeFeedback:", error);
      throw error;
    }
  },
  
  /**
   * Generate a wireframe based on parameters
   */
  generateWireframe: async (params: WireframeGenerationParams): Promise<WireframeGenerationResult> => {
    try {
      // This would typically call an AI model or backend service
      // For now we'll create a simple wireframe with default sections
      
      // Ensure we have a title
      const title = params.title || params.description?.substring(0, 50) || "Generated Wireframe";
      const description = params.description || "Auto-generated wireframe";
      
      const wireframeData: WireframeData = {
        title: title,
        description: description,
        sections: [
          {
            id: uuidv4(),
            name: "Hero Section",
            sectionType: "hero",
            componentVariant: "hero-centered",
            components: [
              { id: uuidv4(), type: "heading", content: "Welcome to Your Website" },
              { id: uuidv4(), type: "paragraph", content: "This is an automatically generated wireframe." }
            ]
          },
          {
            id: uuidv4(),
            name: "Features Section",
            sectionType: "features",
            componentVariant: "features-grid",
            components: [
              { id: uuidv4(), type: "heading", content: "Features" },
              { id: uuidv4(), type: "feature-item", content: "Feature 1" },
              { id: uuidv4(), type: "feature-item", content: "Feature 2" }
            ]
          }
        ],
        layoutType: "standard",
        colorScheme: {
          primary: "#4F46E5",
          secondary: "#A855F7",
          accent: "#F59E0B",
          background: "#FFFFFF"
        },
        typography: {
          headings: "Raleway, sans-serif",
          body: "Inter, sans-serif"
        }
      };
      
      // Return the wireframe data in the expected format
      return {
        wireframe: wireframeData,
        model: "simple-generator-v1",
        generationTime: 0.5,
        success: true,
        creativityLevel: params.creativityLevel || 5
      };
    } catch (error) {
      console.error("Error generating wireframe:", error);
      throw error;
    }
  }
};
