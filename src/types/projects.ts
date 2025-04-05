
/**
 * Project-related types shared across the application
 */

export type ProjectStatus = 'draft' | 'in-progress' | 'review' | 'completed' | 'archived';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  client_name: string;
  client_email: string;
  project_type: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ProjectBoardProps {
  projects: Project[];
  updateProject: (project: Partial<Project>) => void;
  onProjectClick: (projectId: string) => void;
  view: 'board' | 'list';
}

export interface ProjectCardProps {
  project: Project;
  updateProject: (project: Partial<Project>) => void;
  onClick: () => void;
  isDragging?: boolean;
}

export interface ProjectColumnProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

export interface ProjectHistory {
  id: string;
  project_id: string;
  user_id: string;
  previous_status?: ProjectStatus;
  new_status: ProjectStatus;
  notes?: string;
  changed_at: string;
}
