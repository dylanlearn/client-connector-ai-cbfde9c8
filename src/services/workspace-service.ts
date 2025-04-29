
import { Workspace, WorkspaceMember, WorkspaceTeam } from '@/types/workspace';

// Mock data for demonstration
const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Marketing Department',
    description: 'All marketing projects and assets',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {},
    logo_url: '/assets/logos/marketing.png'
  },
  {
    id: '2',
    name: 'Engineering Team',
    description: 'Software development and infrastructure',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: { technical_stack: 'React, Node.js, AWS' },
    logo_url: '/assets/logos/engineering.png'
  },
  {
    id: '3',
    name: 'Executive Dashboard',
    description: 'Key metrics and KPI tracking',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: { visibility: 'executive-only' },
  }
];

export const WorkspaceService = {
  getUserWorkspaces: async (): Promise<Workspace[]> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWorkspaces), 800);
    });
  },

  createWorkspace: async (workspaceData: { name: string, description: string }): Promise<Workspace> => {
    // In a real app, this would call your API
    const newWorkspace: Workspace = {
      id: Math.random().toString(36).substr(2, 9),
      name: workspaceData.name,
      description: workspaceData.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings: {},
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(newWorkspace), 800);
    });
  },

  deleteWorkspace: async (workspaceId: string): Promise<void> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800);
    });
  },

  getWorkspaceDetails: async (workspaceId: string): Promise<Workspace> => {
    // In a real app, this would call your API
    const workspace = mockWorkspaces.find(w => w.id === workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(workspace), 800);
    });
  },

  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 800);
    });
  },

  getWorkspaceTeams: async (workspaceId: string): Promise<WorkspaceTeam[]> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 800);
    });
  }
};
