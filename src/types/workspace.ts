
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  settings: Record<string, any>;
  logo_url?: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  permissions: Record<string, any>;
  joined_at: string;
  invited_by?: string;
  status: 'active' | 'inactive' | 'pending';
  email?: string;
  name?: string;
}

export interface WorkspaceTeam {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  members?: WorkspaceMember[];
}

export interface WorkspaceProject {
  id: string;
  workspace_id: string;
  project_id: string;
  team_id?: string;
  created_at: string;
  status: 'active' | 'archived' | 'completed';
}

export interface ResourceAllocation {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  allocation_percentage: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}
