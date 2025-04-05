
/**
 * Project-related types shared across the application
 */

// Import the Project type from project.ts to ensure consistency
import { Project as BaseProject } from './project';

export type { BaseProject as Project };

export type ProjectStatus = 'draft' | 'in-progress' | 'review' | 'completed' | 'archived';

export interface ProjectBoardProps {
  projects: BaseProject[];
  updateProject: (project: Partial<BaseProject>) => void;
  onProjectClick: (projectId: string) => void;
  view: 'board' | 'list';
}

export interface ProjectCardProps {
  project: BaseProject;
  updateProject: (project: Partial<BaseProject>) => void;
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
