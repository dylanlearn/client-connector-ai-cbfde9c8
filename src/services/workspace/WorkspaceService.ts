
import { supabase } from "@/integrations/supabase/client";
import { Workspace, WorkspaceMember, WorkspaceTeam, WorkspaceProject } from "@/types/workspace";
import { toast } from "sonner";

export class WorkspaceService {
  /**
   * Create a new workspace
   */
  static async createWorkspace(name: string, description?: string, settings = {}): Promise<Workspace | null> {
    try {
      const { data, error } = await supabase.rpc('create_workspace', {
        p_name: name, 
        p_description: description,
        p_settings: settings
      });
      
      if (error) throw error;
      
      // Fetch the newly created workspace
      if (data) {
        return this.getWorkspaceById(data);
      }
      
      return null;
    } catch (err) {
      console.error("Error creating workspace:", err);
      toast.error("Failed to create workspace");
      return null;
    }
  }
  
  /**
   * Get workspaces for current user
   */
  static async getUserWorkspaces(): Promise<Workspace[]> {
    try {
      const { data: memberships, error: membershipError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('status', 'active');
      
      if (membershipError) throw membershipError;
      
      if (!memberships || memberships.length === 0) {
        return [];
      }
      
      const workspaceIds = memberships.map(m => m.workspace_id);
      
      const { data: workspaces, error } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);
        
      if (error) throw error;
      return workspaces as Workspace[];
    } catch (err) {
      console.error("Error fetching user workspaces:", err);
      return [];
    }
  }
  
  /**
   * Get workspace by ID
   */
  static async getWorkspaceById(id: string): Promise<Workspace | null> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Workspace;
    } catch (err) {
      console.error(`Error fetching workspace ${id}:`, err);
      return null;
    }
  }
  
  /**
   * Get workspace members
   */
  static async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    try {
      const { data, error } = await supabase.rpc(
        'get_workspace_members', 
        { p_workspace_id: workspaceId }
      );
        
      if (error) throw error;
      return data as WorkspaceMember[];
    } catch (err) {
      console.error(`Error fetching members for workspace ${workspaceId}:`, err);
      return [];
    }
  }
  
  /**
   * Add member to workspace
   */
  static async addWorkspaceMember(workspaceId: string, email: string, role: string = 'member'): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('add_workspace_member', {
        p_workspace_id: workspaceId,
        p_email: email,
        p_role: role
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (data && data.success) {
        toast.success("Member added successfully");
        return true;
      }
      
      if (data && !data.success) {
        toast.error(data.message || "Failed to add member");
        return false;
      }
      
      return false;
    } catch (err) {
      console.error(`Error adding member to workspace ${workspaceId}:`, err);
      toast.error("Failed to add member");
      return false;
    }
  }
  
  /**
   * Create a team in a workspace
   */
  static async createTeam(workspaceId: string, name: string, description?: string): Promise<WorkspaceTeam | null> {
    try {
      const { data, error } = await supabase
        .from('workspace_teams')
        .insert({
          workspace_id: workspaceId,
          name,
          description
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as WorkspaceTeam;
    } catch (err) {
      console.error("Error creating team:", err);
      toast.error("Failed to create team");
      return null;
    }
  }
  
  /**
   * Get teams in a workspace
   */
  static async getWorkspaceTeams(workspaceId: string): Promise<WorkspaceTeam[]> {
    try {
      const { data, error } = await supabase
        .from('workspace_teams')
        .select('*')
        .eq('workspace_id', workspaceId);
        
      if (error) throw error;
      return data as WorkspaceTeam[];
    } catch (err) {
      console.error(`Error fetching teams for workspace ${workspaceId}:`, err);
      return [];
    }
  }
  
  /**
   * Add project to workspace
   */
  static async addProjectToWorkspace(
    workspaceId: string, 
    projectId: string, 
    teamId?: string
  ): Promise<WorkspaceProject | null> {
    try {
      const { data, error } = await supabase
        .from('workspace_projects')
        .insert({
          workspace_id: workspaceId,
          project_id: projectId,
          team_id: teamId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as WorkspaceProject;
    } catch (err) {
      console.error("Error adding project to workspace:", err);
      toast.error("Failed to add project to workspace");
      return null;
    }
  }
  
  /**
   * Get workspace projects
   */
  static async getWorkspaceProjects(workspaceId: string): Promise<WorkspaceProject[]> {
    try {
      const { data, error } = await supabase
        .from('workspace_projects')
        .select('*')
        .eq('workspace_id', workspaceId);
        
      if (error) throw error;
      return data as WorkspaceProject[];
    } catch (err) {
      console.error(`Error fetching projects for workspace ${workspaceId}:`, err);
      return [];
    }
  }
}
