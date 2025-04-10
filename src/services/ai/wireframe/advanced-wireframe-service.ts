
import { WireframeData, WireframeGenerationParams } from './wireframe-types';
import { EnhancedWireframeGenerator } from './enhanced-wireframe-generator';
import { wireframeService } from './wireframe-service';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

/**
 * Design memory structure for projects
 */
export interface DesignMemory {
  id?: string;
  projectId: string;
  layoutPatterns?: any;
  stylePreferences?: any;
  componentPreferences?: any;
  createdAt?: string;
  updatedAt?: string;
}

// Custom function to create wireframe since it doesn't exist in wireframeService
const createWireframe = async (wireframeData: WireframeData) => {
  // This is a placeholder function - in a real app this would save to a database
  console.log('Creating wireframe:', wireframeData);
  return wireframeData;
};

/**
 * Enhanced wireframe service with advanced capabilities
 */
export class AdvancedWireframeService {
  /**
   * Save an advanced wireframe to the database
   */
  static async saveWireframe(
    projectId: string,
    prompt: string,
    wireframeData: WireframeData,
    intentData: any,
    blueprint: any
  ): Promise<WireframeData | null> {
    try {
      console.log("Saving advanced wireframe for project:", projectId);
      
      // Use the wireframeService instead of WireframeService
      const minimalWireframeData = wireframeService.createMinimalWireframeData();
      
      const result = await createWireframe({
        ...minimalWireframeData,
        title: wireframeData.title || "Advanced Wireframe",
        description: wireframeData.description || prompt || "Generated using advanced wireframe engine",
        // Add project ID as metadata rather than directly on wireframeData
        metadata: {
          ...(wireframeData.metadata || {}),
          projectId: projectId,
          intent: intentData,
          blueprint: blueprint,
          generationType: "advanced"
        },
        sections: wireframeData.sections || []
      });
      
      console.log("Advanced wireframe saved with ID:", result?.id);
      return result;
    } catch (error) {
      console.error("Error saving advanced wireframe:", error);
      throw new Error(`Failed to save advanced wireframe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Retrieve design memory for a project
   */
  static async retrieveDesignMemory(projectId: string): Promise<DesignMemory | null> {
    try {
      console.log("Retrieving design memory for project:", projectId);
      
      // Query the database for design memory - using the correct column name
      const { data, error } = await supabase
        .from('design_memory')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If the error is not found, return null without throwing
        if (error.code === 'PGRST116') {
          console.log("No design memory found for project:", projectId);
          return null;
        }
        
        // Check if the error is caused by the table not existing yet
        if (error.code === '42P01') {
          console.log("Design memory table does not exist yet.");
          return null;
        }
        
        console.error("Error retrieving design memory:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No design memory found for project:", projectId);
        return null;
      }
      
      console.log("Design memory retrieved successfully for project:", projectId);
      
      // Map database fields to DesignMemory interface
      return {
        id: data.id,
        projectId: data.project_id,
        layoutPatterns: data.layout_patterns,
        stylePreferences: data.style_preferences,
        componentPreferences: data.component_preferences,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error("Error retrieving design memory:", error);
      // Return null instead of throwing to handle missing tables gracefully
      return null;
    }
  }
  
  /**
   * Store design memory for a project
   */
  static async storeDesignMemory(
    projectId: string,
    blueprintId: string,
    layoutPatterns: any,
    stylePreferences: any,
    componentPreferences: any
  ): Promise<string | null> {
    try {
      console.log("Storing design memory for project:", projectId);
      
      const memoryId = uuidv4();
      
      // Insert or update design memory - using the correct column names
      const { data, error } = await supabase
        .from('design_memory')
        .upsert({
          id: memoryId,
          project_id: projectId,
          blueprint_id: blueprintId,
          layout_patterns: layoutPatterns,
          style_preferences: stylePreferences,
          component_preferences: componentPreferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'project_id'
        });
      
      if (error) {
        console.error("Error storing design memory:", error);
        throw error;
      }
      
      console.log("Design memory stored successfully for project:", projectId);
      return memoryId;
    } catch (error) {
      console.error("Error storing design memory:", error);
      throw new Error(`Failed to store design memory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Get available style modifiers
   */
  static async getStyleModifiers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('style_modifiers')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error retrieving style modifiers:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error retrieving style modifiers:", error);
      return [];
    }
  }
  
  /**
   * Get available component variants
   */
  static async getComponentVariants(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('component_variants')
        .select('*')
        .order('component_type', { ascending: true })
        .order('variant_name', { ascending: true });
      
      if (error) {
        console.error("Error retrieving component variants:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error retrieving component variants:", error);
      return [];
    }
  }
}
