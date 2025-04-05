
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/projects";
import { toast } from "sonner";

/**
 * Service for project-related operations
 */
export const ProjectService = {
  /**
   * Get all projects for the current user
   */
  async getProjects(): Promise<Project[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Get a single project by ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  /**
   * Create a new project
   */
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Project> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          user_id: user.user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Project created successfully');
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
      throw error;
    }
  },

  /**
   * Update an existing project
   */
  async updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  /**
   * Archive a project (soft delete)
   */
  async archiveProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Project archived');
    } catch (error) {
      console.error('Error archiving project:', error);
      toast.error('Failed to archive project');
      throw error;
    }
  },

  /**
   * Delete a project permanently
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Project deleted permanently');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  }
};
