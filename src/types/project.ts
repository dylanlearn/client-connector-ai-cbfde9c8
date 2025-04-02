
export interface Project {
  id: string;
  user_id: string;
  title: string;
  client_name: string;
  client_email: string;
  project_type: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  intake_form_id?: string;
}

export type CreateProjectData = Omit<Project, 'id' | 'created_at' | 'updated_at'> & {
  user_id: string;
  status?: Project['status'];
  intake_form_id?: string;
};

export type UpdateProjectData = Partial<Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
