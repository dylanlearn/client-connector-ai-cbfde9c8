
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

class WireframeMemoryService {
  /**
   * Get a wireframe project by ID
   * @param projectId The project ID
   * @returns The project data
   */
  async getProject(projectId: string) {
    try {
      // Use maybeSingle instead of single to avoid the error when no rows are returned
      const { data, error } = await supabase
        .from('wireframe_projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      // If no data is found, return null so we can create a default project
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
      
      // If there's no ID, generate one
      const projectId = id || uuidv4();
      
      // Ensure we have the necessary fields
      const dataToSave = {
        id: projectId,
        title: projectDetails.title || 'Untitled Project',
        description: projectDetails.description || '',
        settings: projectDetails.settings || {},
        updated_at: new Date().toISOString(),
        user_id: projectDetails.user_id || null, // Get from auth if available
        ...projectDetails
      };
      
      // Use upsert to either insert or update based on the ID
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
}

export const wireframeMemoryService = new WireframeMemoryService();
