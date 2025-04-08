import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface DesignMemoryResponse {
  id: string;
  project_id: string;
  user_id: string;
  blueprint_id?: string;
  layout_patterns?: any;
  style_preferences?: any;
  component_preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface DesignMemoryData {
  projectId: string;
  blueprintId?: string;
  layoutPatterns?: any;
  stylePreferences?: any;
  componentPreferences?: any;
}

class WireframeMemoryService {
  /**
   * Get a wireframe project by ID
   * @param projectId The project ID
   * @returns The project data
   */
  async getProject(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('wireframe_projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching wireframe project:', error);
      throw error;
    }
  }
  
  /**
   * Save a wireframe project
   * @param projectData The project data to save
   * @returns The saved project data
   */
  async saveProject(projectData: any) {
    try {
      const { id, ...projectDetails } = projectData;
      
      const projectId = id || uuidv4();
      
      const dataToSave = {
        id: projectId,
        title: projectDetails.title || 'Untitled Project',
        description: projectDetails.description || '',
        settings: projectDetails.settings || {},
        updated_at: new Date().toISOString(),
        user_id: projectDetails.user_id || null,
        ...projectDetails
      };
      
      const { data, error } = await supabase
        .from('wireframe_projects')
        .upsert(dataToSave, { onConflict: 'id' })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error saving wireframe project:', error);
      throw error;
    }
  }
  
  /**
   * Get wireframe memories related to a project
   * @param projectId The project ID
   * @returns Array of memories
   */
  async getProjectMemories(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('project_memories')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching project memories:', error);
      throw error;
    }
  }
  
  /**
   * Store a memory for a project
   * @param projectId The project ID
   * @param userId The user ID
   * @param category The memory category
   * @param content The memory content
   * @param metadata Any additional metadata
   * @returns The stored memory
   */
  async storeMemory(
    projectId: string,
    userId: string,
    category: string,
    content: string,
    metadata: any = {}
  ) {
    try {
      const { data, error } = await supabase
        .from('project_memories')
        .insert({
          project_id: projectId,
          user_id: userId,
          category,
          content,
          metadata
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error storing project memory:', error);
      throw error;
    }
  }

  /**
   * Get design memory for a project
   * @param projectId The project ID
   * @returns The design memory
   */
  async getDesignMemory(projectId: string): Promise<DesignMemoryResponse | null> {
    try {
      const { data, error } = await supabase
        .from('wireframe_design_memory')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching design memory:', error);
      throw error;
    }
  }

  /**
   * Store design memory for a project
   * @param data The design memory data
   * @returns The stored design memory
   */
  async storeDesignMemory(data: DesignMemoryData): Promise<DesignMemoryResponse> {
    try {
      const { projectId, ...memoryDetails } = data;
      
      const dataToSave = {
        project_id: projectId,
        blueprint_id: memoryDetails.blueprintId,
        layout_patterns: memoryDetails.layoutPatterns,
        style_preferences: memoryDetails.stylePreferences,
        component_preferences: memoryDetails.componentPreferences,
        updated_at: new Date().toISOString()
      };
      
      const { data: savedData, error } = await supabase
        .from('wireframe_design_memory')
        .insert(dataToSave)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return savedData;
    } catch (error) {
      console.error('Error storing design memory:', error);
      throw error;
    }
  }

  /**
   * Update design memory
   * @param params The update parameters
   * @returns The updated design memory
   */
  async updateDesignMemory(params: { 
    memoryId: string; 
    updates: Partial<Omit<DesignMemoryData, 'projectId'>>
  }): Promise<DesignMemoryResponse> {
    try {
      const { memoryId, updates } = params;
      
      const updateData = {
        blueprint_id: updates.blueprintId,
        layout_patterns: updates.layoutPatterns,
        style_preferences: updates.stylePreferences,
        component_preferences: updates.componentPreferences,
        updated_at: new Date().toISOString()
      };
      
      const { data: updatedData, error } = await supabase
        .from('wireframe_design_memory')
        .update(updateData)
        .eq('id', memoryId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return updatedData;
    } catch (error) {
      console.error('Error updating design memory:', error);
      throw error;
    }
  }
}

export const wireframeMemoryService = new WireframeMemoryService();
