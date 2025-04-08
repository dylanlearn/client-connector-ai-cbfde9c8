
import { supabase } from '@/integrations/supabase/client';
import { DesignMemoryData, DesignMemoryResponse } from './wireframe-types';

/**
 * Service for managing design memory storage and retrieval
 */
export class WireframeMemoryService {
  /**
   * Store design memory data for a project
   */
  async storeDesignMemory(data: DesignMemoryData): Promise<DesignMemoryResponse> {
    try {
      // Check if a record already exists for this project
      const { data: existing } = await supabase
        .from('wireframe_design_memory')
        .select()
        .eq('project_id', data.projectId)
        .maybeSingle();
        
      if (existing) {
        // Update existing record
        const { data: updated, error } = await supabase
          .from('wireframe_design_memory')
          .update({
            blueprint_id: data.blueprintId,
            layout_patterns: data.layoutPatterns,
            style_preferences: data.stylePreferences,
            component_preferences: data.componentPreferences,
            updated_at: new Date().toISOString()
          })
          .eq('project_id', data.projectId)
          .select()
          .single();
          
        if (error) throw error;
        return this.formatResponse(updated);
      } else {
        // Create new record
        const { data: created, error } = await supabase
          .from('wireframe_design_memory')
          .insert({
            project_id: data.projectId,
            blueprint_id: data.blueprintId,
            layout_patterns: data.layoutPatterns,
            style_preferences: data.stylePreferences,
            component_preferences: data.componentPreferences
          })
          .select()
          .single();
          
        if (error) throw error;
        return this.formatResponse(created);
      }
    } catch (error) {
      console.error('Error storing design memory:', error);
      throw error;
    }
  }
  
  /**
   * Get design memory for a project
   */
  async getDesignMemory(projectId: string): Promise<DesignMemoryResponse> {
    try {
      const { data, error } = await supabase
        .from('wireframe_design_memory')
        .select()
        .eq('project_id', projectId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('Design memory not found for project: ' + projectId);
      }
      
      return this.formatResponse(data);
    } catch (error) {
      console.error('Error getting design memory:', error);
      throw error;
    }
  }
  
  /**
   * Update design memory
   */
  async updateDesignMemory({
    memoryId,
    updates
  }: {
    memoryId: string;
    updates: Partial<Omit<DesignMemoryData, 'projectId'>>;
  }): Promise<DesignMemoryResponse> {
    try {
      const { data, error } = await supabase
        .from('wireframe_design_memory')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', memoryId)
        .select()
        .single();
        
      if (error) throw error;
      return this.formatResponse(data);
    } catch (error) {
      console.error('Error updating design memory:', error);
      throw error;
    }
  }
  
  /**
   * Get project data by ID
   */
  async getProject(projectId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }
  
  /**
   * Save project data
   */
  async saveProject(projectId: string, projectData: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }
  
  /**
   * Format the response from database to a consistent API format
   */
  private formatResponse(data: any): DesignMemoryResponse {
    return {
      id: data.id,
      projectId: data.project_id,
      blueprintId: data.blueprint_id,
      layoutPatterns: data.layout_patterns,
      stylePreferences: data.style_preferences,
      componentPreferences: data.component_preferences,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}

// Create a singleton instance to export
export const wireframeMemoryService = new WireframeMemoryService();

// Export types for use in hooks
export type { DesignMemoryData, DesignMemoryResponse };
